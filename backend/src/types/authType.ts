import { Request } from 'express';
import mongoose from 'mongoose';

export interface IUser extends mongoose.Document {
    username: string;
    email: string;
    password: string;
    roleId: mongoose.Types.ObjectId;
    preferences?: Record<string, any>;
}

export interface AuthUser {
    id: string;
    role: string;
}

export interface AuthRequest extends Request {
    user?: AuthUser;
}

export interface IPermission extends Document {
    name: string;
    description?: string;
}


export interface IRole extends Document {
    name: string;
    description?: string;
    permissions: mongoose.Types.ObjectId[];
}