# Architecture optimisée des Widgets - Refactorisation

## 📋 Résumé des améliorations

Cette refactorisation a pour objectif d'éliminer la duplication de code entre la création et l'édition des widgets, tout en améliorant l'expérience utilisateur selon le style Kibana.

## 🏗️ Nouvelle Architecture

### 1. **Composant partagé : `WidgetFormLayout`**
```
frontend/src/presentation/components/widgets/WidgetFormLayout.tsx
```

**Responsabilités :**
- Layout unifié pour création et édition
- Gestion de l'affichage conditionnel des onglets
- Interface utilisateur cohérente avec header et boutons
- Preview en temps réel
- Modal de sauvegarde

**Avantages :**
- ✅ Élimine la duplication de code UI
- ✅ Interface cohérente entre création et édition
- ✅ Maintenance centralisée du layout

### 2. **Hook partagé : `useWidgetTabs`**
```
frontend/src/core/hooks/widget/useWidgetTabs.ts
```

**Responsabilités :**
- Détermination des onglets disponibles selon la configuration
- Logique métier centralisée pour l'affichage conditionnel

**Logique :**
- **Données** : Toujours affiché
- **Métriques & Style** : Si `config.metrics.length > 0`
- **Paramètres** : Si `Object.keys(config).length > 0`

### 3. **Hook commun : `useCommonWidgetForm`**
```
frontend/src/core/hooks/widget/useCommonWidgetForm.ts
```

**Responsabilités :**
- État partagé entre création et édition
- Gestion des propriétés communes (titre, visibilité, erreurs)
- État de l'interface (onglets, modales)

## 📁 Structure des fichiers modifiés

### Pages simplifiées
```
├── WidgetCreatePage.tsx    → Utilise WidgetFormLayout
├── WidgetEditPage.tsx      → Utilise WidgetFormLayout
└── WidgetListPage.tsx      → Modal de sélection ajoutée
```

### Composants partagés
```
├── WidgetFormLayout.tsx           → Layout unifié
├── WidgetTypeSelectionModal.tsx   → Modal de sélection (nouveau)
└── WidgetConfigTabs.tsx           → Onglets conditionnels
```

### Hooks réutilisables
```
├── useWidgetTabs.ts          → Logique des onglets
├── useCommonWidgetForm.ts    → État commun
├── useWidgetCreateForm.ts    → Spécifique création
└── useWidgetEditForm.ts      → Spécifique édition
```

## 🔄 Workflow amélioré

### Ancien workflow
```
Liste → Page création (Step 1: Sélection) → Step 2: Configuration
```

### Nouveau workflow (style Kibana)
```
Liste → Modal sélection → Page création unifiée
```

## ✨ Fonctionnalités

### 1. **Modal de sélection intelligente**
- Sélection source de données + type de visualisation
- Validation avant redirection
- Interface moderne et intuitive

### 2. **Pages unifiées**
- Header avec titre et boutons d'action
- Suppression du système de steps
- Onglets conditionnels selon la configuration
- Preview en temps réel

### 3. **Logique partagée**
- Détection automatique des onglets nécessaires
- État centralisé pour les propriétés communes
- Réutilisation maximale du code

## 🎯 Avantages obtenus

### **Maintenance réduite**
- ✅ Code partagé entre création et édition
- ✅ Logique centralisée dans des hooks
- ✅ Interface unifiée

### **Expérience utilisateur améliorée**
- ✅ Workflow plus fluide (style Kibana)
- ✅ Interface moderne et cohérente
- ✅ Onglets conditionnels intelligents
- ✅ Boutons d'action en header

### **Code plus maintenable**
- ✅ Séparation des responsabilités
- ✅ Composants réutilisables
- ✅ Hooks spécialisés
- ✅ Types TypeScript stricts

## 🧪 Tests et validation

### Points de test prioritaires
1. **Workflow complet** : Liste → Modal → Création → Sauvegarde
2. **Édition** : Chargement → Modification → Sauvegarde
3. **Onglets conditionnels** : Affichage selon configuration
4. **Responsive** : Interface adaptée mobile/desktop

### Cas d'usage validés
- ✅ Création avec source pré-sélectionnée
- ✅ Édition avec configuration existante
- ✅ Onglets dynamiques selon métriques
- ✅ Navigation et annulation

## 🚀 Prochaines étapes

1. **Tests utilisateur** pour valider l'UX
2. **Optimisation performance** des hooks partagés
3. **Extension** aux autres types de widgets
4. **Documentation utilisateur** du nouveau workflow

Cette refactorisation offre une base solide et maintenable pour l'évolution future des widgets, tout en améliorant significativement l'expérience utilisateur.
