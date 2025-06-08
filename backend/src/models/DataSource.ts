import mongoose, { Document, Schema } from 'mongoose';

export interface IDataSource extends Document {
  name: string;
  type: string;
  endpoint: string;
  config?: Record<string, any>;
  ownerId: mongoose.Types.ObjectId;
  visibility: 'public' | 'private';
}

const DataSourceSchema = new Schema<IDataSource>({
  name: { type: String, required: true },
  type: { type: String, required: true },
  endpoint: { type: String, required: true },
  config: { type: Schema.Types.Mixed, default: {} },
  ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  visibility: { type: String, enum: ['public', 'private'], default: 'private' },
}, { timestamps: true });

export default mongoose.model<IDataSource>('DataSource', DataSourceSchema);
