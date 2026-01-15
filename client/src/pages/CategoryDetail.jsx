import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { API_URL, API_BASE } from '../config/api';

const CategoryDetail = () => {
    const { id } = useParams();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    const [category, setCategory] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Items
                const resItems = await axios.get(`${API_BASE}/items/category/${id}`);
                setItems(resItems.data);

                // Fetch Category Info (find from list)
                const resCats = await axios.get(`${API_BASE}/categories`);
                const currentCat = resCats.data.find(c => c.id === parseInt(id));
                setCategory(currentCat);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) return <div>กำลังโหลด...</div>;

    return (
        <div className="relative min-h-[80vh]">
            {/* Background Image */}
            {category?.image_url && (
                <div
                    className="absolute inset-0 z-0 pointer-events-none opacity-10 bg-cover bg-center bg-no-repeat fixed"
                    style={{ backgroundImage: `url(${category.image_url})` }}
                />
            )}

            <div className="max-w-6xl mx-auto relative z-10">
                <div className="flex items-center gap-4 mb-8">
                    {category?.image_url && <img src={category.image_url} alt={category.name} className="w-16 h-16 rounded-xl object-cover shadow-sm" />}
                    <h2 className="text-3xl font-bold text-slate-800">{category ? category.name : 'บทความในหมวดหมู่'}</h2>
                </div>

                {items.length === 0 ? (
                    <div className="text-center py-20 text-slate-400 bg-white/80 backdrop-blur-sm rounded-3xl border border-dashed border-slate-200">
                        ยังไม่มีบทความในหมวดหมู่นี้
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {items.map((item) => {
                            const hasAttachment = item.attachment_url && /\.(jpg|jpeg|png|webp|gif)$/i.test(item.attachment_url);
                            const bgUrl = hasAttachment ? `${API_URL}${item.attachment_url}` : null;

                            return (
                                <div key={item.id} className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-all hover:-translate-y-1 relative overflow-hidden group">
                                    {bgUrl && (
                                        <div className="absolute inset-0 z-0 pointer-events-none">
                                            <img src={bgUrl} alt="" className="w-full h-full object-cover opacity-40 blur-[1px] transition-transform duration-500 group-hover:scale-110" />
                                            <div className="absolute inset-0 bg-white/60"></div>
                                        </div>
                                    )}
                                    <div className="relative z-10">
                                        <div className="flex items-start gap-4 mb-4">
                                            <div className="bg-secondary/10 p-3 rounded-xl text-secondary">
                                                <FileText size={24} />
                                            </div>
                                            <h3 className="font-bold text-lg text-slate-800 leading-tight">{item.title}</h3>
                                        </div>
                                        <p className="text-slate-500 line-clamp-4 text-sm mb-4">{item.content}</p>
                                        <div className="pt-4 border-t border-slate-50 flex justify-between items-center text-xs text-slate-400">
                                            <span>{new Date(item.created_at).toLocaleDateString('th-TH')}</span>
                                            <Link to={`/article/${item.id}`} className="text-secondary font-semibold hover:underline">อ่านต่อ</Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryDetail;
