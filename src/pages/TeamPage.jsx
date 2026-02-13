import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';



const TeamPage = () => {
    const { t, i18n } = useTranslation();
    const [barbers, setBarbers] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8081/api/barbers')
            .then(res => res.json())
            .then(data => setBarbers(data))
            .catch(err => console.error("Error fetching barbers:", err));
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-white">
            {/* Hero Section - 60vh */}
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

            {/* Main Content Area - Row Layout */}
            <div className="flex-1 w-full max-w-6xl mx-auto py-16 px-4">

                {/* Title Section */}
                <div className="flex flex-col lg:flex-row mb-16">
                    <div className="hidden lg:block lg:w-5/12"></div>
                    <div className="w-full lg:w-7/12 flex justify-center text-center">
                        <h2 className="text-4xl md:text-5xl font-bold uppercase text-neutral-900 tracking-wider leading-tight">
                            {t('team.title')}
                        </h2>
                    </div>
                </div>

                <div className="space-y-24">
                    {barbers.map((barber) => (
                        <div key={barber.id} className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

                            {/* Card - Left */}
                            <div className="w-full lg:w-5/12 flex justify-center lg:justify-end">
                                <div className="group relative w-64 aspect-[3/4] overflow-hidden rounded-lg shadow-xl">
                                    <img
                                        src={barber.img}
                                        alt={barber.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                        <p className="text-white font-bold uppercase tracking-wider text-xl">{barber.name}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Description - Right */}
                            <div className="w-full lg:w-7/12 flex flex-col items-center lg:items-center text-center px-4 md:px-12">
                                <div className="max-w-lg">
                                    <h3 className="text-3xl font-bold uppercase text-neutral-800 mb-4 flex flex-col items-center gap-2">
                                        {barber.name}
                                        <span className="text-xs font-bold text-green-700 bg-green-50 px-3 py-1 rounded border border-green-100 tracking-widest uppercase">
                                            {t(barber.roleKey)}
                                        </span>
                                    </h3>
                                    <div className="w-12 h-1 bg-green-700 mb-6 rounded-full opacity-50 mx-auto"></div>
                                    <p className="text-neutral-600 text-lg leading-relaxed font-light">
                                        {i18n.language === 'it' ? (barber.descriptionIt || barber.description) : (barber.descriptionEn || barber.descriptionIt || barber.description)}
                                    </p>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TeamPage;
