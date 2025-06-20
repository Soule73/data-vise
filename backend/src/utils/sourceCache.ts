import NodeCache from "node-cache";

// TTL par défaut : 1h (3600s)
export const sourceCache = new NodeCache({ stdTTL: 3600, checkperiod: 120 });

// Utilitaire pour générer une clé de cache selon la config (sourceId, from, to)
export function getSourceCacheKey(
  sourceId: string,
  from?: string | null,
  to?: string | null
) {
  // Normalisation : null, "", undefined => undefined
  const normFrom = from && from !== "" ? from : undefined;
  const normTo = to && to !== "" ? to : undefined;
  if (normFrom || normTo) {
    return `${sourceId}:${normFrom || "null"}:${normTo || "null"}`;
  }
  return sourceId;
}
