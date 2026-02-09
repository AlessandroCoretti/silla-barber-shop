import React from 'react';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
    const { t } = useTranslation();

    return (
        <footer className="bg-[#0f2f1c] text-white py-16" id="contact">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between gap-12">

                    <div className="max-w-xs flex flex-col items-center text-center">
                        <img
                            src="/barberia-moderna.svg"
                            alt="Silla Barber Shop"
                            className="h-24 w-auto mb-6 brightness-0 invert"
                        />
                        <p className="text-gray-400 mb-6">
                            {t('hero.subtitle')}
                        </p>
                        <div className="flex gap-4 justify-center">
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-green-800 transition-colors">
                                <Instagram size={20} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-green-800 transition-colors">
                                <Facebook size={20} />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-green-800 transition-colors">
                                <Twitter size={20} />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-xl font-bold uppercase mb-6 text-white">{t('footer.contact')}</h4>
                        <ul className="space-y-4 text-gray-300">
                            <li className="flex items-start gap-3">
                                <span>Via Principe di Napoli, 50, 00062 Bracciano RM</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span>06 8916 7770</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span>info@sillabarber.com</span>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-xl font-bold uppercase mb-6 text-white">{t('footer.hours')}</h4>
                        <ul className="space-y-4 text-gray-300">
                            <li className="flex justification-between gap-8 border-b border-white/10 pb-2">
                                <span>{t('footer.monday')}</span>
                                <span>{t('footer.closed')}</span>
                            </li>
                            <li className="flex justification-between gap-8 border-b border-white/10 pb-2">
                                <span>{t('footer.tue_sat')}</span>
                                <span>{t('footer.hours_value')}</span>
                            </li>
                            <li className="flex justification-between gap-8 border-b border-white/10 pb-2">
                                <span>{t('footer.sunday')}</span>
                                <span>{t('footer.closed')}</span>
                            </li>
                        </ul>
                    </div>

                </div>

                <div className="mt-16 pt-8 border-t border-white/10 text-center text-gray-500 text-sm">
                    &copy; {new Date().getFullYear()} Silla Barber Shop. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
