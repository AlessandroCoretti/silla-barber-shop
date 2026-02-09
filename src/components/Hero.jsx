import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useTranslation } from 'react-i18next';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const Hero = () => {
    const { t } = useTranslation();
    const heroRef = useRef(null);
    const textRef = useRef(null);

    useEffect(() => {
        const tl = gsap.timeline();

        tl.fromTo(heroRef.current,
            { scale: 1.1 },
            { scale: 1, duration: 2, ease: "power2.out" }
        )
            .fromTo(textRef.current.children,
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power3.out" },
                "-=1.5"
            );
    }, []);

    return (
        <section className="relative h-screen w-full overflow-hidden dark-section" id="hero">
            <div ref={heroRef} className="absolute inset-0 bg-black">
                <img
                    src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2070&auto=format&fit=crop"
                    alt="Barber Shop Interior"
                    className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40"></div>
            </div>

            <div className="relative h-full container mx-auto px-4 flex flex-col justify-center items-center text-center text-white z-10">
                <div ref={textRef} className="max-w-4xl px-4">
                    <h1 className="text-3xl md:text-7xl font-heading uppercase tracking-wider mb-4 md:mb-8 leading-tight">
                        {t('hero.title')}
                    </h1>
                    <p className="text-base md:text-xl text-gray-300 mb-8 md:mb-10 max-w-2xl mx-auto font-light tracking-wide">
                        {t('hero.subtitle')}
                    </p>
                    <div className="flex flex-col md:flex-row gap-4 md:gap-6 justify-center w-full md:w-auto">
                        <button className="px-8 py-3 md:px-10 md:py-4 bg-green-800 hover:bg-green-700 text-white rounded-full font-bold uppercase tracking-widest transition-all hover:scale-105 shadow-xl text-sm md:text-base">
                            <span className="md:hidden">Prenota</span>
                            <span className="hidden md:inline">{t('hero.book_cut')}</span>
                        </button>
                        <button className="px-8 py-3 md:px-10 md:py-4 border border-white/30 hover:bg-white/10 text-white rounded-full font-bold uppercase tracking-widest transition-all backdrop-blur-sm text-sm md:text-base">
                            {t('hero.watch_video')}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
