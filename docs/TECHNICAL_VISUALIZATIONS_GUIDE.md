# Guide Technique des Visualisations DataVise

## Architecture des Adaptateurs

### Structure de Base
Tous les adaptateurs dans `visualizations.ts` suivent le pattern suivant :

```typescript
export const [WIDGET_NAME]: IVisualizationAdapter<[CONFIG_TYPE]> = {
  key: "widget_key",
  label: "Widget Label",
  icon: IconComponent,
  // Configuration des fonctionnalités
  hasMetrics: boolean,
  hasBuckets: boolean,
  hasDatasetBuckets: boolean,
  enableFilter: boolean, // ✅ true pour tous les widgets
  // Schémas de configuration
  configSchema: {
    globalFilters: FilterArraySchema, // ✅ Présent sur tous
    // ... autres schémas spécifiques
  },
  component: WidgetComponent,
  configComponent: ConfigComponent,
  hook: useWidgetHook
}
```

### Fonctionnalités par Adaptateur

#### Indicateurs (KPI, Card, KPI Group)
```typescript
// Configuration commune
hasMetrics: true,
hasBuckets: false,
hasDatasetBuckets: false,
enableFilter: true,

// Schémas spécifiques
configSchema: {
  globalFilters: FilterArraySchema,
  metrics: MetricsArraySchema,
  widgetParams: z.object({
    // Paramètres spécifiques au widget
  })
}
```

#### Graphiques Chart.js (Bar, Line, Pie)
```typescript
// Configuration commune
hasMetrics: true,
hasBuckets: true,
hasDatasetBuckets: false,
enableFilter: true,

// Schémas spécifiques
configSchema: {
  globalFilters: FilterArraySchema,
  metrics: MetricsArraySchema,
  bucket: BucketSchema.optional(),
  metricStyles: MetricStylesSchema.optional()
}
```

#### Graphiques Spécialisés (Radar, Bubble, Scatter)
```typescript
// Configuration commune
hasMetrics: true,
hasBuckets: false,
hasDatasetBuckets: true,
enableFilter: true,

// Schémas spécifiques
configSchema: {
  globalFilters: FilterArraySchema,
  datasets: DatasetsArraySchema,
  // ... configuration spécifique
}
```

#### Table
```typescript
// Configuration spécifique
hasMetrics: true,
hasBuckets: true,
hasDatasetBuckets: false,
enableFilter: true,

configSchema: {
  globalFilters: FilterArraySchema,
  buckets: BucketsArraySchema.optional(),
  metrics: MetricsArraySchema,
  tableParams: TableParamsSchema.optional()
}
```

## Système de Hooks

### Pattern Commun
Tous les hooks suivent le pattern suivant pour l'application des filtres :

```typescript
export const useWidgetHook = (data: any[], config: ConfigType) => {
  // 1. Application des filtres en premier
  const filteredData = useMemo(() => {
    if (!data?.length) return [];
    return applyAllFilters(data, config.globalFilters || []);
  }, [data, config.globalFilters]);

  // 2. Traitement spécifique au widget
  const processedData = useMemo(() => {
    return processWidgetData(filteredData, config);
  }, [filteredData, config]);

  return { data: processedData, /* autres propriétés */ };
};
```

### Hooks Spécialisés

#### useChartLogic (Bar, Line, Pie)
```typescript
const useChartLogic = ({
  chartType,
  data,
  config,
  customDatasetCreator,
  customOptionsCreator
}) => {
  // Filtrage global
  const filteredData = applyAllFilters(data, config.globalFilters);
  
  // Traitement Chart.js
  const chartData = createChartData(filteredData, config);
  const chartOptions = createChartOptions(config);
  
  return { chartData, chartOptions };
};
```

#### useKPIWidgetVM (KPI, Card)
```typescript
const useKPIWidgetVM = (data: any[], config: KPIConfig) => {
  // Application des filtres avec priorité
  const value = useMemo(() => {
    const filtered = applyKPIFilters(data, config);
    return calculateAggregation(filtered, config.metrics[0]);
  }, [data, config]);

  return { value, formattedValue: formatValue(value, config) };
};
```

#### useKPIGroupVM (KPI Group)
```typescript
const useKPIGroupVM = (data: any[], config: KPIGroupConfig) => {
  // Filtres globaux partagés
  const kpis = useMemo(() => {
    return config.metrics.map(metric => {
      const filtered = applyKPIFilters(data, config);
      return calculateKPI(filtered, metric, config);
    });
  }, [data, config]);

  return { kpis, layout: calculateLayout(config) };
};
```

