# 🔧 Guide de diagnostic - Déploiement Vercel

## 🩺 Tests à effectuer après déploiement

### 1. Test de l'application principale
```bash
# Ouvrez dans le navigateur
https://your-app.vercel.app/

# Devrait afficher la landing page
```

### 2. Test de l'API
```bash
# Test de l'endpoint de santé
curl https://your-app.vercel.app/api/health

# Réponse attendue:
{
  "message": "Data Vise API is working!",
  "timestamp": "2025-09-08T...",
  "method": "GET",
  "url": "/api/health",
  "status": "healthy"
}
```

### 3. Test des routes React
```bash
# Test des routes de l'application
https://your-app.vercel.app/login
https://your-app.vercel.app/register
https://your-app.vercel.app/docs

# Toutes devraient afficher le contenu React approprié
```

## 🔍 Diagnostic des erreurs communes

### Erreur 404 NOT_FOUND
**Causes possibles :**
1. `outputDirectory` incorrect dans vercel.json
2. `buildCommand` qui échoue
3. Fichier index.html manquant dans le dist

**Solutions :**
1. Vérifiez que `frontend/dist/index.html` existe après build
2. Testez le build localement : `cd frontend && npm run build`
3. Vérifiez les logs de build Vercel

### Erreur 500
**Causes possibles :**
1. Variables d'environnement manquantes
2. Erreur dans le code de l'API
3. Dépendances manquantes

**Solutions :**
1. Configurez toutes les variables d'environnement sur Vercel
2. Testez l'API localement
3. Vérifiez les logs Vercel

### Assets/CSS ne se chargent pas
**Causes possibles :**
1. Chemins relatifs incorrects
2. Base URL mal configurée

**Solutions :**
1. Vérifiez la configuration Vite
2. Assurez-vous que les assets sont dans le bon dossier

## 📋 Checklist de vérification

- [ ] ✅ `frontend/dist/index.html` existe après build
- [ ] ✅ Build local fonctionne sans erreur
- [ ] ✅ Variables d'environnement configurées sur Vercel
- [ ] ✅ API health endpoint répond
- [ ] ✅ Routes React fonctionnent
- [ ] ✅ Assets CSS/JS se chargent
- [ ] ✅ Pas d'erreurs dans la console du navigateur

## 🛠️ Commandes de diagnostic

```bash
# Test build local
cd frontend && npm run build && npm run preview

# Vérification des fichiers générés
ls -la frontend/dist/

# Test API locale (si configurée)
cd backend && npm run dev

# Vérification des logs Vercel
vercel logs --follow
```

## 📞 Debug avancé

Si le problème persiste :

1. **Logs Vercel** : Consultez les logs détaillés dans le dashboard
2. **Build logs** : Vérifiez que le build s'exécute correctement
3. **Network tab** : Utilisez les outils développeur pour voir les requêtes
4. **Console errors** : Vérifiez les erreurs JavaScript dans la console

## 🚀 Configuration de test

Pour tester en local avant déploiement :

```bash
# 1. Build frontend
cd frontend
npm run build
npm run preview  # Test local du build de production

# 2. Dans un autre terminal, tester l'API
cd api
node health.js  # Ou équivalent pour tester l'API
```
