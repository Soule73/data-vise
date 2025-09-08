# Script de déploiement PowerShell pour Data Vise sur Vercel

Write-Host "🚀 Déploiement de Data Vise sur Vercel" -ForegroundColor Green

# Vérifier si Vercel CLI est installé
try {
    vercel --version | Out-Null
} catch {
    Write-Host "❌ Vercel CLI n'est pas installé. Installation..." -ForegroundColor Red
    npm install -g vercel
}

# Build du frontend
Write-Host "📦 Build du frontend..." -ForegroundColor Blue
Set-Location frontend
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors du build du frontend" -ForegroundColor Red
    exit 1
}
Set-Location ..

# Build du backend
Write-Host "📦 Build du backend..." -ForegroundColor Blue
Set-Location backend
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erreur lors du build du backend" -ForegroundColor Red
    exit 1
}
Set-Location ..

# Vérifier les variables d'environnement
Write-Host "🔍 Vérification des variables d'environnement..." -ForegroundColor Blue
if (!(Test-Path ".env")) {
    Write-Host "⚠️  Fichier .env manquant. Copiez .env.example vers .env et configurez vos variables" -ForegroundColor Yellow
    Write-Host "Ou configurez-les directement sur Vercel Dashboard" -ForegroundColor Yellow
}

# Déploiement sur Vercel
Write-Host "🚀 Déploiement sur Vercel..." -ForegroundColor Green
vercel --prod

Write-Host "✅ Déploiement terminé!" -ForegroundColor Green
Write-Host "📱 Vérifiez votre application sur le domaine fourni par Vercel" -ForegroundColor Cyan
