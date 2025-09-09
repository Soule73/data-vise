# 🚀 Déploiement Data Vise - Commandes essentielles

## ✅ Prêt pour le déploiement !

Votre projet Data Vise est entièrement configuré pour Vercel. Voici les commandes essentielles :

### 📋 Pré-déploiement
```bash
# Validation complète
node validate-deployment.js

# Test build local
cd backend && npm run build
cd ../frontend && npm run build
```

### 🚀 Déploiement

#### Option 1: CLI Vercel (Rapide)
```bash
# Installation si nécessaire
npm i -g vercel

# Login
vercel login

# Déploiement preview
vercel

# Déploiement production
vercel --prod
```

#### Option 2: Script automatisé
```bash
# Windows
.\deploy.ps1 -Mode "production"

# Linux/Mac
chmod +x deploy.sh
./deploy.sh production
```

### 🔧 Variables d'environnement à configurer sur Vercel

#### Backend
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/datavise
JWT_SECRET=your-super-secret-jwt-key-32-chars-minimum
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://your-app-name.vercel.app
FRONTEND_URL=https://your-app-name.vercel.app
NODE_ENV=production
```

#### Frontend (préfixe VITE_)
```env
VITE_API_URL=https://your-app-name.vercel.app/api
VITE_APP_NAME=Data Vise
VITE_NODE_ENV=production
```

### 🌐 URLs après déploiement
- **App**: `https://your-app-name.vercel.app`
- **API**: `https://your-app-name.vercel.app/api`
- **Health Check**: `https://your-app-name.vercel.app/api/health`
- **Documentation**: `https://your-app-name.vercel.app/docs`

### 🛠️ Monitoring et debug
```bash
# Voir les logs en temps réel
vercel logs --follow

# Logs d'une fonction spécifique
vercel logs <deployment-url>

# Dev local avec config Vercel
vercel dev
```

### 📚 Documentation complète
- [Guide détaillé](./VERCEL_DEPLOYMENT.md)
- [Configuration](./DEPLOYMENT_README.md)
- [Validation](./validate-deployment.js)

---
**🎉 Tout est prêt ! Lancez `vercel --prod` pour déployer !**
