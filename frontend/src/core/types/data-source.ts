export interface DataSource {
  _id: string;
  name: string;
  type: "json" | "csv";
  endpoint?: string;
  filePath?: string;
  config?: Record<string, any>;
  ownerId: string;
  visibility: "public" | "private";
  timestampField?: string;
  createdAt?: string;
  updatedAt?: string;
  httpMethod?: "GET" | "POST";
  authType?: "none" | "bearer" | "apiKey" | "basic";
  authConfig?: {
    token?: string;
    apiKey?: string;
    username?: string;
    password?: string;
    headerName?: string;
  };
  isUsed?: boolean; // Ajouté pour indiquer si la source est utilisée par au moins un widget
}
