# Gestion des utilisateurs et rôles

Data Vise propose un système complet de gestion des utilisateurs avec des rôles flexibles et des permissions granulaires.

## 👤 Types d'utilisateurs

### Administrateur système

L'administrateur a un contrôle total sur l'instance Data Vise.

```yaml
Droits administrateur:
  ✅ Gestion complète des utilisateurs
  ✅ Configuration globale de l'instance
  ✅ Accès à tous les dashboards et données
  ✅ Gestion des sources de données partagées
  ✅ Configuration sécurité et authentification
  ✅ Monitoring et logs système
  ✅ Gestion des licences et facturation
  ✅ Export et sauvegarde complète
```

#### Configuration d'un administrateur
```javascript
{
  "user": {
    "email": "admin@entreprise.com",
    "role": "system_admin",
    "permissions": {
      "global": ["*"],
      "restrictions": []
    },
    "features": {
      "user_management": true,
      "system_config": true,
      "billing_access": true,
      "audit_logs": true
    }
  }
}
```

### Manager/Chef d'équipe

Gestion d'équipe avec permissions étendues dans son périmètre.

```yaml
Droits manager:
  ✅ Gestion utilisateurs de son équipe
  ✅ Création/modification dashboards équipe
  ✅ Configuration sources de données équipe
  ✅ Attribution permissions à ses subordonnés
  ✅ Export données de son périmètre
  ✅ Monitoring performance équipe
  ❌ Accès données autres équipes (sauf autorisation)
  ❌ Configuration système globale
```

#### Structure d'équipe
```javascript
{
  "team": {
    "name": "Équipe Ventes",
    "manager": "marie.manager@entreprise.com",
    "members": [
      "jean.commercial1@entreprise.com",
      "paul.commercial2@entreprise.com",
      "claire.commercial3@entreprise.com"
    ],
    "permissions": {
      "data_scope": ["sales_data", "customer_data"],
      "dashboard_scope": ["sales_*", "team_performance"],
      "features": ["export_pdf", "share_team"]
    }
  }
}
```

### Utilisateur standard

Utilisateur classique avec accès à ses données et dashboards.

```yaml
Droits utilisateur:
  ✅ Accès dashboards autorisés
  ✅ Création dashboards personnels
  ✅ Import sources de données personnelles
  ✅ Partage avec collègues (lecture seule)
  ✅ Export PDF/images de ses dashboards
  ✅ Création widgets et visualisations
  ❌ Gestion d'autres utilisateurs
  ❌ Accès données confidentielles
  ❌ Configuration système
```

### Utilisateur lecture seule

Accès limité à la consultation et interaction basique.

```yaml
Droits lecture seule:
  ✅ Visualisation dashboards partagés
  ✅ Utilisation filtres et interactions
  ✅ Actualisation manuelle données
  ✅ Ajout commentaires (si autorisé)
  ❌ Création/modification dashboards
  ❌ Import données
  ❌ Export (selon configuration)
  ❌ Partage
```

## 🔐 Système de rôles

### Rôles prédéfinis

#### Rôle "Analyste Business"
```javascript
{
  "role": "business_analyst",
  "permissions": {
    "dashboards": {
      "create": true,
      "edit": "own",
      "delete": "own", 
      "share": "readonly"
    },
    "data_sources": {
      "create": true,
      "edit": "own",
      "connect": ["csv", "json", "excel"]
    },
    "widgets": {
      "all_types": true,
      "advanced_config": true
    },
    "features": {
      "export": ["pdf", "png"],
      "scheduling": false,
      "api_access": false
    }
  }
}
```

#### Rôle "Directeur"
```javascript
{
  "role": "executive",
  "permissions": {
    "dashboards": {
      "access": "all_company",
      "sensitive_data": true
    },
    "features": {
      "export": ["pdf", "excel", "raw_data"],
      "scheduling": true,
      "email_reports": true
    },
    "data_access": {
      "financial": true,
      "hr": true,
      "strategic": true
    }
  }
}
```

#### Rôle "Commercial"
```javascript
{
  "role": "sales_rep",
  "permissions": {
    "data_scope": {
      "customers": "assigned_only",
      "sales": "own_territory",
      "targets": "personal"
    },
    "dashboards": {
      "templates": ["sales_performance", "pipeline"],
      "create_from_templates": true
    },
    "features": {
      "mobile_access": true,
      "offline_sync": true
    }
  }
}
```

### Rôles personnalisés

#### Création de rôle sur mesure
```javascript
{
  "custom_role": {
    "name": "Contrôleur Financier",
    "description": "Accès données financières avec restrictions exports",
    "base_role": "analyst",
    "custom_permissions": {
      "data_sources": {
        "financial_db": "read_write",
        "budget_sheets": "read_only"
      },
      "widgets": {
        "restricted_types": ["map"], // Pas de géolocalisation
        "approved_metrics": ["revenue", "costs", "margin"]
      },
      "export": {
        "formats": ["pdf_summary_only"],
        "approval_required": true,
        "approvers": ["cfo@entreprise.com"]
      }
    }
  }
}
```

