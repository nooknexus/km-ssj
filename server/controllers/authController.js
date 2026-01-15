const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');

// SSO: สร้าง URL สำหรับ redirect ไปยัง Health ID OAuth
exports.getSSOUrl = (req, res) => {
    try {
        const clientId = process.env.HEALTH_CLIENT_ID;
        const redirectUri = process.env.HEALTH_REDIRECT_URI;
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

        if (!clientId || !redirectUri) {
            return res.status(500).json({ error: 'SSO configuration is missing' });
        }

        const url = new URL("https://moph.id.th/oauth/redirect");
        url.searchParams.set("client_id", clientId);
        url.searchParams.set("redirect_uri", redirectUri);
        url.searchParams.set("response_type", "code");
        url.searchParams.set("landing", `${frontendUrl}/sso-callback`);
        url.searchParams.set("is_auth", "yes");

        res.json({ url: url.toString() });
    } catch (err) {
        console.error('getSSOUrl error:', err);
        res.status(500).json({ error: 'Failed to generate SSO URL' });
    }
};

// SSO Callback: รับ code จาก Health ID และแลกเป็น Provider ID profile
exports.ssoCallback = async (req, res) => {
    try {
        const { code } = req.body;

        if (!code) {
            return res.status(400).json({ error: 'Authorization code is missing' });
        }

        console.log("SSO: Authorization code received");

        // Step 1: แลก code เป็น Health ID token
        const tokenResponse = await axios.post('https://moph.id.th/api/v1/token', {
            grant_type: 'authorization_code',
            code: code,
            redirect_uri: process.env.HEALTH_REDIRECT_URI,
            client_id: process.env.HEALTH_CLIENT_ID,
            client_secret: process.env.HEALTH_CLIENT_SECRET
        });

        if (!tokenResponse.data?.data?.access_token) {
            console.error('Health ID token response:', tokenResponse.data);
            return res.status(400).json({ error: 'Failed to get Health ID token' });
        }

        const healthIdToken = tokenResponse.data.data.access_token;
        console.log("SSO: Health ID token obtained");

        // Step 2: แลก Health ID token เป็น Provider ID token
        const providerTokenResponse = await axios.post('https://provider.id.th/api/v1/services/token', {
            client_id: process.env.PROVIDER_CLIENT_ID,
            secret_key: process.env.PROVIDER_CLIENT_SECRET,
            token_by: 'Health ID',
            token: healthIdToken
        });

        if (!providerTokenResponse.data?.data?.access_token) {
            console.error('Provider ID token response:', providerTokenResponse.data);
            return res.status(400).json({ error: 'Failed to get Provider ID token' });
        }

        const providerIdToken = providerTokenResponse.data.data.access_token;
        console.log("SSO: Provider ID token obtained");

        // Step 3: ดึง Provider Profile
        const profileResponse = await axios.get('https://provider.id.th/api/v1/services/profile?position_type=1', {
            headers: {
                'client-id': process.env.PROVIDER_CLIENT_ID,
                'secret-key': process.env.PROVIDER_CLIENT_SECRET,
                'Authorization': `Bearer ${providerIdToken}`
            }
        });

        if (!profileResponse.data?.data) {
            console.error('Provider profile response:', profileResponse.data);
            return res.status(400).json({ error: 'Failed to get Provider profile' });
        }

        const profile = profileResponse.data.data;
        console.log("SSO: Provider profile obtained for:", profile.name_th);

        // Step 4: สร้างหรืออัพเดท user ในระบบ
        const providerId = profile.provider_id;
        const username = profile.provider_id; // ใช้ provider_id เป็น username
        const email = profile.email || `${providerId}@provider.id.th`;
        const displayName = profile.name_th || profile.name_eng;
        const department = profile.organization?.[0]?.hname_th || '';

        // ตรวจสอบว่า user มีอยู่แล้วหรือไม่
        const [existingUsers] = await db.query(
            'SELECT * FROM users WHERE username = ? OR email = ?',
            [username, email]
        );

        let user;
        let isNewUser = false;
        if (existingUsers.length > 0) {
            // User มีอยู่แล้ว - อัพเดทข้อมูล
            user = existingUsers[0];
            await db.query(
                'UPDATE users SET email = ?, department = ?, display_name = ?, provider_profile = ?, updated_at = NOW() WHERE id = ?',
                [email, department, displayName, JSON.stringify(profile), user.id]
            );
            console.log("SSO: Existing user updated:", user.id);
        } else {
            // สร้าง user ใหม่ - ยังไม่ approved
            const [result] = await db.query(
                'INSERT INTO users (username, password, email, department, role, display_name, provider_profile, is_approved) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [username, '', email, department, 'user', displayName, JSON.stringify(profile), false]
            );
            user = { id: result.insertId, username, email, role: 'user', department, is_approved: false };
            isNewUser = true;
            console.log("SSO: New user created (pending approval):", user.id);
        }

        // ตรวจสอบ approval status
        if (!user.is_approved && !isNewUser) {
            // ดึงข้อมูลล่าสุด
            const [freshUser] = await db.query('SELECT is_approved FROM users WHERE id = ?', [user.id]);
            user.is_approved = freshUser[0]?.is_approved;
        }

        // ถ้า user ยังไม่ได้รับการ approve
        if (!user.is_approved) {
            return res.status(403).json({
                error: 'pending_approval',
                message: 'บัญชีของคุณกำลังรอการอนุมัติจากผู้ดูแลระบบ',
                user: {
                    id: user.id,
                    username: user.username || username,
                    display_name: displayName,
                    email: user.email || email,
                    department: user.department || department,
                    is_approved: false
                }
            });
        }

        // Step 5: สร้าง JWT token (เฉพาะ user ที่ approved แล้ว)
        const token = jwt.sign(
            { user_id: user.id, username, role: user.role || 'user' },
            process.env.JWT_SECRET || 'secret_key',
            { expiresIn: "8h" }
        );

        // ส่งข้อมูล user กลับ (ไม่รวม password และ provider_profile เต็ม)
        const responseUser = {
            id: user.id,
            username: user.username || username,
            email: user.email || email,
            role: user.role || 'user',
            department: user.department || department,
            display_name: displayName,
            is_approved: true,
            token
        };

        res.json(responseUser);
    } catch (err) {
        console.error('SSO Callback error:', err.response?.data || err.message || err);
        res.status(500).json({
            error: 'SSO authentication failed',
            details: err.response?.data?.error || err.message
        });
    }
};

