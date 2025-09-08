import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    ChartBarIcon,
    BoltIcon,
    ShieldCheckIcon,
    UsersIcon,
    ArrowRightIcon,
    CheckIcon,
    StarIcon
} from '@heroicons/react/24/outline';
import LandingNavbar from '@components/navigation/LandingNavbar';
import logoDataVise from "@assets/logo-datavise.svg";

// Hero Section
function HeroSection() {
    return (
        <div className="relative bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 overflow-hidden">
            <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
                <div className="text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 select-text">
                        Transformez vos données en
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                            insights puissants
                        </span>
                    </h1>
                    <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto select-text">
                        Data Vise est la plateforme de visualisation de données moderne qui vous permet de créer
                        des tableaux de bord interactifs et de prendre des décisions éclairées en temps réel.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/register"
                            className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-8 py-4 rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg"
                        >
                            Commencer gratuitement
                            <ArrowRightIcon className="w-5 h-5" />
                        </Link>
                        <Link
                            to="/login"
                            className="border-2 border-white/30 text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-all duration-200"
                        >
                            Se connecter
                        </Link>
                    </div>
                </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <svg className="absolute top-10 left-10 w-20 h-20 text-blue-400/20" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <svg className="absolute top-20 right-20 w-16 h-16 text-purple-400/20" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                    <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
                </svg>
            </div>
        </div>
    );
}

