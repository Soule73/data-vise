# Types de widgets

Data Vise propose une large gamme de widgets pour visualiser vos données de manière efficace et attrayante.

## KPI et métriques

### Widget KPI simple

Le widget KPI affiche une valeur unique avec évolution optionnelle.

```yaml
Configuration:
  - Valeur principale: Nombre, pourcentage, devise
  - Comparaison: Période précédente, objectif
  - Style: Couleur, taille, icône
  - Format: Auto, personnalisé
```

#### Exemple : Chiffre d'affaires
```javascript
{
  "type": "kpi",
  "title": "CA Total",
  "value": 125000,
  "format": "currency",
  "comparison": {
    "previous": 118000,
    "type": "previous_period",
    "format": "percentage"
  },
  "trend": "up", // up, down, stable
  "color": "#10B981"
}
```

**Résultat visuel** :
```
┌─────────────────┐
│   CA Total      │
│   125 000 €     │
│   ↗ +5.9%       │
│ vs mois dernier │
└─────────────────┘
```

### Widget KPI avec gauge

Affichage en jauge circulaire pour objectifs et pourcentages.

```javascript
{
  "type": "gauge",
  "title": "Taux de conversion",
  "value": 3.2,
  "max": 5.0,
  "format": "percentage", 
  "thresholds": [
    { "value": 2.0, "color": "#EF4444" },  // Rouge
    { "value": 3.5, "color": "#F59E0B" },  // Orange  
    { "value": 5.0, "color": "#10B981" }   // Vert
  ]
}
```

### Métriques multiples

Widget affichant plusieurs KPI dans une grille.

```javascript
{
  "type": "metrics_grid",
  "title": "Performance commerciale",
  "metrics": [
    {
      "label": "Ventes",
      "value": 1250,
      "format": "number",
      "trend": "+12%"
    },
    {
      "label": "Nouveaux clients", 
      "value": 45,
      "format": "number",
      "trend": "+23%"
    },
    {
      "label": "Panier moyen",
      "value": 127.50,
      "format": "currency",
      "trend": "-2%"
    }
  ]
}
```

## Graphiques linéaires

### Graphique en ligne simple

Idéal pour les tendances temporelles.

```javascript
{
  "type": "line_chart",
  "title": "Évolution des ventes",
  "data": {
    "x_axis": "date",
    "y_axis": "ventes", 
    "group_by": "day"
  },
  "style": {
    "color": "#3B82F6",
    "line_width": 2,
    "fill": false,
    "smooth": true
  }
}
```

### Graphique multi-lignes

Comparaison de plusieurs séries de données.

```javascript
{
  "type": "multi_line_chart",
  "title": "Ventes par région",
  "data": {
    "x_axis": "date",
    "y_axis": "ventes",
    "series": "region"
  },
  "series_config": {
    "Nord": { "color": "#EF4444", "style": "solid" },
    "Sud": { "color": "#10B981", "style": "dashed" },
    "Est": { "color": "#F59E0B", "style": "dotted" },
    "Ouest": { "color": "#8B5CF6", "style": "solid" }
  }
}
```

### Graphique en aires empilées

Pour visualiser la composition et l'évolution.

```javascript
{
  "type": "stacked_area",
  "title": "Répartition des ventes par produit",
  "data": {
    "x_axis": "date",
    "y_axis": "ventes",
    "stack": "produit"
  },
  "stack_mode": "percent", // percent, value
  "colors": ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"]
}
```

## Graphiques en barres

### Barres verticales

Comparaison de catégories.

```javascript
{
  "type": "column_chart", 
  "title": "Top 10 produits",
  "data": {
    "x_axis": "produit",
    "y_axis": "ventes",
    "sort": "desc",
    "limit": 10
  },
  "style": {
    "color": "#3B82F6",
    "gradient": true,
    "border_radius": 4
  }
}
```

### Barres horizontales

Utile pour les longs libellés.

