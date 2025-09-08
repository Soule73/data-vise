# Partage et collaboration

Data Vise offre des outils avancés pour partager vos dashboards et collaborer efficacement avec votre équipe.

## Types de partage

### Partage interne (équipe)

Le partage interne permet de collaborer avec les membres de votre organisation.

#### Partage par utilisateur
```yaml
Configuration utilisateur:
  email: "marie.martin@entreprise.com"
  permission: "editor" # owner, editor, viewer
  accès_temporaire: false
  date_expiration: null
  restrictions:
    - widgets: "all"
    - filtres: "all" 
    - export: true
```

#### Partage par équipe/groupe
```yaml
Groupes d'utilisateurs:
  équipe_ventes:
    membres: ["jean@", "marie@", "paul@"]
    permission: "viewer"
    widgets_autorisés: ["kpi-*", "charts-sales"]
    
  direction:
    membres: ["ceo@", "cfo@", "coo@"]
    permission: "owner"
    accès_complet: true
```

### Partage public (liens)

Génération de liens publics sécurisés pour partenaires externes.

#### Lien public standard
```javascript
{
  "public_link": {
    "url": "https://app.data-vise.com/public/abc123def456",
    "expires_at": "2025-06-01T23:59:59Z",
    "password_protected": false,
    "embed_allowed": true,
    "download_enabled": false
  }
}
```

#### Lien sécurisé avancé
```javascript
{
  "secure_link": {
    "url": "https://app.data-vise.com/secure/xyz789ghi012",
    "expires_at": "2025-03-01T12:00:00Z",
    "password": "Dashboard2025!",
    "domain_whitelist": ["partenaire.com", "client.fr"],
    "ip_restrictions": ["192.168.1.0/24"],
    "watermark": "Confidentiel - Partenaire ABC",
    "view_limit": 100,
    "features": {
      "filters": true,
      "export": false,
      "fullscreen": true,
      "refresh": false
    }
  }
}
```

### Intégration (embed)

Intégrez vos dashboards dans d'autres applications.

#### Code d'intégration
```html
<!-- iFrame classique -->
<iframe 
  src="https://app.data-vise.com/embed/dashboard123"
  width="100%" 
  height="600"
  frameborder="0">
</iframe>

<!-- Intégration JavaScript -->
<div id="datavise-dashboard"></div>
<script>
DataVise.embed({
  container: '#datavise-dashboard',
  dashboard: 'dashboard123',
  theme: 'light',
  interactive: true,
  toolbar: false
});
</script>
```

## 👥 Gestion des permissions

### Niveaux d'accès

#### Owner (Propriétaire)
```yaml
Droits complets:
  ✅ Modification complète du dashboard
  ✅ Gestion des permissions et partages
  ✅ Suppression du dashboard
  ✅ Export toutes données (PDF, Excel, CSV)
  ✅ Configuration alertes et automatisations
  ✅ Accès historique et versions
  ✅ Transfert de propriété
```

#### Editor (Éditeur)
```yaml
Modification limitée:
  ✅ Ajout/modification/suppression widgets
  ✅ Modification layout et design
  ✅ Configuration filtres et interactions
  ✅ Export données visibles
  ✅ Partage en lecture seule
  ❌ Gestion permissions d'autres utilisateurs
  ❌ Suppression dashboard
  ❌ Modifications sécurité
```

#### Viewer (Lecteur)
```yaml
Consultation interactive:
  ✅ Visualisation complète dashboard
  ✅ Utilisation filtres et interactions
  ✅ Actualisation manuelle des données
  ✅ Export PDF/image (selon config)
  ✅ Ajout commentaires (si activé)
  ❌ Modification widgets ou layout
  ❌ Export données brutes
  ❌ Partage avec d'autres
```

#### Restricted (Accès restreint)
```yaml
Accès partiel:
  ✅ Visualisation widgets autorisés uniquement
  ✅ Filtres prédéfinis seulement
  ✅ Vue mobile optimisée
  ❌ Export sous toute forme
  ❌ Modification filtres
  ❌ Accès données sensibles
```

### Permissions granulaires

#### Par widget
```javascript
{
  "widget_permissions": {
    "kpi_revenue": {
      "allowed_roles": ["owner", "finance", "direction"],
      "denied_users": ["stagiaire@entreprise.com"]
    },
    "sales_chart": {
      "allowed_teams": ["sales", "marketing"],
      "data_filters": {
        "region": "user.assigned_region"
      }
    },
    "customer_table": {
      "row_level_security": {
        "field": "sales_rep",
        "condition": "equals_user_email"
      }
    }
  }
}
```

