import mongoose from 'mongoose';

const { Schema } = mongoose;

export interface IUser extends mongoose.Document {
  username: string;
  email: string;
  password: string;
  roleId: mongoose.Types.ObjectId; // Référence au rôle
  preferences?: Record<string, any>;
}

const UserSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  roleId: { type: Schema.Types.ObjectId, ref: 'Role', required: true }, // Référence à Role
  preferences: { type: Schema.Types.Mixed, default: {} },
}, { timestamps: true });

export default mongoose.model<IUser>('User', UserSchema);