## Gestion des équipes

### Organisation hiérarchique

#### Structure départementale
```yaml
Organisation:
  Direction:
    - CEO: accès_total
    - CFO: données_financières + commercial
    - CTO: données_techniques + performance
    
  Département Commercial:
    Manager: marie.commercial@entreprise.com
    Équipe:
      - jean.vendeur1@entreprise.com (Région Nord)
      - paul.vendeur2@entreprise.com (Région Sud)
      - claire.vendeur3@entreprise.com (Région Est)
    
  Département Marketing:
    Manager: pierre.marketing@entreprise.com
    Équipe:
      - sophie.digital@entreprise.com
      - lucas.content@entreprise.com
```

#### Permissions en cascade
```javascript
{
  "hierarchy_permissions": {
    "inheritance": true,
    "cascade_rules": [
      {
        "from": "manager",
        "to": "team_members",
        "permissions": ["view_team_dashboards", "comment"],
        "restrictions": ["no_sensitive_data"]
      },
      {
        "from": "department_head", 
        "to": "all_department",
        "permissions": ["view_dept_summary"],
        "override": false
      }
    ]
  }
}
```

### Groupes dynamiques

#### Groupes basés sur attributs
```javascript
{
  "dynamic_groups": [
    {
      "name": "Commerciaux Senior",
      "criteria": {
        "department": "sales",
        "seniority": ">= 3 years",
        "performance": ">= 8/10"
      },
      "permissions": {
        "advanced_analytics": true,
        "territory_comparison": true
      }
    },
    {
      "name": "Managers Régionaux",
      "criteria": {
        "title": "contains 'manager'",
        "scope": "regional"
      },
      "permissions": {
        "cross_region_view": false,
        "team_management": true
      }
    }
  ]
}
```

## Authentification et sécurité

### Single Sign-On (SSO)

#### Configuration Azure AD
```yaml
Azure AD SSO:
  tenant_id: "votre-tenant-id"
  client_id: "datavise-app-id"
  client_secret: "encrypted_secret"
  redirect_uri: "https://app.data-vise.com/auth/callback"
  
  mappings:
    email: "mail"
    nom: "displayName"
    département: "department"
    manager: "manager"
    
  auto_provisioning: true
  default_role: "user"
  
  group_mappings:
    "Sales Team": "sales_rep"
    "Management": "manager"
    "IT Department": "admin"
```

#### Configuration Google Workspace
```javascript
{
  "google_sso": {
    "domain": "entreprise.com",
    "admin_email": "admin@entreprise.com",
    "service_account": "datavise@projet.iam.gserviceaccount.com",
    "scopes": ["profile", "email", "directory.readonly"],
    "user_sync": {
      "enabled": true,
      "frequency": "daily",
      "deactivate_missing": true
    }
  }
}
```

### Authentification multi-facteurs (MFA)

#### Configuration 2FA
```yaml
MFA Settings:
  obligatoire_pour:
    - "admin"
    - "manager" 
    - "users_with_sensitive_access"
    
  méthodes_supportées:
    - TOTP: "Google Authenticator, Authy"
    - SMS: "Numéros français uniquement"
    - Email: "Code à 6 chiffres"
    - WebAuthn: "Clés de sécurité FIDO2"
    
  politiques:
    session_timeout: "8 heures"
    remember_device: "30 jours"
    backup_codes: 10
    code_expiry: "5 minutes"
```

### Gestion des sessions

#### Politique de session
```javascript
{
  "session_policy": {
    "max_duration": 28800, // 8 heures
    "idle_timeout": 3600,  // 1 heure d'inactivité
    "concurrent_sessions": {
      "admin": 3,
      "manager": 2, 
      "user": 1
    },
    "device_tracking": true,
    "geo_restrictions": {
      "enabled": false,
      "allowed_countries": ["FR", "BE", "CH"]
    }
  }
}
```

## Monitoring des utilisateurs

### Tableau de bord administrateur

#### Métriques utilisateurs
```javascript
{
  "user_metrics": {
    "total_users": 156,
    "active_last_30d": 142,
    "new_this_month": 8,
    "by_role": {
      "admin": 3,
      "manager": 12,
      "analyst": 45,
      "user": 89,
      "readonly": 7
    },
    "by_department": {
      "Sales": 67,
      "Marketing": 23,
      "Finance": 18,
      "IT": 12,
      "Operations": 36
    }
  }
}
```

#### Utilisation plateforme
```javascript
{
  "usage_analytics": {
    "dashboards": {
      "most_viewed": [
        {"name": "Sales Overview", "views": 1247},
        {"name": "Marketing KPIs", "views": 892},
        {"name": "Financial Summary", "views": 634}
      ]
    },
    "features": {
      "export_pdf": 234,
      "share_dashboard": 89,
      "create_widget": 156,
      "data_source_upload": 67
    },
    "peak_hours": [
      {"hour": 9, "users": 89},
      {"hour": 14, "users": 76},
      {"hour": 17, "users": 45}
    ]
  }
}
```

