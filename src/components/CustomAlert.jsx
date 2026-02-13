import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { X, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const CustomAlert = ({ isOpen, onClose, title, message, type = 'alert', onConfirm }) => {
    const overlayRef = useRef(null);
    const modalRef = useRef(null);
    const { t } = useTranslation();

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            if (isOpen) {
                gsap.to(overlayRef.current, { opacity: 1, duration: 0.3, pointerEvents: 'all' });
                gsap.fromTo(modalRef.current,
                    { scale: 0.8, opacity: 0 },
                    { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" }
                );
            } else {
                gsap.to(overlayRef.current, { opacity: 0, duration: 0.3, pointerEvents: 'none' });
                gsap.to(modalRef.current, { scale: 0.8, opacity: 0, duration: 0.3 });
            }
        }, [overlayRef, modalRef]);
        return () => ctx.revert();
    }, [isOpen]);

    if (!isOpen) return null;

    let Icon = Info;
    let iconColor = 'text-blue-500';
    let bgColor = 'bg-blue-50';

    if (type === 'success') {
        Icon = CheckCircle;
        iconColor = 'text-green-600';
        bgColor = 'bg-green-50';
    } else if (type === 'error') {
        Icon = AlertTriangle;
        iconColor = 'text-red-500';
        bgColor = 'bg-red-50';
    } else if (type === 'confirm') {
        Icon = Info;
        iconColor = 'text-green-800';
        bgColor = 'bg-green-50';
    }

    return (
        <div ref={overlayRef} className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm opacity-0 pointer-events-none">
            <div ref={modalRef} className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-sm w-[90%] relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-full h-2 ${type === 'error' ? 'bg-red-500' : 'bg-green-800'}`}></div>

                <div className="flex flex-col items-center text-center">
                    <div className={`w-16 h-16 rounded-full ${bgColor} flex items-center justify-center mb-4`}>
                        <Icon size={32} className={iconColor} />
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                        {message}
                    </p>

                    <div className="flex gap-3 w-full">
                        {type === 'confirm' ? (
                            <>
                                <button
                                    onClick={onClose}
                                    className="flex-1 py-3 border border-gray-300 rounded-lg text-gray-600 font-bold hover:bg-gray-50 transition-colors"
                                >
                                    {t('common.cancel', 'Annulla')}
                                </button>
                                <button
                                    onClick={() => { onConfirm && onConfirm(); onClose(); }}
                                    className="flex-1 py-3 bg-green-800 text-white rounded-lg font-bold hover:bg-green-700 transition-colors shadow-lg"
                                >
                                    {t('common.confirm', 'Conferma')}
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={onClose}
                                className="w-full py-3 bg-gray-900 text-white rounded-lg font-bold hover:bg-black transition-colors shadow-lg"
                            >
                                {t('common.close', 'Chiudi')}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomAlert;
