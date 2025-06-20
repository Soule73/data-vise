import DataSource from "../models/DataSource";
import {
  getAbsolutePath,
  readCsvFile,
  fetchRemoteCsv,
  fetchRemoteJson,
  filterByTimestamp,
  inferColumnTypes,
} from "@/utils/dataSourceUtils";
import fs from "fs/promises";
import type {
  DataSourceCreatePayload,
  DataSourceUpdatePayload,
} from "@/types/sourceType";
import { sourceCache, getSourceCacheKey } from "@/utils/sourceCache";

// Map pour suivre les chargements en cours (anti-stampede)
const inflightLoads = new Map<string, Promise<any[]>>();

const dataSourceService = {
  async list() {
    const sources = await DataSource.find();
    return { data: sources };
  },
  async create(payload: DataSourceCreatePayload) {
    const { name, type, endpoint, filePath, config, ownerId, timestampField } =
      payload;
    if (!name || !type || !ownerId)
      return { error: { message: "Champs requis manquants." }, status: 400 };
    if (type === "csv" && !endpoint && !filePath)
      return {
        error: { message: "Un endpoint ou un fichier CSV est requis." },
        status: 400,
      };
    const source = await DataSource.create({
      name,
      type,
      endpoint,
      filePath,
      config,
      ownerId,
      ...(timestampField ? { timestampField } : {}),
    });
    return { data: source };
  },
  async getById(id: string) {
    const source = await DataSource.findById(id);
    if (!source)
      return { error: { message: "Source non trouvée." }, status: 404 };
    return { data: source };
  },
  async update(id: string, payload: DataSourceUpdatePayload) {
    const { name, type, endpoint, filePath, config } = payload;
    const source = await DataSource.findByIdAndUpdate(
      id,
      { name, type, endpoint, filePath, config },
      { new: true }
    );
    if (!source)
      return { error: { message: "Source non trouvée." }, status: 404 };
    return { data: source };
  },
  async remove(id: string) {
    const source = await DataSource.findByIdAndDelete(id);
    if (!source)
      return { error: { message: "Source non trouvée." }, status: 404 };
    // Suppression du fichier CSV local si présent
    if (source.filePath) {
      try {
        const absPath = getAbsolutePath(source.filePath);
        await fs.unlink(absPath);
      } catch (e) {
      }
    }
    return { data: { message: "Source supprimée." } };
  },
  async detectColumns({
    type,
    endpoint,
    filePath,
  }: {
    type?: string;
    endpoint?: string;
    filePath?: string;
  }) {
    try {
      let rows: Record<string, unknown>[] = [];
      if (type === "csv" && filePath) {
        rows = await readCsvFile(filePath);
      } else if (type === "csv" && endpoint) {
        rows = await fetchRemoteCsv(endpoint);
      } else if (type === "json" && endpoint) {
        rows = await fetchRemoteJson(endpoint);
      } else {
        return {
          error: {
            message:
              "Type ou configuration de source non supportée pour la détection de colonnes.",
          },
          status: 400,
        };
      }
      const columns = rows[0] ? Object.keys(rows[0]) : [];
      const preview = rows.slice(0, 5);
      const types = inferColumnTypes(preview, columns);
      return { data: { columns, preview, types } };
    } catch (e: unknown) {
      return {
        error: {
          message:
            e instanceof Error
              ? e.message
              : "Erreur lors de la détection des colonnes.",
        },
        status: 500,
      };
    }
  },
  async fetchData(
    sourceId: string,
    options?: {
      from?: string;
      to?: string;
      page?: number;
      pageSize?: number;
      fields?: string;
      forceRefresh?: boolean;
    }
  ) {
    const source = await DataSource.findById(sourceId);
    if (!source)
      return { error: { message: "Source non trouvée." }, status: 404 };
    let data: Record<string, unknown>[] = [];
    // Gestion du cache
    const hasTimestamp = !!source.timestampField;
    // Normalisation des paramètres pour la clé de cache
    const normFrom =
      hasTimestamp && options?.from && options.from !== ""
        ? options.from
        : undefined;
    const normTo =
      hasTimestamp && options?.to && options.to !== "" ? options.to : undefined;
    const cacheKey = getSourceCacheKey(sourceId, normFrom, normTo);
    if (options?.forceRefresh) {
      sourceCache.del(cacheKey);
      inflightLoads.delete(cacheKey);
      console.log(`[CACHE] Suppression du cache pour ${cacheKey}`);
    }
    let cacheTTL = 3600; // 1h par défaut
    if (hasTimestamp && normFrom && normTo) {
      cacheTTL = 60; // 1 min si requête temporelle précise
    } else if (hasTimestamp && !normFrom && !normTo) {
      cacheTTL = 1800; // 30 min si timestampField mais pas de filtre
    }
    const cached = sourceCache.get(cacheKey);
    if (cached) {
      data = cached as Record<string, unknown>[];
      console.log(`[CACHE] Hit pour ${cacheKey}`);
    } else {
      // Anti-stampede : si un chargement est déjà en cours, on attend la promesse
      if (inflightLoads.has(cacheKey)) {
        const inflight = await inflightLoads.get(cacheKey);
        data = inflight ?? [];
        console.log(`[CACHE] Wait for in-flight load for ${cacheKey}`);
      } else {
        // On lance le chargement et on stocke la promesse
        const loadPromise = (async () => {
          let loaded: any[] = [];
          try {
            if (source.type === "json" && source.endpoint) {
              loaded = await fetchRemoteJson(source.endpoint);
            } else if (source.type === "csv" && source.endpoint) {
              loaded = await fetchRemoteCsv(source.endpoint);
            } else if (source.type === "csv" && source.filePath) {
              loaded = await readCsvFile(source.filePath);
            } else {
              return [];
            }
            if (
              hasTimestamp &&
              (options?.from || options?.to) &&
              typeof source.timestampField === "string"
            ) {
              loaded = filterByTimestamp(
                loaded,
                source.timestampField,
                options?.from,
                options?.to
              );
            }
            sourceCache.set(cacheKey, loaded, cacheTTL);
            inflightLoads.delete(cacheKey);
            return loaded;
          } catch (e: any) {
            inflightLoads.delete(cacheKey);
            return Promise.reject({
              error: {
                message:
                  e instanceof Error
                    ? e.message
                    : "Erreur lors de la récupération des données de la source.",
              },
              status: 500,
            });
          }
        })();
        inflightLoads.set(cacheKey, loadPromise);
        try {
          data = await loadPromise;
          console.log(`[CACHE] Nouvelle entrée pour ${cacheKey} (TTL=${cacheTTL}s)`);
        } catch (err: any) {
          // Gestion de l'erreur levée par les utilitaires
          return err;
        }
      }
    }
    // Sélection des colonnes si fields est défini
    if (options?.fields) {
      const fieldsArr = options.fields
        .split(",")
        .map((f) => f.trim())
        .filter(Boolean);
      data = data.map((row) =>
        Object.fromEntries(
          Object.entries(row).filter(([k]) => fieldsArr.includes(k))
        )
      );
    }
    // Pagination si demandée
    if (options?.page && options?.pageSize) {
      const total = data.length;
      const page = options.page;
      const pageSize = options.pageSize;
      const start = (page - 1) * pageSize;
      const pageData = data.slice(start, start + pageSize);
      return { data: pageData, total };
    }
    // Par défaut, tout renvoyer (attention à la volumétrie)
    return { data };
  },
};

export default dataSourceService;
