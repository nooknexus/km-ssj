import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ArrowLeft, UserCheck, RefreshCw } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || '';

const PendingApproval = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const pendingUser = JSON.parse(localStorage.getItem('pendingUser') || '{}');
    const [checking, setChecking] = useState(false);
    const [lastCheck, setLastCheck] = useState(null);

    // Poll for approval status every 30 seconds
    useEffect(() => {
        if (!pendingUser.id) return;

        const checkApproval = async () => {
            try {
                setChecking(true);
                const response = await axios.get(`${API_URL}/api/users/${pendingUser.id}/check-approval`);
                setLastCheck(new Date());

                if (response.data.is_approved && response.data.user) {
                    // User has been approved! Generate token and login
                    const approvedUser = response.data.user;

                    // Perform SSO login again to get token, or call a new endpoint
                    // For now, redirect to login to re-authenticate
                    localStorage.removeItem('pendingUser');
                    alert('บัญชีของคุณได้รับการอนุมัติแล้ว! กรุณาเข้าสู่ระบบอีกครั้ง');
                    navigate('/login');
                }
            } catch (err) {
                console.error('Error checking approval status:', err);
            } finally {
                setChecking(false);
            }
        };

        // Check immediately on mount
        checkApproval();

        // Then check every 30 seconds
        const interval = setInterval(checkApproval, 30000);

        return () => clearInterval(interval);
    }, [pendingUser.id, navigate]);

    const handleBackToLogin = () => {
        localStorage.removeItem('pendingUser');
        navigate('/login');
    };

    const handleManualCheck = async () => {
        if (!pendingUser.id || checking) return;

        try {
            setChecking(true);
            const response = await axios.get(`${API_URL}/api/users/${pendingUser.id}/check-approval`);
            setLastCheck(new Date());

            if (response.data.is_approved) {
                localStorage.removeItem('pendingUser');
                alert('บัญชีของคุณได้รับการอนุมัติแล้ว! กรุณาเข้าสู่ระบบอีกครั้ง');
                navigate('/login');
            }
        } catch (err) {
            console.error('Error checking approval status:', err);
        } finally {
            setChecking(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-100 flex items-center justify-center p-4">
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl w-full max-w-lg border border-amber-100 text-center relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-amber-200/30 to-orange-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-yellow-200/30 to-amber-200/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                {/* Icon */}
                <div className="relative mb-8">
                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-xl shadow-amber-200/50">
                        <Clock className="w-12 h-12 text-white" />
                    </div>
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white px-4 py-1 rounded-full shadow-md">
                        <span className="text-xs font-bold text-amber-600 uppercase tracking-wide">รอดำเนินการ</span>
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-3">
                    รอการอนุมัติ
                </h1>
                <p className="text-slate-500 mb-8 leading-relaxed">
                    บัญชีของคุณกำลังรอการอนุมัติจากผู้ดูแลระบบ<br />
                    กรุณารอสักครู่ ทีมงานจะดำเนินการโดยเร็วที่สุด
                </p>

                {/* User Info Card */}
                {pendingUser.display_name && (
                    <div className="bg-gradient-to-r from-slate-50 to-slate-100/80 rounded-2xl p-6 mb-8 border border-slate-200/50 text-left">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                {pendingUser.display_name?.charAt(0) || 'U'}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 text-lg">{pendingUser.display_name}</h3>
                                <p className="text-sm text-slate-500">{pendingUser.email}</p>
                            </div>
                        </div>
                        {pendingUser.department && (
                            <div className="flex items-center gap-2 text-sm text-slate-600 bg-white p-3 rounded-xl">
                                <UserCheck size={16} className="text-amber-500" />
                                <span>{pendingUser.department}</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Status Timeline */}
                <div className="flex items-center justify-center gap-3 mb-8">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <span className="text-sm text-slate-600">ลงทะเบียน</span>
                    </div>
                    <div className="w-8 h-0.5 bg-slate-200"></div>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center animate-pulse">
                            <Clock size={16} className="text-white" />
                        </div>
                        <span className="text-sm text-amber-600 font-medium">รออนุมัติ</span>
                    </div>
                    <div className="w-8 h-0.5 bg-slate-200"></div>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
                            <UserCheck size={16} className="text-slate-400" />
                        </div>
                        <span className="text-sm text-slate-400">เข้าใช้งาน</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                    <button
                        onClick={handleManualCheck}
                        disabled={checking}
                        className={`inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold transition-all ${checking ? 'opacity-70 cursor-not-allowed' : 'hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-200'}`}
                    >
                        <RefreshCw size={18} className={checking ? 'animate-spin' : ''} />
                        {checking ? 'กำลังตรวจสอบ...' : 'ตรวจสอบสถานะ'}
                    </button>
                    <button
                        onClick={handleBackToLogin}
                        className="inline-flex items-center justify-center gap-2 bg-white border-2 border-slate-200 text-slate-600 px-6 py-3 rounded-xl font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all"
                    >
                        <ArrowLeft size={18} />
                        กลับหน้าเข้าสู่ระบบ
                    </button>
                </div>

                {/* Auto-check status */}
                <p className="mt-6 text-xs text-slate-400">
                    ระบบตรวจสอบสถานะอัตโนมัติทุก 30 วินาที
                    {lastCheck && (
                        <span className="block mt-1">
                            ตรวจสอบล่าสุด: {lastCheck.toLocaleTimeString('th-TH')}
                        </span>
                    )}
                </p>

                {/* Footer Note */}
                <p className="mt-4 text-xs text-slate-400">
                    หากมีข้อสงสัย กรุณาติดต่อผู้ดูแลระบบ
                </p>
            </div>
        </div>
    );
};

export default PendingApproval;
