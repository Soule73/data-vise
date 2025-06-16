import { DashboardHistoryItem, IDashboard } from "@/types/dashboardType";
import mongoose from "mongoose";

const { Schema } = mongoose;

const DashboardLayoutItemSchema = new Schema(
  {
    widgetId: { type: String, required: true },
    width: { type: String, required: true }, // ex: "48%"
    height: { type: Number, required: true }, // px
    x: { type: Number, required: true },
    y: { type: Number, required: true },
  },
  { _id: false }
);

const DashboardHistoryItemSchema = new Schema<DashboardHistoryItem>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, default: Date.now },
    action: {
      type: String,
      enum: ["create", "update", "delete"],
      required: true,
    },
    changes: { type: Schema.Types.Mixed },
  },
  { _id: false }
);

const DashboardSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    layout: { type: [DashboardLayoutItemSchema], default: [] },
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    history: { type: [DashboardHistoryItemSchema], default: [] },
    // Auto-refresh config
    autoRefreshInterval: { type: Number, default: 60000 }, // ms, 1min par défaut
    autoRefreshIntervalValue: { type: Number }, // valeur personnalisée (ex: 5)
    autoRefreshIntervalUnit: { type: String }, // unité (minute, heure, etc.)
    // Ajout timeRange pour filtrage temporel global
    timeRange: {
      from: { type: Date },
      to: { type: Date }, // plus de default: Date.now
      intervalValue: { type: Number },
      intervalUnit: { type: String },
    },
  },
  { timestamps: true }
);

export default mongoose.model<IDashboard>("Dashboard", DashboardSchema);
