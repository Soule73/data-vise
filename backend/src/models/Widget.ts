import mongoose, { Document, Schema } from 'mongoose';

export interface WidgetHistoryItem {
  userId: mongoose.Types.ObjectId;
  date: Date;
  action: 'create' | 'update' | 'delete';
  changes?: Record<string, any>;
}

export interface IWidget extends Document {
  widgetId: string;
  title: string;
  type: string;
  dataSourceId: mongoose.Types.ObjectId;
  config?: Record<string, any>;
  ownerId: mongoose.Types.ObjectId; // ID de l'utilisateur propriétaire du widget
  visibility: 'public' | 'private'; // Visibilité du widget
  history?: WidgetHistoryItem[];
}

const WidgetHistoryItemSchema = new Schema<WidgetHistoryItem>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  action: { type: String, enum: ['create', 'update', 'delete'], required: true },
  changes: { type: Schema.Types.Mixed },
}, { _id: false });

const WidgetSchema = new Schema<IWidget>({
  widgetId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  type: { type: String, required: true },
  dataSourceId: { type: Schema.Types.ObjectId, ref: 'DataSource', required: true },
  config: { type: Schema.Types.Mixed, default: {} },
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  visibility: { type: String, enum: ['public', 'private'], default: 'private' },
  history: { type: [WidgetHistoryItemSchema], default: [] },
}, { timestamps: true });

export default mongoose.model<IWidget>('Widget', WidgetSchema);
