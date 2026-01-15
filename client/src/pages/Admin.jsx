import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Trash, Plus, Users, Folder, FileText, Edit, X, Shield, CheckCircle, Clock, Search, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import { API_BASE } from '../config/api';

const Admin = () => {
    const [activeTab, setActiveTab] = useState('users');
    const { user } = useAuth();
    const token = localStorage.getItem('token');
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const [message, setMessage] = useState({ text: '', type: '' });

    const [users, setUsers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [items, setItems] = useState([]);

    const [newUser, setNewUser] = useState({ username: '', password: '', email: '', department: '', role: 'user' });
    const [newCat, setNewCat] = useState({ id: null, name: '', image_url: '', file: null });
    const [newItem, setNewItem] = useState({ title: '', content: '', category_id: '', is_highlight: false });

    // User search and pagination
    const [userSearch, setUserSearch] = useState('');
    const [userPage, setUserPage] = useState(1);
    const USERS_PER_PAGE = 15;

    // Confirm modal state
    const [confirmModal, setConfirmModal] = useState({
        show: false,
        title: '',
        message: '',
        type: 'warning', // 'warning', 'danger', 'info'
        onConfirm: null,
        confirmText: 'ยืนยัน',
        cancelText: 'ยกเลิก'
    });

    // Filtered and paginated users
    const filteredUsers = useMemo(() => {
        if (!userSearch.trim()) return users;
        const search = userSearch.toLowerCase();
        return users.filter(u =>
            (u.display_name || '').toLowerCase().includes(search) ||
            (u.username || '').toLowerCase().includes(search) ||
            (u.email || '').toLowerCase().includes(search) ||
            (u.department || '').toLowerCase().includes(search)
        );
    }, [users, userSearch]);

    const totalUserPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
    const paginatedUsers = useMemo(() => {
        const start = (userPage - 1) * USERS_PER_PAGE;
        return filteredUsers.slice(start, start + USERS_PER_PAGE);
    }, [filteredUsers, userPage]);

    // Reset page when search changes
    useEffect(() => {
        setUserPage(1);
    }, [userSearch]);

    // Toggle user approval
    const handleToggleApproval = async (userId, currentStatus) => {
        try {
            await axios.put(`${API_BASE}/users/${userId}/approve`, { is_approved: !currentStatus }, config);
            setMessage({ text: currentStatus ? 'ยกเลิกการอนุมัติสำเร็จ' : 'อนุมัติผู้ใช้สำเร็จ', type: 'success' });
            fetchData();
        } catch (err) {
            setMessage({ text: 'ดำเนินการไม่สำเร็จ', type: 'error' });
        }
    };



    const handleChangeRole = async (userId, currentRole) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        const targetUser = users.find(u => u.id === userId);

        setConfirmModal({
            show: true,
            title: 'เปลี่ยนบทบาทผู้ใช้',
            message: `ต้องการเปลี่ยนบทบาทของ "${targetUser?.display_name || targetUser?.username}" เป็น "${newRole === 'admin' ? 'แอดมิน' : 'ผู้ใช้ทั่วไป'}" หรือไม่?`,
            type: newRole === 'admin' ? 'warning' : 'info',
            confirmText: newRole === 'admin' ? 'เปลี่ยนเป็นแอดมิน' : 'เปลี่ยนเป็นผู้ใช้',
            cancelText: 'ยกเลิก',
            onConfirm: async () => {
                try {
                    await axios.put(`${API_BASE}/users/${userId}/role`, { role: newRole }, config);
                    setMessage({ text: 'เปลี่ยนบทบาทสำเร็จ', type: 'success' });
                    fetchData();
                } catch (err) {
                    setMessage({ text: 'เปลี่ยนบทบาทไม่สำเร็จ', type: 'error' });
                }
                setConfirmModal(prev => ({ ...prev, show: false }));
            }
        });
    };

    const fetchData = async () => {
        try {
            if (activeTab === 'users') {
                const res = await axios.get(`${API_BASE}/users`, config);
                setUsers(res.data);
            } else if (activeTab === 'categories') {
                const res = await axios.get(`${API_BASE}/categories`);
                setCategories(res.data);
            } else if (activeTab === 'items') {
                const cats = await axios.get(`${API_BASE}/categories`);
                setCategories(cats.data);
                // Fetch ALL items by default
                fetchProjectItems();
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line
    }, [activeTab]);

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_BASE}/users`, newUser, config);
            await axios.post(`${API_BASE}/users`, newUser, config);
            setMessage({ text: 'เพิ่มผู้ใช้สำเร็จ', type: 'success' });
            fetchData();
            setNewUser({ username: '', password: '', email: '', department: '', role: 'user' });
        } catch (err) { setMessage({ text: 'เกิดข้อผิดพลาดในการเพิ่มผู้ใช้', type: 'error' }); }
    };

    const handleDeleteUser = async (id) => {
        const targetUser = users.find(u => u.id === id);
        setConfirmModal({
            show: true,
            title: 'ยืนยันการลบผู้ใช้งาน',
            message: `คุณต้องการลบผู้ใช้งาน "${targetUser?.display_name || targetUser?.username}" หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้`,
            type: 'danger',
            confirmText: 'ลบผู้ใช้',
            cancelText: 'ยกเลิก',
            onConfirm: async () => {
                try {
                    await axios.delete(`${API_BASE}/users/${id}`, config);
                    fetchData();
                    setMessage({ text: 'ลบผู้ใช้สำเร็จ', type: 'success' });
                } catch (err) { setMessage({ text: 'ลบผู้ใช้ไม่สำเร็จ', type: 'error' }); }
                setConfirmModal(prev => ({ ...prev, show: false }));
            }
        });
    };

    const handleAddOrUpdateCat = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', newCat.name);
        if (newCat.image_url) formData.append('image_url', newCat.image_url);
        if (newCat.file) formData.append('image', newCat.file);

        try {
            // Let axios set Content-Type automatically for FormData
            if (newCat.id) {
                await axios.put(`${API_BASE}/categories/${newCat.id}`, formData, config);
                setMessage({ text: 'อัปเดตหมวดหมู่สำเร็จ', type: 'success' });
            } else {
                await axios.post(`${API_BASE}/categories`, formData, config);
                setMessage({ text: 'เพิ่มหมวดหมู่สำเร็จ', type: 'success' });
            }

            fetchData();
            setNewCat({ id: null, name: '', image_url: '', file: null });
        } catch (err) {
            console.error(err);
            setMessage({ text: 'ทำรายการไม่สำเร็จ: ' + (err.response?.data?.error || err.message), type: 'error' });
        }
    };

    const handleEditCat = (cat) => {
        setNewCat({ id: cat.id, name: cat.name, image_url: cat.image_url || '', file: null });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setNewCat({ id: null, name: '', image_url: '', file: null });
    };

    const handleDeleteCat = async (id) => {
        const targetCat = categories.find(c => c.id === id);
        setConfirmModal({
            show: true,
            title: 'ยืนยันการลบหมวดหมู่',
            message: `คุณต้องการลบหมวดหมู่ "${targetCat?.name}" หรือไม่? บทความทั้งหมดในหมวดหมู่นี้จะถูกลบไปด้วย!`,
            type: 'danger',
            confirmText: 'ลบหมวดหมู่',
            cancelText: 'ยกเลิก',
            onConfirm: async () => {
                try {
                    await axios.delete(`${API_BASE}/categories/${id}`, config);
                    fetchData();
                    setMessage({ text: 'ลบหมวดหมู่สำเร็จ', type: 'success' });
                } catch (err) { setMessage('ลบหมวดหมู่ไม่สำเร็จ'); }
                setConfirmModal(prev => ({ ...prev, show: false }));
            }
        });
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', newItem.title);
        formData.append('content', newItem.content);
        formData.append('category_id', newItem.category_id);
        formData.append('is_highlight', newItem.is_highlight);
        if (newItem.file) {
            formData.append('files', newItem.file);
        }

        try {
            await axios.post(`${API_BASE}/items`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setMessage('เพิ่มบทความสำเร็จ');
            fetchProjectItems(newItem.category_id);
            setNewItem({ ...newItem, title: '', content: '', file: null });
        } catch (err) { setMessage('เพิ่มบทความไม่สำเร็จ'); }
    };

    const fetchProjectItems = async (catId) => {
        try {
            // New logic: Fetch ALL items always (unless strictly filtered, but user requested all)
            // If catId is passed, maybe filter? For now, user asked "show items from every category".
            // So we will just hit the new root endpoint
            const res = await axios.get(`${API_BASE}/items`);
            setItems(res.data);
        } catch (err) { setItems([]); }
    }

    const handleUpdateItem = async (id, updates) => {
        try {
            await axios.put(`${API_BASE}/items/${id}`, updates, config);
            fetchProjectItems(newItem.category_id);
            setMessage('อัปเดตสถานะสำเร็จ');
        } catch (err) { setMessage('อัปเดตไม่สำเร็จ'); }
    };

    const handleDeleteItem = async (id) => {
        const targetItem = items.find(i => i.id === id);
        setConfirmModal({
            show: true,
            title: 'ยืนยันการลบบทความ',
            message: `คุณต้องการลบบทความ "${targetItem?.title}" หรือไม่?`,
            type: 'danger',
            confirmText: 'ลบบทความ',
            cancelText: 'ยกเลิก',
            onConfirm: async () => {
                try {
                    await axios.delete(`${API_BASE}/items/${id}`, config);
                    fetchProjectItems(newItem.category_id);
                    setMessage('ลบบทความสำเร็จ');
                } catch (err) { setMessage('ลบบทความไม่สำเร็จ'); }
                setConfirmModal(prev => ({ ...prev, show: false }));
            }
        });
    };

    return (
        <>
            <div className="max-w-6xl mx-auto pb-20">
                <h1 className="text-3xl font-bold text-slate-800 mb-8">ระบบจัดการข้อมูล</h1>

                {message.text && (
                    <div className={`p-4 rounded-lg mb-6 flex justify-between items-center ${message.type === 'success' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
                        <span>{message.text}</span>
                        <button onClick={() => setMessage({ text: '', type: '' })} className="hover:opacity-75"><X size={18} /></button>
                    </div>
                )}

                <div className="flex gap-4 mb-8">
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${activeTab === 'users' ? 'bg-primary text-white shadow-lg shadow-sky-200' : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'}`}
                    >
                        <Users size={20} /> ผู้ใช้งาน
                    </button>
                    <button
                        onClick={() => setActiveTab('categories')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${activeTab === 'categories' ? 'bg-secondary text-white shadow-lg shadow-indigo-200' : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'}`}
                    >
                        <Folder size={20} /> หมวดหมู่
                    </button>
                    <button
                        onClick={() => setActiveTab('items')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${activeTab === 'items' ? 'bg-accent text-white shadow-lg shadow-rose-200' : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'}`}
                    >
                        <FileText size={20} /> บทความ
                    </button>
                </div>

                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 min-h-[500px]">
                    {activeTab === 'users' && (
                        <div>
                            {/* Header with search */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                <div className="flex items-center gap-4">
                                    <h3 className="text-xl font-bold text-slate-800">จัดการผู้ใช้งาน</h3>
                                    <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                                        {filteredUsers.length} รายการ
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    {/* Search box */}
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="text"
                                            placeholder="ค้นหาผู้ใช้..."
                                            value={userSearch}
                                            onChange={(e) => setUserSearch(e.target.value)}
                                            className="pl-10 pr-4 py-2 w-64 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                                        />
                                    </div>
                                    {/* Legend */}
                                    <div className="hidden md:flex items-center gap-3 text-sm">
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                                            <span className="text-slate-500">รออนุมัติ</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                                            <span className="text-slate-500">อนุมัติแล้ว</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Users Table */}
                            <div className="overflow-x-auto rounded-xl border border-slate-200">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 text-slate-600 text-sm">
                                        <tr>
                                            <th className="px-4 py-3 font-semibold">สถานะ</th>
                                            <th className="px-4 py-3 font-semibold">ผู้ใช้</th>
                                            <th className="px-4 py-3 font-semibold">บทบาท</th>
                                            <th className="px-4 py-3 font-semibold">อนุมัติ</th>
                                            <th className="px-4 py-3 font-semibold text-right">จัดการ</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {paginatedUsers.map(u => (
                                            <tr
                                                key={u.id}
                                                className={`hover:bg-slate-50 transition-colors ${!u.is_approved ? 'bg-amber-50/50' : ''
                                                    }`}
                                            >
                                                {/* Status */}
                                                <td className="px-4 py-3">
                                                    <div className={`w-3 h-3 rounded-full ${u.is_approved ? 'bg-green-500' : 'bg-amber-500 animate-pulse'
                                                        }`}></div>
                                                </td>
                                                {/* User Info */}
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-white font-bold text-sm ${u.role === 'admin'
                                                            ? 'bg-gradient-to-br from-purple-500 to-indigo-600'
                                                            : 'bg-gradient-to-br from-sky-400 to-blue-500'
                                                            }`}>
                                                            {(u.display_name || u.username || 'U').charAt(0).toUpperCase()}
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="font-semibold text-slate-800 truncate max-w-[200px]">
                                                                {u.display_name || u.username}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                {/* Role */}
                                                <td className="px-4 py-3">
                                                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${u.role === 'admin'
                                                        ? 'bg-purple-100 text-purple-700'
                                                        : 'bg-sky-100 text-sky-700'
                                                        }`}>
                                                        {u.role === 'admin' ? 'แอดมิน' : 'ผู้ใช้'}
                                                    </span>
                                                </td>
                                                {/* Approval Toggle */}
                                                <td className="px-4 py-3">
                                                    <button
                                                        onClick={() => handleToggleApproval(u.id, u.is_approved)}
                                                        className={`relative w-12 h-6 rounded-full transition-colors ${u.is_approved ? 'bg-green-500' : 'bg-slate-300'
                                                            }`}
                                                        title={u.is_approved ? 'ยกเลิกการอนุมัติ' : 'อนุมัติผู้ใช้'}
                                                    >
                                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${u.is_approved ? 'translate-x-7' : 'translate-x-1'
                                                            }`}></div>
                                                    </button>
                                                </td>
                                                {/* Actions */}
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <button
                                                            onClick={() => handleChangeRole(u.id, u.role)}
                                                            className="p-2 rounded-lg text-purple-600 hover:bg-purple-50 transition-colors"
                                                            title="เปลี่ยนบทบาท"
                                                        >
                                                            <Shield size={16} />
                                                        </button>

                                                        <button
                                                            onClick={() => handleDeleteUser(u.id)}
                                                            className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                                                            title="ลบผู้ใช้"
                                                        >
                                                            <Trash size={16} />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {/* Empty State */}
                                {paginatedUsers.length === 0 && (
                                    <div className="text-center py-12 text-slate-400">
                                        <Users size={48} className="mx-auto mb-4 opacity-50" />
                                        <p>{userSearch ? 'ไม่พบผู้ใช้ที่ค้นหา' : 'ยังไม่มีผู้ใช้ในระบบ'}</p>
                                    </div>
                                )}
                            </div>

                            {/* Pagination */}
                            {totalUserPages > 1 && (
                                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                                    <p className="text-sm text-slate-500">
                                        แสดง {((userPage - 1) * USERS_PER_PAGE) + 1} - {Math.min(userPage * USERS_PER_PAGE, filteredUsers.length)} จาก {filteredUsers.length} รายการ
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setUserPage(p => Math.max(1, p - 1))}
                                            disabled={userPage === 1}
                                            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <ChevronLeft size={18} />
                                        </button>
                                        <div className="flex items-center gap-1">
                                            {Array.from({ length: Math.min(5, totalUserPages) }, (_, i) => {
                                                let pageNum;
                                                if (totalUserPages <= 5) {
                                                    pageNum = i + 1;
                                                } else if (userPage <= 3) {
                                                    pageNum = i + 1;
                                                } else if (userPage >= totalUserPages - 2) {
                                                    pageNum = totalUserPages - 4 + i;
                                                } else {
                                                    pageNum = userPage - 2 + i;
                                                }
                                                return (
                                                    <button
                                                        key={pageNum}
                                                        onClick={() => setUserPage(pageNum)}
                                                        className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${userPage === pageNum
                                                            ? 'bg-primary text-white'
                                                            : 'hover:bg-slate-100 text-slate-600'
                                                            }`}
                                                    >
                                                        {pageNum}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        <button
                                            onClick={() => setUserPage(p => Math.min(totalUserPages, p + 1))}
                                            disabled={userPage === totalUserPages}
                                            className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <ChevronRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'categories' && (
                        <div>
                            <h3 className="text-xl font-bold mb-6">จัดการหมวดหมู่</h3>
                            <form onSubmit={handleAddOrUpdateCat} className="grid grid-cols-1 md:grid-cols-[2fr_2fr_1.5fr_auto] gap-4 mb-8 bg-slate-50 p-6 rounded-2xl items-end relative">
                                {newCat.id && (
                                    <button type="button" onClick={handleCancelEdit} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                                        <X />
                                    </button>
                                )}
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">ชื่อหมวดหมู่</label>
                                    <input placeholder="ชื่อหมวดหมู่" className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none" value={newCat.name} onChange={e => setNewCat({ ...newCat, name: e.target.value })} required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">ลิงก์รูปภาพ</label>
                                    <input placeholder="http://..." className="w-full p-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-secondary/20 focus:border-secondary outline-none" value={newCat.image_url} onChange={e => setNewCat({ ...newCat, image_url: e.target.value })} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">หรืออัพโหลดไฟล์</label>
                                    <input type="file" className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" onChange={e => setNewCat({ ...newCat, file: e.target.files[0] })} />
                                </div>
                                <button className={`h-[42px] px-6 rounded-lg flex items-center justify-center gap-2 text-white font-medium transition-colors ${newCat.id ? 'bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-200' : 'bg-secondary hover:bg-indigo-600 shadow-lg shadow-indigo-200'}`}>
                                    {newCat.id ? <><Edit size={18} /> อัปเดต</> : <><Plus size={20} /> เพิ่ม</>}
                                </button>
                            </form>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {categories.map(c => (
                                    <div key={c.id} className="border rounded-xl p-4 relative group">
                                        {c.image_url && <img src={c.image_url} alt={c.name} className="w-full h-24 object-cover rounded-lg mb-2 opacity-80" />}
                                        <h4 className="font-bold text-center">{c.name}</h4>
                                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleEditCat(c)} className="bg-white text-orange-500 p-1.5 rounded-full shadow-md hover:bg-orange-50"><Edit size={16} /></button>
                                            <button onClick={() => handleDeleteCat(c.id)} className="bg-white text-red-500 p-1.5 rounded-full shadow-md hover:bg-red-50"><Trash size={16} /></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'items' && (
                        <div>
                            <h3 className="text-xl font-bold mb-6">จัดการบทความ</h3>
                            <div className="mb-6">
                                <label className="mr-2 font-semibold">เลือกหมวดหมู่:</label>
                                <select
                                    className="p-2 border rounded-lg"
                                    value={newItem.category_id}
                                    onChange={(e) => {
                                        setNewItem({ ...newItem, category_id: e.target.value });
                                    }}
                                >
                                    <option value="">เลือกหมวดหมู่...</option>
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>

                            {newItem.category_id && (
                                <>
                                    <form onSubmit={handleAddItem} className="space-y-4 mb-8 bg-slate-50 p-6 rounded-2xl">
                                        <input placeholder="หัวข้อ" className="w-full p-2 rounded border" value={newItem.title} onChange={e => setNewItem({ ...newItem, title: e.target.value })} required />
                                        <textarea placeholder="เนื้อหา" className="w-full p-2 rounded border h-32" value={newItem.content} onChange={e => setNewItem({ ...newItem, content: e.target.value })} />
                                        <div>
                                            <label className="block text-sm text-slate-500 mb-1">ไฟล์แนบ (PDF, Office, รูปภาพ ไม่เกิน 20MB)</label>
                                            <input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png" className="text-sm block w-full" onChange={e => setNewItem({ ...newItem, file: e.target.files[0] })} />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input type="checkbox" checked={newItem.is_highlight} onChange={e => setNewItem({ ...newItem, is_highlight: e.target.checked })} />
                                            <label>แสดงในสไลเดอร์หน้าแรก?</label>
                                        </div>
                                        <button className="bg-accent text-white px-6 py-2 rounded hover:bg-rose-600 block w-full font-bold">เพิ่มบทความ</button>
                                    </form>
                                </>
                            )}

                            <div className="space-y-4">
                                <h4 className="font-semibold text-slate-500">บทความทั้งหมด ({items.length}):</h4>
                                {items.map(i => (
                                    <div key={i.id} className={`flex justify-between items-center p-4 border rounded-xl hover:bg-slate-50 ${!i.is_approved ? 'bg-orange-50 border-orange-200' : ''}`}>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                {i.category_name && <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full">{i.category_name}</span>}
                                                <span className="font-semibold">{i.title}</span>
                                                {!i.is_approved && <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-bold">รออนุมัติ</span>}
                                                {i.is_highlight && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-bold">ไฮไลท์</span>}
                                            </div>
                                            <p className="text-xs text-slate-500 line-clamp-1">{i.content}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {!i.is_approved && (
                                                <button
                                                    onClick={() => handleUpdateItem(i.id, { is_approved: true })}
                                                    className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 shadow-sm"
                                                >
                                                    อนุมัติ
                                                </button>
                                            )}

                                            <div className="flex items-center gap-1 border-l pl-3 mx-2">
                                                <label className="text-xs text-slate-400">ไฮไลท์:</label>
                                                <input
                                                    type="checkbox"
                                                    checked={!!i.is_highlight}
                                                    onChange={(e) => handleUpdateItem(i.id, { is_highlight: e.target.checked })}
                                                    className="w-4 h-4 cursor-pointer"
                                                />
                                            </div>

                                            <button onClick={() => handleDeleteItem(i.id)} className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded-full transition-colors"><Trash size={18} /></button>
                                        </div>
                                    </div>
                                ))}
                                {items.length === 0 && <p className="text-slate-400 text-center py-4">ยังไม่มีบทความ</p>}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Confirm Modal */}
            {
                confirmModal.show && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        {/* Backdrop */}
                        <div
                            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                            onClick={() => setConfirmModal(prev => ({ ...prev, show: false }))}
                        ></div>

                        {/* Modal */}
                        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                            {/* Header with icon */}
                            <div className={`p-6 pb-4 ${confirmModal.type === 'danger' ? 'bg-red-50' :
                                confirmModal.type === 'warning' ? 'bg-amber-50' :
                                    'bg-sky-50'
                                }`}>
                                <div className="flex items-start gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${confirmModal.type === 'danger' ? 'bg-red-100' :
                                        confirmModal.type === 'warning' ? 'bg-amber-100' :
                                            'bg-sky-100'
                                        }`}>
                                        {confirmModal.type === 'danger' ? (
                                            <Trash className="w-6 h-6 text-red-600" />
                                        ) : confirmModal.type === 'warning' ? (
                                            <AlertTriangle className="w-6 h-6 text-amber-600" />
                                        ) : (
                                            <Shield className="w-6 h-6 text-sky-600" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-slate-800">{confirmModal.title}</h3>
                                        <p className="text-sm text-slate-600 mt-1">{confirmModal.message}</p>
                                    </div>
                                    <button
                                        onClick={() => setConfirmModal(prev => ({ ...prev, show: false }))}
                                        className="text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="p-4 bg-slate-50 flex items-center justify-end gap-3">
                                <button
                                    onClick={() => setConfirmModal(prev => ({ ...prev, show: false }))}
                                    className="px-4 py-2.5 rounded-xl text-slate-600 font-medium hover:bg-slate-200 transition-colors"
                                >
                                    {confirmModal.cancelText}
                                </button>
                                <button
                                    onClick={confirmModal.onConfirm}
                                    className={`px-5 py-2.5 rounded-xl text-white font-semibold transition-all shadow-lg hover:shadow-xl ${confirmModal.type === 'danger' ? 'bg-red-500 hover:bg-red-600' :
                                        confirmModal.type === 'warning' ? 'bg-amber-500 hover:bg-amber-600' :
                                            'bg-sky-500 hover:bg-sky-600'
                                        }`}
                                >
                                    {confirmModal.confirmText}
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    );
};

export default Admin;
