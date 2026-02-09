import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from 'react-i18next';

const Coffee = () => {
    const { t } = useTranslation();
    const sectionRef = useRef(null);

    useEffect(() => {
        const el = sectionRef.current;

        gsap.fromTo(el.querySelector('.coffee-content'),
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 1,
                scrollTrigger: {
                    trigger: el,
                    start: 'top 75%',
                }
            }
        );
    }, []);

    return (
        <section ref={sectionRef} className="py-24 bg-white">
            <div className="container mx-auto px-4 flex flex-col-reverse md:flex-row items-center gap-16">

                <div className="w-full md:w-1/2">
                    <img
                        src="https://images.unsplash.com/photo-1647140655214-e4a2d914971f?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt="Coffee Machine"
                        className="w-full h-auto transition-all duration-700 rounded-lg shadow-lg"
                    />
                </div>

                <div className="coffee-content w-full md:w-1/2">
                    <h2 className="text-4xl font-bold uppercase mb-6">{t('coffee.title')}</h2>
                    <p className="mb-6 text-gray-600 leading-relaxed">
                        {t('coffee.text')}
                    </p>
                    <div className="flex gap-4">
                        <button className="btn bg-green-800 hover:bg-green-700">
                            {t('coffee.read_more')}
                        </button>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default Coffee;
