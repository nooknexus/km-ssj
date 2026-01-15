# Provider ID Process Flow - React/Express Implementation

เอกสารนี้สรุปกระบวนการ (process) และไฟล์ที่ใช้ในการทำ Health ID authentication แล้วเชื่อมต่อไปยัง Provider ID เพื่อนำข้อมูล profile มาใช้ในระบบ **km_health_db**

## สถาปัตยกรรมของระบบ

- **Frontend**: React (Vite)
- **Backend**: Express.js
- **Database**: MySQL
- **Authentication**: JWT-based

---

## ไฟล์ที่เกี่ยวข้อง

### Frontend (client/)
| ไฟล์ | หน้าที่ |
|------|--------|
| `src/pages/Login.jsx` | หน้า Login พร้อมปุ่ม SSO |
| `src/pages/SSOCallback.jsx` | รับ callback หลังจาก Health ID redirect กลับมา |
| `src/context/AuthContext.jsx` | จัดการ state และฟังก์ชัน SSO |
| `src/config/api.js` | Config URL สำหรับ API |
| `.env` | Environment variables |

### Backend (server/)
| ไฟล์ | หน้าที่ |
|------|--------|
| `controllers/authController.js` | Logic สำหรับ SSO callback และ token exchange |
| `routes/authRoutes.js` | Routes สำหรับ SSO endpoints |
| `migrate_sso.sql` | SQL script สำหรับเพิ่ม columns ในตาราง users |
| `migrate_add_sso_columns.js` | Node.js migration script |
| `.env` | Environment variables |

---

## 0. การตั้งค่า Environment Variables

### Backend (`server/.env`)

```env
# Database Configuration
DB_HOST=your-database-host
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=km_db

# JWT Secret
JWT_SECRET=your-jwt-secret

# Server Port
PORT=5001

# Health ID OAuth Configuration (SSO)
HEALTH_CLIENT_ID=your-health-client-id
HEALTH_CLIENT_SECRET=your-health-client-secret
HEALTH_REDIRECT_URI=http://localhost:5001/api/auth/healthid

# Provider ID Configuration
PROVIDER_CLIENT_ID=your-provider-client-id
PROVIDER_CLIENT_SECRET=your-provider-client-secret

# Frontend URL (for SSO callback redirect)
FRONTEND_URL=http://localhost:5173
```

### Frontend (`client/.env`)

```env
# API URL
VITE_API_URL=http://localhost:5001
```

---

## 1. Database Migration

ก่อนใช้งาน SSO ต้องเพิ่ม columns ในตาราง `users`:

```sql
-- เพิ่ม display_name column
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS display_name VARCHAR(255) DEFAULT NULL;

-- เพิ่ม provider_profile column (JSON)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS provider_profile JSON DEFAULT NULL;

-- เพิ่ม updated_at column
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- อัพเดท password column ให้เป็น empty string ได้ (สำหรับ SSO users ที่ไม่ใช้ password)
ALTER TABLE users 
MODIFY COLUMN password VARCHAR(255) DEFAULT '';
```

**รัน migration:**
```bash
cd server
node migrate_add_sso_columns.js
```

---

## 2. Backend Routes (`server/routes/authRoutes.js`)

```javascript
const express = require('express');
const router = express.Router();
const { signup, login, getSSOUrl, ssoCallback, healthIdCallback } = require('../controllers/authController');

// Traditional auth
router.post('/signup', signup);
router.post('/login', login);

// SSO routes
router.get('/sso/url', getSSOUrl);           // สร้าง URL สำหรับ redirect ไป Health ID
router.post('/sso/callback', ssoCallback);   // รับ code แล้วแลก token และ profile
router.get('/healthid', healthIdCallback);   // รับ callback จาก Health ID

module.exports = router;
```

---

## 3. Backend Controller (`server/controllers/authController.js`)

### 3.1 getSSOUrl - สร้าง URL สำหรับ Health ID OAuth

