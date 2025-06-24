/**
 * Mappe les colonnes détectées avec leur type.
 */
export function mapDetectedColumns(
  detectData: any,
  data: Record<string, unknown>[]
): { name: string; type: string }[] {
  return (detectData.columns || []).map((col: string) => ({
    name: col,
    type:
      detectData.types && detectData.types[col]
        ? detectData.types[col]
        : Array.isArray(data) && data.length > 0 && data[0][col] !== undefined
        ? typeof data[0][col]
        : "inconnu",
  }));
}

/**
 * Détecte automatiquement le champ timestamp parmi les colonnes.
 */
export function autoDetectTimestampField(columns: string[]): string {
  const lowerCols = columns.map((col) => col.toLowerCase());
  const keys = ["timestamp", "date", "createdat", "datetime"];
  for (let i = 0; i < lowerCols.length; i++) {
    if (keys.some((k) => lowerCols[i].includes(k))) {
      return columns[i];
    }
  }
  return "";
}

/**
 * Construit les paramètres pour la détection des colonnes.
 */
export function buildDetectParams({
  type,
  csvOrigin,
  csvFile,
  endpoint,
  httpMethod,
  authType,
  authConfig,
}: {
  type: "json" | "csv";
  csvOrigin: "url" | "upload";
  csvFile: File | null;
  endpoint: string;
  httpMethod?: "GET" | "POST";
  authType?: "none" | "bearer" | "apiKey" | "basic";
  authConfig?: any;
}): any {
  if (type === "csv" && csvOrigin === "upload" && csvFile) {
    return { type, file: csvFile };
  } else {
    const params: any = { type };
    if (type === "csv" && csvOrigin === "url") {
      params.endpoint = endpoint;
    } else if (type === "json") {
      params.endpoint = endpoint;
    }
    if (endpoint) {
      if (httpMethod) params.httpMethod = httpMethod;
      if (authType) params.authType = authType;
      if (authConfig) params.authConfig = authConfig;
    }
    return params;
  }
}
