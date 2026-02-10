import React, { useLayoutEffect, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger, Draggable } from 'gsap/all';
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
        let ctx = gsap.context(() => {
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

            // Draggable initialization
            Draggable.create(containerRef.current, {
                type: "x",
                bounds: {
                    minX: - (containerRef.current.offsetWidth - wrapperRef.current.offsetWidth),
                    maxX: 0
                },
                inertia: true,
                edgeResistance: 0.65,
                resistance: 0.75,
                cursor: "grab",
                activeCursor: "grabbing",
                dragClickables: true,
                onDragStart: function () {
                    gsap.to(containerRef.current, { cursor: "grabbing" });
                },
                onDragEnd: function () {
                    gsap.to(containerRef.current, { cursor: "grab" });
                }
            });
        }, sectionRef);

        const handleResize = () => {
            // Refresh Draggable bounds on resize
            if (ctx && ctx.revert) { // safety check
                ctx.revert(); // Revert everything
                // Re-add animations/draggable. 
                // A better way with GSAP context is just to kill the draggable and recreate it, 
                // but reverting context is the nuclear option ensuring no memory leaks.
                // However, complete revert checks might cause flash. 
                // Let's just update bounds if possible or re-run the context logic.

                // Re-running the effect might be simpler:
                // But we are in an effect cleanup.

                // Actually, for resize, Draggable has an `applyBounds` method, or we can just kill and recreate.
                // But since we used context, let's just let React handle full re-render if needed or rely on a key.
                // Or simply:
                ctx.kill();
                ctx = gsap.context(() => {
                    // Re-init code (duplicated here for simplicity in this thought process, but better to extract function)
                    // ...
                    // Actually, let's just make the dependency array handle it or use a specific resize handler that updates draggable.
                }, sectionRef);

                // Let's trigger a re-render to re-run this effect? No, that's not optimal.
                // Let's just create a refresh function.
            }
        };

        // Re-implementing correctly:
        // We can just rely on window resize causing re-renders if we used state, but we aren't.
        // So we need to manually update Draggable.

        // Let's use a separate ResizeObserver or window listener to kill and recreate draggable specifically.
        // Or cleaner: make the Draggable creation dependent on window size (but via ref).

        return () => ctx.revert();
    }, [t]); // Added t dependency as it might change content length? reviews is constant.

    // A better way to handle resize for Draggable bound updates:
    useEffect(() => {
        const refreshDraggable = () => {
            const draggable = Draggable.get(containerRef.current);
            if (draggable) {
                draggable.applyBounds({
                    minX: - (containerRef.current.offsetWidth - wrapperRef.current.offsetWidth),
                    maxX: 0
                });
            }
        };

        window.addEventListener('resize', refreshDraggable);
        return () => window.removeEventListener('resize', refreshDraggable);
    }, []);


    return (
        <section ref={sectionRef} className="py-24 bg-white overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-12">
                    <h2 className="text-4xl font-bold uppercase">{t('reviews.title')}</h2>
                    <div className="flex gap-2">
                        <span className="text-sm font-medium opacity-50 uppercase tracking-widest hidden md:block">
                            {t('reviews.drag_to_view') || "Hold and Drag"}
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
