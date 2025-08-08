import React from "react";
import type { ColumnInfo, ColumnType } from "@/core/types/metric-bucket-types";
import { 
  HashtagIcon, 
  CalendarIcon, 
  DocumentTextIcon,
  CheckIcon,
  CubeIcon,
  ListBulletIcon
} from "@heroicons/react/24/outline";

interface ColumnTypeBadgeProps {
  type: ColumnType;
  className?: string;
}

const ColumnTypeBadge: React.FC<ColumnTypeBadgeProps> = ({ type, className = "" }) => {
  const getTypeConfig = (type: ColumnType) => {
    switch (type) {
      case "number":
        return { 
          icon: HashtagIcon, 
          label: "Nombre", 
          color: "bg-blue-100 text-blue-800",
          textColor: "text-blue-600"
        };
      case "date":
        return { 
          icon: CalendarIcon, 
          label: "Date", 
          color: "bg-green-100 text-green-800",
          textColor: "text-green-600"
        };
      case "string":
        return { 
          icon: DocumentTextIcon, 
          label: "Texte", 
          color: "bg-gray-100 text-gray-800",
          textColor: "text-gray-600"
        };
      case "boolean":
        return { 
          icon: CheckIcon, 
          label: "Booléen", 
          color: "bg-purple-100 text-purple-800",
          textColor: "text-purple-600"
        };
      case "object":
        return { 
          icon: CubeIcon, 
          label: "Objet", 
          color: "bg-orange-100 text-orange-800",
          textColor: "text-orange-600"
        };
      case "array":
        return { 
          icon: ListBulletIcon, 
          label: "Liste", 
          color: "bg-red-100 text-red-800",
          textColor: "text-red-600"
        };
      default:
        return { 
          icon: DocumentTextIcon, 
          label: "Inconnu", 
          color: "bg-gray-100 text-gray-800",
          textColor: "text-gray-600"
        };
    }
  };

  const config = getTypeConfig(type);
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color} ${className}`}>
      <Icon className={`h-3 w-3 ${config.textColor}`} />
      {config.label}
    </span>
  );
};

interface ColumnDisplayProps {
  columns: ColumnInfo[];
  onColumnSelect?: (column: ColumnInfo) => void;
  selectedColumn?: string;
  className?: string;
}

const ColumnDisplay: React.FC<ColumnDisplayProps> = ({ 
  columns, 
  onColumnSelect, 
  selectedColumn,
  className = "" 
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <h3 className="text-sm font-medium text-gray-700 mb-3">
        Colonnes disponibles ({columns.length})
      </h3>
      
      <div className="space-y-1 max-h-60 overflow-y-auto">
        {columns.map((column) => (
          <div
            key={column.name}
            className={`
              flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer
              ${selectedColumn === column.name 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }
            `}
            onClick={() => onColumnSelect?.(column)}
          >
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="flex-shrink-0">
                <ColumnTypeBadge type={column.type} />
              </div>
              
              <div className="min-w-0 flex-1">
                <div className="font-medium text-gray-900 truncate">
                  {column.name}
                </div>
                
                <div className="text-xs text-gray-500 mt-1">
                  {column.cardinality ? `${column.cardinality} valeurs` : ""}
                  {column.nullable && " • Peut être vide"}
                  {column.unique && " • Valeurs uniques"}
                </div>
                
                {column.sample !== undefined && (
                  <div className="text-xs text-gray-400 mt-1 truncate">
                    Exemple: {String(column.sample)}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {columns.length === 0 && (
        <div className="text-center py-6 text-gray-500">
          <DocumentTextIcon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm">Aucune colonne détectée</p>
        </div>
      )}
    </div>
  );
};

export default ColumnDisplay;
export { ColumnTypeBadge };
