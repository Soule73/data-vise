import mongoose from "mongoose";

export interface IDataSource extends Document {
  name: string;
  type: "json" | "csv"; // type = format
  endpoint?: string; // optionnel
  filePath?: string; // nouveau champ pour stockage local CSV
  config?: Record<string, any>;
  ownerId: mongoose.Types.ObjectId;
  visibility: "public" | "private";
  timestampField?: string;
}
