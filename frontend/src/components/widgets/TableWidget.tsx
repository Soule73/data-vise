import Table from "@/components/Table";

export interface TableWidgetConfig {
  columns: { key: string; label: string }[];
  pageSize?: number;
  groupBy?: string; // Ajout du champ groupBy
}

export default function TableWidget({
  data,
  config,
}: {
  data: any[];
  config: TableWidgetConfig;
}) {
  // Prépare les colonnes pour le composant Table
  const columns = Array.isArray(config.columns)
    ? config.columns.map((col) => ({
        key: col.key,
        label: col.label || col.key,
      }))
    : [];
  const safeData = Array.isArray(data) ? data : [];

  // Gestion du groupBy : si défini, on groupe les données par ce champ et on affiche un résumé
  let displayData = safeData;
  if (config.groupBy && typeof config.groupBy === "string") {
    const groupKey = config.groupBy as string;
    // Grouper les données par la valeur du champ groupBy
    const groups: Record<string, any[]> = {};
    safeData.forEach((row) => {
      const key = String(row[groupKey]);
      if (!groups[key]) groups[key] = [];
      groups[key].push(row);
    });
    // Pour chaque groupe, créer une ligne de résumé :
    // - groupBy: valeur du groupe
    // - count: nombre d'éléments
    // - pour chaque colonne numérique, somme
    displayData = Object.entries(groups).map(([groupVal, rows]) => {
      const summary: any = { [groupKey]: groupVal, count: rows.length };
      columns.forEach((col) => {
        if (col.key !== groupKey) {
          // Si toutes les valeurs sont numériques, on fait la somme
          const nums = rows
            .map((r) => Number(r[col.key]))
            .filter((v) => !isNaN(v));
          if (nums.length === rows.length && nums.length > 0) {
            summary[col.key] = nums.reduce((a, b) => a + b, 0);
          } else {
            // Sinon, on met la première valeur (ou vide)
            summary[col.key] = rows[0][col.key] ?? "";
          }
        }
      });
      return summary;
    });
  }

  return (
    <div className=" bg-white dark:bg-gray-900 rounded overflow-auto max-h-80 min-w-full pt-1 md:pt-2">
      <div className="font-bold mb-2 px-4 pt-4">Table</div>
      <div className="relative overflow-x-auto overflow-y-auto max-h-64">
        <Table
          columns={columns}
          data={displayData.slice(0, config.pageSize || 10)}
          emptyMessage="Aucune donnée."
        />
      </div>
    </div>
  );
}
