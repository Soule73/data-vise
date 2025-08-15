# Gestion des sources de données

Les sources de données sont le cœur de Data Vise. Cette section vous guide pour connecter, configurer et optimiser toutes vos sources.

## Types de sources supportées

### Fichiers locaux

#### CSV (Comma-Separated Values)
```csv
# Exemple : ventes.csv
Date,Produit,Quantite,Prix,Region
2025-01-15,Laptop,2,1200,Nord
2025-01-15,Smartphone,5,800,Sud
2025-01-16,Tablet,3,600,Est
```

**Avantages** :
- Import rapide et simple
- Compatible avec Excel, Google Sheets
- Parfait pour données statiques

**Configuration** :
- Séparateur : `,` `;` `|` ou tabulation
- Encodage : UTF-8, ISO-8859-1, Windows-1252
- Headers : Première ligne contient les noms de colonnes

#### JSON (JavaScript Object Notation)
```json
{
  "ventes": [
    {
      "date": "2025-01-15",
      "produit": "Laptop", 
      "quantite": 2,
      "prix": 1200,
      "region": "Nord",
      "metadata": {
        "vendeur": "Jean",
        "commission": 120
      }
    }
  ]
}
```

**Avantages** :
- Structure hiérarchique
- Données complexes et imbriquées
- Métadonnées intégrées

### Bases de données (à venir)

#### PostgreSQL
```sql
-- Configuration de connexion
Host: localhost:5432
Database: entreprise_db
Schema: ventes
Table: transactions
```

#### MySQL/MariaDB
```sql
-- Requête exemple
SELECT 
  DATE(created_at) as date,
  product_name as produit,
  SUM(amount) as total
FROM orders 
WHERE created_at >= '2025-01-01'
GROUP BY DATE(created_at), product_name
```

#### MongoDB
```javascript
// Collection : orders
db.orders.aggregate([
  {
    $match: {
      date: { $gte: new Date('2025-01-01') }
    }
  },
  {
    $group: {
      _id: "$product",
      total: { $sum: "$amount" }
    }
  }
])
```

### APIs REST

#### Configuration générale
```yaml
Endpoint: https://api.entreprise.com/v1/sales
Method: GET
Headers:
  Authorization: Bearer TOKEN_API
  Content-Type: application/json
```

#### Authentification
```javascript
// API Key
headers: {
  'X-API-Key': 'votre-cle-api'
}

// OAuth 2.0
headers: {
  'Authorization': 'Bearer access-token'
}

// Basic Auth
headers: {
  'Authorization': 'Basic ' + btoa('user:pass')
}
```

## Configuration des sources

### Import de fichier CSV

#### Étape 1 : Upload
1. Allez dans **"Sources de données"**
2. Cliquez **"Ajouter une source"**
3. Sélectionnez **"Fichier CSV"**
4. Glissez-déposez ou parcourez votre fichier

#### Étape 2 : Aperçu et validation
```
┌─────────────┬──────────────┬──────────┬───────┐
│ Date        │ Produit      │ Quantite │ Prix  │
├─────────────┼──────────────┼──────────┼───────┤
│ 2025-01-15  │ Laptop       │ 2        │ 1200  │
│ 2025-01-15  │ Smartphone   │ 5        │ 800   │
│ 2025-01-16  │ Tablet       │ 3        │ 600   │
└─────────────┴──────────────┴──────────┴───────┘
```

#### Étape 3 : Configuration des colonnes
```javascript
Colonnes détectées:
- Date: Type Date (format: YYYY-MM-DD)
- Produit: Type Texte
- Quantite: Type Nombre (entier)
- Prix: Type Nombre (décimal)
```

#### Étape 4 : Paramètres avancés
```yaml
Séparateur: ","
Encodage: UTF-8
Première ligne: Headers ✓
Échapper les guillemets: ✓
Ignorer lignes vides: ✓
```

### Configuration JSON

#### Format simple
```json
[
  {
    "id": 1,
    "nom": "Jean Dupont",
    "ventes": 15000,
    "region": "Nord"
  },
  {
    "id": 2, 
    "nom": "Marie Martin",
    "ventes": 23000,
    "region": "Sud"
  }
]
```

#### Format complexe avec nesting
```json
{
  "metadata": {
    "export_date": "2025-01-15",
    "version": "1.0"
  },
  "data": {
    "ventes": [
      {
        "vendeur": {
          "id": 1,
          "nom": "Jean Dupont",
          "contact": {
            "email": "jean@entreprise.com",
            "telephone": "01.23.45.67.89"
          }
        },
        "transactions": [
          {
            "date": "2025-01-15",
            "produit": "Laptop",
            "montant": 1200
          }
        ]
      }
    ]
  }
}
```

#### Configuration du parsing
```javascript
// Chemin vers les données
dataPath: "data.ventes"

// Aplatissement des objets imbriqués
flatten: {
  "vendeur.nom": "nom_vendeur",
  "vendeur.contact.email": "email",
  "transactions[0].montant": "dernier_montant"
}
```

## Transformation des données

### Nettoyage automatique

#### Détection des types
```javascript
// Avant transformation
"123"        → Number: 123
"2025-01-15" → Date: Date Object
"true"       → Boolean: true
"NULL"       → null
""           → null (si option activée)
```

