import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { LogOut, Home, BarChart2, BookOpen, Search, User } from 'lucide-react';
import { useState } from 'react';

const Layout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    if (!user) return <Outlet />;

    return (
        <div className="min-h-screen bg-background flex overflow-x-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 fixed h-full z-10 hidden md:flex flex-col flex-shrink-0">
                <div className="p-6 border-b border-slate-100">
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                        คลังข้อมูล KM
                    </h1>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link to="/" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-primary rounded-xl transition-all">
                        <Home size={20} />
                        <span className="font-medium">หน้าหลัก</span>
                    </Link>
                    <Link to="/stats" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-primary rounded-xl transition-all">
                        <BarChart2 size={20} />
                        <span className="font-medium">สถิติ</span>
                    </Link>
                    {user.role === 'admin' && (
                        <Link to="/admin" className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 hover:text-accent rounded-xl transition-all">
                            <BookOpen size={20} />
                            <span className="font-medium">จัดการระบบ</span>
                        </Link>
                    )}
                </nav>

                <div className="p-4 border-t border-slate-100">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold flex-shrink-0">
                            {(user.display_name || user.username || 'U').charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden min-w-0 flex-1">
                            <p className="text-sm font-semibold text-slate-800 truncate">{user.display_name || user.username}</p>
                            <p className="text-xs text-slate-500 truncate">{user.department || 'เจ้าหน้าที่'}</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                        <LogOut size={16} />
                        ออกจากระบบ
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 min-w-0 overflow-x-hidden">
                {/* Navbar */}
                <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-200 z-20 px-8 py-4 flex items-center justify-between">
                    <div className="md:hidden font-bold text-primary">Health KM</div>

                    <div className="flex-1 max-w-xl mx-auto hidden md:block relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="ค้นหาข้อมูลความรู้... "
                            className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full focus:ring-2 focus:ring-primary/50 outline-none transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleSearch}
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <Link to="/add-article" className="hidden md:flex bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-sky-600 transition-colors shadow-lg shadow-sky-200">
                            + เขียนบทความ
                        </Link>
                        <div className="md:hidden">
                            <User size={24} />
                        </div>
                    </div>
                </header>

                <div className="p-4 md:p-8 overflow-x-hidden">
                    <Outlet context={{ searchQuery }} />
                </div>
            </main>
        </div>
    );
};

export default Layout;
