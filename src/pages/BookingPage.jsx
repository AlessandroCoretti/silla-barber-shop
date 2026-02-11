import React, { useState, useLayoutEffect, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { barbers } from '../data/barbers';

const BookingPage = () => {
    const { t } = useTranslation();
    const pageRef = useRef(null);
    const [step, setStep] = useState(1); // 1: Barber, 2: Date/Time, 3: Details, 4: Success
    const [bookingData, setBookingData] = useState({
        barber: null, // null = any
        service: '',
        date: '',
        time: '',
        name: '',
        surname: '',
        email: '',
        phone: '',
        message: ''
    });

    const services = [
        { id: 'cut', name: 'booking.services.cut', price: 30 },
        { id: 'beard', name: 'booking.services.beard', price: 20 },
        { id: 'combo', name: 'booking.services.combo', price: 45 },
        { id: 'kid', name: 'booking.services.kid', price: 25 },
    ];

    const timeSlots = [
        "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
        "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00"
    ];

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            gsap.fromTo(pageRef.current.children,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: "power2.out" }
            );
        }, pageRef);
        return () => ctx.revert();
    }, []);

    const location = useLocation();

    useEffect(() => {
        if (location.state && location.state.barberId) {
            setBookingData(prev => ({ ...prev, barber: location.state.barberId }));
            setStep(2);
        }
    }, [location.state]);

    const handleBarberSelect = (barberId) => {
        setBookingData(prev => ({ ...prev, barber: barberId }));
        setStep(2);
    };

    const handleDateChange = (e) => {
        setBookingData(prev => ({ ...prev, date: e.target.value }));
    };

    const handleTimeSelect = (time) => {
        setBookingData(prev => ({ ...prev, time }));
        setStep(3);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setBookingData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newBooking = {
            ...bookingData,
            price: services.find(s => s.id === bookingData.service)?.price || 0
        };

        try {
            const response = await fetch('http://localhost:8080/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newBooking),
            });

            if (response.ok) {
                console.log("Booking Saved to Backend");
                setStep(4);
            } else {
                console.error("Failed to save booking");
                alert("Errore nel salvataggio della prenotazione");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Errore di connessione al server");
        }
    };

    const getBarberName = (id) => {
        if (!id) return t('booking.any_barber');
        const barber = barbers.find(b => b.id === id);
        return barber ? barber.name : id;
    };

    return (
        <div className="min-h-screen bg-gray-50 py-24 px-4" ref={pageRef}>
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden min-h-[600px] flex flex-col">

                {/* Header */}
                <div className="bg-green-900 text-white p-8 text-center">
                    <h1 className="text-3xl font-bold uppercase tracking-wider">{t('booking.title')}</h1>
                    {step < 4 && (
                        <div className="flex justify-center gap-4 mt-4 text-sm opacity-70">
                            <span className={step === 1 ? "text-white font-bold" : ""}>1. {t('booking.select_barber')}</span>
                            <span>&gt;</span>
                            <span className={step === 2 ? "text-white font-bold" : ""}>2. {t('booking.select_date')}</span>
                            <span>&gt;</span>
                            <span className={step === 3 ? "text-white font-bold" : ""}>3. {t('booking.your_details')}</span>
                        </div>
                    )}
                </div>

                <div className="p-8 flex-1 flex flex-col">

                    {/* Step 1: Barber Selection */}
                    {step === 1 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {/* Any Barber Option */}
                            <div
                                onClick={() => handleBarberSelect(null)}
                                className="cursor-pointer border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center gap-4 hover:border-green-800 hover:bg-green-50 transition-all aspect-[3/4]"
                            >
                                <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                                    <span className="text-2xl text-gray-400">?</span>
                                </div>
                                <span className="font-bold text-center text-gray-600">{t('booking.any_barber')}</span>
                            </div>

                            {barbers.map(barber => (
                                <div
                                    key={barber.id}
                                    onClick={() => handleBarberSelect(barber.id)}
                                    className="cursor-pointer group relative overflow-hidden rounded-xl aspect-[3/4] shadow-md hover:shadow-xl transition-all"
                                >
                                    <img src={barber.img} alt={barber.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                                        <span className="text-white font-bold uppercase">{barber.name}</span>
                                        <span className="text-xs text-gray-300">{t(barber.roleKey)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Step 2: Date & Time */}
                    {step === 2 && (
                        <div className="max-w-xl mx-auto w-full space-y-8">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">{t('booking.select_date')}</label>
                                <input
                                    type="date"
                                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-800 focus:border-transparent outline-none"
                                    onChange={handleDateChange}
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </div>

                            {bookingData.date && (
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide">{t('booking.select_time')}</label>
                                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                                        {timeSlots.map(time => (
                                            <button
                                                key={time}
                                                onClick={() => handleTimeSelect(time)}
                                                className="py-2 px-1 rounded border border-gray-200 hover:bg-green-800 hover:text-white transition-colors text-sm font-medium"
                                            >
                                                {time}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <button onClick={() => setStep(1)} className="text-sm text-gray-500 hover:text-green-800 mt-4 underline">
                                &larr; Back
                            </button>
                        </div>
                    )}

                    {/* Step 3: Details */}
                    {step === 3 && (
                        <form onSubmit={handleSubmit} className="max-w-xl mx-auto w-full space-y-6">

                            {/* Service Selection */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">{t('booking.select_service')}</label>
                                <select
                                    name="service"
                                    required
                                    value={bookingData.service}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-800 outline-none appearance-none bg-white"
                                >
                                    <option value="" disabled>{t('booking.choose_service')}</option>
                                    {services.map(s => (
                                        <option key={s.id} value={s.id}>
                                            {t(s.name)} - €{s.price}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">{t('booking.name')}</label>
                                    <input required name="name" value={bookingData.name} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-800 outline-none" placeholder="Mario" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">{t('booking.surname')}</label>
                                    <input required name="surname" value={bookingData.surname} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-800 outline-none" placeholder="Rossi" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">{t('booking.phone')}</label>
                                    <input required name="phone" type="tel" value={bookingData.phone} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-800 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">{t('booking.email')}</label>
                                    <input required name="email" type="email" value={bookingData.email} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-800 outline-none" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">{t('booking.message')}</label>
                                <textarea name="message" value={bookingData.message} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-800 outline-none h-32"></textarea>
                            </div>

                            <div className="flex gap-4">
                                <button type="button" onClick={() => setStep(2)} className="w-1/3 py-4 border border-gray-300 rounded-lg font-bold text-gray-600 hover:bg-gray-50">
                                    Back
                                </button>
                                <button type="submit" className="w-2/3 py-4 bg-green-800 text-white rounded-lg font-bold hover:bg-green-700 transition-colors shadow-lg">
                                    {t('booking.submit')}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Step 4: Success */}
                    {step === 4 && (
                        <div className="flex flex-col items-center justify-center flex-1 text-center py-12">
                            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-8">
                                <svg className="w-12 h-12 text-green-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-3xl font-bold text-green-900 mb-4">{t('booking.success_title')}</h2>
                            <p className="text-gray-600 max-w-md mx-auto mb-12 text-lg">
                                {t('booking.success_message', {
                                    name: bookingData.name,
                                    barber: getBarberName(bookingData.barber),
                                    date: bookingData.date,
                                    time: bookingData.time
                                })}
                            </p>
                            <Link to="/" className="btn bg-gray-900 text-white hover:bg-black px-8 py-3 rounded-full font-bold uppercase tracking-widest">
                                {t('booking.back_home')}
                            </Link>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default BookingPage;
