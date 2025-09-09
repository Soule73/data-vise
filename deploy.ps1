# Script de déploiement PowerShell pour Data Vise
# Usage: .\deploy.ps1 [-Mode "preview"|"production"]

param(
    [string]$Mode = "preview"
)

Write-Host "🚀 Déploiement Data Vise sur Vercel" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Green

# Vérification des pré-requis
if (!(Get-Command "vercel" -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Vercel CLI non installé. Installation..." -ForegroundColor Red
    npm i -g vercel
}

if (!(Get-Command "node" -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js requis" -ForegroundColor Red
    exit 1
}

Write-Host "📦 Mode: $Mode" -ForegroundColor Blue

# Nettoyage des builds précédents
Write-Host "🧹 Nettoyage..." -ForegroundColor Yellow
if (Test-Path "frontend/dist") { Remove-Item -Recurse -Force "frontend/dist" }
if (Test-Path "backend/dist") { Remove-Item -Recurse -Force "backend/dist" }

# Installation des dépendances
Write-Host "📦 Installation des dépendances..." -ForegroundColor Yellow
Set-Location "backend"
npm ci --only=production
Set-Location "../frontend"
npm ci

# Vérification de la configuration
Write-Host "🔍 Vérification de la configuration..." -ForegroundColor Yellow
if (!(Test-Path "../vercel.json")) {
    Write-Host "❌ vercel.json manquant" -ForegroundColor Red
    exit 1
}

# Build local pour vérification
Write-Host "🔨 Build de vérification..." -ForegroundColor Yellow
npm run build

Set-Location ".."

# Déploiement
Write-Host "🚀 Déploiement en cours..." -ForegroundColor Green
if ($Mode -eq "production") {
    vercel --prod --yes
} else {
    vercel --yes
}

Write-Host "✅ Déploiement terminé !" -ForegroundColor Green
Write-Host "🌐 Vérifiez votre application sur l'URL fournie par Vercel" -ForegroundColor Blue

# Instructions post-déploiement
Write-Host ""
Write-Host "📋 Instructions post-déploiement:" -ForegroundColor Cyan
Write-Host "1. Configurez les variables d'environnement dans Vercel Dashboard" -ForegroundColor White
Write-Host "2. Vérifiez la connexion à MongoDB" -ForegroundColor White
Write-Host "3. Testez les endpoints API" -ForegroundColor White
Write-Host "4. Vérifiez le fonctionnement du frontend" -ForegroundColor White