```javascript
exports.getSSOUrl = async (req, res) => {
    try {
        const url = new URL("https://moph.id.th/oauth/redirect");
        url.searchParams.set("client_id", process.env.HEALTH_CLIENT_ID);
        url.searchParams.set("redirect_uri", process.env.HEALTH_REDIRECT_URI);
        url.searchParams.set("response_type", "code");
        url.searchParams.set("landing", `${process.env.FRONTEND_URL}/sso-callback`);
        url.searchParams.set("is_auth", "yes");

        res.json({ url: url.toString() });
    } catch (err) {
        res.status(500).json({ error: 'Failed to generate SSO URL' });
    }
};
```

### 3.2 healthIdCallback - รับ callback จาก Health ID แล้ว redirect ไป frontend

```javascript
exports.healthIdCallback = async (req, res) => {
    try {
        const { code } = req.query;
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

        if (!code) {
            return res.redirect(`${frontendUrl}/login?error=no_code`);
        }

        // Redirect ไป frontend พร้อม code
        const redirectUrl = `${frontendUrl}/sso-callback?code=${encodeURIComponent(code)}`;
        res.redirect(redirectUrl);
    } catch (err) {
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        res.redirect(`${frontendUrl}/login?error=callback_failed`);
    }
};
```

### 3.3 ssoCallback - แลก code เป็น token และดึง profile

```javascript
exports.ssoCallback = async (req, res) => {
    try {
        const { code } = req.body;

        // Step 1: แลก code เป็น Health ID token
        const tokenResponse = await axios.post('https://moph.id.th/api/v1/token', {
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: process.env.HEALTH_REDIRECT_URI,
            client_id: process.env.HEALTH_CLIENT_ID,
            client_secret: process.env.HEALTH_CLIENT_SECRET
        });

        const healthIdToken = tokenResponse.data.data.access_token;

        // Step 2: แลก Health ID token เป็น Provider ID token
        const providerTokenResponse = await axios.post('https://provider.id.th/api/v1/services/token', {
            client_id: process.env.PROVIDER_CLIENT_ID,
            secret_key: process.env.PROVIDER_CLIENT_SECRET,
            token_by: 'Health ID',
            token: healthIdToken
        });

        const providerIdToken = providerTokenResponse.data.data.access_token;

        // Step 3: ดึง Provider Profile
        const profileResponse = await axios.get('https://provider.id.th/api/v1/services/profile?position_type=1', {
            headers: {
                'client-id': process.env.PROVIDER_CLIENT_ID,
                'secret-key': process.env.PROVIDER_CLIENT_SECRET,
                'Authorization': `Bearer ${providerIdToken}`
            }
        });

        const profile = profileResponse.data.data;

        // Step 4: สร้างหรืออัพเดท user ในระบบ
        const providerId = profile.provider_id;
        const username = profile.provider_id;
        const email = profile.email || `${providerId}@provider.id.th`;
        const displayName = profile.name_th || profile.name_eng;
        const department = profile.organization?.[0]?.hname_th || '';

        // ตรวจสอบว่า user มีอยู่แล้วหรือไม่
        const [existingUsers] = await db.query(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );

        let userId;
        if (existingUsers.length > 0) {
            // อัพเดท user ที่มีอยู่
            userId = existingUsers[0].id;
            await db.query(
                `UPDATE users SET 
                    email = ?, 
                    display_name = ?, 
                    department = ?, 
                    provider_profile = ?,
                    updated_at = NOW()
                WHERE id = ?`,
                [email, displayName, department, JSON.stringify(profile), userId]
            );
        } else {
            // สร้าง user ใหม่
            const [result] = await db.query(
                `INSERT INTO users (username, email, password, display_name, department, role, provider_profile) 
                VALUES (?, ?, '', ?, ?, 'user', ?)`,
                [username, email, displayName, department, JSON.stringify(profile)]
            );
            userId = result.insertId;
        }

        // Step 5: สร้าง JWT token
        const token = jwt.sign(
            { id: userId, username, role: existingUsers[0]?.role || 'user' },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            id: userId,
            username,
            display_name: displayName,
            email,
            department,
            role: existingUsers[0]?.role || 'user'
        });
    } catch (err) {
        res.status(500).json({
            error: 'SSO authentication failed',
            details: err.response?.data?.error || err.message
        });
    }
};
```

