import DataSource from "../models/DataSource";
import Widget from "../models/Widget";
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
    // Pour chaque source, vérifier si elle est utilisée par au moins un widget
    const sourcesWithUsage = await Promise.all(
      sources.map(async (ds) => {
        const count = await Widget.countDocuments({ dataSourceId: ds._id });
        return { ...ds.toObject(), isUsed: count > 0 };
      })
    );
    return { data: sourcesWithUsage };
  },
  async create(payload: DataSourceCreatePayload) {
    const {
      name,
      type,
      endpoint,
      filePath,
      config,
      ownerId,
      timestampField,
      httpMethod,
      authType,
      authConfig,
    } = payload;
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
      ...(httpMethod ? { httpMethod } : {}),
      ...(authType ? { authType } : {}),
      ...(authConfig ? { authConfig } : {}),
    });
    return { data: source };
  },
  async getById(id: string) {
    const source = await DataSource.findById(id);
    if (!source)
      return { error: { message: "Source non trouvée." }, status: 404 };
    const count = await Widget.countDocuments({ dataSourceId: source._id });
    return { data: { ...source.toObject(), isUsed: count > 0 } };
  },
  async update(id: string, payload: DataSourceUpdatePayload) {
    const {
      name,
      type,
      endpoint,
      filePath,
      config,
      httpMethod,
      authType,
      authConfig,
    } = payload;
    // Récupérer l'ancien fichier avant update
    const oldSource = await DataSource.findById(id);
    const oldFilePath = oldSource?.filePath;
    const source = await DataSource.findByIdAndUpdate(
      id,
      {
        name,
        type,
        endpoint,
        filePath,
        config,
        httpMethod,
        authType,
        authConfig,
      },
      { new: true }
    );
    if (!source)
      return { error: { message: "Source non trouvée" }, status: 404 };
    // Si le fichier a changé, supprimer l'ancien fichier
    if (oldFilePath && filePath && oldFilePath !== filePath) {
      const fs = require("fs");
      fs.unlink(oldFilePath, (err: any) => {});
    }
    return { data: source };
  },
  async remove(id: string) {
    // Vérifier si la source est utilisée
    const count = await Widget.countDocuments({ dataSourceId: id });
    if (count > 0) {
      return {
        error: {
          message:
            "Impossible de supprimer une source utilisée par au moins un widget.",
        },
        status: 400,
      };
    }
    const source = await DataSource.findByIdAndDelete(id);
    if (!source)
      return { error: { message: "Source non trouvée." }, status: 404 };
    // Suppression du fichier CSV local si présent
    if (source.filePath) {
      try {
        const absPath = getAbsolutePath(source.filePath);
        await fs.unlink(absPath);
      } catch (e) {}
    }
    return { data: { message: "Source supprimée." } };
  },
  async detectColumns({
    sourceId,
    type,
    endpoint,
    filePath,
    httpMethod,
    authType,
    authConfig,
  }: {
    sourceId?: string;
    type?: string;
    endpoint?: string;
    filePath?: string;
    httpMethod?: "GET" | "POST";
    authType?: "none" | "bearer" | "apiKey" | "basic";
    authConfig?: any;
  }) {
    try {
      let rows: Record<string, unknown>[] = [];
      let finalType = type;
      let finalEndpoint = endpoint;
      let finalFilePath = filePath;
      let finalHttpMethod = httpMethod;
      let finalAuthType = authType;
      let finalAuthConfig = authConfig;
      // Si sourceId fourni et ni filePath ni endpoint, charger la datasource
      if (sourceId && !filePath && !endpoint) {
        const ds = await DataSource.findById(sourceId);
        if (!ds) {
          return {
            error: {
              message: "Source non trouvée pour la détection de colonnes.",
            },
            status: 404,
          };
        }
        finalType = ds.type;
        finalEndpoint = ds.endpoint;
        finalFilePath = ds.filePath;
        finalHttpMethod = ds.httpMethod;
        finalAuthType = ds.authType;
        finalAuthConfig = ds.authConfig;
      }
      if (finalType === "csv" && finalFilePath) {
        rows = await readCsvFile(finalFilePath);
      } else if (finalType === "csv" && finalEndpoint) {
        rows = await fetchRemoteCsv(
          finalEndpoint,
          finalHttpMethod,
          finalAuthType,
          finalAuthConfig
        );
      } else if (finalType === "json" && finalEndpoint) {
        rows = await fetchRemoteJson(
          finalEndpoint,
          finalHttpMethod,
          finalAuthType,
          finalAuthConfig
        );
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
              loaded = await fetchRemoteJson(
                source.endpoint,
                source.httpMethod,
                source.authType,
                source.authConfig
              );
            } else if (source.type === "csv" && source.endpoint) {
              loaded = await fetchRemoteCsv(
                source.endpoint,
                source.httpMethod,
                source.authType,
                source.authConfig
              );
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
          console.log(
            `[CACHE] Nouvelle entrée pour ${cacheKey} (TTL=${cacheTTL}s)`
          );
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
