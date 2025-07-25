import mongoose from "mongoose";

export interface AuthConfig {
  token?: string;
  apiKey?: string;
  username?: string;
  password?: string;
  headerName?: string;
}
export interface DataSourceBasePayload {
  name: string;
  type: "json" | "csv" | "elasticsearch";
  endpoint?: string;
  config?: Record<string, unknown>;
  visibility: "public" | "private";
  timestampField?: string;
  httpMethod?: "GET" | "POST";
  authType?: "none" | "bearer" | "apiKey" | "basic";
  authConfig?: AuthConfig;
  esIndex?: string;
  esQuery?: any;
}

export interface IDataSource extends Document, DataSourceBasePayload {
  _id: mongoose.Types.ObjectId;
  filePath?: string;
  ownerId: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
  isUsed?: boolean;
}

export interface DataSourceCreatePayload extends DataSourceBasePayload {
  file?: File | null;
  filePath?: string;
  ownerId?: mongoose.Types.ObjectId;
}

export type DataSourceUpdatePayload = Partial<DataSourceCreatePayload>;
