import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
    ChevronDownIcon,
    ChevronRightIcon,
    DocumentTextIcon,
    CogIcon,
    ChartBarIcon,
    CircleStackIcon,
    UsersIcon,
    ShareIcon,
    PlayIcon
} from '@heroicons/react/24/outline';

interface DocSection {
    id: string;
    title: string;
    icon: React.ComponentType<{ className?: string }>;
    items: DocItem[];
}

interface DocItem {
    id: string;
    title: string;
    path: string;
}

const docSections: DocSection[] = [
    {
        id: 'getting-started',
        title: 'Prise en main',
        icon: PlayIcon,
        items: [
            { id: 'introduction', title: 'Introduction', path: '/docs/introduction' },
            { id: 'installation', title: 'Installation', path: '/docs/installation' },
            { id: 'quick-start', title: 'Guide rapide', path: '/docs/quick-start' },
        ]
    },
    {
        id: 'data-sources',
        title: 'Sources de données',
        icon: CircleStackIcon,
        items: [
            { id: 'overview', title: 'Vue d\'ensemble', path: '/docs/data-sources/overview' },
        ]
    },
    {
        id: 'widgets',
        title: 'Widgets & Visualisations',
        icon: ChartBarIcon,
        items: [
            { id: 'types', title: 'Types de widgets', path: '/docs/widgets/types' },
        ]
    },
    {
        id: 'dashboards',
        title: 'Dashboards',
        icon: DocumentTextIcon,
        items: [
            { id: 'creation', title: 'Création', path: '/docs/dashboards/creation' },
        ]
    },
    {
        id: 'sharing',
        title: 'Partage & Collaboration',
        icon: ShareIcon,
        items: [
            { id: 'overview', title: 'Vue d\'ensemble', path: '/docs/sharing/overview' },
        ]
    },
    {
        id: 'user-management',
        title: 'Gestion des utilisateurs',
        icon: UsersIcon,
        items: [
            { id: 'overview', title: 'Vue d\'ensemble', path: '/docs/user-management/overview' },
        ]
    },
    {
        id: 'advanced',
        title: 'Configuration avancée',
        icon: CogIcon,
        items: [
            { id: 'automation', title: 'Automatisation', path: '/docs/advanced/automation' },
        ]
    }
];

export default function DocumentationSidebar() {
    const { section, page } = useParams<{ section: string; page: string }>();
    const [expandedSections, setExpandedSections] = useState<string[]>([section || 'getting-started']);

    const toggleSection = (sectionId: string) => {
        setExpandedSections(prev =>
            prev.includes(sectionId)
                ? prev.filter(id => id !== sectionId)
                : [...prev, sectionId]
        );
    };

    const isItemActive = (itemPath: string) => {
        if (section && page) {
            return itemPath === `/docs/${section}/${page}`;
        } else if (section && !page) {
            return itemPath === `/docs/${section}`;
        }
        return false;
    };

    const isSectionActive = (sectionData: DocSection) =>
        sectionData.items.some(item => isItemActive(item.path));

    return (
        <div className="h-full bg-white dark:bg-gray-900 overflow-y-auto">
            <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Documentation
                </h2>

                <nav className="space-y-2">
                    {docSections.map((sectionData) => {
                        const isExpanded = expandedSections.includes(sectionData.id);
                        const isActive = isSectionActive(sectionData);
                        const Icon = sectionData.icon;

                        return (
                            <div key={sectionData.id}>
                                <button
                                    onClick={() => toggleSection(sectionData.id)}
                                    className={`w-full flex items-center justify-between p-2 text-left rounded-lg transition-colors ${isActive
                                        ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                                        }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <Icon className="w-5 h-5" />
                                        <span className="text-sm font-medium">
                                            {sectionData.title}
                                        </span>
                                    </div>
                                    {isExpanded ? (
                                        <ChevronDownIcon className="w-4 h-4" />
                                    ) : (
                                        <ChevronRightIcon className="w-4 h-4" />
                                    )}
                                </button>

                                {isExpanded && (
                                    <div className="ml-6 mt-1 space-y-1">
                                        {sectionData.items.map((item) => (
                                            <Link
                                                key={item.id}
                                                to={item.path}
                                                className={`block p-2 text-sm rounded-lg transition-colors ${isItemActive(item.path)
                                                    ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border-l-2 border-indigo-500'
                                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200'
                                                    }`}
                                            >
                                                {item.title}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}
