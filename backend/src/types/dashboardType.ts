import mongoose from "mongoose";

export interface DashboardLayoutItem {
    widgetId: string;
    width: string; // ex: "48%"
    height: number; // px
    x: number;
    y: number;
    widget?: any;
}

export interface DashboardHistoryItem {
    userId: mongoose.Types.ObjectId;
    date: Date;
    action: 'create' | 'update' | 'delete';
    changes?: Record<string, any>;
}

export interface IDashboard extends mongoose.Document {
    userId: mongoose.Types.ObjectId;
    title: string;
    layout: DashboardLayoutItem[];
    ownerId: mongoose.Types.ObjectId;
    visibility: 'public' | 'private';
    createdAt: Date;
    updatedAt: Date;
    history?: DashboardHistoryItem[];
}