import Button from "@/presentation/components/forms/Button";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import BucketConfigComponent from "./BucketConfigComponent";
import type { MultiBucketConfig } from "@/core/types/metric-bucket-types";
import { createDefaultBucket } from "@/core/utils/bucketUtils";
import { useBucketUIStore } from "@/core/store/bucketUI";

interface MultiBucketSectionProps {
    buckets: MultiBucketConfig[];
    columns: string[];
    data?: Record<string, unknown>[];
    allowMultiple?: boolean;
    sectionLabel?: string;
    onBucketsChange: (buckets: MultiBucketConfig[]) => void;
}

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
        <div className="bg-gray-100 dark:bg-gray-800 rounded p-2">
            <div className="font-semibold mb-3">{sectionLabel}</div>

            {buckets.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400 py-4">
                    <p className="mb-2">Aucun bucket configuré</p>
                    <Button
                        color="indigo"
                        variant="outline"
                        onClick={addBucket}
                        className="w-max"
                    >
                        <PlusCircleIcon className="w-5 h-5 mr-1" />
                        Ajouter un bucket
                    </Button>
                </div>
            ) : (
                <div className="space-y-2">
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
                        <Button
                            color="indigo"
                            className="mt-2 w-max mx-auto !bg-gray-300 dark:!bg-gray-700 hover:!bg-gray-200 dark:hover:!bg-gray-600 !border-none"
                            variant="outline"
                            onClick={addBucket}
                        >
                            <PlusCircleIcon className="w-5 h-5 mr-1" />
                            Ajouter un bucket
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}
