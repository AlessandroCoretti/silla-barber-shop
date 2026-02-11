import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const LoginRegister = ({ onLoginSuccess }) => {
    const { t } = useTranslation();
    const [isLogin, setIsLogin] = useState(true);

    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        email: '',
        password: '',
        phone: ''
    });
    const [error, setError] = useState('');
    const [loggedInUser, setLoggedInUser] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
        const url = `http://localhost:8081${endpoint}`;

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                setLoggedInUser(data);
                onLoginSuccess(data);
            } else {
                setError(data.error || 'Autenticazione fallita');
            }
        } catch (err) {
            setError('Errore di connessione al server');
        }
    };



    const handleDelete = async () => {
        if (!window.confirm(t('Are you sure you want to delete your account? This action cannot be undone.'))) return;

        try {
            const response = await fetch(`http://localhost:8081/api/auth/${loggedInUser.id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                alert('Account eliminato con successo. Ci dispiace vederti andare via!');
                setLoggedInUser(null);
                setIsLogin(true);
                setFormData({ name: '', surname: '', email: '', password: '', phone: '' });
                // Optional: callback for logout to parent if needed
            } else {
                alert('Errore durante l\'eliminazione dell\'account');
            }
        } catch (error) {
            console.error(error);
            alert('Errore di connessione');
        }
    };

    if (loggedInUser) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 max-w-md mx-auto mt-8 text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Benvenuto, {loggedInUser.name}!</h3>
                <p className="text-gray-600 mb-6">I tuoi dati sono stati caricati nella prenotazione.</p>

                <button
                    onClick={handleDelete}
                    className="text-red-600 hover:text-red-800 text-sm font-bold underline"
                >
                    Elimina Account
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 max-w-md mx-auto mt-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                {isLogin ? 'Accedi per prenotare più velocemente' : 'Registrati'}
            </h3>

            {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                    <div className="grid grid-cols-2 gap-2">
                        <input
                            name="name"
                            placeholder={t('booking.name')}
                            onChange={handleChange}
                            required
                            className="p-2 border rounded w-full"
                        />
                        <input
                            name="surname"
                            placeholder={t('booking.surname')}
                            onChange={handleChange}
                            required
                            className="p-2 border rounded w-full"
                        />
                    </div>
                )}

                <input
                    name="email"
                    type="email"
                    placeholder={t('booking.email')}
                    onChange={handleChange}
                    required
                    className="p-2 border rounded w-full"
                />

                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    onChange={handleChange}
                    required
                    className="p-2 border rounded w-full"
                />

                {!isLogin && (
                    <input
                        name="phone"
                        type="tel"
                        placeholder={t('booking.phone')}
                        onChange={handleChange}
                        className="p-2 border rounded w-full"
                    />
                )}

                <button type="submit" className="w-full bg-gray-800 text-white py-2 rounded font-bold hover:bg-gray-700 transition">
                    {isLogin ? 'Accedi' : 'Registrati'}
                </button>
            </form>

            <div className="mt-4 text-center text-sm">
                <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-green-700 hover:underline"
                >
                    {isLogin ? 'Non hai un account? Registrati' : 'Hai già un account? Accedi'}
                </button>
            </div>
        </div>
    );
};

export default LoginRegister;
