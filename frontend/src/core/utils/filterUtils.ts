/* eslint-disable @typescript-eslint/no-explicit-any */
import type { DatasetFilter } from "@type/metricBucketTypes";
import type { Filter } from "@type/visualization";

/**
 * Utilitaires pour la gestion des filtres dans les widgets
 */

/**
 * Applique un filtre simple à un ensemble de données avec opérateurs
 */
export function applyFilter(
    data: Record<string, any>[],
    filter: Filter
): Record<string, any>[] {
    if (!filter.field || filter.value === undefined || filter.value === null || filter.value === '') {
        return data;
    }

    const operator = filter.operator || 'equals';

    return data.filter(row => {
        const fieldValue = row[filter.field];

        if (fieldValue === undefined || fieldValue === null) {
            return false;
        }

        switch (operator) {
            case 'equals':
                return String(fieldValue) === String(filter.value);

            case 'not_equals':
                return String(fieldValue) !== String(filter.value);

            case 'contains':
                return String(fieldValue).toLowerCase().includes(String(filter.value).toLowerCase());

            case 'not_contains':
                return !String(fieldValue).toLowerCase().includes(String(filter.value).toLowerCase());

            case 'greater_than':
                return Number(fieldValue) > Number(filter.value);

            case 'less_than':
                return Number(fieldValue) < Number(filter.value);

            case 'greater_equal':
                return Number(fieldValue) >= Number(filter.value);

            case 'less_equal':
                return Number(fieldValue) <= Number(filter.value);

            case 'starts_with':
                return String(fieldValue).toLowerCase().startsWith(String(filter.value).toLowerCase());

            case 'ends_with':
                return String(fieldValue).toLowerCase().endsWith(String(filter.value).toLowerCase());

            default:
                return String(fieldValue) === String(filter.value);
        }
    });
}

/**
 * Applique un filtre de dataset (avec opérateurs)
 */
export function applyDatasetFilter(
    data: Record<string, any>[],
    filter: DatasetFilter
): Record<string, any>[] {
    if (!filter.field || filter.value === undefined || filter.value === null || filter.value === '') {
        return data;
    }

    const operator = filter.operator || 'equals';

    return data.filter(row => {
        const fieldValue = row[filter.field];

        if (fieldValue === undefined || fieldValue === null) {
            return false;
        }

        switch (operator) {
            case 'equals':
                return String(fieldValue) === String(filter.value);

            case 'not_equals':
                return String(fieldValue) !== String(filter.value);

            case 'contains':
                return String(fieldValue).toLowerCase().includes(String(filter.value).toLowerCase());

            case 'not_contains':
                return !String(fieldValue).toLowerCase().includes(String(filter.value).toLowerCase());

            case 'greater_than':
                return Number(fieldValue) > Number(filter.value);

            case 'less_than':
                return Number(fieldValue) < Number(filter.value);

            case 'greater_equal':
                return Number(fieldValue) >= Number(filter.value);

            case 'less_equal':
                return Number(fieldValue) <= Number(filter.value);

            case 'starts_with':
                return String(fieldValue).toLowerCase().startsWith(String(filter.value).toLowerCase());

            case 'ends_with':
                return String(fieldValue).toLowerCase().endsWith(String(filter.value).toLowerCase());

            default:
                return String(fieldValue) === String(filter.value);
        }
    });
}

/**
 * Applique une liste de filtres globaux
 */
export function applyGlobalFilters(
    data: Record<string, any>[],
    filters: Filter[]
): Record<string, any>[] {
    if (!filters || filters.length === 0) {
        return data;
    }

    return filters.reduce((filteredData, filter) => {
        return applyFilter(filteredData, filter);
    }, data);
}

/**
 * Applique une liste de filtres de dataset
 */
export function applyDatasetFilters(
    data: Record<string, any>[],
    filters: DatasetFilter[]
): Record<string, any>[] {
    if (!filters || filters.length === 0) {
        return data;
    }

    return filters.reduce((filteredData, filter) => {
        return applyDatasetFilter(filteredData, filter);
    }, data);
}

/**
 * Applique tous les filtres (globaux + dataset) à un ensemble de données
 */
export function applyAllFilters(
    data: Record<string, any>[],
    globalFilters?: Filter[],
    datasetFilters?: DatasetFilter[]
): Record<string, any>[] {
    let filteredData = data;

    // Appliquer d'abord les filtres globaux
    if (globalFilters && globalFilters.length > 0) {
        filteredData = applyGlobalFilters(filteredData, globalFilters);
    }

    // Puis appliquer les filtres de dataset
    if (datasetFilters && datasetFilters.length > 0) {
        filteredData = applyDatasetFilters(filteredData, datasetFilters);
    }

    return filteredData;
}

/**
 * Valide un filtre
 */
export function validateFilter(filter: Filter): {
    isValid: boolean;
    errors: string[];
} {
    const errors: string[] = [];

    if (!filter.field || filter.field.trim() === '') {
        errors.push("Le champ du filtre doit être spécifié");
    }

    if (filter.value === undefined || filter.value === null || filter.value === '') {
        errors.push("La valeur du filtre doit être spécifiée");
    }

    const validOperators = ['equals', 'not_equals', 'contains', 'not_contains', 'greater_than', 'less_than', 'greater_equal', 'less_equal', 'starts_with', 'ends_with'];
    if (filter.operator && !validOperators.includes(filter.operator)) {
        errors.push(`Opérateur invalide: ${filter.operator}`);
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}

/**
 * Valide un filtre de dataset
 */
export function validateDatasetFilter(filter: DatasetFilter): {
    isValid: boolean;
    errors: string[];
} {
    const errors: string[] = [];

    if (!filter.field || filter.field.trim() === '') {
        errors.push("Le champ du filtre doit être spécifié");
    }

    if (filter.value === undefined || filter.value === null || filter.value === '') {
        errors.push("La valeur du filtre doit être spécifiée");
    }

    const validOperators = ['equals', 'not_equals', 'contains', 'not_contains', 'greater_than', 'less_than', 'greater_equal', 'less_equal', 'starts_with', 'ends_with'];
    if (filter.operator && !validOperators.includes(filter.operator)) {
        errors.push(`Opérateur invalide: ${filter.operator}`);
    }

    return {
        isValid: errors.length === 0,
        errors
    };
}
