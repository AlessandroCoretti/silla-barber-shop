import React from 'react';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
    const { t } = useTranslation();

    return (
        <footer className="bg-[#0f2f1c] text-white py-16" id="contact">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between gap-12">

                    <div className="max-w-xs">
                        <h3 className="text-3xl font-heading uppercase mb-6">Silla Barber Shop</h3>
                        <p className="text-gray-400 mb-6">
                            {t('hero.subtitle')}
                        </p>
                        <div className="flex gap-4">
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
                        <h4 className="text-xl font-bold uppercase mb-6 text-green-500">{t('footer.contact')}</h4>
                        <ul className="space-y-4 text-gray-300">
                            <li className="flex items-start gap-3">
                                <span>123 Barber Street, Milan</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span>+39 02 123 4567</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span>info@sillabarber.com</span>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-xl font-bold uppercase mb-6 text-green-500">{t('footer.hours')}</h4>
                        <ul className="space-y-4 text-gray-300">
                            <li className="flex justification-between gap-8 border-b border-white/10 pb-2">
                                <span>{t('footer.mon_sat')}</span>
                                <span>09:00 - 20:00</span>
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
