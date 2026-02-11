import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { barbers } from '../data/barbers';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [activeTab, setActiveTab] = useState('bookings'); // 'bookings', 'stats', 'manual'
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

    useEffect(() => {
        const isAuth = localStorage.getItem('silla_admin_auth');
        if (!isAuth) {
            navigate('/admin');
            return;
        }

        fetch('http://localhost:8081/api/bookings')
            .then(res => res.json())
            .then(data => {
                setBookings(data);
                calculateStats(data);
            })
            .catch(err => console.error("Error fetching bookings:", err));
    }, [navigate]);

    useEffect(() => {
        if (manualForm.date && manualForm.barber) {
            fetch(`http://localhost:8081/api/bookings/reserved?date=${manualForm.date}&barber=${manualForm.barber}`)
                .then(res => res.json())
                .then(data => {
                    setReservedTimes(data.map(b => b.time));
                })
                .catch(err => console.error("Error fetching reserved slots:", err));
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

        barbers.forEach(barber => {
            newStats[barber.id] = { daily: 0, weekly: 0, monthly: 0 };
        });

        data.forEach(booking => {
            if (!booking.date || !booking.price) return;

            const bookingDate = new Date(booking.date).getTime();
            const price = parseFloat(booking.price);

            if (newStats[booking.barber]) {
                if (bookingDate >= startOfDay) newStats[booking.barber].daily += price;
                if (bookingDate >= startOfWeek) newStats[booking.barber].weekly += price;
                if (bookingDate >= startOfMonth) newStats[booking.barber].monthly += price;
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
                const response = await fetch(`http://localhost:8081/api/bookings/${id}`, {
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

            const response = await fetch('http://localhost:8081/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingPayload)
            });

            if (response.ok) {
                alert('Prenotazione inserita!');
                const newBooking = await response.json();
                const updatedBookings = [newBooking, ...bookings];

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
                <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Silla Admin Dashboard</h1>
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
                <div className="flex space-x-4 mb-6">
                    <button onClick={() => setActiveTab('bookings')} className={`px-4 py-2 rounded-md font-medium ${activeTab === 'bookings' ? 'bg-gray-900 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>
                        Prenotazioni
                    </button>
                    <button onClick={() => setActiveTab('stats')} className={`px-4 py-2 rounded-md font-medium ${activeTab === 'stats' ? 'bg-gray-900 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>
                        Statistiche
                    </button>
                    <button onClick={() => setActiveTab('manual')} className={`px-4 py-2 rounded-md font-medium ${activeTab === 'manual' ? 'bg-gray-900 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>
                        Nuova Prenotazione
                    </button>
                </div>

                {activeTab === 'bookings' && (
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                Prenotazioni Recenti
                            </h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                Gestisci gli appuntamenti del salone.
                            </p>
                        </div>

                        {bookings.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                Nessuna prenotazione trovata.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
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
                                                Data & Ora
                                            </th>
                                            <th scope="col" className="relative px-6 py-3">
                                                <span className="sr-only">Delete</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {bookings.map((booking) => (
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
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <div className="font-bold text-gray-900">{booking.date}</div>
                                                    <div>{booking.time}</div>
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
                            </div>
                        )}
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
                            <div className="grid grid-cols-2 gap-4">
                                <select required className="p-2 border rounded" onChange={e => setManualForm({ ...manualForm, barber: e.target.value })}>
                                    <option value="">Seleziona Barbiere</option>
                                    {barbers.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                </select>
                                <select required className="p-2 border rounded" onChange={e => setManualForm({ ...manualForm, service: e.target.value })}>
                                    <option value="">Seleziona Servizio</option>
                                    {services.map(s => <option key={s.id} value={s.id}>{s.name} (€{s.price})</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
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
            </main>
        </div>
    );
};

export default AdminDashboard;
