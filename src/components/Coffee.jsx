import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const Coffee = () => {
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
                        src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=2574&auto=format&fit=crop"
                        alt="Coffee Machine"
                        className="w-full h-auto grayscale hover:grayscale-0 transition-all duration-700 rounded-lg shadow-lg"
                    />
                </div>

                <div className="coffee-content w-full md:w-1/2">
                    <h2 className="text-4xl font-bold uppercase mb-6">Coffee To-Go and Chill</h2>
                    <p className="mb-6 text-gray-600 leading-relaxed">
                        It's not just about the cut, it's about the connection. Arrive early or stay late to enjoy our signature
                        espresso blend. Whether you need a morning kick or a relaxing break, our barista station is always open
                        for our clients. Free coffee with every service.
                    </p>
                    <div className="flex gap-4">
                        <button className="btn bg-green-800 hover:bg-green-700">
                            Read More
                        </button>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default Coffee;
