import mongoose, { Document, Schema } from 'mongoose';

export interface IWidget extends Document {
  widgetId: string;
  title: string;
  type: string;
  dataSourceId: mongoose.Types.ObjectId;
  config?: Record<string, any>;
  dashboardIds?: mongoose.Types.ObjectId[]; // Un widget peut appartenir à plusieurs dashboards
}

const WidgetSchema = new Schema<IWidget>({
  widgetId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  type: { type: String, required: true },
  dataSourceId: { type: Schema.Types.ObjectId, ref: 'DataSource', required: true },
  config: { type: Schema.Types.Mixed, default: {} },
  dashboardIds: [{ type: Schema.Types.ObjectId, ref: 'Dashboard' }], // Plusieurs dashboards possibles
}, { timestamps: true });

export default mongoose.model<IWidget>('Widget', WidgetSchema);
