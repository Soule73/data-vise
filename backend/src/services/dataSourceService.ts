import DataSource from "../models/DataSource";
import path from "path";
import fs from "fs/promises";
import csv from "csvtojson";

function inferColumnTypes(
  rows: any[],
  columns: string[]
): Record<string, string> {
  const types: Record<string, string> = {};
  for (const col of columns) {
    const values = rows
      .map((row) => row[col])
      .filter((v) => v !== undefined && v !== null && v !== "");
    if (values.length === 0) {
      types[col] = "inconnu";
      continue;
    }
    // Détection date/datetime
    const isDate = (val: any) =>
      typeof val === "string" && /^\d{4}-\d{2}-\d{2}$/.test(val);
    const isDateTime = (val: any) =>
      typeof val === "string" &&
      (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z?$/.test(val) ||
        (!isDate(val) && !isNaN(Date.parse(val))));
    if (values.every(isDate)) {
      types[col] = "date";
    } else if (values.every(isDateTime)) {
      types[col] = "datetime";
    } else if (values.every((v) => !isNaN(Number(v)))) {
      types[col] = "number";
    } else if (values.every((v) => v === "true" || v === "false")) {
      types[col] = "boolean";
    } else {
      types[col] = "string";
    }
  }
  return types;
}

const dataSourceService = {
  async list() {
    const sources = await DataSource.find();
    return { data: sources };
  },
  async create({
    name,
    type,
    endpoint,
    filePath,
    config,
    ownerId,
    timestampField,
  }: any) {
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
  async update(id: string, { name, type, endpoint, filePath, config }: any) {
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
        const absPath = path.isAbsolute(source.filePath)
          ? source.filePath
          : path.join(process.cwd(), source.filePath);
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
    if (type === "csv" && filePath) {
      try {
        const absPath = path.isAbsolute(filePath)
          ? filePath
          : path.join(process.cwd(), filePath);
        const text = await fs.readFile(absPath, "utf-8");
        const rows = await csv().fromString(text);
        const columns = rows[0] ? Object.keys(rows[0]) : [];
        const preview = rows.slice(0, 5);
        const types = inferColumnTypes(preview, columns);
        return { data: { columns, preview, types } };
      } catch (e) {
        return {
          error: { message: "Erreur lors de la lecture du fichier CSV." },
          status: 500,
        };
      }
    } else if (type === "csv" && endpoint) {
      let fetchImpl;
      try {
        fetchImpl = (await import("node-fetch")).default;
      } catch (e) {
        return { error: { message: "node-fetch non installé." }, status: 500 };
      }
      try {
        const response = await fetchImpl(endpoint);
        const text = await response.text();
        const rows = await csv().fromString(text);
        const columns = rows[0] ? Object.keys(rows[0]) : [];
        const preview = rows.slice(0, 5);
        const types = inferColumnTypes(preview, columns);
        return { data: { columns, preview, types } };
      } catch (e) {
        return {
          error: { message: "Erreur lors de la récupération CSV distant." },
          status: 500,
        };
      }
    } else if (type === "json" && endpoint) {
      let fetchImpl;
      try {
        fetchImpl = (await import("node-fetch")).default;
      } catch (e) {
        return { error: { message: "node-fetch non installé." }, status: 500 };
      }
      try {
        const response = await fetchImpl(endpoint);
        const data = await response.json();
        let columns: string[] = [];
        let preview: any[] = [];
        let types: Record<string, string> = {};
        if (Array.isArray(data) && data.length > 0) {
          columns = Object.keys(data[0]);
          preview = data.slice(0, 5);
          types = inferColumnTypes(preview, columns);
        } else if (typeof data === "object" && data !== null) {
          columns = Object.keys(data);
          preview = [data];
          types = inferColumnTypes(preview, columns);
        }
        return { data: { columns, preview, types } };
      } catch (err) {
        return {
          error: { message: "Impossible de détecter les colonnes." },
          status: 500,
        };
      }
    } else {
      return {
        error: {
          message:
            "Type ou configuration de source non supportée pour la détection de colonnes.",
        },
        status: 400,
      };
    }
  },
  async fetchData(sourceId: string, options?: { from?: string; to?: string }) {
    const source = await DataSource.findById(sourceId);
    if (!source)
      return { error: { message: "Source non trouvée." }, status: 404 };
    let data: any[] = [];
    // 1. JSON distant
    if (source.type === "json" && source.endpoint) {
      let fetchImpl;
      try {
        fetchImpl = (await import("node-fetch")).default;
      } catch (e) {
        return { error: { message: "node-fetch non installé." }, status: 500 };
      }
      try {
        const response = await fetchImpl(source.endpoint);
        const raw = await response.json();
        data = Array.isArray(raw) ? raw : [raw];
      } catch (e) {
        return {
          error: { message: "Erreur lors de la récupération JSON." },
          status: 500,
        };
      }
    }
    // 2. CSV distant
    else if (source.type === "csv" && source.endpoint) {
      let fetchImpl;
      try {
        fetchImpl = (await import("node-fetch")).default;
      } catch (e) {
        return { error: { message: "node-fetch non installé." }, status: 500 };
      }
      try {
        const response = await fetchImpl(source.endpoint);
        const text = await response.text();
        data = await csv().fromString(text);
      } catch (e) {
        return {
          error: { message: "Erreur lors de la récupération CSV distant." },
          status: 500,
        };
      }
    }
    // 3. CSV local
    else if (source.type === "csv" && source.filePath) {
      try {
        const absPath = path.isAbsolute(source.filePath)
          ? source.filePath
          : path.join(process.cwd(), source.filePath);
        const text = await fs.readFile(absPath, "utf-8");
        data = await csv().fromString(text);
      } catch (e) {
        return {
          error: { message: "Erreur lors de la lecture du fichier CSV." },
          status: 500,
        };
      }
    } else {
      return {
        error: { message: "Type ou configuration de source non supportée." },
        status: 400,
      };
    }
    // Filtrage par timestamp si demandé
    if (source.timestampField && (options?.from || options?.to)) {
      data = data.filter((row) => {
        const ts = row[source.timestampField!];
        if (!ts) return false;
        const date = new Date(ts);
        if (options.from && date < new Date(options.from)) return false;
        if (options.to && date > new Date(options.to)) return false;
        return true;
      });
    }
    return { data };
  },
};

export default dataSourceService;