#### Graphiques Spécialisés (Radar, Bubble, Scatter)
```typescript
const useSpecializedChartVM = (data: any[], config: SpecializedConfig) => {
  // Filtrage par dataset
  const processedDatasets = useMemo(() => {
    return config.datasets.map(dataset => {
      const filtered = applyAllFilters(data, config.globalFilters);
      return processDataset(filtered, dataset);
    });
  }, [data, config]);

  return { datasets: processedDatasets, chartOptions };
};
```

#### useTableWidgetLogic
```typescript
const useTableWidgetLogic = (data: any[], config: TableConfig) => {
  // Filtrage avant traitement
  const filteredData = useMemo(() => {
    return applyAllFilters(data, config.globalFilters || []);
  }, [data, config.globalFilters]);

  // Génération colonnes et données
  const tableData = useMemo(() => {
    return generateTableData(filteredData, config);
  }, [filteredData, config]);

  return { data: tableData, columns: generateColumns(config) };
};
```

## Utilitaires de Filtrage

### filterUtils.ts
```typescript
// Application de tous les filtres
export const applyAllFilters = (data: any[], filters: Filter[]) => {
  if (!filters?.length) return data;
  
  return data.filter(item => 
    filters.every(filter => applyFilter(item, filter))
  );
};

// Application d'un filtre unique
export const applyFilter = (item: any, filter: Filter) => {
  const value = item[filter.field];
  const filterValue = filter.value;

  switch (filter.operator) {
    case 'equals': return value === filterValue;
    case 'not_equals': return value !== filterValue;
    case 'contains': return String(value).includes(String(filterValue));
    case 'greater_than': return Number(value) > Number(filterValue);
    // ... autres opérateurs
    default: return true;
  }
};

// Filtres spécifiques KPI avec priorité
export const applyKPIFilters = (data: any[], config: KPIConfig) => {
  // 1. Filtres globaux (priorité)
  if (config.globalFilters?.length) {
    return applyAllFilters(data, config.globalFilters);
  }
  
  // 2. Filtre legacy (rétrocompatibilité)
  if (config.filter) {
    return data.filter(item => item[config.filter.field] === config.filter.value);
  }
  
  return data;
};
```

## Composants de Configuration

### GlobalFiltersConfig.tsx
```typescript
export const GlobalFiltersConfig = ({ config, data, onConfigChange }) => {
  // Valeurs dynamiques basées sur les données
  const fieldValues = useMemo(() => {
    if (!selectedField || !data?.length) return [];
    return [...new Set(data.map(item => item[selectedField]))];
  }, [selectedField, data]);

  return (
    <div className="space-y-4">
      {config.globalFilters?.map((filter, index) => (
        <div key={index} className="filter-row">
          {/* Sélection du champ */}
          <SelectField
            options={fieldOptions}
            value={filter.field}
            onChange={(field) => updateFilter(index, 'field', field)}
          />
          
          {/* Sélection de l'opérateur */}
          <SelectField
            options={operatorOptions}
            value={filter.operator}
            onChange={(operator) => updateFilter(index, 'operator', operator)}
          />
          
          {/* Sélection de la valeur */}
          <SelectField
            options={fieldValues}
            value={filter.value}
            onChange={(value) => updateFilter(index, 'value', value)}
          />
        </div>
      ))}
    </div>
  );
};
```

### DatasetFiltersConfig.tsx
```typescript
export const DatasetFiltersConfig = ({ datasets, data, onDatasetsChange }) => {
  return (
    <div className="space-y-6">
      {datasets.map((dataset, index) => (
        <div key={index} className="dataset-config">
          <h4>Dataset {index + 1}</h4>
          
          {/* Configuration métrique */}
          <MetricConfig
            metrics={dataset.metrics}
            onChange={(metrics) => updateDataset(index, 'metrics', metrics)}
          />
          
          {/* Filtres spécifiques au dataset */}
          <GlobalFiltersConfig
            config={{ globalFilters: dataset.filters }}
            data={data}
            onConfigChange={(filters) => updateDataset(index, 'filters', filters)}
          />
        </div>
      ))}
    </div>
  );
};
```

## Schémas de Validation

### Schémas Communs
```typescript
// Schéma de base pour les filtres
export const FilterSchema = z.object({
  field: z.string(),
  operator: z.enum([
    'equals', 'not_equals', 'contains', 'not_contains',
    'greater_than', 'less_than', 'greater_equal', 'less_equal',
    'starts_with', 'ends_with'
  ]),
  value: z.any()
});

export const FilterArraySchema = z.array(FilterSchema).optional();

// Schéma métriques
export const MetricSchema = z.object({
  agg: z.enum(['sum', 'avg', 'count', 'min', 'max']),
  field: z.string(),
  label: z.string().optional()
});

export const MetricsArraySchema = z.array(MetricSchema);

// Schéma bucket
export const BucketSchema = z.object({
  field: z.string(),
  label: z.string().optional()
});
```