// Features Section
function FeaturesSection() {
    const features = [
        {
            icon: ChartBarIcon,
            title: "Visualisations avancées",
            description: "Créez des graphiques interactifs avec Chart.js, tableaux dynamiques et indicateurs KPI personnalisés."
        },
        {
            icon: BoltIcon,
            title: "Temps réel",
            description: "Surveillez vos données en temps réel avec des mises à jour automatiques et des alertes intelligentes."
        },
        {
            icon: ShieldCheckIcon,
            title: "Sécurisé",
            description: "Authentification robuste, gestion des permissions et chiffrement des données sensibles."
        },
        {
            icon: UsersIcon,
            title: "Collaboration",
            description: "Partagez vos tableaux de bord, collaborez en équipe et exportez vos rapports facilement."
        }
    ];

    return (
        <div id="features" className="py-24 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Pourquoi choisir Data Vise ?
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        Une plateforme complète pour transformer vos données en insights actionnables
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200">
                            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                                <feature.icon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Screenshots Section
function ScreenshotsSection() {
    return (
        <div className="py-24 bg-white dark:bg-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Interface moderne et intuitive
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300">
                        Découvrez la puissance de Data Vise en action
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            Tableaux de bord personnalisables
                        </h3>
                        <ul className="space-y-3 mb-6">
                            <li className="flex items-center gap-3">
                                <CheckIcon className="w-5 h-5 text-green-500" />
                                <span className="text-gray-600 dark:text-gray-300">Drag & drop intuitif</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <CheckIcon className="w-5 h-5 text-green-500" />
                                <span className="text-gray-600 dark:text-gray-300">Redimensionnement en temps réel</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <CheckIcon className="w-5 h-5 text-green-500" />
                                <span className="text-gray-600 dark:text-gray-300">Thème sombre/clair</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <CheckIcon className="w-5 h-5 text-green-500" />
                                <span className="text-gray-600 dark:text-gray-300">Export PDF</span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-xl p-8 shadow-2xl">
                        <div className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow-lg">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                <div className="text-sm text-gray-500 ml-4">Data Vise Dashboard</div>
                            </div>
                            <div className="space-y-3">
                                <div className="bg-gradient-to-r from-blue-400 to-purple-500 h-20 rounded-lg"></div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-gradient-to-r from-green-400 to-blue-500 h-16 rounded-lg"></div>
                                    <div className="bg-gradient-to-r from-purple-400 to-pink-500 h-16 rounded-lg"></div>
                                </div>
                                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-12 rounded-lg"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Pricing Section
function PricingSection() {
    const plans = [
        {
            name: "Gratuit",
            price: "0€",
            period: "/mois",
            description: "Parfait pour commencer",
            features: [
                "Jusqu'à 3 tableaux de bord",
                "5 sources de données",
                "Visualisations de base",
                "Support communautaire"
            ],
            cta: "Commencer",
            popular: false
        },
        {
            name: "Pro",
            price: "29€",
            period: "/mois",
            description: "Pour les équipes en croissance",
            features: [
                "Tableaux de bord illimités",
                "Sources de données illimitées",
                "Toutes les visualisations",
                "Collaboration en équipe",
                "Export avancé",
                "Support prioritaire"
            ],
            cta: "Essayer gratuitement",
            popular: true
        },
        {
            name: "Enterprise",
            price: "Sur mesure",
            period: "",
            description: "Pour les grandes organisations",
            features: [
                "Tout de Pro",
                "Déploiement on-premise",
                "SSO et sécurité avancée",
                "Support dédié",
                "Formation sur site"
            ],
            cta: "Nous contacter",
            popular: false
        }
    ];

    return (
        <div id="pricing" className="py-24 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Tarifs simples et transparents
                    </h2>
                    <p className="text-xl text-gray-600 dark:text-gray-300">
                        Choisissez le plan qui correspond à vos besoins
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200 p-8 relative ${plan.popular ? 'ring-2 ring-indigo-500 scale-105' : ''
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                    <span className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                                        <StarIcon className="w-4 h-4" />
                                        Plus populaire
                                    </span>
                                </div>
                            )}

                            <div className="text-center mb-6">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                    {plan.name}
                                </h3>
                                <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
                                    {plan.price}
                                    <span className="text-lg text-gray-500">{plan.period}</span>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300">{plan.description}</p>
                            </div>

                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feature, featureIndex) => (
                                    <li key={featureIndex} className="flex items-center gap-3">
                                        <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0" />
                                        <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button
                                className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors duration-200 ${plan.popular
                                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                                    }`}
                            >
                                {plan.cta}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Contact Section
function ContactSection() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission
        console.log('Form submitted:', formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div id="contact" className="py-24 bg-white dark:bg-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                            Prêt à transformer vos données ?
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                            Contactez-nous pour une démonstration personnalisée ou pour toute question sur Data Vise.
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="bg-indigo-100 dark:bg-indigo-900 p-3 rounded-lg">
                                    <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white">Email</h3>
                                    <p className="text-gray-600 dark:text-gray-300">contact@data-vise.com</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="bg-indigo-100 dark:bg-indigo-900 p-3 rounded-lg">
                                    <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white">Réponse rapide</h3>
                                    <p className="text-gray-600 dark:text-gray-300">Sous 24h en moyenne</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-xl">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Nom complet
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Email professionnel
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={4}
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                                    placeholder="Parlez-nous de vos besoins..."
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-700 transition-colors duration-200"
                            >
                                Envoyer le message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Footer
function Footer() {
    return (
        <footer className="bg-gray-900 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-2">
                        <div className="flex items-center gap-3 mb-4">
                            <img
                                src={logoDataVise}
                                alt="Logo DataVise"
                                style={{ minWidth: 40 }}
                            />
                        </div>
                        <p className="text-gray-400 mb-6 max-w-md">
                            La plateforme de visualisation de données moderne pour transformer vos insights en actions concrètes.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                                </svg>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-white transition-colors">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Produit</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="#" className="hover:text-white transition-colors">Fonctionnalités</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Tarifs</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Support</h3>
                        <ul className="space-y-2 text-gray-400">
                            <li><a href="#" className="hover:text-white transition-colors">Centre d'aide</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Statut</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Sécurité</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
                    <p>&copy; 2025 Data Vise. Tous droits réservés.</p>
                </div>
            </div>
        </footer>
    );
}

// Main Landing Page Component
export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-900">
            <LandingNavbar />
            <div className="pt-16"> {/* Offset for fixed navbar */}
                <HeroSection />
                <FeaturesSection />
                <ScreenshotsSection />
                <PricingSection />
                <ContactSection />
                <Footer />
            </div>
        </div>
    );
}
