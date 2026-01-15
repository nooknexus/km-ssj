import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        department: ''
    });
    const { signup } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signup(formData);
            navigate('/');
        } catch (err) {
            setError('การลงทะเบียนล้มเหลว ชื่อผู้ใช้อาจมีอยู่ในระบบแล้ว');
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100">
                <h2 className="text-3xl font-bold text-secondary mb-6 text-center">สมัครสมาชิก</h2>
                {error && <div className="bg-red-50 text-red-500 p-3 rounded mb-4 text-sm">{error}</div>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">ชื่อผู้ใช้</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50"
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">อีเมล</label>
                        <input
                            type="email"
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">รหัสผ่าน</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-600 mb-1">กลุ่มงาน/แผนก</label>
                        <input
                            type="text"
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary/50"
                            value={formData.department}
                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        />
                    </div>
                    <button type="submit" className="w-full bg-secondary hover:bg-indigo-600 text-white py-2 rounded-lg font-semibold transition-colors shadow-lg shadow-indigo-200">
                        ลงทะเบียน
                    </button>
                </form>
                <div className="mt-4 text-center text-sm text-slate-500">
                    มีบัญชีผู้ใช้แล้ว? <Link to="/login" className="text-secondary hover:underline">เข้าสู่ระบบ</Link>
                </div>
            </div>
        </div>
    );
};

export default Signup;
