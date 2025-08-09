import { IPermission } from "@type/authType";
import mongoose, { Schema } from "mongoose";

const PermissionSchema = new Schema<IPermission>({
  name: { type: String, required: true, unique: true },
  description: { type: String },
});

export default mongoose.model<IPermission>("Permission", PermissionSchema);
