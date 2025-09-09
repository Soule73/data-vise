#!/bin/bash

# Script pour générer les fichiers package-lock.json manquants

echo "🔍 Vérification des fichiers package-lock.json..."

# Vérifier frontend
if [ ! -f "frontend/package-lock.json" ]; then
    echo "📦 Génération de package-lock.json pour le frontend..."
    cd frontend
    npm install
    cd ..
    echo "✅ package-lock.json créé pour le frontend"
else
    echo "✅ package-lock.json existe déjà pour le frontend"
fi

# Vérifier backend
if [ ! -f "backend/package-lock.json" ]; then
    echo "📦 Génération de package-lock.json pour le backend..."
    cd backend
    npm install
    cd ..
    echo "✅ package-lock.json créé pour le backend"
else
    echo "✅ package-lock.json existe déjà pour le backend"
fi

echo "🎉 Vérification terminée !"
echo "💡 Vous pouvez maintenant utiliser 'npm ci' pour des installations plus rapides"