---

## 4. Frontend - Login Page (`client/src/pages/Login.jsx`)

```jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const { initiateSSO } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSSOLogin = async () => {
        setLoading(true);
        setError('');
        try {
            await initiateSSO();
        } catch (err) {
            setError('ไม่สามารถเชื่อมต่อกับระบบ SSO ได้');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
                <h1 className="text-2xl font-bold text-center text-slate-800 mb-6">
                    ระบบคลังความรู้
                </h1>
                
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                <button
                    onClick={handleSSOLogin}
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-sky-600 hover:to-blue-700 transition-all shadow-lg"
                >
                    {loading ? 'กำลังเชื่อมต่อ...' : 'เข้าสู่ระบบด้วย Provider ID'}
                </button>
            </div>
        </div>
    );
};

export default Login;
```

---

## 5. Frontend - SSO Callback (`client/src/pages/SSOCallback.jsx`)

```jsx
import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SSOCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { loginWithSSO } = useAuth();
    const [status, setStatus] = useState('กำลังยืนยันตัวตน...');
    const [error, setError] = useState('');
    const hasCalledRef = useRef(false); // ป้องกันการเรียกซ้ำ (React Strict Mode)

    useEffect(() => {
        const handleCallback = async () => {
            if (hasCalledRef.current) return;
            hasCalledRef.current = true;

            try {
                const code = searchParams.get('code');

                if (!code) {
                    setError('ไม่พบรหัสยืนยันตัวตน');
                    return;
                }

                setStatus('กำลังเชื่อมต่อกับ Provider ID...');
                await loginWithSSO(code);

                setStatus('เข้าสู่ระบบสำเร็จ!');
                setTimeout(() => navigate('/'), 1000);
            } catch (err) {
                setError(err.response?.data?.error || 'เกิดข้อผิดพลาด');
            }
        };

        handleCallback();
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center">
            {error ? (
                <div className="text-red-500">
                    <p>{error}</p>
                    <button onClick={() => navigate('/login')}>กลับหน้า Login</button>
                </div>
            ) : (
                <p>{status}</p>
            )}
        </div>
    );
};

export default SSOCallback;
```

---

## 6. Frontend - AuthContext (`client/src/context/AuthContext.jsx`)

```jsx
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        if (token && savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    // เริ่มต้น SSO - redirect ไป Health ID
    const initiateSSO = async () => {
        const response = await axios.get(`${API_URL}/api/auth/sso/url`);
        window.location.href = response.data.url;
    };

    // รับ code จาก callback แล้ว login
    const loginWithSSO = async (code) => {
        const response = await axios.post(`${API_URL}/api/auth/sso/callback`, { code });
        const userData = response.data;
        
        localStorage.setItem('token', userData.token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        
        return userData;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, initiateSSO, loginWithSSO, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
```

---

## 7. Frontend - App Routes (`client/src/App.jsx`)

```jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './Layout';
import Login from './pages/Login';
import SSOCallback from './pages/SSOCallback';
import Home from './pages/Home';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/sso-callback" element={<SSOCallback />} />
                    <Route element={<Layout />}>
                        <Route path="/" element={<Home />} />
                        {/* เพิ่ม routes อื่นๆ */}
                    </Route>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
```

---

