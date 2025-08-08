import React, { useState } from 'react';
import WidgetDataConfigSection from '@/presentation/components/widgets/WidgetDataConfigSection';
import { WIDGET_DATA_CONFIG } from '@/data/adapters/visualizations';
import type { WidgetType } from '@/core/types/widget-types';
import type { MultiBucketConfig, MetricConfig } from '@/core/types/metric-bucket-types';

// Données de test simulées
const sampleData = [
    { category: 'A', region: 'North', value: 100, sales: 1500, date: '2024-01-01' },
    { category: 'B', region: 'North', value: 150, sales: 2000, date: '2024-01-02' },
    { category: 'A', region: 'South', value: 80, sales: 1200, date: '2024-01-03' },
    { category: 'C', region: 'East', value: 120, sales: 1800, date: '2024-01-04' },
    { category: 'B', region: 'South', value: 90, sales: 1300, date: '2024-01-05' },
    { category: 'A', region: 'East', value: 110, sales: 1600, date: '2024-01-06' },
];

const sampleColumns = ['category', 'region', 'value', 'sales', 'date'];

interface TestConfig {
    metrics: MetricConfig[];
    buckets?: MultiBucketConfig[];
    bucket?: { field: string; label?: string };
}

export default function MultiBucketTestComponent() {
    const [selectedWidgetType, setSelectedWidgetType] = useState<WidgetType>('bar');
    const [config, setConfig] = useState<TestConfig>({
        metrics: [
            { field: 'sales', agg: 'sum', label: 'Total Sales' }
        ],
        buckets: [],
        bucket: { field: '' }
    });

    const dataConfig = WIDGET_DATA_CONFIG[selectedWidgetType];

    const handleConfigChange = (field: string, value: unknown) => {
        setConfig(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleDragStart = (idx: number) => {
        console.log('Drag start:', idx);
    };

    const handleDragOver = (idx: number, e: React.DragEvent) => {
        e.preventDefault();
        console.log('Drag over:', idx);
    };

    const handleDrop = (idx: number) => {
        console.log('Drop:', idx);
    };

    const handleMetricAggOrFieldChange = (idx: number, field: "agg" | "field", value: string) => {
        const newMetrics = [...config.metrics];
        newMetrics[idx] = { ...newMetrics[idx], [field]: value };
        setConfig(prev => ({ ...prev, metrics: newMetrics }));
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Test des Buckets Multiples</h1>

            {/* Sélecteur de type de widget */}
            <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Type de widget :</label>
                <select
                    value={selectedWidgetType}
                    onChange={(e) => setSelectedWidgetType(e.target.value as WidgetType)}
                    className="border rounded px-3 py-2"
                >
                    <option value="bar">Bar Chart</option>
                    <option value="line">Line Chart</option>
                    <option value="pie">Pie Chart</option>
                    <option value="table">Table</option>
                </select>
            </div>

            {/* Affichage de la configuration actuelle */}
            <div className="mb-6 p-4 bg-gray-100 rounded">
                <h3 className="font-medium mb-2">Configuration actuelle :</h3>
                <pre className="text-sm overflow-auto">
                    {JSON.stringify(config, null, 2)}
                </pre>
            </div>

            {/* Composant de configuration */}
            <div className="border rounded p-4">
                <h3 className="font-medium mb-4">Configuration des données :</h3>
                <WidgetDataConfigSection
                    type={selectedWidgetType}
                    dataConfig={dataConfig}
                    config={config}
                    columns={sampleColumns}
                    handleConfigChange={handleConfigChange}
                    handleDragStart={handleDragStart}
                    handleDragOver={handleDragOver}
                    handleDrop={handleDrop}
                    handleMetricAggOrFieldChange={handleMetricAggOrFieldChange}
                    data={sampleData}
                />
            </div>

            {/* Aperçu des données traitées */}
            <div className="mt-6 p-4 bg-blue-50 rounded">
                <h3 className="font-medium mb-2">Données d'exemple :</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm font-medium">Colonnes disponibles :</p>
                        <ul className="text-sm">
                            {sampleColumns.map(col => (
                                <li key={col} className="text-gray-600">• {col}</li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <p className="text-sm font-medium">Premières lignes :</p>
                        <div className="text-xs overflow-auto max-h-32">
                            <pre>{JSON.stringify(sampleData.slice(0, 3), null, 1)}</pre>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
