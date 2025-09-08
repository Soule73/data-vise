# Création et gestion des dashboards

Les dashboards sont des espaces de travail qui rassemblent vos widgets pour créer des vues d'ensemble cohérentes et interactives.

## Concepts fondamentaux

### Qu'est-ce qu'un dashboard ?

Un dashboard Data Vise est une interface visuelle qui combine plusieurs widgets pour présenter des informations de manière organisée et interactive.

**Caractéristiques principales** :
- **Layout flexible** : Grille responsive et redimensionnable
- **Interactivité** : Filtres globaux et widgets connectés
- **Temps réel** : Actualisation automatique des données
- **Partage** : Collaboration d'équipe et liens publics
- **Export** : PDF, images, données

### Architecture d'un dashboard

```
Dashboard "Analyse des ventes"
├── Header (titre, filtres globaux, actions)
├── Grid Layout (organisation des widgets)
│   ├── Widget KPI: CA Total (1×1)
│   ├── Widget Graph: Tendance (2×1) 
│   ├── Widget Table: Top produits (2×2)
│   └── Widget Map: Ventes régionales (1×2)
└── Footer (dernière maj, export, partage)
```

## réation d'un dashboard

### Étape 1 : Nouveau dashboard

1. Accédez à **"Dashboards"** dans le menu principal
2. Cliquez sur **"Créer un dashboard"** ➕
3. Configurez les paramètres de base

#### Configuration initiale
```yaml
Informations générales:
  nom: "Analyse des ventes Q1 2025"
  description: "Suivi quotidien des performances commerciales"
  catégorie: "Ventes"
  tags: ["mensuel", "commercial", "kpi"]

Paramètres:
  visibilité: "privé" # privé, équipe, public
  layout: "grille" # grille, colonnes, libre
  thème: "clair" # clair, sombre, auto
  actualisation: 300 # secondes
```

#### Paramètres avancés
```yaml
Permissions:
  propriétaire: "jean.dupont@entreprise.com"
  éditeurs: ["marie.martin@entreprise.com"]
  lecteurs: ["équipe-ventes", "direction"]

Préférences:
  grille_snap: true
  animations: true
  toolbar_visible: true
  export_formats: ["pdf", "png", "xlsx"]
```

### Étape 2 : Configuration de la grille

#### Système de grille
```javascript
{
  "grid": {
    "columns": 12,        // Colonnes disponibles
    "row_height": 60,     // Hauteur d'une unité
    "margin": [10, 10],   // Espacement [x, y]
    "container_padding": [20, 20],
    "breakpoints": {
      "lg": 1200,         // Desktop
      "md": 996,          // Tablet
      "sm": 768,          // Mobile large  
      "xs": 480           // Mobile
    }
  }
}
```

#### Layout responsive
```javascript
{
  "layouts": {
    "lg": [
      { "i": "kpi-ca", "x": 0, "y": 0, "w": 3, "h": 2 },
      { "i": "chart-trend", "x": 3, "y": 0, "w": 6, "h": 4 },
      { "i": "table-products", "x": 9, "y": 0, "w": 3, "h": 4 }
    ],
    "md": [
      { "i": "kpi-ca", "x": 0, "y": 0, "w": 4, "h": 2 },
      { "i": "chart-trend", "x": 4, "y": 0, "w": 8, "h": 4 },
      { "i": "table-products", "x": 0, "y": 4, "w": 12, "h": 3 }
    ]
  }
}
```

### Étape 3 : Ajout de widgets

#### Depuis widgets existants
1. Cliquez sur **"Ajouter un widget"** ➕
2. Sélectionnez dans la bibliothèque de widgets
3. Configurez la position et la taille

#### Création directe
1. **"Nouveau widget"** sur le dashboard
2. Choisissez le type (KPI, graphique, tableau...)
3. Configurez la source de données
4. Personnalisez l'apparence

#### Configuration des widgets
```javascript
{
  "widget": {
    "id": "kpi-revenue",
    "type": "kpi",
    "title": "Chiffre d'affaires",
    "position": { "x": 0, "y": 0, "w": 3, "h": 2 },
    "data_source": "ventes_2025",
    "config": {
      "metric": "sum(montant)",
      "format": "currency",
      "comparison": "previous_month"
    },
    "style": {
      "background": "#ffffff",
      "border": "1px solid #e5e7eb",
      "border_radius": "8px"
    }
  }
}
```

## Personnalisation visuelle

### Thèmes et couleurs

