# 🚀 Guide de déploiement rapide - Data Vise sur Vercel

## ✅ Étapes de déploiement

### 1. Prérequis
- Compte Vercel (gratuit)
- Base de données MongoDB Atlas
- Repository GitHub (optionnel mais recommandé)

### 2. Configuration MongoDB Atlas
```bash
# Créez un cluster sur MongoDB Atlas
# Ajoutez 0.0.0.0/0 aux IP autorisées (pour Vercel)
# Créez un utilisateur avec permissions lecture/écriture
# Copiez l'URI de connexion
```

### 3. Déploiement via GitHub (Recommandé)

1. **Générer les fichiers de verrouillage (si nécessaire)**
   ```bash
   .\generate-lockfiles.ps1  # Windows
   ./generate-lockfiles.sh   # Linux/Mac
   ```

2. **Pusher le code sur GitHub**
   ```bash
   git add .
   git commit -m "Configuration déploiement Vercel"
   git push origin main
   ```

3. **Configurer les secrets GitHub** (pour déploiement automatique)
   - Suivez le guide dans `GITHUB_SECRETS.md`
   - Ajoutez `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID`

4. **Connecter à Vercel**
   - Allez sur [vercel.com](https://vercel.com)
   - Cliquez "New Project"
   - Importez votre repository GitHub
   - Vercel détectera automatiquement le `vercel.json`

5. **Configurer les variables d'environnement**
   ```
   MONGO_URI = mongodb+srv://user:password@cluster.mongodb.net/database
   JWT_SECRET = your-secret-key-here
   CORS_ORIGIN = https://your-app.vercel.app
   APP_DOMAIN = https://your-app.vercel.app
   APP_DEBUG = false
   ```

6. **Déployer**
   - Méthode automatique : Chaque push déclenchera un déploiement
   - Méthode manuelle : Cliquez "Deploy" sur Vercel
   - Attendez le déploiement (2-3 minutes)

### 4. Déploiement via CLI

```bash
# Installer Vercel CLI
npm i -g vercel

# Se connecter
vercel login

# Déployer (depuis la racine du projet)
vercel --prod
```

### 5. Vérification post-déploiement

1. **Tester l'API**
   ```bash
   curl https://your-app.vercel.app/api/health
   ```

2. **Tester le frontend**
   - Ouvrez `https://your-app.vercel.app`
   - Vérifiez que la page se charge
   - Testez la connexion/inscription

### 6. URLs importantes

- **Frontend**: `https://your-app.vercel.app`
- **API**: `https://your-app.vercel.app/api/*`
- **Health check**: `https://your-app.vercel.app/api/health`

## 🛠️ Troubleshooting

### Erreur "Function timeout"
- Les fonctions Vercel ont un timeout de 30s
- Optimisez les requêtes MongoDB
- Vérifiez la connectivité réseau

### Erreur CORS
- Configurez `CORS_ORIGIN` avec votre domaine Vercel exact
- N'oubliez pas le `https://`

### Erreur de build
- Vérifiez les logs dans Vercel Dashboard
- Tous les packages doivent être dans `dependencies`
- Testez le build localement d'abord

### Base de données non accessible
- Vérifiez l'URI MongoDB
- Assurez-vous que 0.0.0.0/0 est dans les IP autorisées
- Testez la connexion localement

## 📱 Scripts utiles

```bash
# Générer les package-lock.json si manquants
.\generate-lockfiles.ps1  # Windows
./generate-lockfiles.sh   # Linux/Mac

# Build local pour tester
npm run build --prefix frontend
npm run build --prefix backend

# Déploiement manuel via CLI
.\deploy.ps1  # Windows
./deploy.sh   # Linux/Mac

# Voir les logs Vercel
vercel logs

# Voir les logs GitHub Actions
# Allez dans l'onglet "Actions" de votre repository
```

## 🔒 Sécurité

- Ne commitez jamais le fichier `.env`
- Utilisez des mots de passe forts pour MongoDB
- Configurez les CORS correctement
- Activez l'authentification MongoDB
