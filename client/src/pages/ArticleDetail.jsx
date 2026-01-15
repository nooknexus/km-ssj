import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { Clock, Eye, Download, ChevronLeft, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { API_URL, API_BASE } from '../config/api';

const ArticleDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const res = await axios.get(`${API_BASE}/items/${id}`);
                setArticle(res.data);

                // Record history if logged in
                if (user) {
                    await axios.post(`${API_BASE}/items/history`,
                        { item_id: id },
                        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
                    );
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchArticle();
    }, [id, user]);

    if (loading) return <div className="p-8 text-center text-slate-500">กำลังโหลดเนื้อหา...</div>;
    if (!article) return <div className="p-8 text-center text-slate-500">ไม่พบข้อมูลบทความ</div>;

    // Logic to find first image for cover
    const allAttachments = (article.attachments && article.attachments.length > 0)
        ? article.attachments
        : (article.attachment_url ? [{ file_path: article.attachment_url }] : []);

    const coverImage = allAttachments.find(att => {
        const path = att.file_path || att;
        return /\.(jpg|jpeg|png|webp|gif)$/i.test(path);
    });

    const coverUrl = coverImage ? `${API_URL}${coverImage.file_path || coverImage}` : null;

    return (
        <div className="max-w-4xl mx-auto pb-10">
            <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary mb-6 transition-colors font-medium">
                <ChevronLeft size={20} /> กลับหน้าหลัก
            </Link>

            <article className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden relative min-h-[400px]">
                {/* Cover Image Background */}
                {coverUrl && (
                    <div className="absolute top-0 left-0 w-full h-[400px] z-0 pointer-events-none">
                        <img
                            src={coverUrl}
                            alt="Article Cover"
                            className="w-full h-full object-cover opacity-40 blur-[2px]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent"></div>
                    </div>
                )}

                <div className="p-8 md:p-12 relative z-10">
                    <div className="flex flex-wrap gap-4 items-center text-sm text-slate-500 mb-6">
                        <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-semibold">{article.category_name}</span>
                        <span className="flex items-center gap-1"><Calendar size={16} /> {new Date(article.created_at).toLocaleDateString('th-TH')}</span>
                        <span className="flex items-center gap-1"><Eye size={16} /> {article.views} ครั้ง</span>
                    </div>

                    <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-8 leading-tight">{article.title}</h1>

                    <div className="prose prose-slate max-w-none mb-10 text-slate-600 leading-relaxed whitespace-pre-wrap">
                        {article.content}
                    </div>

                    {(() => {
                        // allAttachments already defined above for cover logic
                        return (
                            <div className="space-y-6">
                                {allAttachments.map((att, index) => {
                                    const path = att.file_path || att; // Fallback if simple string
                                    const fullUrl = `${API_URL}${path}`;
                                    const isImage = /\.(jpg|jpeg|png|webp|gif)$/i.test(path);

                                    return isImage ? (
                                        <div key={index} className="mb-6 relative group inline-block max-w-full">
                                            <img
                                                src={fullUrl}
                                                alt={`Attachment ${index + 1}`}
                                                className="rounded-2xl shadow-sm border border-slate-100 max-w-full h-auto"
                                            />
                                            <a
                                                href={fullUrl}
                                                download
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg text-slate-700 hover:text-primary hover:bg-white transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                                                title="ดาวน์โหลดรูปภาพ"
                                            >
                                                <Download size={20} />
                                            </a>
                                        </div>
                                    ) : (
                                        <div key={index} className="bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-200 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="bg-white p-3 rounded-xl shadow-sm border border-slate-100 text-red-500">
                                                    <Download size={24} />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-700">เอกสารแนบ {index + 1}</h4>
                                                    <p className="text-sm text-slate-500">คลิกเพื่อดาวน์โหลดไฟล์</p>
                                                </div>
                                            </div>
                                            <a
                                                href={fullUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-6 py-2 bg-slate-800 text-white rounded-lg font-semibold hover:bg-slate-700 transition-colors"
                                            >
                                                ดาวน์โหลด
                                            </a>
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })()}
                </div>
            </article>
        </div>
    );
};

export default ArticleDetail;
