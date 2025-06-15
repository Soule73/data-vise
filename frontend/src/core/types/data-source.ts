export interface DataSource {
  _id: string;
  name: string;
  type: string;
  endpoint: string;
  config?: Record<string, unknown>;
  ownerId: string;
  visibility: "public" | "private";
  createdAt?: string;
  updatedAt?: string;
}