// Health ID OAuth Callback: รับ code จาก Health ID แล้ว redirect ไป frontend
exports.healthIdCallback = async (req, res) => {
    try {
        const { code, landing } = req.query;
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

        if (!code) {
            console.error('Health ID callback: Authorization code is missing');
            return res.redirect(`${frontendUrl}/login?error=no_code`);
        }

        console.log("Health ID callback: Received code, redirecting to frontend");

        // Redirect ไป frontend พร้อม code (ให้ frontend ส่ง code มา backend เพื่อแลก token)
        const redirectUrl = `${frontendUrl}/sso-callback?code=${encodeURIComponent(code)}`;
        res.redirect(redirectUrl);
    } catch (err) {
        console.error('Health ID callback error:', err);
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        res.redirect(`${frontendUrl}/login?error=callback_failed`);
    }
};

exports.signup = async (req, res) => {
    try {
        const { username, password, email, department } = req.body;

        if (!(username && password && email)) {
            return res.status(400).send("All input is required");
        }

        const [existingUser] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        if (existingUser.length > 0) {
            return res.status(409).send("User already exists. Please login");
        }

        const encryptedPassword = await bcrypt.hash(password, 10);

        const [result] = await db.query(
            'INSERT INTO users (username, password, email, department, role) VALUES (?, ?, ?, ?, ?)',
            [username, encryptedPassword, email, department, 'user']
        );

        const user = { id: result.insertId, username, email, role: 'user' };
        const token = jwt.sign(
            { user_id: user.id, username, role: 'user' },
            process.env.JWT_SECRET || 'secret_key',
            { expiresIn: "2h" }
        );

        user.token = token;
        res.status(201).json(user);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!(username && password)) {
            return res.status(400).send("All input is required");
        }

        const [users] = await db.query('SELECT * FROM users WHERE username = ?', [username]);

        if (users.length && (await bcrypt.compare(password, users[0].password))) {
            const user = users[0];
            const token = jwt.sign(
                { user_id: user.id, username, role: user.role },
                process.env.JWT_SECRET || 'secret_key',
                { expiresIn: "5h" } // Longer session for convenience
            );

            const { password, ...userWithoutPassword } = user;
            return res.status(200).json({ ...userWithoutPassword, token });
        }
        res.status(400).send("Invalid Credentials");
    } catch (err) {
        console.log(err);
        res.status(500).send(err.message);
    }
};
