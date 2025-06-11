import { IPermission } from '@/types/authType';
import mongoose, { Document, Schema } from 'mongoose';



const PermissionSchema = new Schema<IPermission>({
  name: { type: String, required: true, unique: true },
  description: { type: String },
});

export default mongoose.model<IPermission>('Permission', PermissionSchema);
