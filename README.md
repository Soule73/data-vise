# Data Vise 🚀

> **Version 1.0 - Prêt pour la Publication !**

Data Vise est une plateforme moderne de visualisation de données qui transforme vos données brutes en insights puissants et actionnables. Conçue pour être à la fois simple d'utilisation et extrêmement flexible.

## ✨ Fonctionnalités Principales

### 📊 Visualisation Avancée
- **Graphiques interactifs** : Histogrammes, courbes, camemberts, scatter, radar, KPI
- **Tableaux dynamiques** avec tri, filtrage et pagination
- **Cartes géographiques** pour la visualisation spatiale
- **Dashboard responsive** avec drag & drop intuitif

### 🔒 Sécurité & Permissions
- **Authentification robuste** avec gestion des sessions
- **Système de rôles** et permissions granulaires
- **Partage sécurisé** de dashboards avec liens temporaires
- **Isolation des données** par utilisateur/organisation

### 🎨 Expérience Utilisateur
- **Interface moderne** avec thème sombre/clair
- **Mobile-first** design responsive
- **Animations fluides** et interactions intuitives
- **Export PDF** haute qualité

### 🔧 Intégrations
- **Sources variées** : CSV, JSON, APIs REST
- **Elasticsearch** pour les gros volumes
- **Temps réel** avec rafraîchissement automatique
- **Architecture extensible** pour nouvelles sources

## 🏗 Architecture Technique

### Backend
- **Node.js + Express** - API REST robuste
- **TypeScript** - Typage strict et sécurité
- **JWT** - Authentification stateless
- **Middleware** - Gestion fine des permissions

### Frontend  
- **React 18** - Interface utilisateur moderne
- **TypeScript** - Développement type-safe
- **Vite** - Build ultra-rapide
- **Tailwind CSS** - Design system cohérent
- **Chart.js** - Visualisations interactives

### Base de Données
- **Architecture flexible** - Support multi-sources
- **Cache intelligent** - Performance optimisée
- **Transactions** - Intégrité des données

## 🚀 Démarrage Rapide

### Prérequis
- Node.js 18+
- npm ou yarn

### Installation

```bash
# Cloner le repository
git clone https://github.com/Soule73/data-vise.git
cd data-vise

# Installation des dépendances
cd backend && npm install
cd ../frontend && npm install

# Démarrer le backend
cd backend && npm run dev

# Démarrer le frontend (nouveau terminal)
cd frontend && npm run dev
```

### Premier Usage
1. Ouvrez [http://localhost:5173](http://localhost:5173)
2. Créez votre compte sur la landing page
3. Ajoutez votre première source de données
4. Créez votre premier widget
5. Composez votre dashboard !

## 📁 Structure du Projet

```
data-vise/
├── 📁 backend/           # API Node.js
│   ├── src/
│   │   ├── controllers/  # Logique métier
│   │   ├── models/       # Modèles de données
│   │   ├── routes/       # Endpoints API
│   │   ├── middleware/   # Auth & permissions
│   │   └── services/     # Services métier
│   └── package.json
├── 📁 frontend/          # App React
│   ├── src/
│   │   ├── presentation/ # Composants UI
│   │   ├── core/         # Hooks & logique
│   │   ├── data/         # Services & repos
│   │   └── styles/       # CSS & themes
│   └── package.json
└── 📄 README.md
```

## 🎯 Roadmap

### Version 1.0 ✅
- [x] Dashboard drag & drop
- [x] Visualisations Chart.js  
- [x] Authentification complète
- [x] Gestion des permissions
- [x] Landing page moderne
- [x] Export PDF
- [x] Thèmes sombre/clair

### Version 1.1 🔄
- [ ] Templates de dashboard
- [ ] Alertes automatiques
- [ ] API webhooks
- [ ] Intégrations cloud

### Version 2.0 🎯
- [ ] Collaboration temps réel
- [ ] IA pour suggestions
- [ ] Mobile app native
- [ ] Multi-tenant SaaS

## 🌐 Landing Page

Visitez notre landing page moderne avec :
- Présentation des fonctionnalités
- Screenshots interactifs  
- Plans tarifaires
- Formulaire de contact

**URL**: `/` (route principale)

## 📚 Documentation

- 📖 [Guide Utilisateur](./GUIDE_USER.md)
- 🔧 [Documentation API](./backend/README.md)
- 🎨 [Guide Développement](./frontend/README.md)
- 🚀 [Publication](./LANDING_PAGE.md)

## 🤝 Contribution

Nous accueillons les contributions ! Consultez notre guide de contribution.

1. Fork le projet
2. Créez votre branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push sur la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📝 Licence

Distribué sous licence MIT. Voir `LICENSE` pour plus d'informations.

## 📧 Contact

- **Email**: contact@data-vise.com
- **GitHub**: [@Soule73](https://github.com/Soule73)
- **Project**: [Data Vise](https://github.com/Soule73/data-vise)

---

**Data Vise** - Transformez vos données en insights puissants 🚀
