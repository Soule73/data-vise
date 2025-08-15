import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { ROUTES } from '@constants/routes';
import logoDataVise from "@assets/logo-datavise.svg";

export default function LandingNavbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to={ROUTES.home} className="flex items-center gap-3">
                        <img
                            src={logoDataVise}
                            alt="Logo DataVise"
                            style={{ minWidth: 40 }}
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                            Fonctionnalités
                        </a>
                        <Link to={ROUTES.docs} className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                            Documentation
                        </Link>
                        <a href="#pricing" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                            Tarifs
                        </a>
                        <a href="#contact" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                            Contact
                        </a>
                        <div className="flex items-center space-x-4">
                            <Link
                                to={ROUTES.login}
                                className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                            >
                                Se connecter
                            </Link>
                            <Link
                                to={ROUTES.register}
                                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-colors font-medium"
                            >
                                Commencer
                            </Link>
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                        >
                            {mobileMenuOpen ? (
                                <XMarkIcon className="w-6 h-6" />
                            ) : (
                                <Bars3Icon className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="space-y-4">
                            <a
                                href="#features"
                                className="block text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Fonctionnalités
                            </a>
                            <Link
                                to={ROUTES.docs}
                                className="block text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Documentation
                            </Link>
                            <a
                                href="#pricing"
                                className="block text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Tarifs
                            </a>
                            <a
                                href="#contact"
                                className="block text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Contact
                            </a>
                            <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
                                <Link
                                    to={ROUTES.login}
                                    className="block text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Se connecter
                                </Link>
                                <Link
                                    to={ROUTES.register}
                                    className="block bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-colors font-medium text-center"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Commencer
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