```javascript
{
  "type": "bar_chart",
  "title": "Ventes par commercial", 
  "data": {
    "x_axis": "commercial",
    "y_axis": "chiffre_affaires",
    "sort": "desc"
  },
  "formatting": {
    "y_format": "currency",
    "show_values": true
  }
}
```

### Barres groupées

Comparaison multi-dimensionnelle.

```javascript
{
  "type": "grouped_bar",
  "title": "Ventes par trimestre et région",
  "data": {
    "x_axis": "trimestre", 
    "y_axis": "ventes",
    "group": "region"
  },
  "group_colors": {
    "Nord": "#3B82F6",
    "Sud": "#10B981", 
    "Est": "#F59E0B",
    "Ouest": "#EF4444"
  }
}
```

## Graphiques circulaires

### Diagramme en secteurs (Pie)

Répartition de parts d'un total.

```javascript
{
  "type": "pie_chart",
  "title": "Répartition par canal de vente",
  "data": {
    "label": "canal",
    "value": "ventes",
    "sort": "desc"
  },
  "style": {
    "show_labels": true,
    "show_percentages": true,
    "inner_radius": 0, // 0 = pie, >0 = donut
    "colors": ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"]
  }
}
```

### Diagramme en anneau (Donut)

Version moderne du diagramme circulaire.

```javascript
{
  "type": "donut_chart",
  "title": "Répartition des revenus",
  "data": {
    "label": "source_revenus",
    "value": "montant"
  },
  "style": {
    "inner_radius": 60,
    "show_center_total": true,
    "center_label": "Total",
    "animate": true
  }
}
```

## Tableaux de données

### Tableau simple

Affichage tabulaire classique avec tri et pagination.

```javascript
{
  "type": "data_table",
  "title": "Dernières commandes",
  "data": {
    "source": "commandes",
    "columns": [
      {
        "field": "date",
        "label": "Date", 
        "type": "date",
        "format": "DD/MM/YYYY"
      },
      {
        "field": "client",
        "label": "Client",
        "type": "text",
        "sortable": true
      },
      {
        "field": "montant",
        "label": "Montant",
        "type": "currency",
        "align": "right"
      },
      {
        "field": "status",
        "label": "Statut",
        "type": "badge",
        "colors": {
          "payé": "green",
          "en_attente": "orange", 
          "annulé": "red"
        }
      }
    ]
  },
  "options": {
    "pagination": true,
    "page_size": 25,
    "search": true,
    "export": true
  }
}
```

### Tableau avec totaux

Calculs automatiques en pied de tableau.

```javascript
{
  "type": "summary_table",
  "title": "Résumé des ventes",
  "aggregations": {
    "montant": "sum",
    "quantite": "sum", 
    "commandes": "count",
    "panier_moyen": "avg"
  },
  "totals_position": "bottom", // top, bottom, both
  "highlight_totals": true
}
```

## Visualisations géographiques

### Carte choroplèthe

Visualisation par régions avec intensité colorée.

```javascript
{
  "type": "choropleth_map",
  "title": "Ventes par région",
  "data": {
    "location_field": "region_code",
    "value_field": "ventes",
    "geo_level": "regions" // regions, departements, countries
  },
  "style": {
    "color_scale": "blues", // blues, greens, reds, viridis
    "min_color": "#F8FAFC",
    "max_color": "#1E40AF",
    "show_legend": true
  }
}
```

### Carte avec marqueurs

Points géographiques avec valeurs.

```javascript
{
  "type": "marker_map",
  "title": "Magasins et performance",
  "data": {
    "latitude": "lat",
    "longitude": "lng", 
    "size": "chiffre_affaires",
    "color": "performance_rating"
  },
  "style": {
    "marker_type": "circle", // circle, square, custom
    "size_range": [5, 25],
    "color_scale": "traffic" // traffic (red-yellow-green)
  }
}
```

## Widgets de comparaison

### Diagramme en radar

Comparaison multi-critères.

