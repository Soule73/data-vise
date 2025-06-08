import mongoose, { Document, Schema } from 'mongoose';

export interface IPermission extends Document {
  name: string; // ex: dashboard:canView
  description?: string;
}

const PermissionSchema = new Schema<IPermission>({
  name: { type: String, required: true, unique: true },
  description: { type: String },
});

export default mongoose.model<IPermission>('Permission', PermissionSchema);
