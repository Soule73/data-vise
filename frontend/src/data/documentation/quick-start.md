# Guide de démarrage rapide

Ce guide vous permet de créer votre premier dashboard en moins de 10 minutes.

## Étape 1 : Première connexion

### Créer votre compte

1. Accédez à Data Vise dans votre navigateur
2. Cliquez sur **"S'inscrire"**
3. Remplissez le formulaire :
   - Email professionnel
   - Mot de passe sécurisé (8+ caractères)
   - Nom et prénom

### Première connexion

```
Email : votre.email@entreprise.com
Mot de passe : VotreMotDePasse123!
```

> **Conseil** : Utilisez un gestionnaire de mots de passe pour sécuriser vos accès.

## Étape 2 : Ajouter une source de données

### Option A : Import CSV rapide

1. Cliquez sur **"Sources de données"** dans le menu
2. Sélectionnez **"Ajouter une source"**
3. Choisissez **"Fichier CSV"**
4. Glissez-déposez votre fichier ou parcourez

#### Exemple de fichier CSV
```csv
Date,Ventes,Produit,Region
2025-01-01,1200,Laptop,Nord
2025-01-02,800,Smartphone,Sud
2025-01-03,1500,Tablet,Est
2025-01-04,950,Laptop,Ouest
```

### Option B : Données JSON

```json
[
  {
    "date": "2025-01-01",
    "ventes": 1200,
    "produit": "Laptop",
    "region": "Nord"
  },
  {
    "date": "2025-01-02", 
    "ventes": 800,
    "produit": "Smartphone",
    "region": "Sud"
  }
]
```

### Configuration de la source

1. **Nom** : "Données de ventes Q1"
2. **Description** : "Chiffres de ventes premier trimestre"
3. **Séparateur CSV** : Virgule (détecté automatiquement)
4. **Encodage** : UTF-8

Cliquez sur **"Sauvegarder"** ✅

## Étape 3 : Créer votre premier widget

### Widget KPI simple

1. Allez dans **"Widgets"** → **"Créer un widget"**
2. **Type** : Sélectionnez "KPI"
3. **Configuration** :
   - Source de données : "Données de ventes Q1"
   - Champ valeur : "ventes"
   - Fonction : "Somme"
   - Titre : "Total des ventes"

### Widget graphique en courbe

1. **Type** : "Graphique en ligne"
2. **Configuration** :
   - Axe X : "date"
   - Axe Y : "ventes"
   - Groupement : Par jour
   - Couleur : Bleu (#3B82F6)

### Widget tableau

1. **Type** : "Tableau"
2. **Colonnes** :
   - Date (tri par défaut)
   - Produit
   - Ventes (format monétaire)
   - Région

Sauvegardez vos widgets !

## Étape 4 : Créer votre dashboard

### Nouveau dashboard

1. **"Dashboards"** → **"Créer un dashboard"**
2. **Nom** : "Analyse des ventes"
3. **Description** : "Suivi quotidien des performances"
4. **Visibilité** : Privé

### Ajouter des widgets

1. Cliquez sur **"Ajouter un widget"** ➕
2. Sélectionnez vos widgets créés précédemment
3. **Glissez-déposez** pour organiser la mise en page
4. **Redimensionnez** en tirant les coins

#### Mise en page suggérée

```
┌─────────────┬─────────────┐
│     KPI     │   Graphique │
│ Total Sales │   Courbe    │
├─────────────┴─────────────┤
│        Tableau            │
│     Détail des ventes     │
└───────────────────────────┘
```

### Personnalisation

- **Couleurs** : Choisissez votre thème (clair/sombre)
- **Espacement** : Ajustez les marges entre widgets
- **Titre** : Personnalisez les titres de widgets

## Étape 5 : Fonctionnalités avancées

### Filtres interactifs

```javascript
// Filtre par période
dateRange: {
  from: '2025-01-01',
  to: '2025-01-31'
}

// Filtre par région
region: ['Nord', 'Sud']
```

### Actualisation automatique

1. **Paramètres du dashboard**
2. **Auto-refresh** : Activé
3. **Intervalle** : 30 secondes

### Partage sécurisé

1. Cliquez sur **"Partager"**
2. **Générer un lien** public temporaire
3. **Copier** et envoyer à votre équipe

## Cas d'usage avancés

### Dashboard commercial

```yaml
Widgets:
  - KPI: Chiffre d'affaires total
  - KPI: Nombre de commandes
  - Graphique: Évolution mensuelle
  - Tableau: Top 10 produits
  - Carte: Ventes par région
```

### Suivi de performance

```yaml
Métriques:
  - Taux de conversion: 2.5%
  - Panier moyen: 127€
  - Satisfaction client: 4.2/5
  - Temps de livraison: 2.1 jours
```

## Astuces d'expert

### Optimisation des performances

1. **Limiter les données** : Utilisez des filtres de date
2. **Cache intelligent** : Activé automatiquement
3. **Widgets légers** : Préférez les KPI aux tableaux massifs

### Bonnes pratiques

- ✅ **Noms explicites** pour sources et widgets
- ✅ **Descriptions détaillées** pour la collaboration
- ✅ **Sauvegarde régulière** des dashboards
- ✅ **Tests sur mobile** pour la responsivité

### Raccourcis clavier

| Raccourci | Action |
|-----------|--------|
| `Ctrl + S` | Sauvegarder |
| `Ctrl + Z` | Annuler |
| `Ctrl + Y` | Refaire |
| `F11` | Plein écran |

## Prochaines étapes

1. **[Sources de données](/docs/data-sources/overview)** : Connectez plus de sources
2. **[Widgets avancés](/docs/widgets/types)** : Explorez tous les types
3. **[Partage équipe](/docs/sharing/team)** : Collaborez efficacement
4. **[Export PDF](/docs/dashboards/export)** : Rapports automatisés

## Besoin d'aide ?

- **Support rapide** : Chat en direct (coin en bas à droite)
- **Email** : support@data-vise.com
- **Documentation** : Guide complet section par section
- **Vidéos** : Tutoriels pas à pas

---

**Félicitations !** Vous avez créé votre premier dashboard Data Vise. Explorez maintenant toutes les possibilités offertes par la plateforme.
