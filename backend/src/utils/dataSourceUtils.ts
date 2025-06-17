import path from "path";
import fs from "fs/promises";
import csv from "csvtojson";
import fetch from "node-fetch";

export function inferColumnTypes(
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

// Utilitaire pour nettoyer la timeRange selon le mode
export function cleanTimeRange(timeRange: any) {
  if (!timeRange) return {};
  // Mode relatif : intervalValue + intervalUnit
  if (timeRange.intervalValue && timeRange.intervalUnit) {
    return {
      intervalValue: timeRange.intervalValue,
      intervalUnit: timeRange.intervalUnit,
    };
  }
  // Mode absolu : from/to
  const cleaned: any = {};
  if (timeRange.from)
    cleaned.from =
      typeof timeRange.from === "string"
        ? new Date(timeRange.from)
        : timeRange.from;
  if (timeRange.to)
    cleaned.to =
      typeof timeRange.to === "string" ? new Date(timeRange.to) : timeRange.to;
  return cleaned;
}

export function getAbsolutePath(filePath: string): string {
  return path.isAbsolute(filePath)
    ? filePath
    : path.join(process.cwd(), filePath);
}

export async function readCsvFile(filePath: string): Promise<any[]> {
  const absPath = getAbsolutePath(filePath);
  const text = await fs.readFile(absPath, "utf-8");
  return csv().fromString(text);
}

export async function fetchRemoteCsv(endpoint: string): Promise<any[]> {
  const response = await fetch(endpoint);
  const text = await response.text();
  return csv().fromString(text);
}

export async function fetchRemoteJson(endpoint: string): Promise<any[]> {
  const response = await fetch(endpoint);
  const data = await response.json();
  return Array.isArray(data) ? data : [data];
}

export function filterByTimestamp(
  data: any[],
  field: string,
  from?: string,
  to?: string
): any[] {
  return data.filter((row) => {
    const ts = row[field];
    if (!ts) return false;
    let date: Date | null = null;
    if (typeof ts === "string" && !isNaN(Date.parse(ts))) {
      date = new Date(ts);
    } else if (typeof ts === "number") {
      date = new Date(ts);
    } else if (ts instanceof Date) {
      date = ts;
    } else {
      return false;
    }
    if (!date || isNaN(date.getTime())) return false;
    if (from && date < new Date(from)) return false;
    if (to && date > new Date(to)) return false;
    return true;
  });
}
