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
        console.log("[BACKEND][REMOVE] Fichier CSV supprimé:", absPath);
      } catch (e) {
        console.warn(
          "[BACKEND][REMOVE] Impossible de supprimer le fichier CSV:",
          source.filePath,
          e
        );
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
  async fetchData(sourceId: string, options?: { from?: string; to?: string }) {
    const source = await DataSource.findById(sourceId);
    if (!source)
      return { error: { message: "Source non trouvée." }, status: 404 };
    let data: Record<string, unknown>[] = [];
    try {
      if (source.type === "json" && source.endpoint) {
        data = await fetchRemoteJson(source.endpoint);
      } else if (source.type === "csv" && source.endpoint) {
        data = await fetchRemoteCsv(source.endpoint);
      } else if (source.type === "csv" && source.filePath) {
        data = await readCsvFile(source.filePath);
      } else {
        return {
          error: { message: "Type ou configuration de source non supportée." },
          status: 400,
        };
      }
      if (source.timestampField && (options?.from || options?.to)) {
        data = filterByTimestamp(
          data,
          source.timestampField,
          options?.from,
          options?.to
        );
      }
      return { data };
    } catch (e: unknown) {
      return {
        error: {
          message:
            e instanceof Error
              ? e.message
              : "Erreur lors de la récupération des données.",
        },
        status: 500,
      };
    }
  },
};

export default dataSourceService;
