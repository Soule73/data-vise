import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from "@routes/auth";
import dataSourceRoutes from "@routes/datasource";
import widgetRoutes from "@routes/widget";
import dashboardRoutes from "@routes/dashboard";
import uploadsRoutes from "@routes/uploads";
import type { Request, Response, NextFunction } from "express";
import { initPermissionsAndRoles } from "@data/initPermissions";

dotenv.config();

const PORT = process.env.PORT;

const allowOrigin = process.env.CORS_ORIGIN;

const appDomain = process.env.APP_DOMAIN;

const appDebug = process.env.APP_DEGUG;

const app = express();

app.use(
  cors({
    origin: allowOrigin,
    credentials: true,
  })
);

app.options("*", cors());

app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  next();
});

app.get("/", (req, res) => {
  res.json({ message: "API Data-Vise opérationnelle" });
});

mongoose
  .connect(process.env.MONGO_URI || "", {
    serverSelectionTimeoutMS: 5000,
    connectTimeoutMS: 10000,
  })
  .then(async () => {
    await initPermissionsAndRoles();

    // Only start server in development mode
    if (process.env.NODE_ENV !== 'production') {
      app.listen(PORT, () => {
        if (appDebug) {
          console.log(`Serveur backend démarré sur ${appDomain}:${PORT}`);
        }
      });
    }
  })
  .catch((err) => {
    if (appDebug) {
      console.error("Erreur de connexion MongoDB:", err.message);
    }
  });

app.use("/api/auth", authRoutes);

app.use("/api/sources", dataSourceRoutes);

app.use("/api/widgets", widgetRoutes);

app.use("/api/dashboards", dashboardRoutes);

app.use("/api/uploads", uploadsRoutes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || 500;

  res.status(status).json({
    success: false,
    error: err.message || "Erreur serveur",
    status,
  });
});

// Export the Express app for serverless function handler
export default app;
