import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Draggable } from 'gsap/Draggable';
import { Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

gsap.registerPlugin(ScrollTrigger, Draggable);

const Reviews = () => {
    const { t } = useTranslation();
    const sectionRef = useRef(null);
    const containerRef = useRef(null);
    const wrapperRef = useRef(null);

    const reviews = [
        { name: "Luisiano Fiore", text: t('reviews.review_1'), rating: 5 },
        { name: "Loris Medves (Sawol)", text: t('reviews.review_2'), rating: 5 },
        { name: "Kap93", text: t('reviews.review_3'), rating: 5 },
        { name: "Giuseppe Pierangelini", text: t('reviews.review_4'), rating: 5 },
        { name: "Simone Pilia", text: t('reviews.review_5'), rating: 5 },
        { name: "Alessandro SANTAGATA", text: t('reviews.review_6'), rating: 5 }
    ];

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Register Draggable inside the context or outside if preferred, but usually safe here
            // However, best practice is to register strictly once. Since React 18 strict mode runs twice, we can do it outside or check.
            // For simplicity in this file, we assume it's registered globally or we register it here.
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    // Specific useEffect for Draggable to ensure DOM is ready and refreshing on resize
    useEffect(() => {
        let draggableInstance;

        const initDraggable = () => {
            if (draggableInstance) {
                draggableInstance[0].kill();
            }

            // Calculate bounds based on wrapper and container width
            // container (draggable) needs to slide within wrapper (viewport)
            // But Draggable 'bounds' usually works by constraining the element to the bounds of another.
            // Here we want the container to be able to slide left until its right edge hits the viewport right edge.

            draggableInstance = Draggable.create(containerRef.current, {
                type: "x",
                bounds: {
                    minX: - (containerRef.current.offsetWidth - wrapperRef.current.offsetWidth),
                    maxX: 0
                },
                inertia: true, // Requires InertiaPlugin, which is paid/club greensock locally usually, but standard draggable works without it for 'hold and slide'
                edgeResistance: 0.65,
                resistance: 0.75, // Adds some friction
                cursor: "grab",
                activeCursor: "grabbing",
                onDragStart: function () {
                    gsap.to(containerRef.current, { cursor: "grabbing" });
                },
                onDragEnd: function () {
                    gsap.to(containerRef.current, { cursor: "grab" });
                }
            });
        };

        // Need to wait for fonts/images or just layout
        const timer = setTimeout(initDraggable, 100);

        const handleResize = () => {
            initDraggable();
        }

        window.addEventListener('resize', handleResize);

        // Initial animation
        gsap.fromTo(containerRef.current.children,
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

        return () => {
            if (draggableInstance && draggableInstance[0]) draggableInstance[0].kill();
            window.removeEventListener('resize', handleResize);
            clearTimeout(timer);
        };
    }, []);

    return (
        <section ref={sectionRef} className="py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-12">
                    <h2 className="text-4xl font-bold uppercase">{t('reviews.title')}</h2>
                    <div className="flex gap-2">
                        {/* Visual indicator that it's scrollable/interactive could be helpful, but user asked for hold and slide */}
                        <span className="text-sm font-medium opacity-50 uppercase tracking-widest hidden md:block">
                            {t('reviews.drag_to_view') || "Drag to view"}
                        </span>
                    </div>
                </div>

                <div ref={wrapperRef} className="overflow-hidden cursor-grab active:cursor-grabbing">
                    <div ref={containerRef} className="flex gap-6 w-max">
                        {reviews.map((review, i) => (
                            <div key={i} className="review-card select-none w-[85vw] md:w-[30vw] lg:w-[25vw] flex-shrink-0 bg-green-900 text-white p-8 rounded-lg shadow-lg relative overflow-hidden group hover:-translate-y-2 transition-transform duration-300">
                                <div className="flex gap-1 mb-4 text-yellow-400">
                                    {[...Array(review.rating)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                                </div>
                                <p className="mb-6 font-medium leading-relaxed opacity-90">"{review.text}"</p>
                                <div className="uppercase font-bold text-sm tracking-wider opacity-60">
                                    {review.name}
                                </div>
                                <div className="absolute top-0 right-0 p-32 bg-green-800 rounded-full blur-3xl opacity-20 transform translate-x-1/2 -translate-y-1/2 group-hover:opacity-40 transition-opacity"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Reviews;