```javascript
{
  "type": "radar_chart", 
  "title": "Performance commerciale",
  "data": {
    "categories": ["Ventes", "Satisfaction", "Délais", "Qualité"],
    "series": [
      {
        "name": "Équipe A",
        "values": [85, 92, 78, 88],
        "color": "#3B82F6"
      },
      {
        "name": "Équipe B", 
        "values": [92, 85, 85, 82],
        "color": "#10B981"
      }
    ]
  },
  "scale": {
    "min": 0,
    "max": 100
  }
}
```

### Graphique en cascade (Waterfall)

Décomposition d'un total en éléments.

```javascript
{
  "type": "waterfall_chart",
  "title": "Évolution du CA mensuel",
  "data": [
    { "label": "CA Initial", "value": 100000, "type": "start" },
    { "label": "Nouvelles ventes", "value": 25000, "type": "positive" },
    { "label": "Retours", "value": -5000, "type": "negative" }, 
    { "label": "Remises", "value": -8000, "type": "negative" },
    { "label": "CA Final", "value": 112000, "type": "end" }
  ],
  "colors": {
    "positive": "#10B981",
    "negative": "#EF4444", 
    "total": "#6B7280"
  }
}
```

## Widgets interactifs

### Filtres dynamiques

Contrôles pour filtrer d'autres widgets.

```javascript
{
  "type": "filter_controls",
  "title": "Filtres",
  "filters": [
    {
      "field": "date_range",
      "type": "date_picker",
      "label": "Période",
      "default": "last_30_days"
    },
    {
      "field": "region",
      "type": "multi_select",
      "label": "Régions",
      "options": ["Nord", "Sud", "Est", "Ouest"]
    },
    {
      "field": "montant_min",
      "type": "slider", 
      "label": "Montant minimum",
      "min": 0,
      "max": 10000,
      "step": 100
    }
  ]
}
```

### Widget de recherche

Zone de recherche globale dans les données.

```javascript
{
  "type": "search_widget",
  "placeholder": "Rechercher client, produit...",
  "search_fields": ["client", "produit", "reference"],
  "highlight_results": true,
  "auto_complete": true
}
```

## Personnalisation avancée

### Styles personnalisés

```css
/* CSS personnalisé pour widgets */
.widget-kpi {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
}

.widget-chart .axis-label {
  font-size: 12px;
  font-weight: 600;
  color: #374151;
}
```

### Templates de widgets

```javascript
// Template réutilisable
{
  "template": "sales_kpi",
  "variables": {
    "metric": "chiffre_affaires",
    "period": "monthly",
    "comparison": "previous_year"
  }
}
```

### Animations et transitions

```javascript
{
  "animations": {
    "load": "fadeIn",
    "update": "smooth", 
    "duration": 800,
    "easing": "easeInOut"
  }
}
```

## Configuration avancée

### Formatage des données

```javascript
{
  "formatting": {
    "numbers": {
      "locale": "fr-FR",
      "decimal_places": 2,
      "thousand_separator": " ",
      "decimal_separator": ","
    },
    "currency": {
      "symbol": "€",
      "position": "after" // before, after
    },
    "dates": {
      "format": "DD/MM/YYYY",
      "timezone": "Europe/Paris"
    }
  }
}
```

### Conditions d'affichage

```javascript
{
  "display_conditions": [
    {
      "field": "status",
      "operator": "equals",
      "value": "active"
    },
    {
      "field": "montant", 
      "operator": "greater_than",
      "value": 1000
    }
  ]
}
```

### Actualisation automatique

```javascript
{
  "auto_refresh": {
    "enabled": true,
    "interval": 300, // secondes
    "on_data_change": true,
    "show_indicator": true
  }
}
```

## Widgets responsifs

### Configuration mobile

```javascript
{
  "responsive": {
    "mobile": {
      "type": "kpi", // Simplification sur mobile
      "hide_elements": ["legend", "grid"],
      "font_size": "large"
    },
    "tablet": {
      "layout": "stacked",
      "chart_height": 300
    }
  }
}
```

---

**Prochaines étapes** : Apprenez à [créer et configurer vos widgets](/docs/widgets/configuration) ou découvrez comment les intégrer dans des [dashboards](/docs/dashboards/creation).
