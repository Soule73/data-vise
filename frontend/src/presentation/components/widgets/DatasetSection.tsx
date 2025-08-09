import type { DatasetSectionProps } from "@type/widget-types";
import { XMarkIcon, PlusCircleIcon, ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";


export default function DatasetSection<T>({
    title,
    datasets,
    onDatasetsChange,
    renderDatasetContent,
    createNewDataset,
    getDatasetLabel,
    collapsible = false,
    collapsedState = {},
    onToggleCollapse,
    minDatasets = 1,
}: DatasetSectionProps<T>) {

    const handleRemoveDataset = (index: number) => {
        if (datasets.length <= minDatasets) return;
        const newDatasets = datasets.filter((_, i) => i !== index);
        onDatasetsChange(newDatasets);
    };

    const handleAddDataset = () => {
        const newDataset = createNewDataset();
        onDatasetsChange([...datasets, newDataset]);
    };

    const handleUpdateDataset = (index: number, updatedDataset: T) => {
        const newDatasets = [...datasets];
        newDatasets[index] = updatedDataset;
        onDatasetsChange(newDatasets);
    };

    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">{title}</h3>
            <div className="space-y-3">
                {datasets.map((dataset, idx) => {
                    const isCollapsed = collapsedState[idx] || false;
                    const canRemove = datasets.length > minDatasets;

                    return (
                        <div
                            key={idx}
                            className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3"
                        >
                            <div className="flex gap-2 items-center mb-3">
                                {collapsible && onToggleCollapse && (
                                    <button
                                        type="button"
                                        className="p-1.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition-colors"
                                        onClick={() => onToggleCollapse(idx)}
                                        aria-label={isCollapsed ? "Déplier" : "Replier"}
                                    >
                                        {isCollapsed ? (
                                            <ChevronDownIcon className="w-4 h-4" />
                                        ) : (
                                            <ChevronUpIcon className="w-4 h-4" />
                                        )}
                                    </button>
                                )}

                                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                                    {getDatasetLabel ? getDatasetLabel(dataset, idx) : `Dataset ${idx + 1}`}
                                </h4>

                                {canRemove && (
                                    <button
                                        className="ml-auto p-1.5 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-md transition-colors"
                                        onClick={() => handleRemoveDataset(idx)}
                                        title="Supprimer ce dataset"
                                    >
                                        <XMarkIcon className="w-4 h-4 text-red-500" />
                                    </button>
                                )}
                            </div>

                            {(!collapsible || !isCollapsed) && (
                                <div>
                                    {renderDatasetContent(dataset, idx, (updatedDataset) => handleUpdateDataset(idx, updatedDataset))}
                                </div>
                            )}
                        </div>
                    );
                })}

                <button
                    className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/40 transition-colors inline-flex items-center mx-auto mt-3"
                    onClick={handleAddDataset}
                >
                    <PlusCircleIcon className="w-4 h-4 mr-2" />
                    Ajouter un dataset
                </button>
            </div>
        </div>
    );
}
