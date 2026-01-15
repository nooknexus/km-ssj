import { useEffect, useState } from 'react';
import axios from 'axios';
import { Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_URL, API_BASE } from '../config/api';

const NewArrivals = () => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchNew = async () => {
            try {
                const res = await axios.get(`${API_BASE}/items/new`);
                setItems(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchNew();
    }, []);

    return (
        <section>
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                <div className="bg-accent/10 p-1.5 rounded-lg text-accent">
                    <Clock size={20} />
                </div>
                บทความมาใหม่
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {items.map((item) => (
                    <Link to={`/article/${item.id}`} key={item.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer block overflow-hidden flex flex-col h-full">
                        <div className="relative h-48 overflow-hidden bg-slate-100">
                            {item.attachment_url && /\.(jpg|jpeg|png|webp|gif)$/i.test(item.attachment_url) ? (
                                <img
                                    src={`${API_URL}${item.attachment_url}`}
                                    alt={item.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-300">
                                    <Clock size={48} className="opacity-20" />
                                </div>
                            )}
                            <div className="absolute top-3 left-3">
                                <span className="text-xs font-bold text-white bg-primary/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                                    มาใหม่
                                </span>
                            </div>
                        </div>

                        <div className="p-5 flex flex-col flex-grow">
                            <h3 className="font-bold text-slate-800 text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors leading-tight">
                                {item.title}
                            </h3>
                            <p className="text-sm text-slate-500 line-clamp-2 mb-4 flex-grow font-light">
                                {item.content}
                            </p>
                            <div className="flex items-center justify-between text-xs text-slate-400 mt-auto pt-4 border-t border-slate-50">
                                <span className="flex items-center gap-1">
                                    <Clock size={14} />
                                    {new Date(item.created_at).toLocaleDateString('th-TH')}
                                </span>
                                <span className="bg-slate-50 px-2 py-1 rounded-md text-slate-500 font-medium">
                                    {item.views} ครั้ง
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default NewArrivals;
