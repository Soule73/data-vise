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
  esQuery?: string;
}

export interface DetectParams {
  type: "json" | "csv" | "elasticsearch";
  csvOrigin?: "url" | "upload";
  csvFile?: File | null;
  endpoint?: string;
  httpMethod?: "GET" | "POST";
  authType?: "none" | "bearer" | "apiKey" | "basic";
  file?: File;
  authConfig?: {
    token?: string;
    apiKey?: string;
    username?: string;
    password?: string;
    headerName?: string;
  };
  esIndex?: string;
  esQuery?: string;
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