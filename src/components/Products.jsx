import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Products = () => {
    const { t } = useTranslation();
    const sectionRef = useRef(null);

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            const el = sectionRef.current;
            gsap.fromTo(el,
                { opacity: 0 },
                {
                    opacity: 1,
                    duration: 1.2,
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 80%',
                    }
                }
            );
        }, sectionRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="py-24 bg-green-900 text-white relative overflow-hidden">
            <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-16 relative z-10">

                <div className="w-full md:w-1/2">
                    <h2 className="text-4xl font-bold uppercase mb-6">{t('products.title')}</h2>
                    <p className="mb-6 opacity-80 leading-relaxed">
                        {t('products.text')}
                    </p>
                    <div className="flex gap-4">
                        <Link to="/booking" className="btn bg-white text-green-900 hover:bg-gray-100">
                            {t('header.book_appointment')}
                        </Link>
                    </div>
                </div>

                <div className="w-full md:w-1/2">
                    <img
                        src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt="Grooming Products"
                        className="w-full h-auto rounded-lg shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500"
                    />
                </div>

            </div>

            {/* Background patterned overlay or texture can go here */}
            <div className="absolute top-0 left-0 w-full h-full bg-black/10 pointer-events-none"></div>
        </section>
    );
};

export default Products;
