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
                    src="/hero_barber_shop.png"
                    alt="Barber Shop Interior"
                    className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40"></div>
            </div>

            <div className="relative h-full container mx-auto px-4 flex flex-col justify-center items-center text-center text-white z-10">
                <div ref={textRef} className="max-w-4xl">
                    <h1 className="text-5xl md:text-7xl font-heading uppercase tracking-wider mb-6 leading-tight">
                        {t('hero.title')}
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto font-light tracking-wide">
                        {t('hero.subtitle')}
                    </p>
                    <div className="flex flex-col md:flex-row gap-6 justify-center">
                        <button className="px-10 py-4 bg-green-800 hover:bg-green-700 text-white rounded-full font-bold uppercase tracking-widest transition-all hover:scale-105 shadow-xl">
                            {t('hero.book_cut')}
                        </button>
                        <button className="px-10 py-4 border border-white/30 hover:bg-white/10 text-white rounded-full font-bold uppercase tracking-widest transition-all backdrop-blur-sm">
                            {t('hero.watch_video')}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
