# Installation et Configuration

Ce guide vous accompagne dans l'installation complète de Data Vise sur votre environnement.

## Prérequis système

### Configuration minimale

- **Node.js** : Version 18.0 ou supérieure
- **npm** : Version 8.0 ou supérieure
- **RAM** : 4 GB minimum (8 GB recommandé)
- **Espace disque** : 2 GB d'espace libre

### Navigateurs supportés

- **Chrome** : Version 90+
- **Firefox** : Version 88+
- **Safari** : Version 14+
- **Edge** : Version 90+

## Installation locale

### 1. Cloner le repository

```bash
git clone https://github.com/Soule73/data-vise.git
cd data-vise
```

### 2. Installation des dépendances

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Configuration de l'environnement

Créez les fichiers de configuration :

#### Backend (.env)
```bash
# backend/.env
PORT=3000
JWT_SECRET=votre_jwt_secret_super_securise
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

#### Frontend (.env)
```bash
# frontend/.env
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=Data Vise
```

### 4. Démarrage de l'application

#### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

#### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

### 5. Accès à l'application

- **Frontend** : http://localhost:5173
- **API Backend** : http://localhost:3000

## Installation Docker

### 1. Dockerfile

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

### 2. Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
    volumes:
      - ./uploads:/app/uploads
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
    depends_on:
      - app
    restart: unless-stopped
```

### 3. Commandes Docker

```bash
# Build et démarrage
docker-compose up -d

# Voir les logs
docker-compose logs -f

# Arrêt
docker-compose down
```

## Configuration avancée

### Variables d'environnement

| Variable | Description | Défaut | Obligatoire |
|----------|-------------|---------|-------------|
| `PORT` | Port du serveur | 3000 | Non |
| `JWT_SECRET` | Clé de chiffrement JWT | - | Oui |
| `CORS_ORIGIN` | URL autorisée CORS | * | Non |
| `MAX_FILE_SIZE` | Taille max upload (MB) | 10 | Non |
| `CACHE_TTL` | Durée cache (secondes) | 300 | Non |

### Configuration HTTPS

#### 1. Certificats SSL

```bash
# Génération certificat auto-signé (développement)
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes
```

#### 2. Configuration Express

```javascript
// backend/src/app.js
const https = require('https');
const fs = require('fs');

const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

https.createServer(options, app).listen(443, () => {
  console.log('HTTPS Server running on port 443');
});
```

### Optimisation des performances

#### 1. Cache Redis (optionnel)

```bash
# Installation Redis
npm install redis

# Configuration
REDIS_URL=redis://localhost:6379
CACHE_ENABLED=true
```

#### 2. Compression

```javascript
// Déjà configuré dans backend
const compression = require('compression');
app.use(compression());
```

#### 3. Rate limiting

```javascript
// Protection contre le spam
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

## Déploiement en production

### 1. Vérifications pré-déploiement

```bash
# Tests
npm run test

# Build production
npm run build

# Vérification sécurité
npm audit

# Performance
npm run lighthouse
```

### 2. Variables de production

```bash
NODE_ENV=production
JWT_SECRET=secret_production_ultra_securise
CORS_ORIGIN=https://votre-domaine.com
HTTPS_REDIRECT=true
```

### 3. Monitoring

```javascript
// Logging avec Winston
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

## Dépannage installation

### Problèmes courants

#### Port déjà utilisé
```bash
# Trouver le processus
lsof -i :3000

# Tuer le processus
kill -9 PID
```

#### Erreurs de permissions
```bash
# Réparer permissions npm
sudo chown -R $(whoami) ~/.npm
```

#### Problèmes de cache
```bash
# Nettoyer cache npm
npm cache clean --force

# Supprimer node_modules
rm -rf node_modules
npm install
```

### Logs de débogage

```bash
# Backend avec debug
DEBUG=app:* npm run dev

# Frontend avec logs détaillés
VITE_LOG_LEVEL=info npm run dev
```

## Support technique

Si vous rencontrez des problèmes :

1. **GitHub Issues** : Signalement de bugs
2. **Email** : support@data-vise.com
3. **Discord** : Communauté d'entraide
4. **Documentation** : Guide complet en ligne

---

**Installation terminée ?** Passez aux [premiers pas](/docs/first-steps) pour créer votre premier dashboard !
