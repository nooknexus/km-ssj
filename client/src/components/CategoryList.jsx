import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { API_BASE } from '../config/api';

const CategoryList = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await axios.get(`${API_BASE}/categories`);
                setCategories(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchCategories();
    }, []);

    return (
        <section className="mb-8">
            <h2 className="text-xl font-bold text-slate-800 mb-4">หมวดหมู่ความรู้</h2>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {categories.map((cat) => (
                    <Link to={`/category/${cat.id}`} key={cat.id} className="flex-shrink-0 group relative overflow-hidden rounded-2xl w-36 h-36 md:w-44 md:h-44 bg-white border border-slate-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/30">
                        {cat.image_url ? (
                            <img src={cat.image_url} alt={cat.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-slate-50">
                                <span className="text-6xl text-slate-200 font-black group-hover:text-primary/20 transition-colors">{cat.name.charAt(0)}</span>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
                            <span className="text-white font-bold text-lg leading-tight drop-shadow-sm transform translate-y-0 transition-transform duration-300 group-hover:-translate-y-1">{cat.name}</span>
                        </div>
                    </Link>
                ))}
                {categories.length === 0 && <div className="text-slate-400">ยังไม่มีหมวดหมู่</div>}
            </div>
        </section>
    );
};

export default CategoryList;