#### Par données
```javascript
{
  "data_permissions": {
    "sales_data": {
      "filters": [
        {
          "user_attribute": "region",
          "data_field": "sales_region",
          "operator": "in"
        },
        {
          "user_role": "junior", 
          "data_field": "amount",
          "operator": "less_than",
          "value": 10000
        }
      ]
    }
  }
}
```

## Sécurité avancée

### Authentification

#### Single Sign-On (SSO)
```yaml
Configuration SSO:
  provider: "Azure AD / Google Workspace / Okta"
  domain: "entreprise.com"
  auto_provisioning: true
  default_role: "viewer"
  groups_mapping:
    "Direction": "owner"
    "Managers": "editor" 
    "Employees": "viewer"
```

#### Authentification à deux facteurs
```yaml
2FA Configuration:
  obligatoire_pour: ["owner", "admin"]
  méthodes: ["TOTP", "SMS", "Email"]
  backup_codes: true
  session_timeout: 8h
```

### Audit et traçabilité

#### Logs d'accès
```json
{
  "access_log": {
    "timestamp": "2025-01-15T14:30:00Z",
    "user": "marie.martin@entreprise.com",
    "action": "view_dashboard",
    "dashboard": "sales_overview_q1",
    "ip_address": "192.168.1.42",
    "user_agent": "Mozilla/5.0...",
    "session_duration": 1820,
    "widgets_viewed": ["kpi_revenue", "sales_chart"],
    "exports": []
  }
}
```

#### Historique des modifications
```json
{
  "modification_log": {
    "timestamp": "2025-01-15T09:15:00Z",
    "user": "jean.dupont@entreprise.com",
    "action": "widget_added",
    "details": {
      "widget_type": "kpi",
      "widget_id": "new_kpi_conversion",
      "position": {"x": 6, "y": 0, "w": 3, "h": 2}
    },
    "version": "v1.23"
  }
}
```

### Protection des données

#### Chiffrement
```yaml
Sécurité des données:
  transit: "TLS 1.3"
  stockage: "AES-256"
  clés: "Rotation automatique tous les 90 jours"
  sauvegarde: "Chiffrement côté client"
```

#### Anonymisation automatique
```javascript
{
  "privacy_settings": {
    "auto_anonymize": {
      "email": "hash",           // marie.martin@... → m***@...
      "phone": "mask",           // 0123456789 → 01***789
      "customer_id": "tokenize", // ID12345 → TOK***345
      "ip_address": "subnet"     // 192.168.1.42 → 192.168.1.0
    },
    "data_retention": {
      "logs": "12_months",
      "exports": "6_months", 
      "cache": "7_days"
    }
  }
}
```

## Collaboration temps réel

### Commentaires et annotations

#### Commentaires sur widgets
```javascript
{
  "comment": {
    "id": "comment_123",
    "widget_id": "sales_chart_q1",
    "user": "marie.martin@entreprise.com",
    "timestamp": "2025-01-15T16:45:00Z",
    "content": "Pic inhabituel le 10 janvier, à investiguer",
    "position": {"x": 150, "y": 200},
    "resolved": false,
    "replies": [
      {
        "user": "jean.dupont@entreprise.com",
        "timestamp": "2025-01-15T17:00:00Z",
        "content": "C'était la promotion Black Friday tardive"
      }
    ]
  }
}
```

#### Annotations visuelles
```javascript
{
  "annotation": {
    "type": "highlight",
    "widget_id": "revenue_kpi",
    "shape": "circle",
    "coordinates": {"x": 75, "y": 120, "radius": 15},
    "color": "#ef4444",
    "text": "Objectif atteint !",
    "temporary": true,
    "expires_at": "2025-01-16T00:00:00Z"
  }
}
```

### Présence en temps réel

#### Curseurs collaboratifs
```javascript
{
  "live_presence": {
    "enabled": true,
    "show_cursors": true,
    "show_selections": true,
    "timeout": 30, // secondes d'inactivité
    "users": [
      {
        "user": "marie.martin@entreprise.com",
        "cursor": {"x": 450, "y": 200},
        "color": "#3b82f6",
        "active_widget": "sales_table"
      }
    ]
  }
}
```

### Notifications collaboratives

