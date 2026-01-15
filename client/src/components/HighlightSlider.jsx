import { useEffect, useState } from 'react';
import axios from 'axios';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { API_URL, API_BASE } from '../config/api';

const HighlightSlider = () => {
    const [slides, setSlides] = useState([]);
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        const fetchHighlights = async () => {
            try {
                const res = await axios.get(`${API_BASE}/items/highlights`);
                setSlides(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchHighlights();
    }, []);

    const nextSlide = () => setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    const prevSlide = () => setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

    if (slides.length === 0) return null;

    return (
        <section className="relative rounded-3xl overflow-hidden shadow-2xl h-full group">
            <div className="w-full h-full relative">
                {slides.map((slide, index) => {
                    const hasAttachment = slide.attachment_url && /\.(jpg|jpeg|png|webp|gif)$/i.test(slide.attachment_url);
                    const bgUrl = hasAttachment ? `${API_URL}${slide.attachment_url}` : null;

                    return (
                        <div
                            key={slide.id}
                            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === current ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                        >
                            {bgUrl && (
                                <div className="absolute inset-0 z-0">
                                    <img src={bgUrl} alt="" className="w-full h-full object-cover opacity-60 blur-[2px] scale-105 transform origin-center" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-transparent z-10"></div>

                            <div className={`absolute inset-0 flex flex-col justify-center px-8 md:px-16 lg:px-24 text-white z-20 max-w-4xl transition-all duration-700 delay-300 ${index === current ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                                <span className="inline-block px-3 py-1 bg-primary/90 text-white rounded-lg text-xs font-bold mb-4 self-start backdrop-blur-sm shadow-sm">
                                    แนะนำ
                                </span>
                                <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight drop-shadow-md">
                                    {slide.title}
                                </h2>
                                <p className="text-gray-200 line-clamp-2 md:line-clamp-3 mb-8 text-sm md:text-lg lg:text-xl font-light leading-relaxed max-w-2xl">
                                    {slide.content.substring(0, 150)}...
                                </p>
                                <Link
                                    to={`/article/${slide.id}`}
                                    className="inline-flex items-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-xl font-bold self-start hover:bg-primary hover:text-white transition-all duration-300 shadow-lg hover:shadow-primary/30 group"
                                >
                                    อ่านเพิ่มเติม
                                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>

            <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-3 rounded-full transition-all shadow-lg border border-white/10 z-30">
                <ChevronLeft size={24} />
            </button>
            <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-sm text-white p-3 rounded-full transition-all shadow-lg border border-white/10 z-30">
                <ChevronRight size={24} />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30">
                {slides.map((_, idx) => (
                    <div
                        key={idx}
                        className={`transition-all rounded-full shadow-sm cursor-pointer ${idx === current ? 'bg-white w-8 h-2' : 'bg-white/50 w-2 h-2 hover:bg-white/80'}`}
                        onClick={() => setCurrent(idx)}
                    />
                ))}
            </div>
        </section>
    );
};

export default HighlightSlider;
