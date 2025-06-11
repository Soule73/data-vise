import mongoose from "mongoose";

export interface IDataSource extends Document {
    name: string;
    type: string;
    endpoint: string;
    config?: Record<string, any>;
    ownerId: mongoose.Types.ObjectId;
    visibility: 'public' | 'private';
}