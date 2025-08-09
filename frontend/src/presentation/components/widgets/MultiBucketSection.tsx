import { PlusCircleIcon } from "@heroicons/react/24/solid";
import BucketConfigComponent from "@components/widgets/BucketConfigComponent";
import type { MultiBucketConfig, MultiBucketSectionProps } from "@type/metric-bucket-types";
import { createDefaultBucket } from "@utils/bucketUtils";
import { useBucketUIStore } from "@store/bucketUI";



export default function MultiBucketSection({
    buckets,
    columns,
    data,
    allowMultiple = true,
    sectionLabel = "Buckets",
    onBucketsChange,
}: MultiBucketSectionProps) {
    const collapsedBuckets = useBucketUIStore((s) => s.collapsedBuckets);
    const toggleBucketCollapse = useBucketUIStore((s) => s.toggleBucketCollapse);

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
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">{sectionLabel}</h3>

            {buckets.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400 py-6">
                    <p className="mb-3">Aucun bucket configuré</p>
                    <button
                        className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/40 transition-colors inline-flex items-center"
                        onClick={addBucket}
                    >
                        <PlusCircleIcon className="w-4 h-4 mr-2" />
                        Ajouter un bucket
                    </button>
                </div>
            ) : (
                <div className="space-y-3">
                    {buckets.map((bucket, index) => (
                        <BucketConfigComponent
                            key={index}
                            bucket={bucket}
                            index={index}
                            isCollapsed={collapsedBuckets[`bucket-${index}`] || false}
                            columns={columns}
                            data={data}
                            isOnlyBucket={isOnlyBucket && !allowMultiple}
                            canMoveUp={index > 0}
                            canMoveDown={index < buckets.length - 1}
                            onToggleCollapse={() => toggleBucketCollapse(`bucket-${index}`)}
                            onUpdate={(updatedBucket) => handleBucketUpdate(index, updatedBucket)}
                            onDelete={() => handleBucketDelete(index)}
                            onMoveUp={() => handleBucketMove(index, index - 1)}
                            onMoveDown={() => handleBucketMove(index, index + 1)}
                        />
                    ))}

                    {allowMultiple && (
                        <button
                            className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/40 transition-colors inline-flex items-center mx-auto mt-3"
                            onClick={addBucket}
                        >
                            <PlusCircleIcon className="w-4 h-4 mr-2" />
                            Ajouter un bucket
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
