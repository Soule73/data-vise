import mongoose from 'mongoose';

const { Schema } = mongoose;

export interface DashboardLayoutItem {
  widgetId: string;
  w: number;
  h: number;
  x: number;
  y: number;
}

export interface DashboardHistoryItem {
  userId: mongoose.Types.ObjectId;
  date: Date;
  action: 'create' | 'update' | 'delete';
  changes?: Record<string, any>;
}

export interface IDashboard extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  layout: DashboardLayoutItem[];
  ownerId: mongoose.Types.ObjectId;
  visibility: 'public' | 'private';
  createdAt: Date;
  updatedAt: Date;
  history?: DashboardHistoryItem[];
}

const DashboardLayoutItemSchema = new Schema({
  widgetId: { type: String, required: true },
  w: { type: Number, required: true },
  h: { type: Number, required: true },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
}, { _id: false });

const DashboardHistoryItemSchema = new Schema<DashboardHistoryItem>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  action: { type: String, enum: ['create', 'update', 'delete'], required: true },
  changes: { type: Schema.Types.Mixed },
}, { _id: false });

const DashboardSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  layout: { type: [DashboardLayoutItemSchema], default: [] },
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  history: { type: [DashboardHistoryItemSchema], default: [] },
}, { timestamps: true });

export default mongoose.model<IDashboard>('Dashboard', DashboardSchema);
