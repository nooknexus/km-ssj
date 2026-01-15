import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SSOCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { loginWithSSO } = useAuth();
    const [status, setStatus] = useState('กำลังยืนยันตัวตน...');
    const [error, setError] = useState('');
    const hasCalledRef = useRef(false); // ป้องกันการเรียกซ้ำ

    useEffect(() => {
        const handleCallback = async () => {
            // ป้องกัน React Strict Mode เรียกซ้ำ
            if (hasCalledRef.current) return;
            hasCalledRef.current = true;

            try {
                // รับ code จาก URL parameters
                const code = searchParams.get('code');

                if (!code) {
                    setError('ไม่พบรหัสยืนยันตัวตน (Authorization code)');
                    return;
                }

                setStatus('กำลังเชื่อมต่อกับ Provider ID...');

                // ส่ง code ไปยัง backend เพื่อแลก token และ profile
                await loginWithSSO(code);

                setStatus('เข้าสู่ระบบสำเร็จ! กำลังนำทาง...');

                // Redirect ไปหน้าหลักหลังจาก login สำเร็จ
                setTimeout(() => {
                    navigate('/');
                }, 1000);

            } catch (err) {
                console.error('SSO Callback error:', err);

                // ตรวจสอบ pending approval error
                if (err.response?.status === 403 && err.response?.data?.error === 'pending_approval') {
                    // เก็บข้อมูล user ไว้แสดงในหน้า pending
                    localStorage.setItem('pendingUser', JSON.stringify(err.response.data.user));
                    navigate('/pending-approval');
                    return;
                }

                setError(err.response?.data?.message || err.response?.data?.error || err.message || 'เกิดข้อผิดพลาดในการยืนยันตัวตน');
            }
        };

        handleCallback();
    }, []); // Empty dependency array - run only once

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-100 text-center">
                {/* MOPH Logo */}
                <div className="mb-6">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-sky-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-slate-800 mb-4">
                    Provider ID Authentication
                </h2>

                {error ? (
                    <div className="space-y-4">
                        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
                            <div className="flex items-center justify-center mb-2">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <p className="font-medium">เกิดข้อผิดพลาด</p>
                            <p className="text-sm mt-1">{error}</p>
                        </div>
                        <button
                            onClick={() => navigate('/login')}
                            className="w-full bg-sky-500 hover:bg-sky-600 text-white py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
                        >
                            กลับไปหน้าเข้าสู่ระบบ
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {/* Loading spinner */}
                        <div className="flex justify-center">
                            <div className="relative">
                                <div className="w-12 h-12 border-4 border-sky-200 rounded-full animate-spin border-t-sky-500"></div>
                            </div>
                        </div>
                        <p className="text-slate-600 font-medium">{status}</p>
                        <div className="flex justify-center space-x-1">
                            <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 bg-sky-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SSOCallback;
