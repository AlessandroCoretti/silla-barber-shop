import React, { useLayoutEffect, useEffect, useRef, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from 'react-i18next';

gsap.registerPlugin(ScrollTrigger);

const Header = () => {
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const headerRef = useRef(null);
    const mobileMenuRef = useRef(null);
    const burgerRefs = useRef([]);
    const [isDark, setIsDark] = useState(true);
    const [showLogo, setShowLogo] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            // Animation entry - Only on desktop
            if (window.innerWidth >= 768) {
                gsap.fromTo(headerRef.current,
                    { y: 100, opacity: 0 },
                    { y: 0, opacity: 1, duration: 1, delay: 0.5, ease: "power3.out" }
                );
            } else {
                // Ensure it's visible on mobile without animation
                gsap.set(headerRef.current, { y: 0, opacity: 1 });
            }

            // Theme switching trigger
            setTimeout(() => {
                const darkSections = document.querySelectorAll('.dark-section');

                darkSections.forEach(section => {
                    ScrollTrigger.create({
                        trigger: section,
                        start: 'top bottom-=60',
                        end: 'bottom bottom-=60',
                        onEnter: () => setIsDark(true),
                        onLeave: () => setIsDark(false),
                        onEnterBack: () => setIsDark(true),
                        onLeaveBack: () => setIsDark(false),
                    });
                });

                ScrollTrigger.refresh();
            }, 100);

            // Smart Logo
            ScrollTrigger.create({
                trigger: 'body',
                start: 'top top',
                end: 99999,
                onUpdate: (self) => {
                    if (self.direction === 1 && self.scroll() > 100) {
                        setShowLogo(false);
                    } else if (self.direction === -1) {
                        setShowLogo(true);
                    }
                }
            });

        }, headerRef);

        return () => ctx.revert();
    }, [location.pathname]);

    // Effect for Mobile Menu Animation and Burger Icon
    useEffect(() => {
        const [line1, line2, line3] = burgerRefs.current;

        if (!line1 || !line2 || !line3 || !mobileMenuRef.current) return;

        if (isMenuOpen) {
            // Open Menu
            gsap.to(mobileMenuRef.current, {
                y: 0,
                xPercent: -50,
                autoAlpha: 1,
                scale: 1,
                duration: 0.4,
                ease: "power3.out"
            });

            // Animate Burger to X
            gsap.to(line1, { y: 8, rotate: 45, duration: 0.3, ease: "power2.out" });
            gsap.to(line2, { opacity: 0, duration: 0.3, ease: "power2.out" });
            gsap.to(line3, { y: -8, rotate: -45, duration: 0.3, ease: "power2.out" });

        } else {
            // Close Menu
            gsap.to(mobileMenuRef.current, {
                y: 20,
                xPercent: -50,
                autoAlpha: 0,
                scale: 0.95,
                duration: 0.3,
                ease: "power3.in"
            });

            // Animate X to Burger
            gsap.to(line1, { y: 0, rotate: 0, duration: 0.3, ease: "power2.in" });
            gsap.to(line2, { opacity: 1, duration: 0.3, ease: "power2.in" });
            gsap.to(line3, { y: 0, rotate: 0, duration: 0.3, ease: "power2.in" });
        }
    }, [isMenuOpen]);

    const containerClass = isDark
        ? "bg-[#ffffff20] border-white/10"
        : "bg-white/60 border-white/40 shadow-xl";

    const textClass = isDark
        ? "text-white"
        : "text-[#0f2f1c]";

    const buttonClass = isDark
        ? "bg-[#1a4d2e] text-white hover:bg-[#143d24]"
        : "bg-white text-[#0f2f1c] hover:bg-gray-100";

    return (
        <>
            {/* Top Logo */}
            <div
                className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-[100] pointer-events-none transition-all duration-500 ease-in-out ${isDark ? 'text-white' : 'text-[#0f2f1c]'} ${showLogo ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'}`}
            >
                <Link to="/" className="pointer-events-auto block">
                    <img
                        src="/barberia-moderna.svg"
                        alt="Barberia Moderna Logo"
                        className={`h-24 md:h-32 w-auto transition-all duration-300 ${isDark ? 'brightness-0 invert' : ''}`}
                    />
                </Link>
            </div>

            {/* Mobile Menu Overlay - Expanding from Navbar */}
            <div
                ref={mobileMenuRef}
                className={`fixed bottom-10 left-1/2 transform -translate-x-1/2 w-[90%] z-[90] backdrop-blur-xl border p-8 flex flex-col items-center gap-6 opacity-0 invisible md:hidden pb-28 rounded-3xl transition-colors duration-300 ${containerClass}`}
            >
                <nav className={`flex flex-col gap-6 text-center font-bold text-lg tracking-widest uppercase ${textClass}`}>
                    <Link to="/team" onClick={() => setIsMenuOpen(false)} className="hover:opacity-70 transition-opacity">{t('header.barbers')}</Link>
                    <a href="/#services" onClick={() => setIsMenuOpen(false)} className="hover:opacity-70 transition-opacity">{t('header.treatments')}</a>
                    <a href="/#news" onClick={() => setIsMenuOpen(false)} className="hover:opacity-70 transition-opacity">{t('header.news')}</a>
                    <a href="/#contact" onClick={() => setIsMenuOpen(false)} className="hover:opacity-70 transition-opacity">{t('header.contact')}</a>
                </nav>
            </div>

            {/* Bottom Navigation Bar */}
            <header
                ref={headerRef}
                className={`fixed bottom-10 left-1/2 transform -translate-x-1/2 z-[100] w-[90%] md:w-auto md:min-w-[600px] backdrop-blur-md border rounded-full p-1 flex justify-between items-center transition-all duration-300 ${containerClass}`}
            >
                {/* Desktop Nav */}
                <nav className={`hidden md:flex px-8 gap-8 font-bold text-sm tracking-wide uppercase transition-colors duration-300 ${textClass}`}>
                    <Link to="/team" className="hover:opacity-70 transition-opacity">{t('header.barbers')}</Link>
                    <a href="/#services" className="hover:opacity-70 transition-opacity">{t('header.treatments')}</a>
                    <a href="/#news" className="hover:opacity-70 transition-opacity">{t('header.news')}</a>
                    <a href="/#contact" className="hover:opacity-70 transition-opacity">{t('header.contact')}</a>
                </nav>

                {/* Mobile Burger Icon - Left Side on Mobile */}
                <div className="md:hidden pl-4">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="relative z-50 w-10 h-10 flex flex-col justify-center items-center gap-1.5"
                    >
                        <span
                            ref={(el) => (burgerRefs.current[0] = el)}
                            className={`w-6 h-0.5 rounded-full transition-colors duration-300 ${isDark ? 'bg-white' : 'bg-[#1a4d2e]'}`}
                        />
                        <span
                            ref={(el) => (burgerRefs.current[1] = el)}
                            className={`w-6 h-0.5 rounded-full transition-colors duration-300 ${isDark ? 'bg-white' : 'bg-[#1a4d2e]'}`}
                        />
                        <span
                            ref={(el) => (burgerRefs.current[2] = el)}
                            className={`w-6 h-0.5 rounded-full transition-colors duration-300 ${isDark ? 'bg-white' : 'bg-[#1a4d2e]'}`}
                        />
                    </button>
                </div>

                <div className="flex items-center gap-4">
                    {/* Language Switcher */}
                    <div className={`flex gap-2 font-bold text-xs ${textClass}`}>
                        <button
                            onClick={() => changeLanguage('it')}
                            className={`hover:opacity-100 transition-opacity ${i18n.language === 'it' ? 'underline opacity-100' : 'opacity-50'}`}
                        >
                            IT
                        </button>
                        <span>|</span>
                        <button
                            onClick={() => changeLanguage('en')}
                            className={`hover:opacity-100 transition-opacity ${i18n.language === 'en' ? 'underline opacity-100' : 'opacity-50'}`}
                        >
                            EN
                        </button>
                    </div>

                    <Link to="/booking" className={`px-6 md:px-8 py-3 rounded-full font-bold text-sm uppercase tracking-wide transition-colors duration-300 shadow-lg ${buttonClass}`}>
                        <span className="md:hidden">{t('header.book_appointment')}</span>
                        <span className="hidden md:inline">{t('header.book_appointment')}</span>
                    </Link>
                </div>
            </header>
        </>
    );
};

export default Header;
