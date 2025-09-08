/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import SelectField from "@components/SelectField";
import InputField from "@components/forms/InputField";
import Button from "@components/forms/Button";
import {
    PlusCircleIcon,
    TrashIcon,
} from "@heroicons/react/24/solid";
import type { MultiBucketConfig, BucketType, BucketConfigComponentProps } from "@type/metricBucketTypes";
import {
    BUCKET_TYPES,
    DATE_INTERVALS,
    SORT_ORDERS,
    createDefaultBucket,
    generateBucketLabel,
    getAvailableColumns,
    validateBucket,
} from "@utils/bucketMetrics/bucketUtils";
import CollapsibleSection from "@components/widgets/CollapsibleSection";

export default function BucketConfigComponent({
    bucket,
    index,
    // isCollapsed,
    columns,
    data,
    isOnlyBucket,
    canMoveUp,
    canMoveDown,
    // onToggleCollapse,
    onUpdate,
    onDelete,
    onMoveUp,
    onMoveDown,
}: BucketConfigComponentProps) {
    const [errors, setErrors] = useState<string[]>([]);

    const handleFieldChange = (field: keyof MultiBucketConfig, value: any) => {
        const updatedBucket = { ...bucket, [field]: value };

        // Si on change le type, on recrée un bucket par défaut avec le nouveau type
        if (field === 'type') {
            const newBucket = createDefaultBucket(value as BucketType, bucket.field);
            newBucket.label = bucket.label;
            onUpdate(newBucket);
        } else {
            onUpdate(updatedBucket);
        }

        // Validation
        const validation = validateBucket(updatedBucket);
        setErrors(validation.errors);
    };

    const handleRangeChange = (rangeIndex: number, field: 'from' | 'to' | 'label', value: any) => {
        const updatedRanges = [...(bucket.ranges || [])];
        updatedRanges[rangeIndex] = {
            ...updatedRanges[rangeIndex],
            [field]: field === 'label' ? value : Number(value),
        };
        handleFieldChange('ranges', updatedRanges);
    };

    const addRange = () => {
        const newRange = { from: 0, to: 100, label: `Plage ${(bucket.ranges?.length || 0) + 1}` };
        handleFieldChange('ranges', [...(bucket.ranges || []), newRange]);
    };

    const removeRange = (rangeIndex: number) => {
        const updatedRanges = bucket.ranges?.filter((_, i) => i !== rangeIndex) || [];
        handleFieldChange('ranges', updatedRanges);
    };

    const headerLabel = generateBucketLabel(bucket);
    const availableColumns = getAvailableColumns(columns, bucket.type, data);

    return (
        <CollapsibleSection
            title={headerLabel}
            canMoveUp={canMoveUp}
            canMoveDown={canMoveDown}
            onDelete={onDelete}
            onMoveUp={onMoveUp}
            onMoveDown={onMoveDown}
            hideSettings={isOnlyBucket}
        >
            <div className="flex flex-col gap-3 mt-2">
                {/* Type de bucket */}
                <SelectField
                    label="Type de groupement"
                    value={bucket.type}
                    onChange={(e) => handleFieldChange('type', e.target.value)}
                    options={BUCKET_TYPES.map(type => ({
                        value: type.value,
                        label: type.label,
                    }))}
                    name={`bucket-type-${index}`}
                    id={`bucket-type-${index}`}
                />

                {/* Champ */}
                <SelectField
                    label="Champ"
                    value={bucket.field}
                    onChange={(e) => handleFieldChange('field', e.target.value)}
                    options={[
                        { value: '', label: '-- Sélectionner --' },
                        ...availableColumns.map((col) => ({ value: col, label: col }))
                    ]}
                    name={`bucket-field-${index}`}
                    id={`bucket-field-${index}`}
                />

                {/* Label personnalisé */}
                <InputField
                    label="Label personnalisé"
                    value={bucket.label || ''}
                    onChange={(e) => handleFieldChange('label', e.target.value)}
                    name={`bucket-label-${index}`}
                    id={`bucket-label-${index}`}
                    placeholder="Laisser vide pour auto-génération"
                />

                {/* Options spécifiques selon le type */}
                {bucket.type === 'histogram' && (
                    <InputField
                        label="Intervalle"
                        type="number"
                        value={bucket.interval || 1}
                        onChange={(e) => handleFieldChange('interval', Number(e.target.value))}
                        name={`bucket-interval-${index}`}
                        id={`bucket-interval-${index}`}
                        min={0.1}
                        step={0.1}
                    />
                )}

                {bucket.type === 'date_histogram' && (
                    <SelectField
                        label="Intervalle de temps"
                        value={bucket.dateInterval || 'day'}
                        onChange={(e) => handleFieldChange('dateInterval', e.target.value)}
                        options={DATE_INTERVALS}
                        name={`bucket-date-interval-${index}`}
                        id={`bucket-date-interval-${index}`}
                    />
                )}

                {bucket.type === 'range' && (
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Plages de valeurs
                        </label>
                        {bucket.ranges?.map((range, rangeIndex) => (
                            <div key={rangeIndex} className="flex gap-2 items-center p-2 bg-white dark:bg-gray-700 rounded border">
                                <InputField
                                    label="De"
                                    type="number"
                                    value={range.from || 0}
                                    onChange={(e) => handleRangeChange(rangeIndex, 'from', e.target.value)}
                                    name={`range-from-${index}-${rangeIndex}`}
                                    id={`range-from-${index}-${rangeIndex}`}
                                />
                                <InputField
                                    label="À"
                                    type="number"
                                    value={range.to || 0}
                                    onChange={(e) => handleRangeChange(rangeIndex, 'to', e.target.value)}
                                    name={`range-to-${index}-${rangeIndex}`}
                                    id={`range-to-${index}-${rangeIndex}`}
                                />
                                <InputField
                                    label="Label"
                                    value={range.label || ''}
                                    onChange={(e) => handleRangeChange(rangeIndex, 'label', e.target.value)}
                                    name={`range-label-${index}-${rangeIndex}`}
                                    id={`range-label-${index}-${rangeIndex}`}
                                />
                                <button
                                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900 rounded mt-6"
                                    onClick={() => removeRange(rangeIndex)}
                                    title="Supprimer la plage"
                                >
                                    <TrashIcon className="w-4 h-4 text-red-500" />
                                </button>
                            </div>
                        )) || []}
                        <Button
                            color="indigo"
                            variant="outline"
                            onClick={addRange}
                            className="w-full"
                        >
                            <PlusCircleIcon className="w-4 h-4 mr-1" />
                            Ajouter une plage
                        </Button>
                    </div>
                )}

                {/* Options avancées */}
                <div className="grid grid-cols-2 gap-2">
                    <SelectField
                        label="Tri"
                        value={bucket.order || 'desc'}
                        onChange={(e) => handleFieldChange('order', e.target.value)}
                        options={SORT_ORDERS}
                        name={`bucket-order-${index}`}
                        id={`bucket-order-${index}`}
                    />

                    <InputField
                        label="Taille max"
                        type="number"
                        value={bucket.size || 10}
                        onChange={(e) => handleFieldChange('size', Number(e.target.value))}
                        name={`bucket-size-${index}`}
                        id={`bucket-size-${index}`}
                        min={1}
                    />
                </div>

                <InputField
                    label="Minimum de documents"
                    type="number"
                    value={bucket.minDocCount || 1}
                    onChange={(e) => handleFieldChange('minDocCount', Number(e.target.value))}
                    name={`bucket-min-doc-count-${index}`}
                    id={`bucket-min-doc-count-${index}`}
                    min={0}
                />

                {/* Affichage des erreurs */}
                {errors.length > 0 && (
                    <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded p-2">
                        <ul className="text-sm text-red-600 dark:text-red-300">
                            {errors.map((error, i) => (
                                <li key={i}>• {error}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </CollapsibleSection>
    );
}
