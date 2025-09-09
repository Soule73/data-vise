#!/usr/bin/env node

/**
 * Script de validation pré-déploiement
 * Vérifie que tous les éléments nécessaires sont en place
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Validation pré-déploiement Data Vise');
console.log('=====================================');

let errors = [];
let warnings = [];

// Vérification des fichiers de configuration
const requiredFiles = [
    'vercel.json',
    'backend/package.json',
    'frontend/package.json',
    'backend/api/index.ts',
    'backend/tsconfig.json',
    'frontend/vite.config.ts'
];

requiredFiles.forEach(file => {
    if (!fs.existsSync(file)) {
        errors.push(`❌ Fichier manquant: ${file}`);
    } else {
        console.log(`✅ ${file}`);
    }
});

// Vérification de la configuration Vercel
try {
    const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));

    if (!vercelConfig.builds || vercelConfig.builds.length < 2) {
        errors.push('❌ Configuration Vercel: builds manquants');
    }

    if (!vercelConfig.routes || vercelConfig.routes.length < 2) {
        errors.push('❌ Configuration Vercel: routes manquantes');
    }

    console.log('✅ Configuration Vercel valide');
} catch (e) {
    errors.push('❌ Erreur de parsing vercel.json');
}

// Vérification des dépendances backend
try {
    const backendPkg = JSON.parse(fs.readFileSync('backend/package.json', 'utf8'));

    const requiredBackendDeps = [
        'express',
        'mongoose',
        'cors',
        'dotenv',
        '@vercel/node'
    ];

    requiredBackendDeps.forEach(dep => {
        if (!backendPkg.dependencies[dep]) {
            errors.push(`❌ Dépendance backend manquante: ${dep}`);
        }
    });

    if (!backendPkg.scripts['vercel-build']) {
        warnings.push('⚠️ Script vercel-build manquant dans backend/package.json');
    }

    console.log('✅ Dépendances backend OK');
} catch (e) {
    errors.push('❌ Erreur lecture backend/package.json');
}

// Vérification des dépendances frontend
try {
    const frontendPkg = JSON.parse(fs.readFileSync('frontend/package.json', 'utf8'));

    const requiredFrontendDeps = [
        'react',
        'react-dom',
        'vite'
    ];

    requiredFrontendDeps.forEach(dep => {
        if (!frontendPkg.dependencies[dep] && !frontendPkg.devDependencies[dep]) {
            errors.push(`❌ Dépendance frontend manquante: ${dep}`);
        }
    });

    if (!frontendPkg.scripts['build']) {
        errors.push('❌ Script build manquant dans frontend/package.json');
    }

    console.log('✅ Dépendances frontend OK');
} catch (e) {
    errors.push('❌ Erreur lecture frontend/package.json');
}

// Vérification des fichiers d'exemple d'environnement
const envFiles = [
    'backend/.env.example',
    'frontend/.env.example'
];

envFiles.forEach(file => {
    if (!fs.existsSync(file)) {
        warnings.push(`⚠️ Fichier d'exemple manquant: ${file}`);
    }
});

// Vérification de la structure de l'API
if (fs.existsSync('backend/api/index.ts')) {
    const apiContent = fs.readFileSync('backend/api/index.ts', 'utf8');

    if (!apiContent.includes('VercelRequest') || !apiContent.includes('VercelResponse')) {
        warnings.push('⚠️ API handler pourrait ne pas être compatible Vercel');
    }

    if (!apiContent.includes('connectToDatabase') && !apiContent.includes('mongoose')) {
        warnings.push('⚠️ Connexion base de données non détectée dans l\'API');
    }
}

// Résumé
console.log('\n📋 Résumé de validation:');
console.log(`✅ ${requiredFiles.length - errors.length}/${requiredFiles.length} fichiers OK`);

if (warnings.length > 0) {
    console.log('\n⚠️ Avertissements:');
    warnings.forEach(warning => console.log(warning));
}

if (errors.length > 0) {
    console.log('\n❌ Erreurs à corriger:');
    errors.forEach(error => console.log(error));
    console.log('\n🚫 Déploiement non recommandé avec ces erreurs');
    process.exit(1);
} else {
    console.log('\n✅ Validation réussie ! Prêt pour le déploiement');
    console.log('🚀 Exécutez: vercel --prod');
}
