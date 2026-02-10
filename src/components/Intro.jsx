import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from 'react-i18next';

const Intro = () => {
    const { t } = useTranslation();
    const sectionRef = useRef(null);

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            const el = sectionRef.current;

            gsap.fromTo(el.querySelector('.intro-text'),
                { opacity: 0, x: -50 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 1,
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 75%',
                    }
                }
            );

            gsap.fromTo(el.querySelector('.intro-image'),
                { opacity: 0, scale: 0.9 },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 1.2,
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 70%',
                    }
                }
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="py-24 bg-white text-gray-900">
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-16">

                <div className="intro-text flex-1">
                    <h2
                        className="text-4xl md:text-5xl font-bold uppercase mb-8 leading-none"
                        dangerouslySetInnerHTML={{ __html: t('intro.title') }}
                    />
                    <p className="text-gray-600 mb-6 leading-relaxed">
                        {t('intro.text')}
                    </p>
                    <div className="flex gap-12 mt-12">
                        <div>
                            <span className="block text-4xl font-bold text-green-800">4,9</span>
                            <span className="text-sm text-gray-500 uppercase tracking-wider">{t('intro.rating')}</span>
                        </div>
                        <div>
                            <span className="block text-4xl font-bold text-green-800">10+</span>
                            <span className="text-sm text-gray-500 uppercase tracking-wider">{t('intro.years_exp')}</span>
                        </div>
                    </div>
                </div>

                <div className="intro-image flex-1 relative">
                    <div className="relative overflow-hidden rounded-lg shadow-2xl">
                        <img
                            src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=1170&auto=format&fit=crop"
                            alt="Barber working"
                            className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-4 py-2 rounded text-xs font-bold uppercase tracking-widest shadow-lg">
                            {t('intro.master_barber')}
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default Intro;
