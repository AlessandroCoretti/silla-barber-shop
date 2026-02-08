import React, { useEffect, useRef, useState } from 'react';
import { Menu, Phone, Calendar } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from 'react-i18next';

gsap.registerPlugin(ScrollTrigger);

const Header = () => {
    const { t, i18n } = useTranslation();
    const headerRef = useRef(null);
    const [isDark, setIsDark] = useState(true); // Start true because Hero is dark
    const [showLogo, setShowLogo] = useState(true);

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
    };

    useEffect(() => {
        // Animation entry
        gsap.fromTo(headerRef.current,
            { y: 100, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, delay: 0.5, ease: "power3.out" }
        );

        // Theme switching trigger
        const darkSections = document.querySelectorAll('.dark-section');

        // Default to dark (Hero is first)
        darkSections.forEach(section => {
            ScrollTrigger.create({
                trigger: section,
                start: 'top bottom-=60', // When top of darker section hits the navbar area (approx 60px from bottom)
                end: 'bottom bottom-=60', // When bottom of darker section leaves the navbar area
                onEnter: () => setIsDark(true),
                onLeave: () => setIsDark(false),
                onEnterBack: () => setIsDark(true),
                onLeaveBack: () => setIsDark(false),
            });
        });

        // Smart Logo: Hide on scroll down, show on scroll up
        ScrollTrigger.create({
            trigger: 'body',
            start: 'top top',
            end: 99999,
            onUpdate: (self) => {
                if (self.direction === 1 && self.scroll() > 100) {
                    setShowLogo(false); // Hide on scroll down
                } else if (self.direction === -1) {
                    setShowLogo(true);  // Show on scroll up
                }
            }
        });

    }, []);

    // Styles based on theme
    const containerClass = isDark
        ? "bg-[#ffffff20] border-white/10" // Dark Theme (over dark bg)
        : "bg-white/60 border-white/40 shadow-xl"; // Light Theme (over light bg)

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
                className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 pointer-events-none transition-all duration-500 ease-in-out ${isDark ? 'text-white' : 'text-[#0f2f1c]'} ${showLogo ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full'}`}
            >
                <img
                    src="/barberia-moderna.svg"
                    alt="Barberia Moderna Logo"
                    className={`h-32 w-auto transition-all duration-300 ${isDark ? 'brightness-0 invert' : ''}`}
                />
            </div>

            {/* Bottom Navigation */}
            <header
                ref={headerRef}
                className={`fixed bottom-10 left-1/2 transform -translate-x-1/2 z-50 w-auto min-w-[600px] backdrop-blur-md border rounded-full p-2 flex justify-between items-center transition-all duration-300 ${containerClass}`}
            >
                <nav className={`flex px-8 gap-8 font-bold text-sm tracking-wide uppercase transition-colors duration-300 ${textClass}`}>
                    <a href="#team" className="hover:opacity-70 transition-opacity">{t('header.barbers')}</a>
                    <a href="#services" className="hover:opacity-70 transition-opacity">{t('header.treatments')}</a>
                    <a href="#news" className="hover:opacity-70 transition-opacity">{t('header.news')}</a>
                    <a href="#contact" className="hover:opacity-70 transition-opacity">{t('header.contact')}</a>
                </nav>

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

                    <button className={`px-8 py-3 rounded-full font-bold text-sm uppercase tracking-wide transition-colors duration-300 shadow-lg ${buttonClass}`}>
                        {t('header.book_appointment')}
                    </button>
                </div>
            </header>
        </>
    );
};

export default Header;