#### Alertes de modification
```yaml
Notifications automatiques:
  modification_dashboard:
    destinataires: "tous_les_éditeurs"
    canal: "email + app"
    fréquence: "temps_réel"
    
  nouveau_commentaire:
    destinataires: "participants_conversation"
    canal: "app"
    
  partage_nouveau:
    destinataires: "propriétaire"
    canal: "email"
```

## Export et rapports

### Formats d'export

#### PDF professionnel
```javascript
{
  "pdf_export": {
    "template": "corporate",
    "header": {
      "logo": "logo_entreprise.png",
      "title": "Rapport mensuel des ventes",
      "subtitle": "Janvier 2025",
      "date": "auto"
    },
    "footer": {
      "page_numbers": true,
      "confidentiality": "Usage interne uniquement",
      "generated_by": "Data Vise - ${user.name}"
    },
    "layout": {
      "orientation": "landscape",
      "quality": "high",
      "compression": "medium"
    }
  }
}
```

#### Excel avec données brutes
```javascript
{
  "excel_export": {
    "include_raw_data": true,
    "separate_sheets": {
      "summary": "Vue d'ensemble",
      "kpis": "Indicateurs clés",
      "detailed_sales": "Données détaillées",
      "charts_data": "Données graphiques"
    },
    "formatting": {
      "currency": "€",
      "dates": "DD/MM/YYYY",
      "numbers": "french_locale"
    }
  }
}
```

### Rapports automatisés

#### Planification d'envoi
```yaml
Rapport hebdomadaire:
  nom: "Synthèse ventes hebdomadaire"
  destinataires: 
    - "direction@entreprise.com"
    - "ventes@entreprise.com"
  format: "PDF"
  planification: "Tous les lundis à 08h00"
  filtres:
    période: "semaine_précédente"
    régions: ["toutes"]
  options:
    inclure_commentaires: true
    résolution: "haute"
    langue: "français"
```

## API et intégrations

### API de partage

#### Gestion programmatique
```javascript
// Créer un partage
const share = await DataViseAPI.createShare({
  dashboard_id: 'dashboard_123',
  user_email: 'nouveau@entreprise.com', 
  permission: 'viewer',
  expires_at: '2025-12-31'
});

// Modifier permissions
await DataViseAPI.updateShare(share.id, {
  permission: 'editor'
});

// Révoquer accès
await DataViseAPI.revokeShare(share.id);
```

#### Webhooks pour notifications
```javascript
{
  "webhook": {
    "url": "https://votre-app.com/webhooks/datavise",
    "events": [
      "dashboard.shared",
      "dashboard.access_granted", 
      "dashboard.modified",
      "export.completed"
    ],
    "authentication": {
      "type": "bearer_token",
      "token": "webhook_secret_token"
    }
  }
}
```

### Intégrations tierces

#### Slack
```yaml
Configuration Slack:
  workspace: "entreprise.slack.com"
  bot_token: "xoxb-your-bot-token"
  channels:
    notifications: "#datavise-alerts"
    rapports: "#ventes-quotidien"
  commandes:
    "/datavise dashboard sales": "Affiche dashboard ventes"
    "/datavise export weekly": "Export rapport hebdomadaire"
```

#### Microsoft Teams
```javascript
{
  "teams_integration": {
    "tenant_id": "your-tenant-id",
    "app_id": "datavise-teams-app",
    "channels": {
      "alerts": "Sales Team > DataVise Alerts",
      "reports": "Management > Weekly Reports"
    },
    "features": {
      "dashboard_previews": true,
      "interactive_cards": true,
      "scheduled_reports": true
    }
  }
}
```

## Cas d'usage avancés

### Partage client/partenaire

```yaml
Scénario: Dashboard pour client
  configuration:
    données_filtrées: "client_specific_data"
    branding_personnalisé: "logo_client.png"
    domaine_personnalisé: "analytics.client.com"
    sécurité:
      accès_ip: ["client_office_range"]
      expiration: "fin_contrat" 
      watermark: "Confidentiel - Client ABC"
```

### Présentation temps réel

```yaml
Mode présentation:
  activation: "mode_kiosque"
  rotation_automatique: 
    - dashboard: "vue_ensemble" (30s)
    - dashboard: "détails_ventes" (45s)
    - dashboard: "performance_équipe" (30s)
  contrôles:
    pause_navigation: "spacebar"
    navigation_manuelle: "flèches"
    zoom: "molette_souris"
```

---

**Prochaines étapes** : Explorez la [gestion des utilisateurs](/docs/user-management/overview) ou découvrez les [fonctionnalités avancées](/docs/advanced/automation).
