import type { ReactNode } from 'react';
import DocumentationSidebar from '@components/documentation/DocumentationSidebar';
import { Link } from 'react-router-dom';
import {
    //  HomeIcon, 
    ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { ROUTES } from '@constants/routes';
import logoDataVise from "@assets/logo-datavise.svg";

interface DocumentationLayoutProps {
    children: ReactNode;
    title?: string;
    description?: string;
}

export default function DocumentationLayout({
    children,
    title = 'Documentation',
    description = 'Guide complet d\'utilisation de Data Vise'
}: DocumentationLayoutProps) {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header fixe */}
            <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 fixed top-0 left-0 right-0 z-40">
                <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link to={ROUTES.home} className="flex items-center gap-2">
                                <img
                                    src={logoDataVise}
                                    alt="Logo DataVise"
                                    style={{ minWidth: 40 }}
                                />
                            </Link>

                            {/* <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                <Link to={ROUTES.home} className="hover:text-indigo-600 dark:hover:text-indigo-400">
                                    <HomeIcon className="w-4 h-4" />
                                </Link>
                                <span>/</span>
                                <span className="text-gray-700 dark:text-gray-300">Documentation</span>
                            </nav> */}
                        </div>

                        <div className="flex items-center gap-4">
                            <Link
                                to={ROUTES.home}
                                className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                            >
                                <ArrowLeftIcon className="w-4 h-4" />
                                Retour à l'accueil
                            </Link>
                            <Link
                                to={ROUTES.login}
                                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                Se connecter
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Layout principal avec sidebar fixe */}
            <div className="pt-20 flex"> {/* pt-20 pour compenser le header fixe */}
                {/* Sidebar fixe */}
                <aside className="fixed top-20 left-0 h-[calc(100vh-5rem)] w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto z-30">
                    <DocumentationSidebar />
                </aside>

                {/* Contenu principal avec marge pour la sidebar */}
                <main className="flex-1 ml-64 min-w-0">
                    <div className="max-w-4xl mx-auto px-6 py-8">
                        {/* En-tête de page */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                {title}
                            </h1>
                            <p className="text-lg text-gray-600 dark:text-gray-300">
                                {description}
                            </p>
                        </div>

                        {/* Contenu */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
                            {children}
                        </div>

                        {/* Footer */}
                        <footer className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    © 2025 Data Vise. Documentation mise à jour régulièrement.
                                </p>
                                <div className="flex gap-4 text-sm">
                                    <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                                        Signaler une erreur
                                    </a>
                                    <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                                        Contribuer
                                    </a>
                                    <a href="#" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                                        Support
                                    </a>
                                </div>
                            </div>
                        </footer>
                    </div>
                </main>
            </div>
        </div>
    );
}
