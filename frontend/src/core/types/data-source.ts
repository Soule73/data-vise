export interface DataSource {
  _id: string;
  name: string;
  type: "json" | "csv"; // type = format
  endpoint?: string; // optionnel
  filePath?: string; // nouveau champ pour stockage local CSV
  config?: Record<string, unknown>;
  ownerId: string;
  visibility: "public" | "private";
  timestampField?: string;
  createdAt?: string;
  updatedAt?: string;
}
