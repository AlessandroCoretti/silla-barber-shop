import React, { useLayoutEffect, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/all';

gsap.registerPlugin(ScrollTrigger);
import { useTranslation } from 'react-i18next';
import { API_BASE_URL } from '../config';

const Team = ({ showDescription = true }) => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const sectionRef = useRef(null);
    const containerRef = useRef(null);
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
    const [activeBarber, setActiveBarber] = useState(null);
    const [isHovering, setIsHovering] = useState(false);
    const [barbers, setBarbers] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [scrollLeft, setScrollLeft] = useState(0);

    useEffect(() => {
        fetch(`${API_BASE_URL}/barbers`)
            .then(res => res.json())
            .then(data => setBarbers(data))
            .catch(err => console.error("Error fetching barbers:", err));
    }, []);

    useEffect(() => {
        const moveCursor = (e) => {
            setCursorPos({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', moveCursor);
        return () => window.removeEventListener('mousemove', moveCursor);
    }, []);

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            // Entrance animation for cards
            gsap.fromTo('.barber-card',
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
    }, [barbers]);

    const handleCardClick = (barberId) => {
        navigate('/team');
    };

    return (
        <section ref={sectionRef} className="py-24 bg-gray-50 text-gray-900 relative" id="team">
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

                {/* Scrollable Container with Snap */}
                <div
                    ref={containerRef}
                    className={`
                        ${barbers.length > 4 ? 'flex overflow-x-auto snap-x snap-mandatory pb-8 -mx-4 px-4 md:mx-0 md:px-0 gap-6 no-scrollbar scroll-smooth cursor-grab' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'}
                        ${isDragging ? 'cursor-grabbing snap-none scroll-auto' : ''}
                    `}
                    onMouseDown={(e) => {
                        if (barbers.length <= 4) return;
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
                        const walk = (x - startX) * 2; // scroll-fast
                        containerRef.current.scrollLeft = scrollLeft - walk;
                    }}
                >
                    {barbers.map((barber, index) => (
                        <div
                            key={index}
                            className={`
                                barber-card group relative overflow-hidden rounded-lg shadow-lg cursor-pointer bg-white
                                ${barbers.length > 4 ? 'min-w-[85vw] md:min-w-[350px] snap-center flex-shrink-0 select-none' : ''}
                            `}
                            onMouseEnter={() => {
                                setActiveBarber(barber.name);
                                setIsHovering(true);
                            }}
                            onMouseLeave={() => setIsHovering(false)}
                            onClick={() => {
                                if (!isDragging) handleCardClick(barber.id);
                            }}
                        >
                            <div className="aspect-[3/4] overflow-hidden">
                                <img
                                    src={barber.img}
                                    alt={barber.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 pointer-events-none"
                                />
                            </div>
                            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 via-black/70 to-transparent p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 pointer-events-none">
                                <h3 className="text-2xl font-bold uppercase">{barber.name}</h3>
                                <p className="text-sm opacity-80 uppercase tracking-widest mb-2">{t(barber.roleKey)}</p>
                                {showDescription && (barber.descriptionIt || barber.descriptionEn) && (
                                    <p className="text-xs text-gray-300 line-clamp-3 mt-2 font-light">
                                        {i18n.language === 'it' ? (barber.descriptionIt || barber.description) : (barber.descriptionEn || barber.descriptionIt || barber.description)}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Team;
