# DataVise

DataVise est une application moderne de visualisation de données, conçue pour rendre l'exploration, l'analyse et la présentation de données accessibles à tous, sans compromis sur la puissance ou la flexibilité.

## Fonctionnalités principales

- **Connexion à des sources de données variées** (CSV, JSON)
- **Création de widgets interactifs** : histogrammes, courbes, camemberts, scatter, radar, KPI, tableaux, cartes, etc.
- **Dashboards dynamiques** : composez vos tableaux de bord en glissant-déposant les widgets, redimensionnez-les librement, sauvegardez et partagez.
- **Gestion fine des utilisateurs et des permissions** : rôles, droits d'accès, visibilité publique/privée des ressources.
- **Sécurité** : suppression impossible d'une source ou d'un widget utilisé, badge "utilisée" et désactivation du bouton de suppression.
- **UI moderne et responsive** : badges, tooltips, modales de confirmation, icônes par type de source/visualisation.
- **Typage strict et robustesse** : extraction typée des champs pour chaque visualisation, prévention des erreurs lors de l'évolution des configs.
- **Extensible** : architecture modulaire (backend Node/Express + frontend React/Vite + TypeScript), hooks centralisés pour la logique métier, composants réutilisables.

## Structure du projet

- `backend/` : API Node.js/Express, gestion des utilisateurs, dashboards, widgets, sources, sécurité, etc.
- `frontend/` : Application React (Vite + TypeScript), UI, gestion d'état, hooks, composants, pages, services.
- `sensor_db/` : (optionnel) Données de test ou scripts d'intégration.

## Démarrage rapide

1. **Installer les dépendances** :
   - `cd backend && npm i`
   - `cd /frontend && npm i`
2. **Lancer le backend** :
   - `npm run dev` (depuis le dossier backend)
3. **Lancer le frontend** :
   - `npm run dev` (depuis le dossier frontend)
4. Accédez à l'application sur [http://localhost:5173](http://localhost:5173)

## Documentation

- Voir les fichiers `README.md` dans chaque dossier (`frontend/`, `backend/`) pour plus de détails techniques.
- Charte graphique et logo : `frontend/public/README_LOGO.md`
- Propagation du layout dashboard : `frontend/README_PROPAGATION_LAYOUT.md`

---

**DataVise** – La data visualisation, simple, moderne et puissante.