#### Thème global
```css
/* Thème clair */
.dashboard-light {
  --bg-primary: #ffffff;
  --bg-secondary: #f9fafb;
  --text-primary: #111827;
  --text-secondary: #6b7280;
  --border-color: #e5e7eb;
  --accent-color: #3b82f6;
}

/* Thème sombre */
.dashboard-dark {
  --bg-primary: #1f2937;
  --bg-secondary: #374151;
  --text-primary: #ffffff;
  --text-secondary: #d1d5db;
  --border-color: #4b5563;
  --accent-color: #60a5fa;
}
```

#### Couleurs personnalisées
```javascript
{
  "theme": {
    "primary_color": "#3b82f6",
    "secondary_color": "#10b981", 
    "accent_color": "#f59e0b",
    "text_color": "#111827",
    "background": "#ffffff",
    "custom_palette": [
      "#ef4444", "#f97316", "#eab308", 
      "#22c55e", "#06b6d4", "#8b5cf6"
    ]
  }
}
```

### Mise en page avancée

#### Templates de layout
```yaml
# Template E-commerce
Template "E-commerce":
  structure:
    - Row 1: [KPI CA, KPI Commandes, KPI Conversion] (3 colonnes)
    - Row 2: [Graphique Tendance] (pleine largeur)
    - Row 3: [Top Produits, Géographie] (2 colonnes)
    - Row 4: [Tableau Commandes] (pleine largeur)

# Template Marketing  
Template "Marketing":
  structure:
    - Row 1: [ROI, CPC, CTR, Conversions] (4 colonnes)
    - Row 2: [Performance Campagnes] (pleine largeur)
    - Row 3: [Entonnoir, Audience] (2 colonnes)
```

#### Sections et onglets
```javascript
{
  "sections": [
    {
      "id": "overview",
      "title": "Vue d'ensemble",
      "widgets": ["kpi-ca", "kpi-orders", "trend-chart"]
    },
    {
      "id": "details", 
      "title": "Détails",
      "widgets": ["products-table", "regions-map"]
    },
    {
      "id": "analysis",
      "title": "Analyse",
      "widgets": ["cohort-analysis", "funnel-chart"]
    }
  ]
}
```

## Interactivité et filtres

### Filtres globaux

#### Configuration des filtres
```javascript
{
  "global_filters": [
    {
      "id": "date_range",
      "type": "date_range",
      "label": "Période",
      "default": "last_30_days",
      "applies_to": "all_widgets"
    },
    {
      "id": "region_filter",
      "type": "multi_select", 
      "label": "Régions",
      "source": "distinct(region)",
      "applies_to": ["map-widget", "sales-table"]
    },
    {
      "id": "product_category",
      "type": "dropdown",
      "label": "Catégorie",
      "options": ["Électronique", "Vêtements", "Maison"]
    }
  ]
}
```

#### Synchronisation des widgets
```javascript
{
  "widget_interactions": [
    {
      "trigger": "chart-regions.click", 
      "action": "filter",
      "target": ["table-sales"],
      "parameter": "region"
    },
    {
      "trigger": "date_filter.change",
      "action": "refresh", 
      "target": "all_widgets"
    }
  ]
}
```

### Drill-down et navigation

#### Configuration drill-down
```javascript
{
  "drill_down": {
    "levels": [
      { "field": "year", "label": "Année" },
      { "field": "quarter", "label": "Trimestre" },
      { "field": "month", "label": "Mois" },
      { "field": "day", "label": "Jour" }
    ],
    "widgets": ["trend-chart", "revenue-kpi"]
  }
}
```

## Performance et optimisation

### Chargement intelligent

#### Lazy loading
```javascript
{
  "performance": {
    "lazy_loading": true,
    "viewport_buffer": 2,          // Charger 2 widgets hors vue
    "initial_load_count": 4,       // Charger 4 widgets au démarrage
    "priority_widgets": ["kpi-ca", "alert-widget"]
  }
}
```

#### Cache et refresh
```javascript
{
  "caching": {
    "widget_cache": {
      "enabled": true,
      "ttl": 300,                  // 5 minutes
      "strategy": "stale_while_revalidate"
    },
    "data_cache": {
      "enabled": true,
      "ttl": 600,                  // 10 minutes
      "invalidate_on_filter": true
    }
  }
}
```

### Optimisation des requêtes

#### Pagination intelligente
```javascript
{
  "pagination": {
    "table_widgets": {
      "page_size": 25,
      "virtual_scrolling": true
    },
    "chart_widgets": {
      "max_data_points": 1000,
      "sampling": "time_based"
    }
  }
}
```

## Responsive design

### Adaptation mobile

#### Breakpoints personnalisés
```javascript
{
  "responsive": {
    "breakpoints": {
      "desktop": { "min": 1200 },
      "tablet": { "min": 768, "max": 1199 },
      "mobile": { "max": 767 }
    },
    "adaptations": {
      "mobile": {
        "hide_widgets": ["complex-table"],
        "simplify_charts": true,
        "stack_layout": true,
        "touch_friendly": true
      }
    }
  }
}
```

