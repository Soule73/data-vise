const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Imports des routes du backend existant - utilisation de require pour compatibility
const authRoutes = require('../backend/src/routes/auth');
const dataSourceRoutes = require('../backend/src/routes/datasource');  
const widgetRoutes = require('../backend/src/routes/widget');
const dashboardRoutes = require('../backend/src/routes/dashboard');
const uploadsRoutes = require('../backend/src/routes/uploads');
const { initPermissionsAndRoles } = require('../backend/src/data/initPermissions');

// Configuration automatique des variables d'environnement par Vercel

const app = express();

// Configuration CORS pour Vercel
app.use(cors({
    origin: process.env.CORS_ORIGIN || process.env.FRONTEND_URL,
    credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Connexion MongoDB (avec cache de connexion pour Vercel)
let cachedConnection: typeof mongoose | null = null;

async function connectToDatabase() {
    if (cachedConnection) {
        return cachedConnection;
    }

    try {
        const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
        if (!mongoUri) {
            throw new Error('MONGODB_URI or MONGO_URI environment variable is required');
        }

        cachedConnection = await mongoose.connect(mongoUri, {
            bufferCommands: false,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });

        console.log('Connected to MongoDB');

        // Initialiser les permissions et rôles une seule fois
        await initPermissionsAndRoles();

        return cachedConnection;
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
}

// Configuration des routes
app.use('/api/auth', authRoutes);
app.use('/api/datasource', dataSourceRoutes);
app.use('/api/widget', widgetRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/uploads', uploadsRoutes);

// Route de santé
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'production'
    });
});

// Middleware de gestion d'erreurs
app.use((error: any, req: any, res: any, next: any) => {
    console.error('API Error:', error);
    res.status(error.status || 500).json({
        message: error.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    });
});

// Handler principal pour Vercel (export CommonJS)
module.exports = async function handler(req, res) {
    try {
        // Connecter à la base de données
        await connectToDatabase();

        // Traiter la requête avec Express
        return app(req, res);
    } catch (error) {
        console.error('Handler error:', error);
        return res.status(500).json({
            error: 'Internal Server Error',
            message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
        });
    }
};
