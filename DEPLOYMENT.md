# Déploiement Data Vise sur Vercel

## Configuration requise

### 1. Variables d'environnement à configurer sur Vercel

Allez dans les paramètres de votre projet Vercel et ajoutez ces variables d'environnement :

```
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-super-secret-jwt-key
CORS_ORIGIN=https://your-domain.vercel.app
APP_DOMAIN=https://your-domain.vercel.app
APP_DEBUG=false
ELASTICSEARCH_URL=your-elasticsearch-url (si utilisé)
```

### 2. Base de données MongoDB

- Utilisez MongoDB Atlas pour la production
- Configurez les IP autorisées (ajoutez 0.0.0.0/0 pour Vercel)
- Créez un utilisateur avec les permissions appropriées

### 3. Déploiement

#### Méthode 1: Via GitHub (Recommandée)
1. Poussez votre code sur GitHub
2. Connectez votre repo GitHub à Vercel
3. Vercel détectera automatiquement le fichier `vercel.json`
4. Configurez les variables d'environnement
5. Déployez

#### Méthode 2: Via Vercel CLI
```bash
npm i -g vercel
vercel login
vercel --prod
```

### 4. Structure du projet pour Vercel

```
data-vise/
├── vercel.json           # Configuration Vercel
├── frontend/             # Application React
│   ├── package.json
│   ├── vite.config.ts
│   └── dist/            # Build frontend (généré)
├── backend/             # API Node.js
│   ├── package.json
│   ├── api/
│   │   └── index.ts     # Point d'entrée pour Vercel
│   └── src/             # Code source
└── .env.example         # Variables d'environnement
```

### 5. Scripts de build

Le projet utilise les scripts suivants pour le build :

- **Frontend**: `npm run build` (dans /frontend)
- **Backend**: `npm run build` (dans /backend)

### 6. Routes

- **Frontend**: `https://your-domain.vercel.app/`
- **API**: `https://your-domain.vercel.app/api/*`

### 7. Troubleshooting

#### Erreur de timeout
Si vous obtenez des erreurs de timeout, vérifiez :
- La connexion MongoDB (timeout trop court)
- Les fonctions Vercel (limite de 30s par défaut)

#### Erreur CORS
Configurez correctement `CORS_ORIGIN` avec votre domaine Vercel.

#### Erreur de modules
Vérifiez que tous les modules sont dans `dependencies` et non `devDependencies`.

### 8. Monitoring

- Consultez les logs dans le dashboard Vercel
- Surveillez les performances via Vercel Analytics
- Configurez des alertes pour les erreurs

## Commandes utiles

```bash
# Build local pour tester
npm run build --prefix frontend
npm run build --prefix backend

# Déploiement avec Vercel CLI
vercel --prod

# Voir les logs de déploiement
vercel logs
```
