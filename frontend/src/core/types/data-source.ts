interface DataSourceBase {
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

export interface DataSource extends DataSourceBase {
  _id: string;
  filePath?: string;
  ownerId: string;
  timestampField?: string;
  createdAt?: string;
  updatedAt?: string;
  isUsed?: boolean;
}


export interface AuthConfig {
  token?: string;
  apiKey?: string;
  username?: string;
  password?: string;
  headerName?: string;
}

export interface CreateSourcePayload extends DataSourceBase {
  file?: File | null;
}