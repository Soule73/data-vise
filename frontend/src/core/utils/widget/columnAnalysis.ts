import type { ColumnInfo, ColumnType } from "@/core/types/metric-bucket-types";

/**
 * Détecte le type d'une colonne basé sur ses valeurs
 */
export function detectColumnType(values: unknown[]): ColumnType {
  if (!values || values.length === 0) return "string";
  
  // Filtre les valeurs nulles pour l'analyse
  const nonNullValues = values.filter(v => v !== null && v !== undefined);
  if (nonNullValues.length === 0) return "string";
  
  // Prend un échantillon pour l'analyse (max 100 valeurs)
  const sample = nonNullValues.slice(0, 100);
  
  // Compteurs par type
  let numberCount = 0;
  let dateCount = 0;
  let booleanCount = 0;
  let objectCount = 0;
  let arrayCount = 0;
  
  for (const value of sample) {
    if (Array.isArray(value)) {
      arrayCount++;
    } else if (typeof value === 'object') {
      objectCount++;
    } else if (typeof value === 'boolean') {
      booleanCount++;
    } else if (typeof value === 'number') {
      numberCount++;
    } else if (typeof value === 'string') {
      // Essaie de détecter les dates
      if (isDateString(value)) {
        dateCount++;
      }
      // Les strings restantes sont comptées implicitement
    }
  }
  
  const total = sample.length;
  const threshold = 0.8; // 80% des valeurs doivent correspondre au type
  
  // Détermine le type majoritaire
  if (numberCount / total >= threshold) return "number";
  if (dateCount / total >= threshold) return "date";
  if (booleanCount / total >= threshold) return "boolean";
  if (arrayCount / total >= threshold) return "array";
  if (objectCount / total >= threshold) return "object";
  
  return "string"; // Par défaut
}

/**
 * Vérifie si une chaîne représente une date
 */
function isDateString(value: string): boolean {
  if (!value || typeof value !== 'string') return false;
  
  // Formats de date courants
  const datePatterns = [
    /^\d{4}-\d{2}-\d{2}$/, // YYYY-MM-DD
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/, // ISO 8601
    /^\d{2}\/\d{2}\/\d{4}$/, // MM/DD/YYYY
    /^\d{2}-\d{2}-\d{4}$/, // MM-DD-YYYY
  ];
  
  // Test avec les patterns
  if (datePatterns.some(pattern => pattern.test(value))) {
    const date = new Date(value);
    return !isNaN(date.getTime());
  }
  
  // Test direct avec Date
  const date = new Date(value);
  return !isNaN(date.getTime()) && value.length > 6;
}

/**
 * Analyse les colonnes d'un dataset et retourne leurs informations
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function analyzeColumns(data: any[]): ColumnInfo[] {
  if (!Array.isArray(data) || data.length === 0) return [];
  
  const firstRow = data[0];
  if (!firstRow || typeof firstRow !== 'object') return [];
  
  const columnNames = Object.keys(firstRow);
  
  return columnNames.map(name => {
    // Collecte toutes les valeurs pour cette colonne
    const values = data.map(row => row[name]);
    
    // Détecte le type
    const type = detectColumnType(values);
    
    // Analyse des métadonnées
    const nonNullValues = values.filter(v => v !== null && v !== undefined);
    const uniqueValues = new Set(nonNullValues);
    
    return {
      name,
      type,
      sample: nonNullValues[0],
      nullable: values.some(v => v === null || v === undefined),
      unique: uniqueValues.size === nonNullValues.length,
      cardinality: uniqueValues.size,
    };
  });
}

/**
 * Retourne les types de buckets recommandés pour un type de colonne
 */
export function getRecommendedBucketTypes(columnType: ColumnType) {
  switch (columnType) {
    case "string":
      return [
        { type: "terms", label: "Grouper par valeurs", description: "Groupe par valeurs uniques" },
        { type: "split_series", label: "Diviser en séries", description: "Sépare en séries colorées" },
      ];
    
    case "number":
      return [
        { type: "histogram", label: "Intervalles numériques", description: "Groupe par plages de valeurs" },
        { type: "range", label: "Plages personnalisées", description: "Défini des plages manuellement" },
        { type: "terms", label: "Grouper par valeurs", description: "Groupe par valeurs exactes" },
      ];
    
    case "date":
      return [
        { type: "date_histogram", label: "Intervalles de dates", description: "Groupe par périodes (jour, mois, année)" },
        { type: "range", label: "Plages de dates", description: "Défini des périodes personnalisées" },
      ];
    
    case "boolean":
      return [
        { type: "terms", label: "Grouper par valeurs", description: "Groupe par true/false" },
      ];
    
    default:
      return [
        { type: "terms", label: "Grouper par valeurs", description: "Groupe par valeurs uniques" },
      ];
  }
}

/**
 * Génère les options d'intervalle pour les dates
 */
export function getDateIntervalOptions() {
  return [
    { value: "1m", label: "Minute" },
    { value: "1h", label: "Heure" },
    { value: "1d", label: "Jour" },
    { value: "1w", label: "Semaine" },
    { value: "1M", label: "Mois" },
    { value: "1q", label: "Trimestre" },
    { value: "1y", label: "Année" },
  ];
}

/**
 * Valide une configuration de bucket
 */
export function validateBucketConfig(config: Record<string, unknown>, columnInfo: ColumnInfo): string[] {
  const errors: string[] = [];
  
  if (!config.field) {
    errors.push("Le champ est requis");
    return errors;
  }
  
  if (!config.type) {
    errors.push("Le type de groupement est requis");
    return errors;
  }
  
  // Validations spécifiques par type
  switch (config.type) {
    case "date_histogram":
      if (columnInfo.type !== "date") {
        errors.push("Les intervalles de dates nécessitent une colonne de type date");
      }
      if (!config.interval) {
        errors.push("L'intervalle est requis pour les histogrammes de dates");
      }
      break;
      
    case "histogram":
      if (columnInfo.type !== "number") {
        errors.push("Les histogrammes nécessitent une colonne numérique");
      }
      if (!config.interval) {
        errors.push("L'intervalle est requis pour les histogrammes");
      }
      break;
      
    case "range":
      if (!config.ranges || !Array.isArray(config.ranges) || config.ranges.length === 0) {
        errors.push("Au moins une plage est requise");
      }
      break;
  }
  
  return errors;
}