### Logs et audit

#### Traçabilité actions utilisateurs
```json
{
  "audit_log": [
    {
      "timestamp": "2025-01-15T10:30:00Z",
      "user": "marie.martin@entreprise.com",
      "action": "dashboard_created", 
      "resource": "Q1_Sales_Analysis",
      "ip": "192.168.1.42",
      "success": true,
      "details": {
        "widgets_count": 6,
        "data_sources": ["sales_2025.csv"]
      }
    },
    {
      "timestamp": "2025-01-15T10:35:00Z",
      "user": "jean.dupont@entreprise.com",
      "action": "export_pdf",
      "resource": "Q1_Sales_Analysis", 
      "ip": "192.168.1.43",
      "success": true,
      "details": {
        "format": "pdf",
        "pages": 3,
        "file_size": "2.4MB"
      }
    }
  ]
}
```

## Administration avancée

### Provisioning automatique

#### Intégration LDAP/Active Directory
```yaml
LDAP Configuration:
  server: "ldap://dc.entreprise.com"
  bind_dn: "CN=ServiceAccount,OU=Service,DC=entreprise,DC=com"
  user_base: "OU=Users,DC=entreprise,DC=com"
  group_base: "OU=Groups,DC=entreprise,DC=com"
  
  mappings:
    username: "sAMAccountName"
    email: "mail"
    firstname: "givenName"
    lastname: "sn"
    department: "department"
    title: "title"
    manager: "manager"
    
  sync_schedule: "0 2 * * *" # 2h du matin tous les jours
```

#### API de gestion utilisateurs
```javascript
// Créer utilisateur
const user = await DataViseAPI.users.create({
  email: 'nouveau@entreprise.com',
  firstName: 'Jean',
  lastName: 'Nouveau',
  role: 'user',
  department: 'Sales',
  manager: 'marie.manager@entreprise.com'
});

// Mettre à jour permissions
await DataViseAPI.users.updatePermissions(user.id, {
  role: 'analyst',
  additional_permissions: ['export_excel']
});

// Désactiver utilisateur
await DataViseAPI.users.deactivate(user.id, {
  reason: 'Fin de contrat',
  transfer_assets_to: 'marie.manager@entreprise.com'
});
```

### Politiques de sécurité

#### Politiques mot de passe
```yaml
Password Policy:
  min_length: 12
  require_uppercase: true
  require_lowercase: true
  require_numbers: true
  require_special_chars: true
  
  restrictions:
    no_common_passwords: true
    no_personal_info: true
    no_dictionary_words: true
    
  expiry:
    max_age: 90 # jours
    warning_days: 7
    grace_period: 3
    
  history:
    remember_last: 12
    min_change_chars: 4
```

#### Contrôle d'accès basé sur les risques
```javascript
{
  "risk_based_access": {
    "factors": [
      {
        "name": "unusual_location",
        "weight": 0.4,
        "action": "require_mfa"
      },
      {
        "name": "multiple_failed_attempts",
        "weight": 0.6,
        "action": "temporary_lockout"
      },
      {
        "name": "new_device",
        "weight": 0.3,
        "action": "email_notification"
      }
    ],
    "thresholds": {
      "low_risk": 0.3,
      "medium_risk": 0.6,
      "high_risk": 0.8
    }
  }
}
```

## Communication et notifications

### Notifications utilisateurs

#### Types de notifications
```yaml
Notifications automatiques:
  welcome_new_user:
    trigger: "account_created"
    template: "bienvenue_datavise"
    delay: "immediate"
    
  password_expiry_warning:
    trigger: "password_expires_in_7_days" 
    template: "renouvellement_mdp"
    frequency: "daily_until_changed"
    
  suspicious_activity:
    trigger: "unusual_login_pattern"
    template: "activite_suspecte"
    recipients: ["user", "security_team"]
    priority: "high"
```

### Onboarding utilisateurs

#### Processus d'accueil
```javascript
{
  "onboarding_flow": [
    {
      "step": "welcome",
      "content": "Bienvenue sur Data Vise",
      "duration": "modal",
      "actions": ["tour_guided", "skip"]
    },
    {
      "step": "first_dashboard",
      "content": "Créons votre premier dashboard",
      "type": "interactive_tutorial",
      "required": false
    },
    {
      "step": "data_source",
      "content": "Connecter vos données",
      "template": "sample_csv",
      "auto_complete": true
    },
    {
      "step": "team_introduction",
      "content": "Découvrir les dashboards partagés",
      "show_examples": true
    }
  ]
}
```

---

**Prochaines étapes** : Explorez les [fonctionnalités avancées](/docs/advanced/api) ou découvrez les [intégrations tierces](/docs/advanced/integrations).
