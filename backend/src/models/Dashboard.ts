import mongoose from 'mongoose';

const { Schema } = mongoose;

export interface DashboardLayoutItem {
  widgetId: string;
  w: number;
  h: number;
  x: number;
  y: number;
}

export interface IDashboard extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  layout: DashboardLayoutItem[];
  createdAt: Date;
  updatedAt: Date;
}

const DashboardLayoutItemSchema = new Schema({
  widgetId: { type: String, required: true },
  w: { type: Number, required: true },
  h: { type: Number, required: true },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
}, { _id: false });

const DashboardSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  layout: { type: [DashboardLayoutItemSchema], default: [] },
}, { timestamps: true });

export default mongoose.model<IDashboard>('Dashboard', DashboardSchema);
