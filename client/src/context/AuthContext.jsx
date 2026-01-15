import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
            setUser(JSON.parse(storedUser));
            // Optional: Validate token with backend /me endpoint here
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        const res = await axios.post(`${API_URL}/api/auth/login`, { username, password });
        const { token, ...userData } = res.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return userData;
    };

    // SSO: เริ่มกระบวนการ SSO ด้วยการ redirect ไปยัง Health ID
    const initiateSSO = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/auth/sso/url`);
            // Redirect ไปยัง Health ID OAuth URL
            window.location.href = res.data.url;
        } catch (err) {
            console.error('SSO initiate error:', err);
            throw err;
        }
    };

    // SSO: รับ code จาก callback และแลกเป็น user data
    const loginWithSSO = async (code) => {
        try {
            const res = await axios.post(`${API_URL}/api/auth/sso/callback`, { code });
            const { token, ...userData } = res.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            return userData;
        } catch (err) {
            console.error('SSO login error:', err);
            throw err;
        }
    };

    const signup = async (userData) => {
        const res = await axios.post(`${API_URL}/api/auth/signup`, userData);
        const { token, ...newUserData } = res.data;

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(newUserData));
        setUser(newUserData);
        return newUserData;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, loading, initiateSSO, loginWithSSO }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

