import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';
// import { barbers } from '../data/barbers'; // Removed static import

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [activeTab, setActiveTab] = useState('bookings'); // 'bookings', 'stats', 'manual', 'dayoff'
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [manualForm, setManualForm] = useState({
        barber: '',
        service: '',
        date: '',
        time: '',
        name: '',
        surname: '',
        email: '',
        phone: '',
        price: 0
    });
    const [reservedTimes, setReservedTimes] = useState([]);
    const [stats, setStats] = useState({});
    const [barbers, setBarbers] = useState([]); // Dynamic barbers state

    // New State for Day Off Management
    const [daysOff, setDaysOff] = useState([]);
    const [dayOffForm, setDayOffForm] = useState({
        barberId: '',
        startDate: '',
        endDate: ''
    });

    const [newBarberForm, setNewBarberForm] = useState({
        name: '',
        roleKey: 'team.roles.barber',
        img: '',
        descriptionIt: '',
        descriptionEn: ''
    });
    const [showAddBarber, setShowAddBarber] = useState(false);

    const timeSlots = [
        "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
        "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00"
    ];

    const services = [
        { id: 'cut', name: 'Taglio Uomo', price: 30 },
        { id: 'beard', name: 'Rasatura Barba', price: 20 },
        { id: 'combo', name: 'Taglio + Barba', price: 45 },
        { id: 'kid', name: 'Taglio Bambino', price: 25 },
    ];

    const sortBookings = (data) => {
        return [...data].sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            if (dateA !== dateB) return dateA - dateB;
            return a.time.localeCompare(b.time);
        });
    };

    const getDailyAvailability = () => {
        const bookingsForDate = bookings.filter(b => b.date === selectedDate);
        return barbers.map(barber => {
            // Check if barber has a day off on the selected date
            const isDayOff = daysOff.some(d => d.barberId === barber.id && d.date === selectedDate);

            if (isDayOff) {
                return { ...barber, freeSlots: [], isDayOff: true };
            }

            const barberBookings = bookingsForDate.filter(b => b.barber === barber.id);
            const bookedTimes = barberBookings.map(b => b.time);
            const freeSlots = timeSlots.filter(time => !bookedTimes.includes(time));
            return { ...barber, freeSlots, isDayOff: false };
        });
    };

    useEffect(() => {
        const isAuth = localStorage.getItem('silla_admin_auth');
        if (!isAuth) {
            navigate('/admin');
            return;
        }

        // Fetch Bookings with Polling
        const fetchBookings = () => {
            fetch(`${API_BASE_URL}/bookings`)
                .then(res => res.json())
                .then(data => {
                    const sortedData = sortBookings(data);
                    setBookings(sortedData);
                    calculateStats(sortedData);
                })
                .catch(err => console.error("Error fetching bookings:", err));
        };

        // Fetch Barbers
        const fetchBarbers = () => {
            fetch(`${API_BASE_URL}/barbers`)
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) {
                        setBarbers(data);
                    } else {
                        console.error("Invalid barbers data:", data);
                        setBarbers([]);
                    }
                })
                .catch(err => console.error("Error fetching barbers:", err));
        };

        // Fetch Days Off
        const fetchDaysOff = () => {
            fetch(`${API_BASE_URL}/dayoffs`)
                .then(res => res.json())
                .then(data => {
                    if (Array.isArray(data)) {
                        setDaysOff(data);
                    }
                })
                .catch(err => console.error("Error fetching days off:", err));
        };

        fetchBookings(); // Initial fetch
        fetchBarbers(); // Initial fetch
        fetchDaysOff(); // Initial fetch

        const interval = setInterval(() => {
            fetchBookings();
            fetchDaysOff(); // Also poll days off
        }, 5000); // Poll every 5 seconds

        return () => clearInterval(interval); // Cleanup
    }, [navigate]);

    useEffect(() => {
        if (manualForm.date && manualForm.barber) {
            const fetchReserved = async () => {
                try {
                    const response = await fetch(`${API_BASE_URL}/bookings/reserved?date=${manualForm.date}&barber=${manualForm.barber}`);
                    if (response.ok) {
                        const data = await response.json();
                        if (Array.isArray(data)) {
                            setReservedTimes(data.map(b => b.time));
                        } else {
                            setReservedTimes([]);
                        }
                    } else {
                        console.error("Failed to fetch reserved slots");
                        setReservedTimes([]);
                    }
                } catch (error) {
                    console.error("Error fetching reserved slots:", error);
                    setReservedTimes([]);
                }
            };
            fetchReserved();
        } else {
            setReservedTimes([]);
        }
    }, [manualForm.date, manualForm.barber]);

    const calculateStats = (data) => {
        if (!Array.isArray(data)) return;

        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

        // Start of Week (Monday)
        const currentDay = now.getDay(); // 0=Sunday, 1=Monday...
        const distanceToMonday = currentDay === 0 ? 6 : currentDay - 1;
        const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - distanceToMonday).getTime();

        // Start of Month
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

        const newStats = {};

        // Initialize stats for each barber (using lowercase ID for matching)
        barbers.forEach(barber => {
            newStats[barber.id] = { daily: 0, weekly: 0, monthly: 0 };
        });

        data.forEach(booking => {
            if (!booking.date || !booking.price) return;

            // Robust Date Parsing: Convert UTC string (YYYY-MM-DD) to Local Midnight
            const dateParts = booking.date.split('-');
            const year = parseInt(dateParts[0]);
            const month = parseInt(dateParts[1]) - 1; // Months are 0-indexed
            const day = parseInt(dateParts[2]);

            const bookingDateLocal = new Date(year, month, day).getTime();
            const price = parseFloat(booking.price);

            // Normalize Barber ID comparison
            let barberId = booking.barber;
            // If the exact ID isn't found, try lowercase
            if (!newStats[barberId] && typeof barberId === 'string') {
                const lowerId = barberId.toLowerCase();
                // Check if any barber has this ID in lowercase (handling potential casing mismatch)
                const matchedBarber = barbers.find(b => b.id.toLowerCase() === lowerId);
                if (matchedBarber) {
                    barberId = matchedBarber.id;
                }
            }

            if (newStats[barberId]) {
                if (bookingDateLocal >= startOfDay) newStats[barberId].daily += price;
                if (bookingDateLocal >= startOfWeek) newStats[barberId].weekly += price;
                if (bookingDateLocal >= startOfMonth) newStats[barberId].monthly += price;
            } else {
                console.warn(`Barber ID mismatch for booking ${booking.id}: ${booking.barber}`);
            }
        });
        setStats(newStats);
    };

    const handleLogout = () => {
        localStorage.removeItem('silla_admin_auth');
        navigate('/admin');
    };

    const handleDelete = async (id) => {
        if (window.confirm('Sei sicuro di voler eliminare questa prenotazione?')) {
            try {
                const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    const updatedBookings = bookings.filter(b => b.id !== id);
                    setBookings(updatedBookings);
                    calculateStats(updatedBookings);
                } else {
                    alert("Errore durante l'eliminazione");
                }
            } catch (error) {
                console.error("Error deleting:", error);
            }
        }
    };

    const handleManualSubmit = async (e) => {
        e.preventDefault();
        try {
            const serviceObj = services.find(s => s.id === manualForm.service);
            const bookingPayload = { ...manualForm, price: serviceObj ? serviceObj.price : 0 };

            const response = await fetch(`${API_BASE_URL}/bookings`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingPayload)
            });

            if (response.ok) {
                alert('Prenotazione inserita!');
                const newBooking = await response.json();
                const updatedBookings = sortBookings([...bookings, newBooking]);

                setBookings(updatedBookings);
                calculateStats(updatedBookings);
                setManualForm({ barber: '', service: '', date: '', time: '', name: '', surname: '', email: '', phone: '', price: 0 });
                setActiveTab('bookings');
            } else {
                alert('Errore inserimento');
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleAddDayOff = async (e) => {
        e.preventDefault();
        if (!dayOffForm.barberId || !dayOffForm.startDate || !dayOffForm.endDate) {
            alert('Seleziona un barbiere e un intervallo di date.');
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/dayoffs`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dayOffForm)
            });

            if (response.ok) {
                alert('Giorni di ferie aggiunti con successo!');
                const newDaysOff = await response.json();
                setDaysOff(prev => [...prev, ...newDaysOff]);
                setDayOffForm({ barberId: '', startDate: '', endDate: '' }); // Reset form
            } else {
                alert('Errore durante l\'aggiunta dei giorni di ferie.');
            }
        } catch (error) {
            console.error("Error adding day off:", error);
        }
    };

    const handleDeleteDayOff = async (id) => {
        if (window.confirm('Sei sicuro di voler riattivare questo operatore per la data selezionata?')) {
            try {
                const response = await fetch(`${API_BASE_URL}/dayoffs/${id}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    setDaysOff(daysOff.filter(d => d.id !== id));
                } else {
                    alert("Errore durante la riattivazione");
                }
            } catch (error) {
                console.error("Error deleting day off:", error);
            }
        }
    };

    const handleAddBarber = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${API_BASE_URL}/barbers`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newBarberForm)
            });

            if (response.ok) {
                const newBarber = await response.json();
                setBarbers([...barbers, newBarber]);
                setNewBarberForm({ name: '', roleKey: 'team.roles.barber', img: '', descriptionIt: '', descriptionEn: '' });
                setShowAddBarber(false);
                alert('Barbiere aggiunto con successo!');
            } else {
                alert('Errore durante l\'aggiunta del barbiere.');
            }
        } catch (error) {
            console.error("Error adding barber:", error);
        }
    };

    const handleDeleteBarber = async (id, name) => {
        if (window.confirm(`Sei sicuro di voler eliminare ${name}? Questa azione è irreversibile.`)) {
            try {
                const response = await fetch(`${API_BASE_URL}/barbers/${id}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    setBarbers(barbers.filter(b => b.id !== id));
                } else {
                    alert("Errore durante l'eliminazione");
                }
            } catch (error) {
                console.error("Error deleting barber:", error);
            }
        }
    };

    const getBarberName = (id) => {
        if (!id) return 'Qualsiasi';
        const barber = barbers.find(b => b.id === id);
        return barber ? barber.name : id;
    };

    const getServiceName = (id) => {
        const service = services.find(s => s.id === id);
        return service ? service.name : id;
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Admin Header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight text-center sm:text-left">Silla Admin Dashboard</h1>
                    <button
                        onClick={handleLogout}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md font-medium text-sm transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Tabs */}
                <div className="flex space-x-2 mb-6 overflow-x-auto pb-2 sm:pb-0">
                    <button onClick={() => setActiveTab('bookings')} className={`px-4 py-2 rounded-md font-medium whitespace-nowrap ${activeTab === 'bookings' ? 'bg-gray-900 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>
                        Prenotazioni
                    </button>
                    <button onClick={() => setActiveTab('stats')} className={`px-4 py-2 rounded-md font-medium whitespace-nowrap ${activeTab === 'stats' ? 'bg-gray-900 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>
                        Statistiche
                    </button>
                    <button onClick={() => setActiveTab('manual')} className={`px-4 py-2 rounded-md font-medium whitespace-nowrap ${activeTab === 'manual' ? 'bg-gray-900 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>
                        Nuova Prenotazione
                    </button>
                    <button onClick={() => setActiveTab('operators')} className={`px-4 py-2 rounded-md font-medium whitespace-nowrap ${activeTab === 'operators' ? 'bg-gray-900 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>
                        Gestione Operatori
                    </button>
                </div>

                {activeTab === 'bookings' && (
                    <div className="space-y-6">
                        {/* Date Filter */}
                        <div className="bg-white shadow rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                            <label htmlFor="dateFilter" className="font-medium text-gray-700">Seleziona Data:</label>
                            <input
                                type="date"
                                id="dateFilter"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 p-2 border"
                            />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Bookings List */}
                            <div className="lg:col-span-2 bg-white shadow overflow-hidden sm:rounded-lg">
                                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                                        Prenotazioni del {new Date(selectedDate).toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' })}
                                    </h3>
                                    <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                        Gestisci gli appuntamenti per la data selezionata.
                                    </p>
                                </div>

                                {bookings.filter(b => b.date === selectedDate).length === 0 ? (
                                    <div className="p-8 text-center text-gray-500">
                                        Nessuna prenotazione per questa data.
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        {/* Desktop Table */}
                                        <table className="min-w-full divide-y divide-gray-200 hidden md:table">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Cliente
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Contatti
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Servizio
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Barbiere
                                                    </th>
                                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                        Ora
                                                    </th>
                                                    <th scope="col" className="relative px-6 py-3">
                                                        <span className="sr-only">Delete</span>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {bookings.filter(b => b.date === selectedDate).map((booking) => (
                                                    <tr key={booking.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div>
                                                                    <div className="text-sm font-medium text-gray-900">
                                                                        {booking.name} {booking.surname}
                                                                    </div>
                                                                    {booking.message && (
                                                                        <div className="text-xs text-gray-400 mt-1 max-w-[150px] truncate" title={booking.message}>
                                                                            Msg: {booking.message}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-900">{booking.phone}</div>
                                                            <div className="text-sm text-gray-500">{booking.email}</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="text-sm text-gray-900">{getServiceName(booking.service)}</div>
                                                            <div className="text-sm text-green-600 font-semibold">€{booking.price}</div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 uppercase">
                                                                {getBarberName(booking.barber)}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-bold">
                                                            {booking.time}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                            <button
                                                                onClick={() => handleDelete(booking.id)}
                                                                className="text-red-600 hover:text-red-900 font-bold"
                                                            >
                                                                Elimina
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>

                                        {/* Mobile Cards */}
                                        <div className="md:hidden space-y-4 p-4">
                                            {bookings.filter(b => b.date === selectedDate).map((booking) => (
                                                <div key={booking.id} className="bg-white p-4 border rounded-lg shadow-sm">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div>
                                                            <h4 className="text-lg font-bold text-gray-900">{booking.name} {booking.surname}</h4>
                                                            <p className="text-sm text-gray-500">Ore {booking.time}</p>
                                                        </div>
                                                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 uppercase">
                                                            {getBarberName(booking.barber)}
                                                        </span>
                                                    </div>

                                                    <div className="space-y-1 text-sm text-gray-700 mb-3">
                                                        <div className="flex justify-between">
                                                            <span>Servizio:</span>
                                                            <span className="font-medium">{getServiceName(booking.service)}</span>
                                                        </div>
                                                        <div className="flex justify-between">
                                                            <span>Prezzo:</span>
                                                            <span className="font-bold text-green-600">€{booking.price}</span>
                                                        </div>
                                                        {booking.phone && (
                                                            <div className="flex justify-between">
                                                                <span>Tel:</span>
                                                                <a href={`tel:${booking.phone}`} className="text-blue-600">{booking.phone}</a>
                                                            </div>
                                                        )}
                                                        {booking.message && (
                                                            <div className="text-xs text-gray-500 mt-2 bg-gray-50 p-2 rounded">
                                                                "{booking.message}"
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex justify-end pt-2 border-t">
                                                        <button
                                                            onClick={() => handleDelete(booking.id)}
                                                            className="text-red-600 hover:text-red-900 font-bold text-sm"
                                                        >
                                                            Elimina
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Daily Availability Sidebar */}
                            <div className="bg-white shadow rounded-lg p-6 h-fit">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Disponibilità {new Date(selectedDate).toLocaleDateString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit' })}</h3>
                                <div className="space-y-6">
                                    {getDailyAvailability().map(barber => (
                                        <div key={barber.id}>
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center space-x-3">
                                                    <img src={barber.img} alt={barber.name} className="w-8 h-8 rounded-full object-cover" />
                                                    <div>
                                                        <h4 className="font-medium text-gray-900">{barber.name}</h4>
                                                    </div>
                                                </div>
                                                {barber.isDayOff && (
                                                    <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-bold rounded-full border border-red-200">
                                                        IN FERIE
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {barber.isDayOff ? (
                                                    <span className="text-xs text-gray-500 italic block w-full">Il barbiere non è disponibile in questa data.</span>
                                                ) : (
                                                    barber.freeSlots.length > 0 ? (
                                                        barber.freeSlots.map(slot => (
                                                            <span key={slot} className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs border border-green-200">
                                                                {slot}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-xs text-red-500 font-medium">Nessuna disponibilità</span>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'stats' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {barbers.map(barber => (
                            <div key={barber.id} className="bg-white shadow rounded-lg p-6">
                                <div className="flex items-center space-x-4 mb-4">
                                    <img src={barber.img} alt={barber.name} className="w-12 h-12 rounded-full object-cover" />
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">{barber.name}</h3>
                                        <p className="text-sm text-gray-500">{getBarberName(barber.id)}</p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between border-b pb-2">
                                        <span className="text-gray-600">Oggi:</span>
                                        <span className="font-bold text-green-600">€{stats[barber.id]?.daily || 0}</span>
                                    </div>
                                    <div className="flex justify-between border-b pb-2">
                                        <span className="text-gray-600">Settimana:</span>
                                        <span className="font-bold text-green-600">€{stats[barber.id]?.weekly || 0}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Mese:</span>
                                        <span className="font-bold text-green-600">€{stats[barber.id]?.monthly || 0}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'manual' && (
                    <div className="bg-white shadow rounded-lg p-6 max-w-2xl mx-auto">
                        <h3 className="text-lg font-bold text-gray-900 mb-6">Inserisci Prenotazione Manuale</h3>
                        <form onSubmit={handleManualSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <select required className="p-2 border rounded" onChange={e => setManualForm({ ...manualForm, barber: e.target.value })}>
                                    <option value="">Seleziona Barbiere</option>
                                    {barbers.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                </select>
                                <select required className="p-2 border rounded" onChange={e => setManualForm({ ...manualForm, service: e.target.value })}>
                                    <option value="">Seleziona Servizio</option>
                                    {services.map(s => <option key={s.id} value={s.id}>{s.name} (€{s.price})</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <input type="date" required className="p-2 border rounded" onChange={e => setManualForm({ ...manualForm, date: e.target.value })} min={new Date().toISOString().split('T')[0]} />
                                <select required className="p-2 border rounded" value={manualForm.time} onChange={e => setManualForm({ ...manualForm, time: e.target.value })}>
                                    <option value="">Seleziona Orario</option>
                                    {timeSlots.map(slot => (
                                        <option key={slot} value={slot} disabled={reservedTimes.includes(slot)}>
                                            {slot} {reservedTimes.includes(slot) ? '(Occupato)' : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <input type="text" placeholder="Nome" required className="w-full p-2 border rounded" onChange={e => setManualForm({ ...manualForm, name: e.target.value })} />
                            <input type="text" placeholder="Cognome" required className="w-full p-2 border rounded" onChange={e => setManualForm({ ...manualForm, surname: e.target.value })} />
                            <input type="email" placeholder="Email" className="w-full p-2 border rounded" onChange={e => setManualForm({ ...manualForm, email: e.target.value })} />
                            <input type="tel" placeholder="Telefono" className="w-full p-2 border rounded" onChange={e => setManualForm({ ...manualForm, phone: e.target.value })} />
                            <button type="submit" className="w-full bg-green-800 text-white font-bold py-2 rounded hover:bg-green-700">Conferma Prenotazione</button>
                        </form>
                    </div>
                )}

                {activeTab === 'operators' && (
                    <div className="max-w-6xl mx-auto space-y-8">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <h3 className="text-xl font-bold text-gray-900">Gestione Operatori e Team</h3>
                                <p className="text-gray-500">Gestisci i membri del team e le loro ferie.</p>
                            </div>
                            <button
                                onClick={() => setShowAddBarber(!showAddBarber)}
                                className="px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-black transition-colors font-bold shadow-lg"
                            >
                                {showAddBarber ? 'Chiudi' : '+ Aggiungi Barbiere'}
                            </button>
                        </div>

                        {/* Add Barber Form */}
                        {showAddBarber && (
                            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mb-8 animate-fadeIn">
                                <h4 className="font-bold text-gray-800 mb-4">Nuovo Membro del Team</h4>
                                <form onSubmit={handleAddBarber} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Nome"
                                        required
                                        className="p-3 border rounded-lg"
                                        value={newBarberForm.name}
                                        onChange={e => setNewBarberForm({ ...newBarberForm, name: e.target.value })}
                                    />

                                    {/* Image Upload Input */}
                                    <div className="flex flex-col">
                                        <label className="text-sm text-gray-600 mb-1">Foto Profilo</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            required
                                            className="p-2 border rounded-lg bg-white"
                                            onChange={(e) => {
                                                const file = e.target.files[0];
                                                if (file) {
                                                    const reader = new FileReader();
                                                    reader.onloadend = () => {
                                                        setNewBarberForm({ ...newBarberForm, img: reader.result });
                                                    };
                                                    reader.readAsDataURL(file);
                                                }
                                            }}
                                        />
                                    </div>

                                    <select
                                        className="p-3 border rounded-lg"
                                        value={newBarberForm.roleKey}
                                        onChange={e => setNewBarberForm({ ...newBarberForm, roleKey: e.target.value })}
                                    >
                                        <option value="team.roles.head_barber">Head Barber</option>
                                        <option value="team.roles.stylist">Stylist</option>
                                        <option value="team.roles.barber">Barber</option>
                                        <option value="team.roles.junior">Junior Barber</option>
                                    </select>

                                    <textarea
                                        placeholder="Descrizione IT (es. specialità, esperienza...)"
                                        className="p-3 border rounded-lg md:col-span-2"
                                        rows="2"
                                        value={newBarberForm.descriptionIt || ''}
                                        onChange={e => setNewBarberForm({ ...newBarberForm, descriptionIt: e.target.value })}
                                    />

                                    <textarea
                                        placeholder="Descrizione EN (es. specialty, experience...)"
                                        className="p-3 border rounded-lg md:col-span-2"
                                        rows="2"
                                        value={newBarberForm.descriptionEn || ''}
                                        onChange={e => setNewBarberForm({ ...newBarberForm, descriptionEn: e.target.value })}
                                    />

                                    <button type="submit" className="bg-green-600 text-white font-bold p-3 rounded-lg hover:bg-green-700 md:col-span-2">
                                        Salva
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* Barber Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                            {barbers.map(barber => (
                                <div
                                    key={barber.id}
                                    className={`relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all overflow-hidden border-2 ${dayOffForm.barberId === barber.id ? 'border-indigo-600 ring-2 ring-indigo-200' : 'border-transparent'}`}
                                >
                                    <div
                                        className="aspect-square relative cursor-pointer"
                                        onClick={() => {
                                            setDayOffForm(prev => ({ ...prev, barberId: barber.id }));
                                        }}
                                    >
                                        <img src={barber.img} alt={barber.name} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                                            <h4 className="text-white font-bold text-lg">{barber.name}</h4>
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteBarber(barber.id, barber.name);
                                        }}
                                        className="absolute top-2 right-2 bg-black/40 backdrop-blur-sm text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-600 transition-all shadow-sm z-10"
                                        title="Elimina Barbiere"
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Date Selection Form (Visible when a barber is selected) */}
                        {dayOffForm.barberId && (
                            <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100 animate-fadeIn">
                                <h4 className="text-lg font-bold text-gray-900 mb-4">
                                    Imposta Ferie per <span className="text-indigo-600">{getBarberName(dayOffForm.barberId)}</span>
                                </h4>
                                <form onSubmit={handleAddDayOff} className="flex flex-col md:flex-row gap-4 items-end">
                                    <div className="w-full md:w-1/3">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Dal</label>
                                        <input
                                            type="date"
                                            required
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                            value={dayOffForm.startDate}
                                            onChange={e => setDayOffForm({ ...dayOffForm, startDate: e.target.value })}
                                            min={new Date().toISOString().split('T')[0]}
                                        />
                                    </div>
                                    <div className="w-full md:w-1/3">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Al</label>
                                        <input
                                            type="date"
                                            required
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                            value={dayOffForm.endDate}
                                            onChange={e => setDayOffForm({ ...dayOffForm, endDate: e.target.value })}
                                            min={dayOffForm.startDate || new Date().toISOString().split('T')[0]}
                                        />
                                    </div>
                                    <div className="flex gap-2 w-full md:w-auto">
                                        <button
                                            type="submit"
                                            className="flex-1 md:flex-none px-6 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors shadow-md"
                                        >
                                            Disattiva
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setDayOffForm({ barberId: '', startDate: '', endDate: '' })}
                                            className="px-4 py-3 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200 transition-colors"
                                        >
                                            Annulla
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* List of Days Off */}
                        <div className="bg-white shadow rounded-lg overflow-hidden mt-8">
                            <div className="px-4 py-5 sm:px-6 border-b border-gray-200 bg-gray-50">
                                <h3 className="text-lg leading-6 font-bold text-gray-900">
                                    Operatori Disattivati / In Ferie
                                </h3>
                            </div>
                            {daysOff.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">
                                    Nessuna disattivazione pianificata.
                                </div>
                            ) : (
                                <ul className="divide-y divide-gray-200 max-h-[400px] overflow-y-auto">
                                    {daysOff.sort((a, b) => new Date(a.date) - new Date(b.date)).map((day) => (
                                        <li key={day.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50 flex justify-between items-center transition duration-150 ease-in-out">
                                            <div className="flex items-center space-x-4">
                                                <img
                                                    src={barbers.find(b => b.id === day.barberId)?.img}
                                                    alt="Barber"
                                                    className="w-10 h-10 rounded-full object-cover border border-gray-200"
                                                />
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900">
                                                        {getBarberName(day.barberId)}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {new Date(day.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                                    </p>
                                                </div>
                                            </div>
                                            <div>
                                                <button
                                                    onClick={() => handleDeleteDayOff(day.id)}
                                                    className="text-red-500 hover:text-red-700 font-medium text-sm hover:underline"
                                                >
                                                    Riattiva
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;
