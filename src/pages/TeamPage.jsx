import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { gsap } from 'gsap';

const TeamPage = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const wheelContainerRef = useRef(null);
    const lastScrollTime = useRef(0);

    // Initialize state from location or default to 0
    const [activeBarberIndex, setActiveBarberIndex] = useState(0);

    const barbers = [
        {
            id: 'lele',
            name: 'Lele',
            role: t('team.roles.head_barber'),
            img: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
        {
            id: 'riccardo',
            name: 'Riccardo',
            role: t('team.roles.stylist'),
            img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop',
        },
        {
            id: 'jurgen',
            name: 'Jurgen',
            role: t('team.roles.barber'),
            img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop',
        },
        {
            id: 'stefano',
            name: 'Stefano',
            role: t('team.roles.junior'),
            img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1000&auto=format&fit=crop',
        }
    ];

    useEffect(() => {
        if (location.state && typeof location.state.barberIndex === 'number') {
            setActiveBarberIndex(location.state.barberIndex);
        }
    }, [location.state]);

    // Handle scroll interaction ONLY for the wheel container
    useEffect(() => {
        const handleWheel = (e) => {
            // Prevent default page scrolling ONLY when the wheel is being used
            e.preventDefault();

            const now = Date.now();
            // Throttle
            if (now - lastScrollTime.current < 600) return;
            // Threshold
            if (Math.abs(e.deltaY) < 30) return;

            lastScrollTime.current = now;

            if (e.deltaY > 0) {
                setActiveBarberIndex((prev) => (prev + 1) % barbers.length);
            } else {
                setActiveBarberIndex((prev) => (prev - 1 + barbers.length) % barbers.length);
            }
        };

        const container = wheelContainerRef.current;
        if (container) {
            container.addEventListener('wheel', handleWheel, { passive: false });
        }

        return () => {
            if (container) {
                container.removeEventListener('wheel', handleWheel);
            }
        };
    }, [barbers.length]);

    return (
        <div className="min-h-screen flex flex-col bg-white">
            {/* Hero Section - 60vh - Increased Height */}
            <div className="relative h-[60vh] w-full flex items-center justify-center bg-black dark-section">
                <img
                    src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=2070&auto=format&fit=crop"
                    alt="Barber Shop Team"
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40"></div>
                <h1 className="relative z-10 text-6xl md:text-8xl font-heading text-white uppercase tracking-wider text-center drop-shadow-lg">
                    Team
                </h1>
            </div>

            {/* Main Content Area - Wheel & Info */}
            {/* Added pb-32 to prevent footer overlap */}
            <div className="flex-1 w-full max-w-7xl mx-auto flex flex-col md:flex-row py-12 md:py-20 pb-40">

                {/* Left Side - Vertical Wheel - Scroll Listener Attached Here */}
                <div className="w-full md:w-1/2 flex flex-col items-center justify-center relative perspective-1000 z-10 min-h-[500px]">
                    {/* Overlay hint for interaction if needed, or just the container */}
                    <div
                        ref={wheelContainerRef}
                        className="relative w-full max-w-md h-[400px] flex items-center justify-center cursor-ns-resize"
                        title="Scroll on cards to change barber"
                    >
                        {barbers.map((barber, index) => {
                            let diff = index - activeBarberIndex;
                            const total = barbers.length;
                            let distance = (index - activeBarberIndex + total) % total;
                            if (distance > total / 2) distance -= total;

                            const isActive = distance === 0;
                            const yOffset = distance * 140;
                            const scale = isActive ? 1.0 : 0.8;
                            const opacity = isActive ? 1 : Math.max(0.2, 1 - Math.abs(distance) * 0.4);
                            const blur = isActive ? 0 : 4;
                            const zIndex = isActive ? 50 : 10 - Math.abs(distance);
                            const rotateX = distance * -15;

                            return (
                                <div
                                    key={barber.id}
                                    className="absolute top-1/2 left-1/2 w-64 h-80 transition-all duration-700 ease-out"
                                    style={{
                                        transform: `translate(-50%, -50%) translateY(${yOffset}px) scale(${scale}) perspective(1000px) rotateX(${rotateX}deg)`,
                                        zIndex: zIndex,
                                        opacity: opacity,
                                        filter: `blur(${blur}px)`,
                                        pointerEvents: isActive ? 'auto' : 'none'
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation(); // prevent triggering other clicks
                                        setActiveBarberIndex(index);
                                    }}
                                >
                                    <div className="w-full h-full rounded-xl overflow-hidden shadow-2xl bg-white border border-neutral-200 transition-colors duration-500">
                                        <img
                                            src={barber.img}
                                            alt={barber.name}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className={`absolute inset-0 bg-white/60 transition-all duration-500 ${isActive ? 'opacity-0' : 'opacity-100 backdrop-blur-[2px]'}`}></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right Side - Info */}
                <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-16 z-20 mt-12 md:mt-0">
                    <div key={activeBarberIndex} className="max-w-xl animate-fade-in-up">
                        <div className="w-24 h-1 bg-green-700 mb-8"></div>

                        <div className="space-y-6">
                            <h2 className="text-4xl font-bold uppercase text-neutral-800 tracking-wider">
                                {barbers[activeBarberIndex].name}
                            </h2>
                            <h3 className="text-xl text-green-700 uppercase tracking-widest font-medium border-l-4 border-green-700 pl-4">
                                {barbers[activeBarberIndex].role}
                            </h3>
                            <p className="text-neutral-600 text-lg leading-relaxed font-light">
                                {t(`team.descriptions.${barbers[activeBarberIndex].id}`)}
                            </p>
                        </div>
                    </div>
                </div>

                <style>{`
                    @keyframes fadeInUp {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .animate-fade-in-up {
                        animation: fadeInUp 0.6s ease-out forwards;
                    }
                `}</style>
            </div>
        </div>
    );
};

export default TeamPage;
