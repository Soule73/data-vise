#!/bin/bash

# Script de déploiement pour Data Vise sur Vercel

echo "🚀 Déploiement de Data Vise sur Vercel"

# Vérifier si Vercel CLI est installé
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI n'est pas installé. Installation..."
    npm install -g vercel
fi

# Build du frontend
echo "📦 Build du frontend..."
cd frontend
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Erreur lors du build du frontend"
    exit 1
fi
cd ..

# Build du backend
echo "📦 Build du backend..."
cd backend
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Erreur lors du build du backend"
    exit 1
fi
cd ..

# Vérifier les variables d'environnement
echo "🔍 Vérification des variables d'environnement..."
if [ ! -f ".env" ]; then
    echo "⚠️  Fichier .env manquant. Copiez .env.example vers .env et configurez vos variables"
    echo "Ou configurez-les directement sur Vercel Dashboard"
fi

# Déploiement sur Vercel
echo "🚀 Déploiement sur Vercel..."
vercel --prod

echo "✅ Déploiement terminé!"
echo "📱 Vérifiez votre application sur le domaine fourni par Vercel"
