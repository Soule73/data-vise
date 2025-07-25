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
  IDataSource,
} from "@/types/sourceType";
import type { ApiError, ApiResponse, ApiData } from "@/types/api";
import { sourceCache, getSourceCacheKey } from "@/utils/sourceCache";
import Dashboard from "@/models/Dashboard";
import { IWidget } from "@/types/widgetType";
import { ObjectId } from "mongoose";
import { DashboardLayoutItem } from "@/types/dashboardType";
import { toApiData, toApiError } from "@/utils/api";
import { Client, Client as ESClient } from "@elastic/elasticsearch";

// Map pour suivre les chargements en cours (anti-stampede)
const inflightLoads = new Map<string, Promise<any[]>>();

/**
 * Service de gestion des sources de données (DataSource).
 * Fournit les opérations CRUD, la détection de colonnes et la récupération de données avec gestion du cache et accès public via shareId.
 */
const dataSourceService = {
  /**
   * Liste toutes les sources de données avec indication d'utilisation par au moins un widget.
   * Chaque source est enrichie d'un champ `isUsed` indiquant si elle est utilisée par au moins un widget.
   * @return {Promise<ApiData<(DataSource & { isUsed: boolean })[]>>} - La liste des sources de données avec leur état d'utilisation.
   * @throws {ApiError} - Si une erreur se produit lors de la récupération des sources de données.
   * @description Cette méthode récupère toutes les sources de données depuis la base de données,
   */
  async list(): Promise<ApiData<(IDataSource & { isUsed: boolean })[]>> {
    const sources = await DataSource.find();

    const sourcesWithUsage = await Promise.all(
      sources.map(async (ds) => {
        const count = await Widget.countDocuments({ dataSourceId: ds._id });
        return { ...ds.toObject(), isUsed: count > 0 };
      })
    );

    return toApiData(sourcesWithUsage);
  },

  /**
   * Crée une nouvelle source de données.
   * @param {DataSourceCreatePayload} payload - Les données de la source à créer.
   * @return {Promise<ApiResponse<object>>} - La réponse contenant la source créée ou
   * une erreur si la création échoue.
   * @throws {ApiError} - Si des champs requis sont manquants ou si
   * la source ne peut pas être créée.
   * @description Cette méthode crée une nouvelle source de données dans la base de données.
   */
  async create(
    payload: DataSourceCreatePayload
  ): Promise<ApiResponse<IDataSource>> {
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

    return toApiData(source);
  },

  /**
   * Récupère une source de données par son identifiant.
   * @param {string} id - L'identifiant de la source à récupérer.
   * @return {Promise<ApiResponse<IDataSource & { isUsed: boolean }>>} - La réponse contenant la source trouvée
   * ou une erreur si la source n'existe pas.
   * @throws {ApiError} - Si la source n'est pas trouvée.
   */
  async getById(
    id: string
  ): Promise<ApiResponse<IDataSource & { isUsed: boolean }>> {
    const source = await DataSource.findById(id);

    if (!source) {
      return { error: { message: "Source non trouvée." }, status: 404 };
    }

    const count = await Widget.countDocuments({ dataSourceId: source._id });

    return toApiData({ ...source.toObject(), isUsed: count > 0 });
  },
  /**
   * Met à jour une source de données existante.
   * @param {string} id - L'identifiant de la source à mettre à jour.
   * @param {DataSourceUpdatePayload} payload - Les données de mise à jour de
   * la source.
   * @return {Promise<ApiResponse<DataSource>>} - La réponse contenant la source mise à jour
   * ou une erreur si la mise à jour échoue.
   * @throws {ApiError} - Si la source n'est pas trouvée ou si des champs requis sont manquants.
   * @description Cette méthode met à jour une source de données existante dans la base de
   * données. Elle prend en compte les champs suivants :
   */
  async update(
    id: string,
    payload: DataSourceUpdatePayload
  ): Promise<ApiResponse<IDataSource>> {
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

    if (!source) {
      return toApiError("Source non trouvée", 404);
    }

    if (oldFilePath && filePath && oldFilePath !== filePath) {
      await fs.unlink(oldFilePath);
    }

    return toApiData(source);
  },

  /**
   * Supprime une source de données si elle n'est pas utilisée par un widget.
   * @param {string} id - L'identifiant de la source à supprimer.
   * @return {Promise<ApiResponse<{ message: string }>>} - La réponse indiquant le succès de la suppression
   * ou une erreur si la source est utilisée par un widget ou si elle n'existe pas.
   * @throws {ApiError} - Si la source est utilisée par un widget ou si elle n'existe pas.
   * @description Cette méthode supprime une source de données de la base de données.
   */
  async remove(id: string): Promise<ApiResponse<{ message: string }>> {
    const count = await Widget.countDocuments({ dataSourceId: id });

    if (count > 0) {
      return toApiError(
        "Impossible de supprimer une source utilisée par au moins un widget.",
        400
      );
    }

    const source = await DataSource.findByIdAndDelete(id);

    if (!source) {
      return toApiError("Source non trouvée.", 404);
    }

    if (source.filePath) {
      try {
        const absPath = getAbsolutePath(source.filePath);
        await fs.unlink(absPath);
      } catch (e) { }
    }

    return toApiData({ message: "Source supprimée." });
  },

  /**
   * Détecte les colonnes d'une source de données (locale ou distante).
   * Cette méthode peut être utilisée pour détecter les colonnes d'un fichier CSV local ou distant,
   * ou d'une API JSON distante. Elle peut également être utilisée pour détecter les colon
   * nes d'une source de données existante en fournissant son ID.
   * @param {Object} params - Les paramètres de détection des colonnes.
   * @param {string} [params.sourceId] - L'ID de la source de données existante.
   * @param {string} [params.type] - Le type de la source (csv, json).
   * @param {string} [params.endpoint] - L'URL de l'API distante pour les données JSON ou CSV.
   * @param {string} [params.filePath] - Le chemin du fichier CSV local à analyser.
   * @param {string} [params.httpMethod] - La méthode HTTP à utiliser pour
   * récupérer les données (GET ou POST).
   * @param {string} [params.authType] - Le type d'authentication à
   * utiliser pour accéder aux données distantes (none, bearer, apiKey, basic).
   * @param {any} [params.authConfig] - La configuration d'authentification
   * pour les données distantes (par exemple, le token pour l'authentification
   * bearer, la clé API pour l'authentification par clé API, etc.).
   * @return {Promise<ApiResponse<{ columns: string[]; preview: object[]; types: Record<string, string> }>>} - La réponse contenant les colonnes détectées,
   * un aperçu des données et les types de colonnes détectés.
   * @throws {ApiError} - Si une erreur se produit lors de la détection des colonnes,
   * si la source n'est pas trouvée ou si le type de source n'est pas supporté.
   * @description Cette méthode lit un fichier CSV local ou distant, ou récupère des données
   */
  async detectColumns(params: {
    sourceId?: string;
    type?: string;
    endpoint?: string;
    filePath?: string;
    httpMethod?: "GET" | "POST";
    authType?: "none" | "bearer" | "apiKey" | "basic";
    authConfig?: any;
    esIndex?: string;
    esQuery?: any;
  }): Promise<
    ApiResponse<{
      columns: string[];
      preview: object[];
      types: Record<string, string>;
    }>
  > {
    try {
      let rows: Record<string, unknown>[] = [];

      let finalType = params.type;

      let finalEndpoint = params.endpoint;

      let finalFilePath = params.filePath;

      let finalHttpMethod = params.httpMethod;

      let finalAuthType = params.authType;

      let finalAuthConfig = params.authConfig;

      if (params.sourceId && !params.filePath && !params.endpoint) {
        const ds = await DataSource.findById(params.sourceId);
        if (!ds) {
          return toApiError(
            "Source non trouvée pour la détection de colonnes.",
            404
          );
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
      } else if (
        finalType === "elasticsearch" &&
        finalEndpoint &&
        params.esIndex
      ) {
        // Détection colonnes Elasticsearch
        let esClientOptions: any = { node: finalEndpoint };
        // Auth support
        if (
          finalAuthType === "basic" &&
          finalAuthConfig?.username &&
          finalAuthConfig?.password
        ) {
          esClientOptions.auth = {
            username: finalAuthConfig.username,
            password: finalAuthConfig.password,
          };
        } else if (finalAuthType === "bearer" && finalAuthConfig?.token) {
          esClientOptions.headers = {
            Authorization: `Bearer ${finalAuthConfig.token}`,
          };
        }
        // Correction : ne pas forcer Content-Type ici, le client l’ajoute déjà
        // esClientOptions.headers = {
        //   ...(esClientOptions.headers || {}),
        //   'Content-Type': 'application/json',
        // };
        const esClient = new Client(esClientOptions);
        let esQuery = params.esQuery || { match_all: {} };
        try {
          // Requête ES compatible v7 (sans gestion de fields ici)
          const searchParams: any = {
            index: params.esIndex,
            body: { query: esQuery },
            size: 5,
          };
          const result = await esClient.search(searchParams);
          // Typage explicite pour TypeScript v7
          const hits = (result as any).body?.hits?.hits || [];
          rows = hits.map((hit: any) => hit._source || {});
        } catch (esErr: any) {
          console.error(
            "[Elasticsearch DetectColumns] Erreur:",
            esErr?.message || esErr,
            {
              endpoint: finalEndpoint,
              esIndex: params.esIndex,
              esQuery: params.esQuery,
              authType: finalAuthType,
              authConfig: finalAuthConfig,
            }
          );
          if (
            esErr &&
            esErr.message &&
            esErr.message.includes("not Elasticsearch")
          ) {
            return toApiError(
              "L’URL ne pointe pas vers un cluster Elasticsearch valide.",
              400
            );
          }
          // Relancer l’erreur pour le catch global
          throw esErr;
        }
      } else {
        return toApiError(
          "Type ou configuration de source non supportée pour la détection de colonnes.",
          400
        );
      }

      const columns = rows[0] ? Object.keys(rows[0]) : [];

      const preview = rows.slice(0, 5);

      const types = inferColumnTypes(preview, columns);

      return { data: { columns, preview, types } };
    } catch (e: unknown) {
      return toApiError(
        e instanceof Error
          ? e.message
          : "Erreur lors de la détection des colonnes.",
        500
      );
    }
  },
  /**
   * Récupère les données d'une source de données avec gestion du cache, pagination et sélection de champs.
   * @param {string} sourceId - L'identifiant de la source de données.
   * @param {Object} [options] - Les options de récupération des données.
   * @param {string} [options.from] - La date de début pour filtrer les données (format ISO).
   * @param {string} [options.to] - La date de fin pour filtrer les données (format ISO).
   * @param {number} [options.page] - Le numéro de page pour la pagination.
   * @param {number} [options.pageSize] - Le nombre d'éléments par page.
   * @param {string} [options.fields] - Les champs à sélectionner dans les données (séparés par des virgules).
   * @param {boolean} [options.forceRefresh] - Si true, force le rafraîchissement des données et ignore le cache.
   * @param {string} [options.shareId] - L'ID de partage pour accéder aux dashboards partagés.
   * @return {Promise<ApiResponse<Record<string,any>[] & { total?: number }>>} - La réponse contenant les données récupérées,
   * ou une erreur si la source n'est pas trouvée ou si une erreur se produit lors de la récupération des données.
   */
  async fetchData(
    sourceId: string,
    options?: {
      from?: string;
      to?: string;
      page?: number;
      pageSize?: number;
      fields?: string;
      forceRefresh?: boolean;
      shareId?: string;
    }
  ): Promise<ApiResponse<Record<string, any>[] & { total?: number }>> {
    if (options?.shareId) {
      const dashboard = await Dashboard.findOne({
        shareId: options.shareId,
        shareEnabled: true,
      });

      if (!dashboard) {
        return toApiError("Dashboard partagé non trouvé ou désactivé.", 404);
      }

      const widgetIds = dashboard.layout.map(
        (item: DashboardLayoutItem) => item.widgetId
      );

      const widgets = (await Widget.find({
        widgetId: { $in: widgetIds },
      }).lean()) as IWidget[];

      const dataSourceIds = [
        ...new Set(
          widgets.map((w: IWidget) => w.dataSourceId).filter((id) => !!id)
        ),
      ];

      if (!dataSourceIds.map(String).includes(String(sourceId))) {
        return toApiError(
          "Source non autorisée pour ce dashboard partagé.",
          403
        );
      }
    }

    const source = await DataSource.findById(sourceId);
    if (!source)
      return { error: { message: "Source non trouvée." }, status: 404 };
    let data: Record<string, unknown>[] = [];
    // --- Ajout Elasticsearch ---
    if (source.type === "elasticsearch" && source.endpoint && source.esIndex) {
      try {
        const es = new ESClient({ node: source.endpoint });
        const esQuery = source.esQuery || { match_all: {} };
        const page = options?.page || 1;
        const pageSize = options?.pageSize || 5000;
        const from = (page - 1) * pageSize;
        const searchParams: any = {
          index: source.esIndex,
          body: {
            query: esQuery,
          },

          from,
          size: pageSize,
        };
        if (options?.fields) {
          const fieldsArr = options.fields
            .split(",")
            .map((f) => f.trim())
            .filter(Boolean);
          if (fieldsArr.length > 0) {
            searchParams._source = fieldsArr;
          }
        }
        const result = await es.search(searchParams);
        const hits = (result as any).body?.hits?.hits || [];
        data = hits.map((hit: any) => hit._source);
        const total = (result as any).body?.hits?.total;
        console.log(
          `[Elasticsearch fetchData] Succès: index=${source.esIndex
          }, endpoint=${source.endpoint
          }, page=${page}, pageSize=${pageSize}, count=${data.length}, total=${total && typeof total === "object" ? total.value : total
          }`
        );
        return {
          data,
          total: total && typeof total === "object" ? total.value : total,
        } as ApiResponse<Record<string, any>[]> & { total?: number };
      } catch (e: any) {
        console.error("[Elasticsearch fetchData] Erreur:", e?.message || e, {
          endpoint: source.endpoint,
          esIndex: source.esIndex,
          esQuery: source.esQuery,
          page: options?.page,
          pageSize: options?.pageSize,
          fields: options?.fields,
        });
        return {
          error: {
            message:
              e instanceof Error
                ? e.message
                : "Erreur lors de la récupération des données Elasticsearch.",
          },
          status: 500,
        };
      }
    }
    const hasTimestamp = !!source.timestampField;

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

    let cacheTTL = 3600;

    if (hasTimestamp && normFrom && normTo) {
      cacheTTL = 60;
    } else if (hasTimestamp && !normFrom && !normTo) {
      cacheTTL = 1800;
    }

    const cached = sourceCache.get(cacheKey);

    if (cached) {
      data = cached as Record<string, unknown>[];

      console.log(`[CACHE] Hit pour ${cacheKey}`);
    } else {
      if (inflightLoads.has(cacheKey)) {
        const inflight = await inflightLoads.get(cacheKey);

        data = inflight ?? [];

        console.log(`[CACHE] Wait for in-flight load for ${cacheKey}`);
      } else {
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

            return Promise.reject(
              toApiError(
                e instanceof Error
                  ? e.message
                  : "Erreur lors de la récupération des données de la source",
                500
              )
            );
          }
        })();

        inflightLoads.set(cacheKey, loadPromise);

        try {
          data = await loadPromise;
          console.log(
            `[CACHE] Nouvelle entrée pour ${cacheKey} (TTL=${cacheTTL}s)`
          );
        } catch (err: any) {
          return err;
        }
      }
    }

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

    if (options?.page && options?.pageSize) {
      const total = data.length;

      const page = options.page;

      const pageSize = options.pageSize;

      const start = (page - 1) * pageSize;

      const pageData = data.slice(start, start + pageSize);

      return {
        data: pageData,
        ...(typeof total === "number" ? { total } : {}),
      } as ApiData<object[]> & { total?: number };
    }

    return { data };
  },
};

export default dataSourceService;
