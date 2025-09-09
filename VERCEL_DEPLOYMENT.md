# Guide de déploiement Data Vise sur Vercel

## 📋 Pré-requis

1. **Compte Vercel** : [vercel.com](https://vercel.com)
2. **MongoDB Atlas** : Base de données cloud MongoDB
3. **Repository Git** : Code source sur GitHub/GitLab/Bitbucket

## 🚀 Étapes de déploiement

### 1. Préparation des variables d'environnement

#### Backend (.env dans Vercel Dashboard)
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/datavise
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://your-app-name.vercel.app
FRONTEND_URL=https://your-app-name.vercel.app
NODE_ENV=production
```

#### Frontend (Variables Vercel avec préfixe VITE_)
```env
VITE_API_URL=https://your-app-name.vercel.app/api
VITE_APP_NAME=Data Vise
VITE_NODE_ENV=production
```

### 2. Déploiement via Vercel CLI

```bash
# Installation globale de Vercel CLI
npm i -g vercel

# Login
vercel login

# Déploiement depuis la racine du projet
vercel --prod
```

### 3. Déploiement via GitHub (Recommandé)

1. **Connecter le repository** :
   - Aller sur [vercel.com/dashboard](https://vercel.com/dashboard)
   - Cliquer "New Project"
   - Importer votre repository Git

2. **Configuration automatique** :
   - Vercel détectera automatiquement la configuration
   - Les builds se feront selon `vercel.json`

3. **Variables d'environnement** :
   - Aller dans Settings → Environment Variables
   - Ajouter toutes les variables listées ci-dessus

### 4. Configuration MongoDB Atlas

```javascript
// Whitelist Vercel IPs (ou autoriser toutes les IPs: 0.0.0.0/0)
// URL de connexion format:
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
```

## 🛠️ Commandes utiles

```bash
# Build local pour tester
cd backend && npm run build
cd frontend && npm run build

# Test en local avec configuration production
vercel dev

# Déploiement de preview
vercel

# Déploiement en production
vercel --prod

# Voir les logs de déploiement
vercel logs <deployment-url>
```

## 📁 Structure de déploiement

```
data-vise/
├── vercel.json                 # Configuration Vercel
├── .vercelignore              # Fichiers à ignorer
├── backend/
│   ├── api/
│   │   └── index.ts           # Point d'entrée Vercel
│   ├── src/                   # Code source original
│   └── package.json           # Dépendances backend
└── frontend/
    ├── dist/                  # Build artifacts (auto-généré)
    ├── src/                   # Code source React
    └── package.json           # Dépendances frontend
```

## 🔧 Points d'attention

### Backend
- ✅ Point d'entrée créé dans `backend/api/index.ts`
- ✅ Gestion de cache MongoDB pour Vercel
- ✅ Timeout configuré à 30s max
- ✅ CORS configuré pour le frontend

### Frontend
- ✅ Build Vite configuré
- ✅ Routing SPA géré (fallback vers index.html)
- ✅ Assets statiques servis correctement
- ✅ Variables d'environnement avec préfixe VITE_

### Database
- ✅ Connection pooling optimisé
- ✅ Timeout configurations
- ✅ Retry logic pour la connexion

## 🐛 Dépannage

### Erreurs communes

1. **"Module not found"** → Vérifier les alias de paths et imports
2. **"Database connection failed"** → Vérifier MONGODB_URI et whitelist IP
3. **"CORS error"** → Vérifier CORS_ORIGIN et FRONTEND_URL
4. **"Build failed"** → Vérifier les dépendances et scripts build

### Logs et monitoring

```bash
# Voir les logs en temps réel
vercel logs --follow

# Logs d'une fonction spécifique
vercel logs backend/api/index.ts

# Metrics et performance
vercel --help
```

## 🔐 Sécurité

- ✅ Variables sensibles dans Vercel Dashboard uniquement
- ✅ JWT_SECRET fort (min 32 caractères)
- ✅ CORS restreint au domaine frontend
- ✅ MongoDB avec authentification et whitelist IP
- ✅ HTTPS forcé par défaut sur Vercel

## 📈 Optimisations

- ✅ Fonction Lambda optimisée (50MB max)
- ✅ Cache de connexion DB
- ✅ Assets statiques avec CDN Vercel
- ✅ Compression automatique
- ✅ Build incrémental

## 🌐 URLs finales

Après déploiement, votre app sera disponible sur :
- **Frontend** : `https://your-app-name.vercel.app`
- **API** : `https://your-app-name.vercel.app/api`
- **Docs** : `https://your-app-name.vercel.app/docs`
