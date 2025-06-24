import { IDataSource } from "@/types/sourceType";
import mongoose, { Document, Schema } from "mongoose";

const DataSourceSchema = new Schema<IDataSource>(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ["json", "csv"], default: "json" },
    endpoint: { type: String, required: false }, // endpoint devient optionnel
    filePath: { type: String }, // nouveau champ pour stockage local CSV
    config: { type: Schema.Types.Mixed, default: {} },
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    visibility: {
      type: String,
      enum: ["public", "private"],
      default: "private",
    },
    timestampField: { type: String },
    httpMethod: { type: String, enum: ["GET", "POST"], default: "GET" },
    authType: {
      type: String,
      enum: ["none", "bearer", "apiKey", "basic"],
      default: "none",
    },
    authConfig: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export default mongoose.model<IDataSource>("DataSource", DataSourceSchema);
