import mongoose from "mongoose";

export interface WidgetHistoryItem {
    userId: mongoose.Types.ObjectId;
    date: Date;
    action: 'create' | 'update' | 'delete';
    changes?: Record<string, any>;
}

export interface IWidget extends Document {
    widgetId: string;
    title: string;
    type: string;
    dataSourceId: mongoose.Types.ObjectId;
    config?: Record<string, any>;
    ownerId: mongoose.Types.ObjectId; // ID de l'utilisateur propriétaire du widget
    visibility: 'public' | 'private'; // Visibilité du widget
    history?: WidgetHistoryItem[];
}