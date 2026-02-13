import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { API_BASE_URL } from '../config';

const LoginRegister = ({ onLoginSuccess, showAlert }) => {
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
        const endpoint = isLogin ? '/auth/login' : '/auth/register';
        const url = `${API_BASE_URL}${endpoint}`;

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
                setError(data.error || t('auth.auth_failed'));
            }
        } catch (err) {
            setError(t('booking.connection_error'));
        }
    };

    const handleDelete = () => {
        if (!showAlert) {
            // Fallback if showAlert not provided
            if (!window.confirm(t('auth.delete_confirm_msg'))) return;
            executeDelete();
            return;
        }

        showAlert(
            t('auth.delete_confirm_title'),
            t('auth.delete_confirm_msg'),
            'confirm',
            executeDelete
        );
    };

    const executeDelete = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/${loggedInUser.id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                if (showAlert) {
                    showAlert(t('common.success'), t('auth.delete_success'), 'success');
                } else {
                    alert(t('auth.delete_success'));
                }
                setLoggedInUser(null);
                setIsLogin(true);
                setFormData({ name: '', surname: '', email: '', password: '', phone: '' });
                // Optional: callback for logout to parent if needed
            } else {
                if (showAlert) {
                    showAlert(t('common.error'), t('auth.delete_error'), 'error');
                } else {
                    alert(t('auth.delete_error'));
                }
            }
        } catch (error) {
            console.error(error);
            if (showAlert) {
                showAlert(t('common.error'), t('booking.connection_error'), 'error');
            } else {
                alert(t('booking.connection_error'));
            }
        }
    };

    if (loggedInUser) {
        return (
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 max-w-md mx-auto mt-8 text-center">
                <h3 className="text-xl font-bold text-gray-800 mb-4">{t('auth.welcome_user', { name: loggedInUser.name })}</h3>
                <p className="text-gray-600 mb-6">{t('auth.data_loaded')}</p>

                <button
                    onClick={handleDelete}
                    className="text-red-600 hover:text-red-800 text-sm font-bold underline"
                >
                    {t('auth.delete_account')}
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 max-w-md mx-auto mt-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                {isLogin ? t('auth.login_title') : t('auth.register_title')}
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
                    placeholder={t('auth.password_placeholder')}
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
                    {isLogin ? t('auth.login_btn') : t('auth.register_btn')}
                </button>
            </form>

            <div className="mt-4 text-center text-sm">
                <button
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-green-700 hover:underline"
                >
                    {isLogin ? t('auth.no_account') : t('auth.has_account')}
                </button>
            </div>
        </div>
    );
};

export default LoginRegister;