#### Normalisation des formats
```javascript
// Dates multiples formats
"15/01/2025" → "2025-01-15"
"Jan 15, 2025" → "2025-01-15" 
"15-01-25" → "2025-01-15"

// Nombres avec séparateurs
"1,200.50" → 1200.50
"1 200,50" → 1200.50
"1.200,50" → 1200.50
```

### Filtres et transformations

#### Filtre de lignes
```javascript
// Exclure lignes avec valeurs nulles
filters: {
  excludeNull: ['prix', 'quantite'],
  dateRange: {
    column: 'date',
    from: '2025-01-01',
    to: '2025-12-31'
  }
}
```

#### Colonnes calculées
```javascript
// Nouvelle colonne calculée
computed: {
  'total': 'prix * quantite',
  'mois': 'MONTH(date)',
  'trimestre': 'QUARTER(date)',
  'region_maj': 'UPPER(region)'
}
```

#### Agrégations
```javascript
// Groupement par période
aggregation: {
  groupBy: ['MONTH(date)', 'region'],
  metrics: {
    'total_ventes': 'SUM(prix * quantite)',
    'avg_prix': 'AVG(prix)',
    'count_orders': 'COUNT(*)'
  }
}
```

## 📈 Optimisation des performances

### Cache intelligent

#### Configuration du cache
```yaml
Cache settings:
  enabled: true
  duration: 30 minutes
  refresh_on_change: true
  max_size: 100MB
```

#### Stratégies de cache
```javascript
// Cache par source
source_cache: {
  strategy: 'time_based',  // time_based, size_based, manual
  ttl: 1800,              // 30 minutes
  compression: 'gzip'
}

// Cache par requête
query_cache: {
  strategy: 'lru',        // Least Recently Used
  max_entries: 1000,
  invalidate_on_update: true
}
```

### Pagination et limitation

#### Gros volumes de données
```javascript
// Configuration de pagination
pagination: {
  enabled: true,
  page_size: 1000,
  max_total: 100000,
  streaming: true
}
```

#### Échantillonnage
```javascript
// Pour prévisualisation rapide
sampling: {
  method: 'random',    // random, systematic, stratified
  size: 10000,         // Nombre de lignes
  preserve_stats: true // Garder distributions
}
```

## 🔐 Sécurité et accès

### Permissions des sources

#### Niveaux d'accès
```yaml
Permissions:
  Owner: Toutes actions (lecture, écriture, suppression)
  Editor: Lecture, modification configuration
  Viewer: Lecture seule
  Restricted: Accès filtré (certaines colonnes masquées)
```

#### Partage d'équipe
```javascript
// Partage avec équipe
sharing: {
  team_access: {
    'equipe-ventes': 'editor',
    'equipe-marketing': 'viewer',
    'direction': 'owner'
  },
  public_access: false,
  link_expiry: '2025-06-01'
}
```

### Données sensibles

#### Anonymisation
```javascript
// Masquage automatique
privacy: {
  anonymize: {
    'email': 'hash',      // jean@email.com → j***@email.com
    'telephone': 'mask',  // 0123456789 → 01***789
    'nom': 'partial'      // Jean Dupont → J. D.
  },
  exclude_columns: ['ssn', 'salary']
}
```

## 🛠️ Dépannage courant

### Erreurs d'import

#### Problème : Fichier CSV illisible
```
Erreur: "Impossible de parser le fichier CSV"

Solutions:
1. Vérifier l'encodage (UTF-8 recommandé)
2. Contrôler le séparateur (virgule, point-virgule)
3. Échapper les guillemets dans les données
4. Supprimer caractères spéciaux en début de fichier
```

#### Problème : Colonnes mal détectées
```
Erreur: "Les nombres sont lus comme du texte"

Solutions:
1. Vérifier le séparateur décimal (. ou ,)
2. Supprimer espaces en début/fin de valeur
3. Remplacer "NULL", "N/A" par valeurs vides
4. Utiliser format numérique cohérent
```

### Performances lentes

#### Diagnostics
```javascript
// Métriques de performance
performance: {
  import_time: "2.3s",
  file_size: "15.2MB", 
  rows_processed: 50000,
  memory_usage: "45MB",
  cache_hit_rate: "78%"
}
```

#### Optimisations
```yaml
Améliorations suggérées:
- Réduire nombre de colonnes inutiles
- Filtrer par période plus récente
- Activer compression des données
- Utiliser échantillonnage pour prévisualisation
```

## Exemples concrets

### E-commerce
```csv
date,commande_id,client_id,produit,quantite,prix_unitaire,status
2025-01-15,CMD001,CLI123,iPhone 14,1,999.00,livré
2025-01-15,CMD002,CLI456,MacBook Pro,1,2499.00,en_cours
2025-01-16,CMD003,CLI789,iPad Air,2,649.00,expédié
```

### Marketing
```json
{
  "campagnes": [
    {
      "nom": "Campagne Printemps",
      "canal": "Google Ads",
      "budget": 5000,
      "impressions": 150000,
      "clics": 3750,
      "conversions": 89,
      "roi": 2.4
    }
  ]
}
```

### RH & Finance
```csv
employe_id,nom,departement,salaire,date_embauche,performance
EMP001,Alice Martin,Ventes,45000,2023-03-15,8.5
EMP002,Bob Durand,Marketing,42000,2023-01-10,7.8
EMP003,Claire Leroy,IT,52000,2022-11-20,9.2
```

---

**Prochaines étapes** : Une fois vos sources configurées, apprenez à créer des [widgets puissants](/docs/widgets/overview) pour visualiser vos données.