## 8. SSO Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SSO Authentication Flow                            │
└─────────────────────────────────────────────────────────────────────────────┘

    ┌──────────┐          ┌──────────┐          ┌──────────┐          ┌──────────┐
    │  Client  │          │  Backend │          │ Health ID │          │Provider ID│
    │ (React)  │          │(Express) │          │  (MOPH)  │          │  (MOPH)   │
    └────┬─────┘          └────┬─────┘          └────┬─────┘          └────┬─────┘
         │                     │                     │                     │
    1. กดปุ่ม Login            │                     │                     │
         │──GET /sso/url──────►│                     │                     │
         │◄─────URL────────────│                     │                     │
         │                     │                     │                     │
    2. Redirect ไป Health ID   │                     │                     │
         │─────────────────────────────────────────►│                     │
         │                     │                     │                     │
    3. ผู้ใช้ยืนยันตัวตน        │                     │                     │
         │                     │◄──GET /healthid?code│                     │
         │                     │                     │                     │
    4. Backend redirect ไป Frontend                  │                     │
         │◄─────────────────────│                     │                     │
         │  /sso-callback?code │                     │                     │
         │                     │                     │                     │
    5. Frontend ส่ง code ไป Backend                   │                     │
         │──POST /sso/callback─►│                     │                     │
         │                     │                     │                     │
    6. Backend แลก token        │                     │                     │
         │                     │──POST /token────────►│                     │
         │                     │◄───Health ID Token───│                     │
         │                     │                     │                     │
    7. แลกเป็น Provider ID token │                     │                     │
         │                     │───────────────────────────POST /token────►│
         │                     │◄──────────────────────────Provider Token──│
         │                     │                     │                     │
    8. ดึง Profile             │                     │                     │
         │                     │───────────────────────────GET /profile───►│
         │                     │◄──────────────────────────Profile Data────│
         │                     │                     │                     │
    9. สร้าง/อัพเดท User + JWT  │                     │                     │
         │◄────JWT + User Data──│                     │                     │
         │                     │                     │                     │
   10. เก็บ token + redirect   │                     │                     │
         │──────────────────────────────────────────────────────────────────►
         │                                   หน้าหลัก                       │
```

---

## 9. ตัวอย่าง Profile จาก Provider ID

```json
{
  "account_id": "13347845xxxxx",
  "provider_id": "0Bxxx1DAFxxxxx",
  "name_th": "สมชาย ใจดี",
  "name_eng": "Somchai Jaidee",
  "email": "somchai@example.com",
  "date_of_birth": "1980-04-30",
  "organization": [
    {
      "position": "นักวิชาการสาธารณสุข",
      "hcode": "00015",
      "hname_th": "สำนักงานสาธารณสุขจังหวัดพิษณุโลก",
      "address": {
        "province": "พิษณุโลก",
        "district": "เมืองพิษณุโลก"
      }
    }
  ]
}
```

---

## 10. การติดตั้งและขึ้นระบบ

### 10.1 Clone และติดตั้ง dependencies

```bash
# Clone repository
git clone <repository-url>
cd km_health_db

# ติดตั้ง dependencies
cd server && npm install
cd ../client && npm install
```

### 10.2 ตั้งค่า Environment Variables

```bash
# Copy ตัวอย่าง .env
cp server/.env.example server/.env
# แก้ไขค่าใน .env ตามระบบของคุณ

# สร้าง client/.env
echo "VITE_API_URL=http://localhost:5001" > client/.env
```

### 10.3 รัน Database Migration

```bash
cd server
node migrate_add_sso_columns.js
```

### 10.4 รันระบบ

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend  
cd client
npm run dev
```

### 10.5 ทดสอบ

1. เปิด http://localhost:5173
2. กดปุ่ม "เข้าสู่ระบบด้วย Provider ID"
3. ยืนยันตัวตนที่ Health ID
4. ระบบจะ redirect กลับมาและ login อัตโนมัติ

---

## 11. Troubleshooting

### Error: "SSO authentication failed"
- ตรวจสอบค่า `HEALTH_CLIENT_ID`, `HEALTH_CLIENT_SECRET` ใน `.env`
- ตรวจสอบว่า `HEALTH_REDIRECT_URI` ตรงกับที่ลงทะเบียนไว้กับ Health ID

### Error: "Authorization code is missing"
- ตรวจสอบว่า Health ID redirect กลับมาที่ URL ที่ถูกต้อง

### API ไม่ตอบสนอง
- ตรวจสอบว่า server กำลังทำงานอยู่
- ตรวจสอบ PORT ใน `.env` (default: 5001)

### React เรียก API ซ้ำ
- ใช้ `useRef` เพื่อป้องกันการเรียกซ้ำใน React Strict Mode (ดูตัวอย่างใน SSOCallback.jsx)

---

**Last Updated**: 2026-01-15
**Version**: 1.0.0