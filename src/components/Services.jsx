import React, { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Services = () => {
    const { t } = useTranslation();
    const sectionRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);

    const services = [
        {
            name: t('services.cuts.name'),
            desc: t('services.cuts.desc'),
            price: '€35',
            img: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?q=80&w=1000&auto=format&fit=crop" // Haircut specific
        },
        {
            name: t('services.beard.name'),
            desc: t('services.beard.desc'),
            price: '€25',
            img: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?q=80&w=1000&auto=format&fit=crop" // Beard/Shave specific
        },
        {
            name: t('services.combo.name'),
            desc: t('services.combo.desc'),
            price: '€55',
            img: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=2070&auto=format&fit=crop" // Combo/General
        },
        {
            name: t('services.kids.name'),
            desc: t('services.kids.desc'),
            price: '€25',
            img: "https://images.unsplash.com/photo-1519340241574-2cec6aef0c01?q=80&w=1000&auto=format&fit=crop" // Kids
        }
    ];

    useLayoutEffect(() => {
        const el = sectionRef.current;
        const mm = gsap.matchMedia();

        mm.add({
            isMobile: "(max-width: 768px)",
            isDesktop: "(min-width: 769px)"
        }, (context) => {
            let { isMobile } = context.conditions;

            // Entry animation for all devices
            gsap.fromTo(el.querySelectorAll('.service-item'),
                { opacity: 0, x: -30 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.6,
                    stagger: 0.1,
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 75%',
                    }
                }
            );

            // Mobile: No pinning, just natural scroll
            // The active index will be set by mouse enter (touch) or we can leave it default
            if (isMobile) {
                // Optional: We could add a simple scroll trigger just to update the index without pinning
                // But for now, ensuring smooth scroll is priority.
            }
        });

        return () => mm.revert();

    }, [t, services.length]);

    return (
        <section ref={sectionRef} className="py-24 bg-white" id="services">
            <div className="container mx-auto px-4 flex flex-col md:flex-row gap-16">

                <div className="w-full md:w-1/2">
                    <h2 className="text-4xl font-bold uppercase mb-12">{t('services.title')}</h2>

                    <div className="flex flex-col gap-6">
                        {services.map((service, index) => (
                            <div
                                key={index}
                                className={`service-item border-b border-gray-200 pb-6 group cursor-pointer transition-colors ${activeIndex === index ? 'border-green-800' : 'hover:border-green-800'}`}
                                onMouseEnter={() => setActiveIndex(index)}
                            >
                                <div className="flex justify-between items-baseline mb-2">
                                    <h3 className={`text-2xl font-bold uppercase transition-colors ${activeIndex === index ? 'text-green-800' : 'text-gray-400 group-hover:text-green-800'}`}>
                                        {service.name}
                                    </h3>
                                    <span className={`text-xl font-bold transition-colors ${activeIndex === index ? 'text-green-800' : 'group-hover:text-green-800'}`}>
                                        {service.price}
                                    </span>
                                </div>
                                <p className={`transition-colors ${activeIndex === index ? 'text-gray-700' : 'text-gray-500 group-hover:text-gray-700'}`}>
                                    {service.desc}
                                </p>
                            </div>
                        ))}
                    </div>

                    <Link to="/booking" className="mt-8 btn bg-green-800 hover:bg-green-700 inline-block text-center">
                        {t('services.book_appointment')}
                    </Link>
                </div>

                <div className="w-full md:w-1/2 relative h-[500px] overflow-hidden rounded-lg shadow-xl">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${activeIndex === index ? 'opacity-100' : 'opacity-0'}`}
                        >
                            <img
                                src={service.img}
                                alt={service.name}
                                className="w-full h-full object-cover"
                            />
                            {/* Overlay gradient for better text readability if we add text over usage, purely aesthetic for cleaner look */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default Services;
