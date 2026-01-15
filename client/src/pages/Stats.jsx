import { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { API_BASE } from '../config/api';

const COLORS = ['#0ea5e9', '#6366f1', '#f43f5e', '#10b981', '#f59e0b'];

const Stats = () => {
    const [stats, setStats] = useState({ popularCategories: [], popularItems: [] });
    const [history, setHistory] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, historyRes] = await Promise.all([
                    axios.get(`${API_BASE}/dashboard/stats`),
                    axios.get(`${API_BASE}/dashboard/history`, {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                    })
                ]);
                setStats(statsRes.data);
                setHistory(historyRes.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);

    const categoryData = stats.popularCategories.map(cat => ({ name: cat.name, value: parseInt(cat.total_views) || 0 }));
    const itemData = stats.popularItems.map(item => ({ name: item.title.substring(0, 15) + '...', views: item.views }));

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-10">
            <h1 className="text-3xl font-bold text-slate-800">แดชบอร์ดการใช้งาน</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Popular Categories */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-700 mb-4">หมวดหมู่ยอมนิยม</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Popular Items */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-700 mb-4">บทความยอดนิยม (ทั้งหมด)</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={itemData}>
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                                <YAxis stroke="#94a3b8" fontSize={12} />
                                <Tooltip />
                                <Bar dataKey="views" fill="#6366f1" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* User History */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-700 mb-4">ประวัติการเข้าชมของคุณ</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-100 text-slate-500 text-sm">
                                <th className="p-3">บทความ</th>
                                <th className="p-3">หมวดหมู่</th>
                                <th className="p-3">เวลาที่เข้าชม</th>
                            </tr>
                        </thead>
                        <tbody>
                            {history.length > 0 ? history.map((h, i) => (
                                <tr key={i} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-3 font-medium text-slate-700">{h.title}</td>
                                    <td className="p-3 text-slate-500">{h.category_name}</td>
                                    <td className="p-3 text-slate-400 text-sm">{new Date(h.accessed_at).toLocaleString('th-TH')}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="3" className="p-4 text-center text-slate-400">ยังไม่มีประวัติการเข้าชม</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Stats;
