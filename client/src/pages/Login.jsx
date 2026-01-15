import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const { initiateSSO } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSSOLogin = async () => {
        try {
            setLoading(true);
            setError('');
            await initiateSSO();
        } catch (err) {
            setLoading(false);
            setError('ไม่สามารถเชื่อมต่อกับระบบ SSO ได้ กรุณาลองใหม่อีกครั้ง');
            console.error('SSO error:', err);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl w-full max-w-md border border-white/50">
                {/* Logo และ Header */}
                <div className="text-center mb-8">
                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-sky-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-sky-200/50 mb-4 transform hover:scale-105 transition-transform">
                        <svg className="w-14 h-14 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-blue-700 bg-clip-text text-transparent">
                        ระบบคลังความรู้
                    </h1>
                    <p className="text-slate-500 mt-2">Knowledge Management System</p>
                </div>

                {/* Error Alert */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6 flex items-start gap-3">
                        <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-sm">{error}</p>
                    </div>
                )}

                {/* SSO Login Button */}
                <div className="space-y-4">
                    <button
                        onClick={handleSSOLogin}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 rounded-xl font-semibold transition-all shadow-lg shadow-green-200/50 hover:shadow-xl hover:shadow-green-300/50 transform hover:-translate-y-0.5 disabled:transform-none disabled:shadow-none flex items-center justify-center gap-3"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>กำลังเชื่อมต่อ...</span>
                            </>
                        ) : (
                            <>
                                {/* Provider ID Icon */}
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                <span>เข้าสู่ระบบด้วย Provider ID</span>
                            </>
                        )}
                    </button>

                    {/* Info Box */}
                    <div className="bg-sky-50 border border-sky-100 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                <svg className="w-4 h-4 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="text-sm text-slate-600">
                                <p className="font-medium text-slate-700 mb-1">ระบบยืนยันตัวตน</p>
                                <p>ใช้บัญชี <strong className="text-sky-700">Provider ID</strong> ของกระทรวงสาธารณสุข (สธ.) ในการเข้าสู่ระบบ</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                    <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <span>Secured by MOPH SSO</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

