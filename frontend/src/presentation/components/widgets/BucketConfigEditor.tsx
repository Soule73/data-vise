import React, { useState } from "react";
import type { BucketConfig, BucketType, ColumnInfo } from "@/core/types/metric-bucket-types";
import { getRecommendedBucketTypes, getDateIntervalOptions } from "@/core/utils/widget/columnAnalysis";
import { ColumnTypeBadge } from "./ColumnDisplay";
import {
  ChevronDownIcon,
  PlusIcon,
  TrashIcon,
  InformationCircleIcon
} from "@heroicons/react/24/outline";

interface BucketConfigEditorProps {
  config: BucketConfig;
  onChange: (config: BucketConfig) => void;
  availableColumns: ColumnInfo[];
  label?: string;
  description?: string;
  required?: boolean;
  supportedTypes?: BucketType[];
}

const BucketConfigEditor: React.FC<BucketConfigEditorProps> = ({
  config,
  onChange,
  availableColumns,
  label = "Configuration du groupement",
  description,
  required = false,
  supportedTypes = ["terms", "date_histogram", "histogram", "range"]
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  const selectedColumn = availableColumns.find(col => col.name === config.field);
  const recommendedTypes = selectedColumn ? 
    getRecommendedBucketTypes(selectedColumn.type).filter(type => 
      supportedTypes.includes(type.type as BucketType)
    ) : [];

  const handleFieldChange = (field: string) => {
    const column = availableColumns.find(col => col.name === field);
    const newConfig = { ...config, field };
    
    // Reset type if not compatible with new column
    if (column && config.type) {
      const compatibleTypes = getRecommendedBucketTypes(column.type).map(t => t.type);
      if (!compatibleTypes.includes(config.type)) {
        newConfig.type = compatibleTypes[0] as BucketType;
      }
    }
    
    onChange(newConfig);
  };

  const handleTypeChange = (type: BucketType) => {
    const newConfig = { ...config, type };
    
    // Set default values based on type
    switch (type) {
      case "date_histogram":
        newConfig.interval = newConfig.interval || "1d";
        break;
      case "histogram":
        newConfig.interval = newConfig.interval || 1;
        break;
      case "terms":
        newConfig.size = newConfig.size || 10;
        newConfig.order = newConfig.order || "desc";
        newConfig.orderBy = newConfig.orderBy || "_count";
        break;
      case "range":
        newConfig.ranges = newConfig.ranges || [{ from: 0, to: 100, label: "0-100" }];
        break;
    }
    
    onChange(newConfig);
  };

  const addRange = () => {
    const ranges = config.ranges || [];
    const lastRange = ranges[ranges.length - 1];
    const newFrom = lastRange ? (lastRange.to || 0) : 0;
    
    onChange({
      ...config,
      ranges: [...ranges, { from: newFrom, to: newFrom + 100, label: `${newFrom}-${newFrom + 100}` }]
    });
  };

  const updateRange = (index: number, field: 'from' | 'to' | 'label', value: number | string) => {
    const ranges = [...(config.ranges || [])];
    ranges[index] = { ...ranges[index], [field]: value };
    onChange({ ...config, ranges });
  };

  const removeRange = (index: number) => {
    const ranges = [...(config.ranges || [])];
    ranges.splice(index, 1);
    onChange({ ...config, ranges });
  };

  return (
    <div className="space-y-4 border rounded-lg p-4 bg-gray-50">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-900">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </h3>
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>
      </div>

      {/* Sélection de la colonne */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-2">
          Colonne
        </label>
        <select
          value={config.field || ""}
          onChange={(e) => handleFieldChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Sélectionner une colonne</option>
          {availableColumns.map((column) => (
            <option key={column.name} value={column.name}>
              {column.name} ({column.type})
            </option>
          ))}
        </select>
        
        {selectedColumn && (
          <div className="mt-2 flex items-center gap-2">
            <ColumnTypeBadge type={selectedColumn.type} />
            <span className="text-xs text-gray-500">
              {selectedColumn.cardinality} valeurs uniques
            </span>
          </div>
        )}
      </div>

      {/* Type de groupement */}
      {config.field && recommendedTypes.length > 0 && (
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">
            Type de groupement
          </label>
          <div className="space-y-2">
            {recommendedTypes.map((typeOption) => (
              <label key={typeOption.type} className="flex items-start gap-3 cursor-pointer">
                <input
                  type="radio"
                  name={`bucket-type-${label}`}
                  value={typeOption.type}
                  checked={config.type === typeOption.type}
                  onChange={() => handleTypeChange(typeOption.type as BucketType)}
                  className="mt-1"
                />
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {typeOption.label}
                  </div>
                  <div className="text-xs text-gray-500">
                    {typeOption.description}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Configuration spécifique par type */}
      {config.type && (
        <div className="space-y-3">
          {config.type === "date_histogram" && (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Intervalle
              </label>
              <select
                value={config.interval || "1d"}
                onChange={(e) => onChange({ ...config, interval: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                {getDateIntervalOptions().map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {config.type === "histogram" && (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                Intervalle numérique
              </label>
              <input
                type="number"
                value={config.interval || 1}
                onChange={(e) => onChange({ ...config, interval: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                min="0.01"
                step="0.01"
              />
            </div>
          )}

          {config.type === "terms" && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Nombre maximum de groupes
                </label>
                <input
                  type="number"
                  value={config.size || 10}
                  onChange={(e) => onChange({ ...config, size: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  min="1"
                  max="100"
                />
              </div>
              
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-2 text-xs text-blue-600 hover:text-blue-800"
              >
                <ChevronDownIcon className={`h-4 w-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
                Options avancées
              </button>
              
              {showAdvanced && (
                <div className="space-y-3 pl-4 border-l-2 border-gray-200">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      Trier par
                    </label>
                    <select
                      value={config.orderBy || "_count"}
                      onChange={(e) => onChange({ ...config, orderBy: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="_count">Nombre d'éléments</option>
                      <option value="_key">Valeur alphabétique</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      Ordre
                    </label>
                    <select
                      value={typeof config.order === 'string' ? config.order : "desc"}
                      onChange={(e) => onChange({ ...config, order: e.target.value as 'asc' | 'desc' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="desc">Décroissant</option>
                      <option value="asc">Croissant</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}

          {config.type === "range" && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-medium text-gray-700">
                  Plages de valeurs
                </label>
                <button
                  type="button"
                  onClick={addRange}
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  <PlusIcon className="h-3 w-3" />
                  Ajouter
                </button>
              </div>
              
              <div className="space-y-2">
                {(config.ranges || []).map((range, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 border rounded bg-white">
                    <input
                      type="number"
                      placeholder="De"
                      value={range.from || ""}
                      onChange={(e) => updateRange(index, 'from', Number(e.target.value))}
                      className="flex-1 px-2 py-1 border rounded text-sm"
                    />
                    <span className="text-xs text-gray-500">à</span>
                    <input
                      type="number"
                      placeholder="À"
                      value={range.to || ""}
                      onChange={(e) => updateRange(index, 'to', Number(e.target.value))}
                      className="flex-1 px-2 py-1 border rounded text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Label"
                      value={range.label || ""}
                      onChange={(e) => updateRange(index, 'label', e.target.value)}
                      className="flex-1 px-2 py-1 border rounded text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeRange(index)}
                      className="p-1 text-red-600 hover:text-red-800"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              
              {(!config.ranges || config.ranges.length === 0) && (
                <div className="text-center py-4 text-gray-500 border border-dashed rounded">
                  <InformationCircleIcon className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                  <p className="text-xs">Aucune plage définie</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BucketConfigEditor;
