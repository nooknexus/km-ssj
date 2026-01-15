import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { API_BASE } from '../config/api';

const PopularArticles = () => {
    const [popularItems, setPopularItems] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPopular = async () => {
            try {
                const res = await axios.get(`${API_BASE}/items/popular`);
                setPopularItems(res.data);
            } catch (err) {
                console.error("Failed to fetch popular items", err);
                setError(true);
            }
        };
        fetchPopular();
    }, []);

    if (error) {
        return (
            <div className="bg-[#14b8a6] rounded-3xl p-6 text-white h-full shadow-lg flex flex-col justify-center items-center">
                <p>Unable to load popular items</p>
                <p className="text-sm opacity-75">Please restart server</p>
            </div>
        );
    }

    if (popularItems.length === 0) return null;

    return (
        <div className="bg-gradient-to-br from-teal-500 to-emerald-600 rounded-3xl p-6 text-white h-full shadow-lg flex flex-col overflow-hidden relative">
            <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <div className="relative z-10 flex flex-col h-full">
                <div className="mb-4">
                    <h2 className="text-xl md:text-2xl font-bold mb-1">บทความยอดนิยม</h2>
                    <p className="text-white/80 text-sm">ที่มีคนอ่านมากที่สุดในเดือนนี้</p>
                </div>

                <div className="flex flex-col gap-3 flex-grow overflow-y-auto scrollbar-hide pr-1">
                    {popularItems.map((item, index) => (
                        <Link to={`/article/${item.id}`} key={item.id} className="group block">
                            <div className="bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl p-3 flex items-center gap-4 transition-all duration-300 border border-white/5 hover:border-white/20 hover:translate-x-1">
                                <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shadow-sm ${index < 3 ? 'bg-white text-teal-600' : 'bg-white/20 text-white'}`}>
                                    {index + 1}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h3 className="font-semibold text-white truncate text-sm md:text-base leading-tight mb-0.5 group-hover:text-amber-200 transition-colors">
                                        {item.title}
                                    </h3>
                                    <div className="flex items-center gap-2 text-xs text-white/70">
                                        <span>{item.views || 0} views</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PopularArticles;
