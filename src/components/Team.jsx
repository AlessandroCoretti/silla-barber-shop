import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from 'react-i18next';

const Team = () => {
    const { t } = useTranslation();
    const containerRef = useRef(null);
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
    const [activeBarber, setActiveBarber] = useState(null);
    const [isHovering, setIsHovering] = useState(false);

    const barbers = [
        { name: 'Lele', role: t('team.roles.head_barber'), img: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?q=80&w=1000&auto=format&fit=crop' },
        { name: 'Riccardo', role: t('team.roles.stylist'), img: 'https://images.unsplash.com/photo-1583341612074-cce5ec6b435c?q=80&w=1000&auto=format&fit=crop' },
        { name: 'Jurgen', role: t('team.roles.barber'), img: 'https://images.unsplash.com/photo-1618077360395-f3068be8e001?q=80&w=1000&auto=format&fit=crop' },
        { name: 'Stefano', role: t('team.roles.junior'), img: 'https://images.unsplash.com/photo-1605497787865-e6e50c91acbd?q=80&w=1000&auto=format&fit=crop' }
    ];

    useEffect(() => {
        const moveCursor = (e) => {
            setCursorPos({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', moveCursor);
        return () => window.removeEventListener('mousemove', moveCursor);
    }, []);

    useEffect(() => {
        const el = containerRef.current;

        gsap.fromTo(el.querySelectorAll('.barber-card'),
            { opacity: 0, y: 50 },
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
        <section ref={containerRef} className="py-24 bg-gray-50 text-gray-900 relative" id="team">
            {/* Custom Cursor */}
            {/* Custom Cursor */}
            {/* Custom Cursor */}
            <div
                className="fixed top-0 left-0 bg-green-900/90 text-white rounded-full flex items-center justify-center text-center px-3 py-3 pointer-events-none z-50 transition-transform duration-100 ease-out shadow-2xl backdrop-blur-sm"
                style={{
                    left: `${cursorPos.x}px`,
                    top: `${cursorPos.y}px`,
                    transform: `translate(-50%, -50%) scale(${isHovering ? 1 : 0})`,
                }}
            >
                <span className="text-[10px] font-bold uppercase tracking-widest leading-tight whitespace-nowrap">
                    {t('team.discover_more')} <span className="uppercase">{activeBarber}</span>
                </span>
            </div>

            <div className="container mx-auto px-4">
                <div className="flex justify-between items-end mb-16">
                    <h2 className="text-4xl font-bold uppercase">{t('team.title')}</h2>
                    <div className="hidden md:flex gap-2">
                        <span className="w-3 h-3 rounded-full bg-green-800"></span>
                        <span className="w-3 h-3 rounded-full bg-gray-300"></span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {barbers.map((barber, index) => (
                        <div
                            key={index}
                            className="barber-card group relative overflow-hidden rounded-lg shadow-lg cursor-none"
                            onMouseEnter={() => {
                                setActiveBarber(barber.name);
                                setIsHovering(true);
                            }}
                            onMouseLeave={() => setIsHovering(false)}
                        >
                            <div className="aspect-[3/4] overflow-hidden">
                                <img
                                    src={barber.img}
                                    alt={barber.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0"
                                />
                            </div>
                            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 to-transparent p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 pointer-events-none">
                                <h3 className="text-2xl font-bold uppercase">{barber.name}</h3>
                                <p className="text-sm opacity-80 uppercase tracking-widest">{barber.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Team;
