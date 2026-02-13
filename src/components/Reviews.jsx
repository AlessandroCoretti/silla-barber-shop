import React, { useLayoutEffect, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';
import { Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

gsap.registerPlugin(ScrollTrigger);

const Reviews = () => {
    const { t } = useTranslation();
    const sectionRef = useRef(null);
    const containerRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    const reviews = [
        { name: "Luisiano Fiore", text: t('reviews.review_1'), rating: 5 },
        { name: "Loris Medves (Sawol)", text: t('reviews.review_2'), rating: 5 },
        { name: "Kap93", text: t('reviews.review_3'), rating: 5 },
        { name: "Giuseppe Pierangelini", text: t('reviews.review_4'), rating: 5 },
        { name: "Simone Pilia", text: t('reviews.review_5'), rating: 5 },
        { name: "Alessandro SANTAGATA", text: t('reviews.review_6'), rating: 5 }
    ];

    useEffect(() => {
        let ctx = gsap.context(() => {
            // Initial animation
            gsap.fromTo('.review-card',
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.1,
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 80%',
                    }
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, [t]);

    return (
        <section ref={sectionRef} className="py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-12">
                    <h2 className="text-4xl font-bold uppercase">{t('reviews.title')}</h2>
                    <div className="flex gap-2">
                        <span className="text-sm font-medium opacity-50 uppercase tracking-widest hidden md:block">
                            {t('reviews.drag_to_view') || "Swipe to view"}
                        </span>
                    </div>
                </div>

                <div
                    ref={containerRef}
                    className={`flex overflow-x-auto snap-x snap-mandatory pb-8 -mx-4 px-4 md:mx-0 md:px-0 gap-6 no-scrollbar scroll-smooth cursor-grab
                        ${isDragging ? 'cursor-grabbing snap-none scroll-auto' : ''}`}
                    onMouseDown={(e) => {
                        setIsDragging(true);
                        setStartX(e.pageX - containerRef.current.offsetLeft);
                        setScrollLeft(containerRef.current.scrollLeft);
                    }}
                    onMouseLeave={() => setIsDragging(false)}
                    onMouseUp={() => setIsDragging(false)}
                    onMouseMove={(e) => {
                        if (!isDragging) return;
                        e.preventDefault();
                        const x = e.pageX - containerRef.current.offsetLeft;
                        const walk = (x - startX) * 2;
                        containerRef.current.scrollLeft = scrollLeft - walk;
                    }}
                >
                    {reviews.map((review, i) => (
                        <div key={i} className="review-card snap-center flex-shrink-0 w-[85vw] md:w-[30vw] lg:w-[25vw] bg-green-900 text-white p-8 rounded-lg shadow-lg relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300 select-none">
                            <div className="flex gap-1 mb-4 text-yellow-400">
                                {[...Array(review.rating)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                            </div>
                            <p className="mb-6 font-medium leading-relaxed opacity-90">"{review.text}"</p>
                            <div className="uppercase font-bold text-sm tracking-wider opacity-60">
                                {review.name}
                            </div>
                            <div className="absolute top-0 right-0 p-32 bg-green-800 rounded-full blur-3xl opacity-20 transform translate-x-1/2 -translate-y-1/2 group-hover:opacity-40 transition-opacity pointer-events-none"></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Reviews;
