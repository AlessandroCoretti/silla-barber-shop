import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from 'react-i18next';

const News = () => {
    const { t } = useTranslation();
    const sectionRef = useRef(null);

    const newsItems = [
        { title: t('news.item_1'), img: "https://images.unsplash.com/photo-1629219357597-4581f4a9b736?q=80&w=2070&auto=format&fit=crop" },
        { title: t('news.item_2'), img: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=2072&auto=format&fit=crop" },
        { title: t('news.item_3'), img: "https://images.unsplash.com/photo-1505245842246-8869c36214ba?q=80&w=2070&auto=format&fit=crop" }
    ];

    useEffect(() => {
        const el = sectionRef.current;

        gsap.fromTo(el.querySelectorAll('.news-card'),
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                stagger: 0.2,
                scrollTrigger: {
                    trigger: el,
                    start: 'top 80%',
                }
            }
        );
    }, []);

    return (
        <section ref={sectionRef} className="py-24 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-12">
                    <h2 className="text-4xl font-bold uppercase">{t('news.title')}</h2>
                    <button className="btn bg-green-800 hover:bg-green-700 text-sm px-6">{t('news.read_blog')}</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {newsItems.map((item, i) => (
                        <div key={i} className="news-card group cursor-pointer">
                            <div className="overflow-hidden rounded-lg mb-4 aspect-video">
                                <img
                                    src={item.img}
                                    alt={item.title}
                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                                />
                            </div>
                            <h3 className="text-xl font-bold uppercase leading-tight group-hover:text-green-800 transition-colors">
                                {item.title}
                            </h3>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default News;
