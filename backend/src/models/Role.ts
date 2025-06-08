import mongoose, { Document, Schema } from 'mongoose';

export interface IRole extends Document {
  name: string; // ex: admin, user, manager
  description?: string;
  permissions: mongoose.Types.ObjectId[]; // Références vers Permission
}

const RoleSchema = new Schema<IRole>({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  permissions: [{ type: Schema.Types.ObjectId, ref: 'Permission', required: true }],
});

export default mongoose.model<IRole>('Role', RoleSchema);
