import type { DatasetSectionProps } from "@type/widgetTypes";
import WidgetConfigSection from "@components/widgets/WidgetConfigSection";
import CollapsibleSection from "@components/widgets/CollapsibleSection";


export default function DatasetSection<T>({
    title,
    datasets,
    onDatasetsChange,
    renderDatasetContent,
    createNewDataset,
    getDatasetLabel,
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
        <WidgetConfigSection
            title={title}
            canAdd={true}
            onAdd={handleAddDataset}
            addButtonText="Ajouter un dataset"
        >
            <div className="space-y-3">
                {datasets.length === 0 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                        Aucun dataset configuré. Cliquez sur "Ajouter un dataset" pour commencer.
                    </p>
                )}
                {datasets.map((dataset, idx) => {
                    const canRemove = datasets.length > minDatasets;

                    return (
                        <CollapsibleSection

                            key={idx}
                            title={getDatasetLabel ? getDatasetLabel(dataset, idx) : `Dataset ${idx + 1}`}
                            hideSettings={!canRemove}
                            onDelete={() => canRemove && handleRemoveDataset(idx)}

                        >
                            {renderDatasetContent(dataset, idx, (updatedDataset) => handleUpdateDataset(idx, updatedDataset))}
                        </CollapsibleSection>
                    );
                })}
            </div>
        </WidgetConfigSection>
    );
}