#### Widgets mobiles optimisés
```javascript
{
  "mobile_optimizations": {
    "chart_simplification": {
      "max_series": 3,
      "reduce_data_points": true,
      "larger_touch_targets": true
    },
    "table_adaptations": {
      "horizontal_scroll": true,
      "condensed_view": true,
      "swipe_actions": true
    }
  }
}
```

## Sécurité et permissions

### Gestion des accès

#### Niveaux de permission
```yaml
Permissions dashboard:
  Owner (Propriétaire):
    - Modification complète
    - Gestion des permissions
    - Suppression
    - Export toutes données

  Editor (Éditeur):
    - Modification widgets et layout
    - Export données visibles
    - Partage lecture seule

  Viewer (Lecteur):
    - Vue lecture seule
    - Filtres et interactions
    - Export limité

  Restricted (Restreint):
    - Vue partielle
    - Widgets filtrés
    - Pas d'export
```

#### Contrôle granulaire
```javascript
{
  "permissions": {
    "widget_level": {
      "sensitive_kpis": ["owner", "direction"],
      "sales_charts": ["sales_team", "management"],
      "public_metrics": ["all_users"]
    },
    "data_level": {
      "row_level_security": {
        "field": "region",
        "user_mapping": {
          "jean.dupont": ["Nord", "Est"],
          "marie.martin": ["Sud", "Ouest"]
        }
      }
    }
  }
}
```

## Export et partage

### Formats d'export

#### PDF avec mise en page
```javascript
{
  "pdf_export": {
    "format": "A4",
    "orientation": "landscape",
    "quality": "high",
    "include": {
      "header": true,
      "footer": true,
      "filters": true,
      "timestamp": true
    },
    "branding": {
      "logo": "logo_entreprise.png",
      "footer_text": "Confidentiel - Usage interne"
    }
  }
}
```

#### Export programmé
```javascript
{
  "scheduled_exports": [
    {
      "name": "Rapport hebdomadaire",
      "format": "pdf",
      "schedule": "0 8 * * 1",      // Tous les lundis 8h
      "recipients": ["direction@entreprise.com"],
      "filters": {
        "date_range": "last_week"
      }
    }
  ]
}
```

### Partage collaboratif

#### Liens publics sécurisés
```javascript
{
  "public_sharing": {
    "enabled": true,
    "expiry": "2025-06-01",
    "password_protected": true,
    "domain_restriction": ["entreprise.com"],
    "watermark": "Confidentiel",
    "disable_export": true
  }
}
```

#### Collaboration temps réel
```javascript
{
  "collaboration": {
    "live_cursors": true,           // Voir curseurs autres utilisateurs
    "comments": true,               // Commentaires sur widgets
    "annotations": true,            // Annotations visuelles
    "version_history": true,        // Historique modifications
    "conflict_resolution": "merge"  // Gestion conflits
  }
}
```

## Alertes et notifications

### Alertes automatiques

#### Configuration d'alertes
```javascript
{
  "alerts": [
    {
      "name": "CA en baisse",
      "condition": {
        "metric": "daily_revenue",
        "operator": "less_than",
        "threshold": 10000,
        "comparison": "previous_day"
      },
      "notification": {
        "channels": ["email", "slack"],
        "recipients": ["commercial@entreprise.com"],
        "frequency": "immediate"
      }
    }
  ]
}
```

### Monitoring des performances

#### Métriques système
```javascript
{
  "monitoring": {
    "performance_alerts": {
      "slow_widgets": {
        "threshold": 5000,          // ms
        "action": "notify_admin"
      },
      "high_memory": {
        "threshold": "500MB",
        "action": "optimize_cache"
      }
    }
  }
}
```

## Dépannage courant

### Problèmes de performance

#### Diagnostic
```yaml
Symptômes courants:
  - Dashboard lent à charger
  - Widgets qui ne se mettent pas à jour
  - Interface qui se bloque

Solutions:
  1. Réduire nombre de widgets affichés simultanément
  2. Optimiser requêtes avec filtres de date
  3. Activer cache et pagination
  4. Simplifier widgets complexes
```

#### Optimisations recommandées
```javascript
{
  "best_practices": {
    "widget_limit": 12,             // Max widgets par dashboard
    "data_limit": 10000,            // Max lignes par widget
    "refresh_interval": 300,        // Min 5 minutes
    "cache_enabled": true
  }
}
```

---

**Prochaines étapes** : Découvrez les [fonctionnalités de partage](/docs/sharing/overview) ou apprenez à [exporter vos dashboards](/docs/dashboards/export).
