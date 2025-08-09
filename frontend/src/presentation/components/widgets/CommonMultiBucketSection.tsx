import MultiBucketSection from "@/presentation/components/widgets/MultiBucketSection";
import type { MultiBucketConfig } from "@/core/types/metric-bucket-types";

interface CommonMultiBucketSectionProps {
    config?: { buckets?: MultiBucketConfig[] };
    columns: string[];
    availableFields?: string[];
    onConfigChange: (field: string, value: unknown) => void;
    sectionLabel?: string;
    allowMultiple?: boolean;
}

export default function CommonMultiBucketSection({
    config,
    columns,
    availableFields,
    onConfigChange,
    sectionLabel = "Buckets",
    allowMultiple = true,
}: CommonMultiBucketSectionProps) {
    return (
        <MultiBucketSection
            buckets={config?.buckets || []}
            columns={availableFields || columns}
            allowMultiple={allowMultiple}
            sectionLabel={sectionLabel}
            onBucketsChange={(buckets) => onConfigChange("buckets", buckets)}
        />
    );
}
