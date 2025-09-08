import MultiBucketSection from "@components/widgets/MultiBucketSection";
import type { CommonMultiBucketSectionProps } from "@type/metricBucketTypes";

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
