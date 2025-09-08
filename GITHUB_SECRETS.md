# Configuration des Secrets GitHub pour Vercel

## 🔐 Secrets requis pour le déploiement automatique

Pour que le workflow GitHub Actions fonctionne avec Vercel, vous devez configurer ces secrets dans votre repository GitHub :

### 1. Obtenir les informations Vercel

1. **Installez Vercel CLI** (si pas déjà fait)
   ```bash
   npm i -g vercel
   ```

2. **Connectez-vous à Vercel**
   ```bash
   vercel login
   ```

3. **Obtenez votre token**
   ```bash
   # Créez un token sur https://vercel.com/account/tokens
   # Copiez le token généré
   ```

4. **Obtenez les IDs de votre projet**
   ```bash
   # Dans le dossier de votre projet
   vercel link
   
   # Ensuite, regardez dans .vercel/project.json
   cat .vercel/project.json
   ```

### 2. Configurer les secrets GitHub

Allez dans votre repository GitHub → Settings → Secrets and variables → Actions

Ajoutez ces **Repository secrets** :

#### `VERCEL_TOKEN`
- **Valeur** : Votre token Vercel (commençant par `vercel_`)
- **Description** : Token d'authentification Vercel

#### `VERCEL_ORG_ID`
- **Valeur** : L'ID de votre organisation/équipe Vercel
- **Description** : ID de l'organisation Vercel

#### `VERCEL_PROJECT_ID`
- **Valeur** : L'ID de votre projet Vercel
- **Description** : ID du projet Vercel

### 3. Exemple de configuration

Après avoir exécuté `vercel link`, vous devriez voir un fichier `.vercel/project.json` comme :

```json
{
  "projectId": "prj_xxxxxxxxxxxxxxxxxxxx",
  "orgId": "team_xxxxxxxxxxxxxxxxxxxx"
}
```

- `projectId` → `VERCEL_PROJECT_ID`
- `orgId` → `VERCEL_ORG_ID`

### 4. Test du déploiement

1. **Committez et poussez** votre code :
   ```bash
   git add .
   git commit -m "Configure GitHub Actions deployment"
   git push origin main
   ```

2. **Vérifiez l'action** :
   - Allez dans l'onglet "Actions" de votre repository
   - Vérifiez que le workflow s'exécute sans erreur

### 5. Variables d'environnement Vercel

N'oubliez pas de configurer vos variables d'environnement directement sur Vercel :

- `MONGO_URI`
- `JWT_SECRET`
- `CORS_ORIGIN`
- `APP_DOMAIN`
- `APP_DEBUG`

### 6. Troubleshooting

#### Erreur "Invalid token"
- Vérifiez que le token Vercel est correct
- Assurez-vous qu'il n'a pas expiré

#### Erreur "Project not found"
- Vérifiez `VERCEL_PROJECT_ID`
- Assurez-vous que le projet existe sur Vercel

#### Erreur "Organization not found"
- Vérifiez `VERCEL_ORG_ID`
- Assurez-vous d'avoir accès à l'organisation

#### Erreur de build
- Vérifiez les logs dans l'onglet Actions
- Testez le build localement d'abord
- Vérifiez que toutes les dépendances sont dans `package.json`

### 7. Workflow de déploiement

Le workflow `deploy.yml` est configuré pour :

- ✅ Déployer automatiquement sur push vers `main`, `master`, `source_elasticsearch`
- ✅ Tester les builds sur les pull requests
- ✅ Utiliser le cache pour des builds plus rapides
- ✅ Gérer automatiquement les fichiers package-lock.json
- ✅ Fournir des logs détaillés avec des emojis

Le déploiement n'est déclenché que lors des push, pas sur les pull requests (pour économiser les ressources).
