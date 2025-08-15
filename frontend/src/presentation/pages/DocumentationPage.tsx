import { useParams, Navigate } from 'react-router-dom';
import DocumentationLayout from '@components/documentation/DocumentationLayout';
import MarkdownRenderer from '@components/documentation/MarkdownRenderer';
import { useState, useEffect } from 'react';

interface DocumentationContent {
    [key: string]: {
        [key: string]: {
            title: string;
            file: string;
        };
    };
}

const documentationContent: DocumentationContent = {
    'getting-started': {
        'introduction': {
            title: 'Introduction à Data Vise',
            file: '/docs/introduction.md'
        },
        'installation': {
            title: 'Installation et configuration',
            file: '/docs/installation.md'
        },
        'quick-start': {
            title: 'Guide de démarrage rapide',
            file: '/docs/quick-start.md'
        }
    },
    'data-sources': {
        'overview': {
            title: 'Gestion des sources de données',
            file: '/docs/data-sources/overview.md'
        }
    },
    'widgets': {
        'types': {
            title: 'Types de widgets',
            file: '/docs/widgets/types.md'
        }
    },
    'dashboards': {
        'creation': {
            title: 'Création et gestion des dashboards',
            file: '/docs/dashboards/creation.md'
        }
    },
    'sharing': {
        'overview': {
            title: 'Partage et collaboration',
            file: '/docs/sharing/overview.md'
        }
    },
    'user-management': {
        'overview': {
            title: 'Gestion des utilisateurs et rôles',
            file: '/docs/user-management/overview.md'
        }
    },
    'advanced': {
        'automation': {
            title: 'Configuration avancée et automatisation',
            file: '/docs/advanced/automation.md'
        }
    }
};

export default function DocumentationPage() {
    const { section, page } = useParams<{ section: string; page: string }>();
    const [currentContent, setCurrentContent] = useState<string>('');
    const [currentTitle, setCurrentTitle] = useState<string>('Documentation');
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const loadContent = async () => {
            setLoading(true);

            try {
                let filePath = '';
                let title = '';

                // Si on a section et page, chercher dans les sous-dossiers
                if (section && page) {
                    const contentInfo = documentationContent[section]?.[page];
                    if (contentInfo) {
                        filePath = contentInfo.file;
                        title = contentInfo.title;
                    }
                }
                // Si on a seulement section, essayer de trouver le fichier à la racine
                else if (section && !page) {
                    // Mapper les sections vers les fichiers à la racine
                    const rootFiles: Record<string, { file: string; title: string }> = {
                        'introduction': { file: '/docs/introduction.md', title: 'Introduction à Data Vise' },
                        'installation': { file: '/docs/installation.md', title: 'Installation et configuration' },
                        'quick-start': { file: '/docs/quick-start.md', title: 'Guide de démarrage rapide' }
                    };

                    if (rootFiles[section]) {
                        filePath = rootFiles[section].file;
                        title = rootFiles[section].title;
                    }
                }

                // Par défaut, charger l'introduction
                if (!filePath) {
                    filePath = '/docs/introduction.md';
                    title = 'Introduction à Data Vise';
                }

                const response = await fetch(filePath);
                if (!response.ok) {
                    throw new Error(`Erreur lors du chargement: ${response.status}`);
                }

                const content = await response.text();
                setCurrentContent(content);
                setCurrentTitle(title);
            } catch (error) {
                console.error('Erreur lors du chargement du contenu:', error);
                setCurrentContent('# Erreur\n\nImpossible de charger le contenu de la documentation.');
                setCurrentTitle('Erreur');
            } finally {
                setLoading(false);
            }
        };

        loadContent();
    }, [section, page]);

    // Redirection si aucun paramètre
    if (!section && !page) {
        return <Navigate to="/docs/introduction" replace />;
    }

    return (
        <DocumentationLayout title={currentTitle}>
            <div className="flex-1 p-8">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    </div>
                ) : (
                    <MarkdownRenderer content={currentContent} />
                )}
            </div>
        </DocumentationLayout>
    );
}
