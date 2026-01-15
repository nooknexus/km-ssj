import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Upload } from 'lucide-react';
import { API_BASE } from '../config/api';

const AddArticle = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category_id: '',
        is_highlight: false
    });
    const [files, setFiles] = useState([]); // Store actual File objects
    // We render inputs based on this array. Initially one.
    // Actually, simpler logic: 
    // Just maintain an array of IDs for inputs. 
    // And a map of files.

    const [inputKeys, setInputKeys] = useState([Date.now()]);
    const [fileMap, setFileMap] = useState({});

    const handleFileChange = (key, e) => {
        const file = e.target.files[0];

        // Update file map
        const newMap = { ...fileMap, [key]: file };
        if (!file) delete newMap[key];
        setFileMap(newMap);

        // If user selected a file and it's the last input, add a new one
        if (file && key === inputKeys[inputKeys.length - 1]) {
            setInputKeys(prev => [...prev, Date.now() + 1]);
        }
    };

    // ... later in submit ...
    // Object.values(fileMap).forEach(file => data.append('files', file));

    // ... replace the state init and submit logic ...

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCats = async () => {
            try {
                const res = await axios.get(`${API_BASE}/categories`);
                setCategories(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchCats();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const data = new FormData();
        data.append('title', formData.title);
        data.append('content', formData.content);
        data.append('category_id', formData.category_id);
        data.append('is_highlight', formData.is_highlight);
        if (Object.keys(fileMap).length > 0) {
            Object.values(fileMap).forEach(file => {
                if (file) data.append('files', file);
            });
        }

        try {
            await axios.post(`${API_BASE}/items`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.error || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <h1 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                    <Upload className="text-primary" />
                    เพิ่มบทความใหม่
                </h1>

                {error && <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-6">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block font-medium text-slate-700 mb-2">หัวข้อบทความ</label>
                        <input
                            type="text"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block font-medium text-slate-700 mb-2">หมวดหมู่</label>
                        <select
                            required
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white"
                            value={formData.category_id}
                            onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                        >
                            <option value="">เลือกหมวดหมู่...</option>
                            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block font-medium text-slate-700 mb-2">เนื้อหา</label>
                        <textarea
                            required
                            rows="10"
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/50"
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block font-medium text-slate-700 mb-2">เอกสารแนบ หรือ รูปภาพ (PDF, Word, Excel, PPT, PNG, JPG ขนาดไม่เกิน 20MB)</label>

                        <div className="space-y-3">
                            {inputKeys.map((key) => (
                                <input
                                    key={key}
                                    type="file"
                                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png"
                                    className="w-full text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 block"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        setFileMap(prev => {
                                            const newMap = { ...prev, [key]: file };
                                            if (!file) delete newMap[key];
                                            return newMap;
                                        });
                                        // Add new input if dealing with the last one and a file was selected
                                        if (file && key === inputKeys[inputKeys.length - 1]) {
                                            setInputKeys(prev => [...prev, Date.now() + Math.random()]);
                                        }
                                    }}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={formData.is_highlight}
                            onChange={(e) => setFormData({ ...formData, is_highlight: e.target.checked })}
                            id="highlight"
                            className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
                        />
                        <label htmlFor="highlight" className="text-slate-700">แสดงใน Highlight หน้าแรก</label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-sky-600 transition-all shadow-lg shadow-sky-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'กำลังบันทึก...' : 'บันทึกบทความ'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddArticle;
