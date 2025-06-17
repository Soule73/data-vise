import mongoose from "mongoose";

export interface IDataSource extends Document {
  name: string;
  type: "json" | "csv"; // type = format
  endpoint?: string; // optionnel
  filePath?: string; // nouveau champ pour stockage local CSV
  config?: Record<string, unknown>;
  ownerId: mongoose.Types.ObjectId;
  visibility: "public" | "private";
  timestampField?: string;
}

export interface DataSourceBasePayload {
  name?: string;
  type?: "json" | "csv";
  endpoint?: string;
  filePath?: string;
  config?: Record<string, unknown>;
}

export interface DataSourceCreatePayload extends DataSourceBasePayload {
  name: string;
  type: "json" | "csv";
  ownerId: mongoose.Types.ObjectId;
  timestampField?: string;
}

export type DataSourceUpdatePayload = Partial<DataSourceBasePayload>;
