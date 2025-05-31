import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from '@/routes/auth';
import dataSourceRoutes from '@/routes/datasource';
import widgetRoutes from '@/routes/widget';
import dashboardRoutes from '@/routes/dashboard';
import type { Request, Response, NextFunction } from 'express';

// Chargement des variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 7000;

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  // methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  // allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.options('*', cors());
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'API Data-Vise opérationnelle' });
});

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI || '', {
  // options recommandées
})
.then(() => {
  console.log('Connecté à MongoDB');
  app.listen(PORT, () => {
    console.log(`Serveur backend démarré sur http://localhost:${PORT}`);
  });
})
.catch((err) => {
  console.error('Erreur de connexion MongoDB:', err);
});

app.use('/api/auth', authRoutes);
app.use('/api/sources', dataSourceRoutes);
app.use('/api/widgets', widgetRoutes);
app.use('/api/dashboards', dashboardRoutes);

// Gestion des erreurs (toutes les routes)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    error: err.message || 'Erreur serveur',
    status
  });
});
