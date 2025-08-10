/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from "react";
import {
  aggregate,
} from "@utils/chartUtils";
import { useMultiBucketProcessor as useMultiBucketProcessorUtils } from "@utils/multiBucketProcessor";

export function useTableWidgetLogic(data: any[], config: any) {
  // Process data with multi-bucket system using the utils function
  const processedData = useMultiBucketProcessorUtils(data, config);

  const hasMetrics = Array.isArray(config.metrics) && config.metrics.length > 0;
  const hasMultiBuckets = Array.isArray(config.buckets) && config.buckets.length > 0;
  const hasLegacyBucket = config.bucket && config.bucket.field; // Support legacy bucket

  const { columns, displayData } = useMemo(() => {
    const safeData = Array.isArray(data) ? data : [];
    let columns: { key: string; label: string }[] = [];
    let displayData: any[] = [];

    // PRIORITÉ 1: Système multi-buckets moderne
    if (hasMultiBuckets && processedData) {
      const groupedData = processedData.groupedData || [];
      const labels = processedData.labels || [];
      
      if (groupedData.length > 0 && labels.length > 0) {
        // Créer les colonnes pour le(s) bucket(s)
        const bucketColumns = config.buckets.map((bucket: any) => ({
          key: bucket.field,
          label: bucket.label || bucket.field,
        }));

        // Créer les colonnes pour les métriques si présentes
        const metricColumns = hasMetrics ? config.metrics.map((m: any) => ({
          key: m.field,
          label: m.label || m.field,
        })) : [];

        // Ajouter une colonne count si pas de métriques
        const countColumn = !hasMetrics ? [{ key: '_doc_count', label: 'Nombre' }] : [];

        columns = [...bucketColumns, ...metricColumns, ...countColumn];

        // Créer les données d'affichage en utilisant les labels formatés
        displayData = labels.map((label: string, index: number) => {
          const row: any = {};
          
          // Ajouter la valeur du bucket principal avec le label formaté
          const primaryBucketField = config.buckets[0].field;
          row[primaryBucketField] = label;
          
          // Ajouter les valeurs de métriques depuis les données groupées si présentes
          if (hasMetrics && config.metrics) {
            const groupData = groupedData[index];
            config.metrics.forEach((metric: any) => {
              row[metric.field] = groupData?.[metric.field] ?? 0;
            });
          }
          
          // Ajouter le count si pas de métriques
          if (!hasMetrics) {
            const groupData = groupedData[index];
            row['_doc_count'] = groupData?._doc_count ?? 0;
          }

          return row;
        });
      }
    }
    // PRIORITÉ 2: Système legacy single bucket (rétro-compatibilité)
    else if (hasLegacyBucket && hasMetrics && config.bucket && config.metrics) {
      const bucketLabel = config.bucket.label || config.bucket.field;
      columns = [
        { key: config.bucket.field, label: bucketLabel },
        ...config.metrics.map((m: any) => ({
          key: m.field,
          label: m.label || m.field,
        })),
      ];
      const groups: Record<string, any[]> = {};
      safeData.forEach((row: any) => {
        const key = String(row[config.bucket.field]);
        if (!groups[key]) groups[key] = [];
        groups[key].push(row);
      });
      displayData = Object.entries(groups).map(([bucketVal, rows]) => {
        const summary: any = { [config.bucket.field]: bucketVal };
        config.metrics.forEach((metric: any) => {
          summary[metric.field] = aggregate(rows, metric.agg, metric.field);
        });
        return summary;
      });
    } else if (Array.isArray(config.columns) && config.columns.length > 0) {
      columns = config.columns.map((col: any) => ({
        key: col.key,
        label: col.label || col.key,
      }));
      if (config.groupBy && typeof config.groupBy === "string") {
        const groupKey = config.groupBy as string;
        const groups: Record<string, any[]> = {};
        safeData.forEach((row: any) => {
          const key = String(row[groupKey]);
          if (!groups[key]) groups[key] = [];
          groups[key].push(row);
        });
        displayData = Object.entries(groups).map(([groupVal, rows]) => {
          const summary: any = { [groupKey]: groupVal, count: rows.length };
          columns.forEach((col: any) => {
            if (col.key !== groupKey) {
              const nums = rows
                .map((r: any) => Number(r[col.key]))
                .filter((v: number) => !isNaN(v));
              if (nums.length === rows.length && nums.length > 0) {
                summary[col.key] = nums.reduce(
                  (a: number, b: number) => a + b,
                  0
                );
              } else {
                summary[col.key] = rows[0][col.key] ?? "";
              }
            }
          });
          return summary;
        });
      } else {
        displayData = safeData;
      }
    }
    // PRIORITÉ 4: Données brutes (aucun groupement configuré)
    else if (safeData.length > 0) {
      // Générer les colonnes automatiquement depuis les données
      const firstRow = safeData[0];
      const keys = Object.keys(firstRow);
      columns = keys.map(key => ({
        key,
        label: key.charAt(0).toUpperCase() + key.slice(1),
      }));
      displayData = safeData;
    }
    
    return { columns, displayData };
  }, [hasMetrics, hasLegacyBucket, hasMultiBuckets, config.bucket, config.buckets, config.metrics, config.columns, config.groupBy, data, processedData]);

  // Détermination du titre à afficher
  let tableTitle = "Tableau";
  if (config.widgetParams && config.widgetParams.title) {
    tableTitle = config.widgetParams.title;
  } else if (hasMultiBuckets) {
    // Priorité aux multi-buckets
    const bucketLabels = config.buckets
      .map((bucket: any) => bucket.label || bucket.field)
      .join(", ");
    if (hasMetrics) {
      tableTitle = `Tableau groupé par ${bucketLabels}`;
    } else {
      tableTitle = `Décompte par ${bucketLabels}`;
    }
  } else if (hasLegacyBucket && hasMetrics) {
    // Fallback legacy
    const bucketLabel =
      config.bucket && config.bucket.label
        ? config.bucket.label
        : config.bucket
          ? config.bucket.field
          : "";
    tableTitle = `Tableau groupé par ${bucketLabel}`;
  } else if (config.groupBy) {
    tableTitle = `Tableau groupé par ${config.groupBy}`;
  } else if (hasMetrics) {
    tableTitle = `Tableau des métriques`;
  } else {
    tableTitle = `Tableau des données`;
  }

  return { columns, displayData, tableTitle };
}
