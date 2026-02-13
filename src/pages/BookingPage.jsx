import React, { useState, useLayoutEffect, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';
import gsap from 'gsap';
import LoginRegister from '../components/LoginRegister';
import CustomAlert from '../components/CustomAlert';
import { API_BASE_URL } from '../config';

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
    const [reservedTimes, setReservedTimes] = useState([]);
    const [dayOffs, setDayOffs] = useState([]);
    const [barbers, setBarbers] = useState([]); // Dynamic Barbers

    // Custom Alert State
    const [alertState, setAlertState] = useState({
        isOpen: false,
        title: '',
        message: '',
        type: 'alert', // alert, confirm, success, error
        onConfirm: null
    });

    const showAlert = (title, message, type = 'alert', onConfirm = null) => {
        setAlertState({ isOpen: true, title, message, type, onConfirm });
    };

    const closeAlert = () => {
        setAlertState(prev => ({ ...prev, isOpen: false }));
    };

    useEffect(() => {
        // Fetch Barbers
        fetch(`${API_BASE_URL}/barbers`)
            .then(res => res.json())
            .then(data => setBarbers(data))
            .catch(err => console.error("Error fetching barbers:", err));

        // Fetch Day Offs to filter barbers
        fetch(`${API_BASE_URL}/dayoffs`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setDayOffs(data);
                }
            })
            .catch(err => console.error("Error fetching day offs:", err));
    }, []);

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
            setStep(1);
        }
    }, [location.state]);

    useEffect(() => {
        if (bookingData.date && bookingData.barber) {
            fetch(`${API_BASE_URL}/bookings/reserved?date=${bookingData.date}&barber=${bookingData.barber}`)
                .then(res => res.json())
                .then(data => {
                    setReservedTimes(data.map(b => b.time));
                })
                .catch(err => console.error("Error fetching reserved slots:", err));
        } else {
            setReservedTimes([]);
        }
    }, [bookingData.date, bookingData.barber]);

    const handleBarberSelect = (barberId) => {
        setBookingData(prev => ({ ...prev, barber: barberId }));
        setStep(3); // Go to Time selection
    };

    const handleDateChange = (e) => {
        setBookingData(prev => ({ ...prev, date: e.target.value }));
    };

    const handleTimeSelect = (time) => {
        setBookingData(prev => ({ ...prev, time }));
        setStep(4); // Go to Details
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
            const response = await fetch(`${API_BASE_URL}/bookings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newBooking),
            });

            if (response.ok) {
                console.log("Booking Saved to Backend");
                setStep(5);
            } else {
                console.error("Failed to save booking");
                showAlert(t('common.error'), t('booking.save_error'), 'error');
            }
        } catch (error) {
            console.error("Error:", error);
            showAlert(t('common.error'), t('booking.connection_error'), 'error');
        }
    };

    const getBarberName = (id) => {
        if (!id) return t('booking.any_barber');
        const barber = barbers.find(b => b.id === id);
        return barber ? barber.name : id;
    };

    return (
        <div className="min-h-screen bg-gray-50 py-24 px-4" ref={pageRef}>
            <CustomAlert
                isOpen={alertState.isOpen}
                onClose={closeAlert}
                title={alertState.title}
                message={alertState.message}
                type={alertState.type}
                onConfirm={alertState.onConfirm}
            />

            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden min-h-[600px] flex flex-col">

                {/* Header */}
                <div className="bg-green-900 text-white p-8 text-center">
                    <h1 className="text-3xl font-bold uppercase tracking-wider">{t('booking.title')}</h1>
                    {step < 5 && (
                        <div className="flex justify-center flex-wrap gap-2 sm:gap-4 mt-4 text-xs sm:text-sm opacity-70">
                            <span className={step === 1 ? "text-white font-bold" : ""}>{t('booking.steps.date_service')}</span>
                            <span>&gt;</span>
                            <span className={step === 2 ? "text-white font-bold" : ""}>{t('booking.steps.barber')}</span>
                            <span>&gt;</span>
                            <span className={step === 3 ? "text-white font-bold" : ""}>{t('booking.steps.time')}</span>
                            <span>&gt;</span>
                            <span className={step === 4 ? "text-white font-bold" : ""}>{t('booking.steps.details')}</span>
                        </div>
                    )}
                </div>

                <div className="p-8 flex-1 flex flex-col">

                    {/* Step 1: Date & Service */}
                    {step === 1 && (
                        <div className="max-w-xl mx-auto w-full space-y-8 animate-fadeIn">
                            {/* Date Selection */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">{t('booking.select_date')}</label>
                                <input
                                    type="date"
                                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-800 focus:border-transparent outline-none"
                                    onChange={handleDateChange}
                                    value={bookingData.date}
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </div>

                            {/* Service Selection */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">{t('booking.select_service')}</label>
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

                            <button
                                onClick={() => setStep(2)}
                                disabled={!bookingData.date || !bookingData.service}
                                className={`w-full py-4 rounded-lg font-bold text-white transition-colors ${!bookingData.date || !bookingData.service ? 'bg-gray-300 cursor-not-allowed' : 'bg-green-800 hover:bg-green-700 shadow-lg'}`}
                            >
                                {t('booking.next')} &rarr;
                            </button>
                        </div>
                    )}

                    {/* Step 2: Barber Selection */}
                    {step === 2 && (
                        <div className="space-y-6 animate-fadeIn">
                            <h2 className="text-xl font-bold text-gray-800 text-center mb-6">{t('booking.select_barber')} - {new Date(bookingData.date).toLocaleDateString()}</h2>
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

                                {barbers
                                    .filter(b => !dayOffs.some(d => d.barberId === b.id && d.date === bookingData.date)) // Filter out barbers on holiday
                                    .map(barber => (
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

                            {barbers.every(b => dayOffs.some(d => d.barberId === b.id && d.date === bookingData.date)) && (
                                <div className="text-center text-red-500 font-bold py-8">
                                    {t('booking.fully_booked_day')}
                                </div>
                            )}

                            <button onClick={() => setStep(1)} className="text-sm text-gray-500 hover:text-green-800 mt-4 underline w-full text-center">
                                &larr; {t('booking.back')}
                            </button>
                        </div>
                    )}

                    {/* Step 3: Time Selection */}
                    {step === 3 && (
                        <div className="max-w-xl mx-auto w-full space-y-8 animate-fadeIn">
                            <div className="text-center mb-6">
                                <h2 className="text-xl font-bold text-gray-800">{t('booking.select_time')}</h2>
                                <p className="text-gray-500">{bookingData.date} - {getBarberName(bookingData.barber)}</p>
                            </div>

                            <div>
                                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                                    {timeSlots.map(time => {
                                        const isReserved = reservedTimes.includes(time);
                                        return (
                                            <button
                                                key={time}
                                                disabled={isReserved}
                                                onClick={() => handleTimeSelect(time)}
                                                className={`py-2 px-1 rounded border transition-colors text-sm font-medium
                                                        ${isReserved
                                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-100'
                                                        : 'border-gray-200 hover:bg-green-800 hover:text-white'
                                                    }`}
                                            >
                                                {time}
                                            </button>
                                        );
                                    })}
                                </div>
                                {timeSlots.every(t => reservedTimes.includes(t)) && (
                                    <p className="text-red-500 text-sm mt-2 font-bold text-center">
                                        {t('booking.fully_booked')}
                                    </p>
                                )}
                            </div>

                            <button onClick={() => setStep(2)} className="text-sm text-gray-500 hover:text-green-800 mt-4 underline w-full text-center">
                                &larr; {t('booking.back')}
                            </button>
                        </div>
                    )}

                    {/* Step 4: Details */}
                    {step === 4 && (
                        <div className="animate-fadeIn">
                            <div className="mb-6 text-center">
                                <h2 className="text-xl font-bold text-gray-800">{t('booking.your_details')}</h2>
                                <p className="text-sm text-gray-500">
                                    {t('booking.chosen_summary')} {getBarberName(bookingData.barber)} | {bookingData.date} @ {bookingData.time} | {t(services.find(s => s.id === bookingData.service)?.name)}
                                </p>
                            </div>

                            {/* Login Section */}
                            <div className="mb-8 border-b pb-6">
                                <LoginRegister
                                    onLoginSuccess={(user) => {
                                        setBookingData(prev => ({
                                            ...prev,
                                            name: user.name,
                                            surname: user.surname,
                                            email: user.email,
                                            phone: user.phone || ''
                                        }));
                                        // Use custom alert instead of window.alert
                                        showAlert(
                                            t('common.success'),
                                            t('auth.welcome_user', { name: user.name }) + ' ' + t('auth.data_loaded'),
                                            'success'
                                        );
                                    }}
                                    showAlert={showAlert} // Pass showAlert to child
                                />
                            </div>

                            <form onSubmit={handleSubmit} className="max-w-xl mx-auto w-full space-y-6">

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
                                    <button type="button" onClick={() => setStep(3)} className="w-1/3 py-4 border border-gray-300 rounded-lg font-bold text-gray-600 hover:bg-gray-50">
                                        {t('booking.back')}
                                    </button>
                                    <button type="submit" className="w-2/3 py-4 bg-green-800 text-white rounded-lg font-bold hover:bg-green-700 transition-colors shadow-lg">
                                        {t('booking.submit')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Step 5: Success (previously 4) */}
                    {step === 5 && (
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
