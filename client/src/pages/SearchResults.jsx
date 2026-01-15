import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, FileText } from 'lucide-react';
import { API_BASE } from '../config/api';

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${API_BASE}/items/search?q=${query}`);
                setResults(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        if (query) fetchResults();
    }, [query]);

    return (
        <div className="max-w-4xl mx-auto pb-10">
            <h1 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-3">
                <Search className="text-primary" />
                ผลการค้นหาสำหรับ "{query}"
            </h1>

            {loading ? (
                <div className="text-center text-slate-500">กำลังค้นหา...</div>
            ) : results.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-100 text-slate-400">
                    ไม่พบข้อมูลที่ค้นหา
                </div>
            ) : (
                <div className="space-y-4">
                    {results.map(item => (
                        <div key={item.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <span className="text-xs font-semibold text-primary bg-primary/5 px-2 py-1 rounded-md mb-2 inline-block">{item.category_name}</span>
                                    <h3 className="text-lg font-bold text-slate-800">{item.title}</h3>
                                </div>
                                <Link to={`/article/${item.id}`} className="px-4 py-2 bg-slate-50 text-slate-600 rounded-lg text-sm font-semibold hover:bg-primary hover:text-white transition-colors">
                                    อ่านต่อ
                                </Link>
                            </div>
                            <p className="text-slate-500 text-sm line-clamp-2">{item.content}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchResults;
