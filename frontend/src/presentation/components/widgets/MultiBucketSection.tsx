import BucketConfigComponent from "@components/widgets/BucketConfigComponent";
import type { MultiBucketConfig, MultiBucketSectionProps } from "@type/metricBucketTypes";
import { createDefaultBucket } from "@utils/bucketMetrics/bucketUtils";
import WidgetConfigSection from "@components/widgets/WidgetConfigSection";


export default function MultiBucketSection({
    buckets,
    columns,
    data,
    allowMultiple = true,
    sectionLabel = "Buckets",
    onBucketsChange,
}: MultiBucketSectionProps) {

    const handleBucketUpdate = (index: number, updatedBucket: MultiBucketConfig) => {
        const newBuckets = [...buckets];
        newBuckets[index] = updatedBucket;
        onBucketsChange(newBuckets);
    };

    const handleBucketDelete = (index: number) => {
        const newBuckets = buckets.filter((_, i) => i !== index);
        onBucketsChange(newBuckets);
    };

    const handleBucketMove = (fromIndex: number, toIndex: number) => {
        if (toIndex < 0 || toIndex >= buckets.length) return;

        const newBuckets = [...buckets];
        const [movedBucket] = newBuckets.splice(fromIndex, 1);
        newBuckets.splice(toIndex, 0, movedBucket);
        onBucketsChange(newBuckets);
    };

    const addBucket = () => {
        const newBucket = createDefaultBucket('terms', columns[0] || '');
        onBucketsChange([...buckets, newBucket]);
    };

    const isOnlyBucket = buckets.length === 1;

    return (
        <WidgetConfigSection
            title={sectionLabel}
            addButtonText="Ajouter un bucket"
            canAdd={allowMultiple}
            onAdd={addBucket}
        >
            {buckets.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                    Aucun bucket configuré. Cliquez sur "Ajouter un bucket" pour commencer.
                </p>
            ) : (
                <div className="space-y-3">
                    {buckets.map((bucket, index) => (
                        <BucketConfigComponent
                            key={index}
                            bucket={bucket}
                            index={index}
                            columns={columns}
                            data={data}
                            isOnlyBucket={isOnlyBucket && allowMultiple}
                            canMoveUp={index > 0}
                            canMoveDown={index < buckets.length - 1}
                            onUpdate={(updatedBucket) => handleBucketUpdate(index, updatedBucket)}
                            onDelete={() => handleBucketDelete(index)}
                            onMoveUp={() => handleBucketMove(index, index - 1)}
                            onMoveDown={() => handleBucketMove(index, index + 1)}
                        />
                    ))}
                </div>
            )}
        </WidgetConfigSection>
    );
}