### Schémas Spécialisés
```typescript
// KPI Config
export const KPIConfigSchema = z.object({
  globalFilters: FilterArraySchema,
  metrics: MetricsArraySchema,
  filter: z.object({ // Legacy
    field: z.string(),
    value: z.any()
  }).optional(),
  widgetParams: z.object({
    title: z.string().optional(),
    format: z.enum(['number', 'currency', 'percentage']).optional(),
    currency: z.string().optional()
  }).optional()
});

// Chart Config
export const ChartConfigSchema = z.object({
  globalFilters: FilterArraySchema,
  metrics: MetricsArraySchema,
  bucket: BucketSchema.optional(),
  metricStyles: z.record(z.object({
    color: z.string().optional(),
    borderColor: z.string().optional(),
    borderWidth: z.number().optional()
  })).optional()
});

// Table Config
export const TableConfigSchema = z.object({
  globalFilters: FilterArraySchema,
  buckets: z.array(BucketSchema).optional(),
  metrics: MetricsArraySchema,
  tableParams: z.object({
    itemsPerPage: z.number().optional(),
    showSearch: z.boolean().optional()
  }).optional()
});
```

## Performance et Optimisations

### Mémorisation des Calculs
```typescript
// Hook optimisé avec mémorisation
const useOptimizedWidget = (data: any[], config: Config) => {
  // Mémorisation du filtrage
  const filteredData = useMemo(() => {
    return applyAllFilters(data, config.globalFilters || []);
  }, [data, config.globalFilters]);

  // Mémorisation du traitement
  const processedData = useMemo(() => {
    return expensiveProcessing(filteredData, config);
  }, [filteredData, config.metrics, config.bucket]);

  // Mémorisation du rendu
  const renderData = useMemo(() => {
    return formatForRender(processedData);
  }, [processedData]);

  return { data: renderData };
};
```

### Validation et Nettoyage
```typescript
// Nettoyage automatique des filtres
export const cleanFilters = (filters: Filter[]): Filter[] => {
  return filters.filter(filter => 
    filter.field && 
    filter.operator && 
    filter.value !== undefined && 
    filter.value !== ''
  );
};

// Validation des données
export const validateData = (data: any[]): boolean => {
  return Array.isArray(data) && data.length > 0;
};
```

## Tests et Debugging

### Tests Unitaires
```typescript
describe('filterUtils', () => {
  test('applyFilter with equals operator', () => {
    const item = { name: 'John', age: 30 };
    const filter = { field: 'name', operator: 'equals', value: 'John' };
    expect(applyFilter(item, filter)).toBe(true);
  });

  test('applyAllFilters with multiple filters', () => {
    const data = [
      { name: 'John', age: 30, city: 'Paris' },
      { name: 'Jane', age: 25, city: 'London' }
    ];
    const filters = [
      { field: 'age', operator: 'greater_than', value: 25 },
      { field: 'city', operator: 'equals', value: 'Paris' }
    ];
    const result = applyAllFilters(data, filters);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('John');
  });
});
```

### Debugging
```typescript
// Mode debug pour les hooks
const DEBUG_FILTERS = process.env.NODE_ENV === 'development';

export const useWidgetHookWithDebug = (data: any[], config: Config) => {
  const filteredData = useMemo(() => {
    const result = applyAllFilters(data, config.globalFilters || []);
    
    if (DEBUG_FILTERS) {
      console.log('Widget Debug:', {
        originalCount: data.length,
        filteredCount: result.length,
        filters: config.globalFilters
      });
    }
    
    return result;
  }, [data, config.globalFilters]);

  return { data: filteredData };
};
```

## Migration et Compatibilité

### Rétrocompatibilité
```typescript
// Support des anciens formats de configuration
export const migrateConfig = (oldConfig: any): NewConfig => {
  const newConfig = { ...oldConfig };

  // Migration des filtres KPI
  if (oldConfig.filter && !oldConfig.globalFilters) {
    newConfig.globalFilters = [{
      field: oldConfig.filter.field,
      operator: 'equals',
      value: oldConfig.filter.value
    }];
  }

  // Migration des filtres KPI Group
  if (oldConfig.filters && !oldConfig.globalFilters) {
    newConfig.globalFilters = oldConfig.filters.map(filter => ({
      field: filter.field,
      operator: 'equals',
      value: filter.value
    }));
  }

  return newConfig;
};
```

Cette documentation technique complète le guide utilisateur et fournit toutes les informations nécessaires pour comprendre et maintenir le système de visualisations DataVise.
