# Configuration Vercel simplifiée - Data Vise

## 🎯 Configuration actuelle

Cette version utilise une configuration Vercel simplifiée qui se concentre uniquement sur le déploiement du frontend React.

### ✅ Ce qui fonctionne
- ✅ Déploiement du frontend React/Vite
- ✅ Routing côté client (React Router)
- ✅ Assets statiques (CSS, JS, images)
- ✅ Build optimisé pour la production

### 📁 Structure
```
data-vise/
├── vercel.json          # Configuration Vercel simplifiée
├── frontend/            # Application React
│   ├── package.json     # Avec script vercel-build
│   ├── dist/           # Build de production
│   └── src/            # Code source React
└── backend/            # API (pour développement local)
```

### 🔧 Configuration Vercel

```json
{
    "version": 2,
    "builds": [
        {
            "src": "frontend/package.json",
            "use": "@vercel/static-build",
            "config": {
                "distDir": "dist"
            }
        }
    ],
    "routes": [
        {
            "handle": "filesystem"
        },
        {
            "src": "/(.*)",
            "dest": "/frontend/dist/index.html"
        }
    ]
}
```

### 🚀 Déploiement

Le déploiement est maintenant beaucoup plus simple :
1. Vercel détecte `frontend/package.json`
2. Installe les dépendances frontend
3. Exécute `npm run vercel-build` (qui appelle `npm run build`)
4. Utilise `frontend/dist/` comme répertoire de sortie
5. Sert `index.html` pour toutes les routes (SPA)

### 📋 Tests

Après déploiement, vérifiez :
- ✅ https://data-vise.vercel.app/ - Landing page
- ✅ https://data-vise.vercel.app/login - Page de connexion
- ✅ https://data-vise.vercel.app/docs - Documentation
- ✅ Console du navigateur sans erreurs

### 🔮 Prochaines étapes

Pour ajouter l'API backend plus tard :
1. Créer des fonctions Vercel serverless
2. Ou utiliser un service externe (Supabase, Railway, etc.)
3. Configurer les variables d'environnement

### 🛠️ Debug

Si problème :
1. Vérifiez les logs Vercel Dashboard
2. Testez le build local : `cd frontend && npm run build`
3. Vérifiez que `frontend/dist/index.html` existe

Cette configuration simplifiée devrait résoudre les problèmes de timeout et de dépendances !
