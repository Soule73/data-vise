# 🚀 Configuration de déploiement Vercel - Data Vise

## ✅ Configuration complète

Votre projet Data Vise est maintenant configuré pour le déploiement sur Vercel avec les optimisations suivantes :

### 📁 Fichiers créés/modifiés

- ✅ `vercel.json` - Configuration principal Vercel
- ✅ `backend/api/index.ts` - Point d'entrée API Vercel 
- ✅ `backend/package.json` - Ajout dépendance @vercel/node
- ✅ `.vercelignore` - Fichiers à ignorer au déploiement
- ✅ `backend/.env.example` - Variables d'environnement backend
- ✅ `frontend/.env.example` - Variables d'environnement frontend
- ✅ `deploy.sh` / `deploy.ps1` - Scripts de déploiement automatisé
- ✅ `validate-deployment.js` - Validation pré-déploiement
- ✅ `VERCEL_DEPLOYMENT.md` - Guide complet de déploiement

### 🔧 Fonctionnalités

#### Backend
- ✅ API serverless compatible Vercel
- ✅ Cache de connexion MongoDB optimisé
- ✅ Gestion d'erreurs robuste
- ✅ CORS configuré automatiquement
- ✅ Timeout et mémoire optimisés

#### Frontend
- ✅ Build Vite optimisé pour production
- ✅ Routing SPA avec fallback
- ✅ Assets statiques avec CDN
- ✅ Variables d'environnement sécurisées

## 🚀 Déploiement rapide

### Option 1: Via GitHub (Recommandé)
1. Push votre code sur GitHub
2. Connectez votre repo sur [vercel.com](https://vercel.com)
3. Configurez les variables d'environnement
4. Déploiement automatique !

### Option 2: Via CLI
```bash
# Installation
npm i -g vercel

# Validation pré-déploiement
node validate-deployment.js

# Déploiement
vercel --prod
```

### Option 3: Script automatisé
```bash
# Linux/Mac
chmod +x deploy.sh
./deploy.sh production

# Windows
.\deploy.ps1 -Mode "production"
```

## ⚙️ Variables d'environnement requises

### Backend (Vercel Dashboard)
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/datavise
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
CORS_ORIGIN=https://your-app.vercel.app
NODE_ENV=production
```

### Frontend (Vercel Dashboard)
```env
VITE_API_URL=https://your-app.vercel.app/api
VITE_APP_NAME=Data Vise
```

## 🔍 Validation

Avant le déploiement, exécutez :
```bash
node validate-deployment.js
```

## 📊 Monitoring

Après déploiement :
- ✅ URL principale: `https://your-app.vercel.app`
- ✅ API: `https://your-app.vercel.app/api/health`
- ✅ Logs: `vercel logs --follow`

## 🛠️ Dépannage

### Problèmes courants
1. **Build failed**: Vérifiez les dépendances et scripts
2. **API 500**: Vérifiez MONGODB_URI et variables d'env
3. **CORS errors**: Vérifiez CORS_ORIGIN
4. **Route 404**: Vérifiez vercel.json routes

### Support
- 📖 [Guide complet](./VERCEL_DEPLOYMENT.md)
- 🐛 [Issues GitHub](https://github.com/your-repo/issues)
- 💬 [Vercel Discord](https://vercel.com/discord)

---

**✨ Votre application Data Vise est prête pour la production !**
