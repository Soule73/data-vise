import mongoose, { Document, Schema } from 'mongoose';

export interface IDataSource extends Document {
  name: string;
  type: string;
  endpoint: string;
  config?: Record<string, any>;
}

const DataSourceSchema = new Schema<IDataSource>({
  name: { type: String, required: true },
  type: { type: String, required: true },
  endpoint: { type: String, required: true },
  config: { type: Schema.Types.Mixed, default: {} },
}, { timestamps: true });

export default mongoose.model<IDataSource>('DataSource', DataSourceSchema);
