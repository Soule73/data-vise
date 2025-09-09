#!/bin/bash

# Script de déploiement automatisé pour Data Vise
# Usage: ./deploy.sh [preview|production]

set -e

echo "🚀 Déploiement Data Vise sur Vercel"
echo "=================================="

# Vérification des pré-requis
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI non installé. Installation..."
    npm i -g vercel
fi

if ! command -v node &> /dev/null; then
    echo "❌ Node.js requis"
    exit 1
fi

# Mode de déploiement
MODE=${1:-preview}
echo "📦 Mode: $MODE"

# Nettoyage des builds précédents
echo "🧹 Nettoyage..."
rm -rf frontend/dist/
rm -rf backend/dist/

# Installation des dépendances
echo "📦 Installation des dépendances..."
cd backend && npm ci --only=production
cd ../frontend && npm ci

# Vérification de la configuration
echo "🔍 Vérification de la configuration..."
if [ ! -f "../vercel.json" ]; then
    echo "❌ vercel.json manquant"
    exit 1
fi

# Build local pour vérification
echo "🔨 Build de vérification..."
npm run build

cd ..

# Déploiement
echo "🚀 Déploiement en cours..."
if [ "$MODE" = "production" ]; then
    vercel --prod --yes
else
    vercel --yes
fi

echo "✅ Déploiement terminé !"
echo "🌐 Vérifiez votre application sur l'URL fournie par Vercel"

# Instructions post-déploiement
echo ""
echo "📋 Instructions post-déploiement:"
echo "1. Configurez les variables d'environnement dans Vercel Dashboard"
echo "2. Vérifiez la connexion à MongoDB"
echo "3. Testez les endpoints API"
echo "4. Vérifiez le fonctionnement du frontend"
