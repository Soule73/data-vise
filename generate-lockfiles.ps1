# Script PowerShell pour générer les fichiers package-lock.json manquants

Write-Host "🔍 Vérification des fichiers package-lock.json..." -ForegroundColor Blue

# Vérifier frontend
if (!(Test-Path "frontend/package-lock.json")) {
    Write-Host "📦 Génération de package-lock.json pour le frontend..." -ForegroundColor Yellow
    Set-Location frontend
    npm install
    Set-Location ..
    Write-Host "✅ package-lock.json créé pour le frontend" -ForegroundColor Green
} else {
    Write-Host "✅ package-lock.json existe déjà pour le frontend" -ForegroundColor Green
}

# Vérifier backend
if (!(Test-Path "backend/package-lock.json")) {
    Write-Host "📦 Génération de package-lock.json pour le backend..." -ForegroundColor Yellow
    Set-Location backend
    npm install
    Set-Location ..
    Write-Host "✅ package-lock.json créé pour le backend" -ForegroundColor Green
} else {
    Write-Host "✅ package-lock.json existe déjà pour le backend" -ForegroundColor Green
}

Write-Host "🎉 Vérification terminée !" -ForegroundColor Green
Write-Host "💡 Vous pouvez maintenant utiliser 'npm ci' pour des installations plus rapides" -ForegroundColor Cyan
