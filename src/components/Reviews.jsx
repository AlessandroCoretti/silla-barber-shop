import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Reviews = () => {
    const { t } = useTranslation();
    const sectionRef = useRef(null);

    const reviews = [
        { name: "Alessandro M.", text: t('reviews.review_1'), rating: 5 },
        { name: "Giulia R.", text: t('reviews.review_2'), rating: 5 },
        { name: "Marco T.", text: t('reviews.review_3'), rating: 5 }
    ];

    useEffect(() => {
        const el = sectionRef.current;

        gsap.fromTo(el.querySelectorAll('.review-card'),
            { opacity: 0, scale: 0.9 },
            {
                opacity: 1,
                scale: 1,
                duration: 0.6,
                stagger: 0.1,
                scrollTrigger: {
                    trigger: el,
                    start: 'top 80%',
                }
            }
        );
    }, []);

    return (
        <section ref={sectionRef} className="py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-12">
                    <h2 className="text-4xl font-bold uppercase">{t('reviews.title')}</h2>
                    <div className="flex gap-2">
                        <span className="w-3 h-3 rounded-full bg-green-800"></span>
                        <span className="w-3 h-3 rounded-full bg-gray-300"></span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {reviews.map((review, i) => (
                        <div key={i} className="review-card bg-green-900 text-white p-8 rounded-lg shadow-lg relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300">
                            <div className="flex gap-1 mb-4 text-yellow-400">
                                {[...Array(review.rating)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                            </div>
                            <p className="mb-6 font-medium leading-relaxed opacity-90">"{review.text}"</p>
                            <div className="uppercase font-bold text-sm tracking-wider opacity-60">
                                {review.name}
                            </div>
                            <div className="absolute top-0 right-0 p-32 bg-green-800 rounded-full blur-3xl opacity-20 transform translate-x-1/2 -translate-y-1/2 group-hover:opacity-40 transition-opacity"></div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Reviews;
