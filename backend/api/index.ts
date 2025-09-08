import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "../src/routes/auth";
import dataSourceRoutes from "../src/routes/datasource";
import widgetRoutes from "../src/routes/widget";
import dashboardRoutes from "../src/routes/dashboard";
import uploadsRoutes from "../src/routes/uploads";
import type { Request, Response, NextFunction, Application } from "express";
import { initPermissionsAndRoles } from "../src/data/initPermissions";

dotenv.config();

const app: Application = express();

const allowOrigin = process.env.CORS_ORIGIN || "*";

app.use(
    cors({
        origin: allowOrigin,
        credentials: true,
    })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Fonction pour initialiser MongoDB
async function initMongoDB() {
    if (mongoose.connection.readyState === 0) {
        try {
            await mongoose.connect(process.env.MONGO_URI || "", {
                serverSelectionTimeoutMS: 5000,
                connectTimeoutMS: 10000,
            });
            await initPermissionsAndRoles();
            console.log("MongoDB connecté et permissions initialisées");
        } catch (err: any) {
            console.error("Erreur de connexion MongoDB:", err.message);
            throw err;
        }
    }
}

// Routes API
app.use("/api/auth", authRoutes);
app.use("/api/sources", dataSourceRoutes);
app.use("/api/widgets", widgetRoutes);
app.use("/api/dashboards", dashboardRoutes);
app.use("/api/uploads", uploadsRoutes);

// Middleware de gestion d'erreur
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const status = err.status || 500;
    res.status(status).json({
        success: false,
        error: err.message || "Erreur serveur",
        status,
    });
});

// Route de santé
app.get("/api/health", (req: Request, res: Response) => {
    res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Handler pour Vercel
export default async (req: Request, res: Response) => {
    try {
        await initMongoDB();
        app(req, res);
    } catch (error) {
        console.error("Erreur lors de l'initialisation:", error);
        res.status(500).json({
            success: false,
            error: "Erreur de configuration du serveur"
        });
    }
};
