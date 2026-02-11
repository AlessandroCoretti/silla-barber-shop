import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { barbers } from '../data/barbers';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);

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

        fetch('http://localhost:8080/api/bookings')
            .then(res => res.json())
            .then(data => setBookings(data))
            .catch(err => console.error("Error fetching bookings:", err));
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('silla_admin_auth');
        navigate('/admin');
    };

    const handleDelete = async (id) => {
        if (window.confirm('Sei sicuro di voler eliminare questa prenotazione?')) {
            try {
                const response = await fetch(`http://localhost:8080/api/bookings/${id}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    setBookings(prev => prev.filter(b => b.id !== id));
                } else {
                    alert("Errore durante l'eliminazione");
                }
            } catch (error) {
                console.error("Error deleting:", error);
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
            </main>
        </div>
    );
};

export default AdminDashboard;
