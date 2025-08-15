# Configuration avancée et automatisation

Data Vise offre des fonctionnalités avancées pour automatiser vos processus analytiques et intégrer la plateforme dans votre écosystème existant.

## Automatisation des rapports

### Rapports programmés

#### Configuration de base
```yaml
Rapport automatisé:
  nom: "Synthèse Hebdomadaire Ventes"
  dashboard_source: "sales_overview_q1"
  format: "PDF"
  planification:
    fréquence: "weekly"
    jour: "monday"
    heure: "08:00"
    timezone: "Europe/Paris"
  
  destinataires:
    - "direction@entreprise.com"
    - "ventes@entreprise.com"
    - "manager-region-nord@entreprise.com"
```

#### Configuration avancée
```javascript
{
  "scheduled_report": {
    "id": "weekly_sales_report",
    "name": "Rapport Ventes Hebdomadaire",
    "dashboard_id": "sales_dashboard_2025",
    "schedule": {
      "cron": "0 8 * * 1",  // Tous les lundis à 8h
      "timezone": "Europe/Paris",
      "active": true
    },
    "filters": {
      "date_range": "last_week",
      "region": ["Nord", "Sud", "Est", "Ouest"]
    },
    "output": {
      "format": "pdf",
      "quality": "high",
      "include_data": true,
      "compression": "medium"
    },
    "distribution": {
      "email": {
        "to": ["direction@entreprise.com"],
        "cc": ["ventes@entreprise.com"],
        "subject": "Rapport Ventes - Semaine du {{date_start}}",
        "body_template": "weekly_sales_template"
      },
      "storage": {
        "save_to": "/reports/weekly/",
        "retention": "12_months",
        "archive": true
      }
    },
    "conditions": {
      "only_if_data_available": true,
      "min_data_freshness": "24_hours",
      "skip_holidays": true
    }
  }
}
```

### Alertes intelligentes

#### Alertes basées sur seuils
```javascript
{
  "alerts": [
    {
      "name": "Baisse CA Critique",
      "description": "Alerte si CA journalier < 80% de la moyenne",
      "trigger": {
        "metric": "daily_revenue",
        "condition": "less_than",
        "threshold": {
          "type": "percentage_of_average",
          "value": 80,
          "period": "last_30_days"
        }
      },
      "notification": {
        "immediate": true,
        "channels": ["email", "slack", "teams"],
        "recipients": {
          "primary": ["commercial@entreprise.com"],
          "escalation": ["direction@entreprise.com"]
        },
        "escalation_delay": "2_hours"
      },
      "actions": {
        "auto_refresh_dashboard": true,
        "create_incident": true,
        "run_investigation_query": "sales_breakdown_analysis"
      }
    }
  ]
}
```

#### Alertes prédictives
```javascript
{
  "predictive_alerts": [
    {
      "name": "Prévision Objectifs en Danger",
      "model": {
        "type": "linear_regression",
        "features": ["daily_sales", "trends", "seasonality"],
        "prediction_horizon": "end_of_month"
      },
      "trigger": {
        "condition": "predicted_monthly_total < monthly_target * 0.95",
        "confidence_threshold": 0.8
      },
      "notification": {
        "advance_warning": "7_days",
        "message": "Objectif mensuel en danger selon prévisions",
        "suggested_actions": [
          "Intensifier prospection",
          "Activer promotions", 
          "Réassigner ressources"
        ]
      }
    }
  ]
}
```

## API et intégrations

### API REST Data Vise

#### Authentification
```javascript
// Token d'authentification
const response = await fetch('https://api.data-vise.com/auth/token', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'api@entreprise.com',
    password: 'secure_password',
    api_key: 'your_api_key'
  })
});

const { access_token } = await response.json();
```

#### Gestion des dashboards
```javascript
// Créer un dashboard
const dashboard = await fetch('https://api.data-vise.com/dashboards', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${access_token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Nouveau Dashboard API',
    description: 'Créé via API',
    layout: {
      columns: 12,
      widgets: []
    }
  })
});

// Récupérer données dashboard
const data = await fetch(`https://api.data-vise.com/dashboards/${dashboard.id}/data`, {
  headers: {
    'Authorization': `Bearer ${access_token}`
  }
});
```

#### Manipulation des données
```javascript
// Upload de données
const formData = new FormData();
formData.append('file', csvFile);
formData.append('name', 'Nouvelles Ventes');
formData.append('type', 'csv');

const upload = await fetch('https://api.data-vise.com/data-sources', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${access_token}`
  },
  body: formData
});

// Exécuter requête personnalisée
const query = await fetch('https://api.data-vise.com/query', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${access_token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    sql: 'SELECT region, SUM(ventes) FROM sales_2025 GROUP BY region',
    data_source: 'sales_2025'
  })
});
```

### Webhooks

#### Configuration webhooks
```javascript
{
  "webhooks": [
    {
      "id": "new_data_webhook",
      "url": "https://votre-app.com/webhooks/datavise/new-data",
      "events": [
        "data_source.created",
        "data_source.updated", 
        "dashboard.shared"
      ],
      "authentication": {
        "type": "hmac_sha256",
        "secret": "webhook_secret_key"
      },
      "retry_policy": {
        "max_attempts": 3,
        "backoff": "exponential",
        "timeout": 30000
      }
    }
  ]
}
```

#### Traitement webhook
```javascript
// Serveur Node.js pour recevoir webhooks
app.post('/webhooks/datavise/new-data', (req, res) => {
  const signature = req.headers['x-datavise-signature'];
  const payload = JSON.stringify(req.body);
  
  // Vérifier signature HMAC
  const expectedSignature = crypto
    .createHmac('sha256', webhook_secret)
    .update(payload)
    .digest('hex');
    
  if (signature === `sha256=${expectedSignature}`) {
    // Traiter l'événement
    const { event, data } = req.body;
    
    switch(event) {
      case 'data_source.created':
        handleNewDataSource(data);
        break;
      case 'dashboard.shared':
        notifyTeam(data);
        break;
    }
    
    res.status(200).send('OK');
  } else {
    res.status(401).send('Unauthorized');
  }
});
```

## 🏗️ Intégrations tierces

### CRM (Salesforce, HubSpot)

#### Connector Salesforce
```javascript
{
  "salesforce_integration": {
    "connection": {
      "instance_url": "https://votre-entreprise.salesforce.com",
      "client_id": "your_connected_app_id",
      "client_secret": "your_connected_app_secret",
      "username": "integration@entreprise.com",
      "security_token": "your_security_token"
    },
    "sync_config": {
      "objects": [
        {
          "name": "Opportunity",
          "fields": ["Id", "Name", "Amount", "StageName", "CloseDate"],
          "filter": "Amount > 1000 AND CreatedDate >= LAST_N_DAYS:30"
        },
        {
          "name": "Account", 
          "fields": ["Id", "Name", "Type", "AnnualRevenue"],
          "relationships": ["Opportunities"]
        }
      ],
      "schedule": "0 */6 * * *", // Toutes les 6 heures
      "real_time": {
        "enabled": true,
        "events": ["Opportunity.Created", "Opportunity.Updated"]
      }
    }
  }
}
```

### ERP (SAP, Oracle)

#### Connector SAP
```yaml
SAP Integration:
  connection:
    system: "PRD"
    client: "100"
    host: "sap-server.entreprise.com"
    port: 3300
    username: "DATAVISE_USER"
    
  data_extraction:
    tables:
      - VBAK: "Commandes de vente"
      - VBAP: "Postes commandes"
      - KNA1: "Données maîtres clients"
      - MARA: "Données articles"
      
    custom_extractors:
      - name: "CA_par_region"
        query: "SELECT_QUERY_SAP"
        schedule: "daily_midnight"
```

### Email et messaging

#### Intégration Slack
```javascript
{
  "slack_integration": {
    "workspace": "entreprise.slack.com",
    "app_config": {
      "bot_token": "xoxb-your-bot-token",
      "signing_secret": "your-signing-secret"
    },
    "channels": {
      "alerts": "#datavise-alerts",
      "reports": "#ventes-quotidien",
      "notifications": "#analytics"
    },
    "commands": [
      {
        "command": "/dashboard",
        "description": "Afficher un dashboard",
        "usage": "/dashboard sales-overview",
        "response_type": "in_channel"
      },
      {
        "command": "/kpi",
        "description": "Afficher un KPI spécifique", 
        "usage": "/kpi revenue today",
        "response_type": "ephemeral"
      }
    ],
    "interactive_components": {
      "dashboard_previews": true,
      "quick_filters": true,
      "export_buttons": true
    }
  }
}
```

#### Intégration Microsoft Teams
```javascript
{
  "teams_integration": {
    "tenant_id": "your-tenant-id",
    "app_id": "datavise-teams-app-id",
    "channels": {
      "Sales Team": {
        "daily_report": true,
        "alerts": true
      },
      "Management": {
        "weekly_summary": true,
        "critical_alerts": true
      }
    },
    "adaptive_cards": {
      "kpi_card": "templates/kpi_card.json",
      "alert_card": "templates/alert_card.json",
      "report_card": "templates/report_card.json"
    }
  }
}
```

## 🔧 Scripts et automatisation

### Scripts Python

#### Auto-import de données
```python
import pandas as pd
import requests
from datetime import datetime, timedelta

def auto_import_sales_data():
    """Import automatique des données de vente quotidiennes"""
    
    # Récupération des données depuis le système source
    sales_data = fetch_sales_from_erp(
        date_from=datetime.now() - timedelta(days=1),
        date_to=datetime.now()
    )
    
    # Transformation et nettoyage
    df = pd.DataFrame(sales_data)
    df['date'] = pd.to_datetime(df['date'])
    df['amount'] = pd.to_numeric(df['amount'], errors='coerce')
    df = df.dropna()
    
    # Upload vers Data Vise
    response = requests.post(
        'https://api.data-vise.com/data-sources/sales_daily/append',
        headers={'Authorization': f'Bearer {API_TOKEN}'},
        json=df.to_dict('records')
    )
    
    if response.status_code == 200:
        print(f" Import réussi: {len(df)} lignes ajoutées")
        
        # Déclencher actualisation dashboards
        refresh_dashboards(['sales_overview', 'daily_performance'])
    else:
        print(f" Erreur import: {response.text}")
        send_alert_to_team("Échec import données quotidiennes")

# Planification avec cron: 0 7 * * * (tous les jours à 7h)
if __name__ == "__main__":
    auto_import_sales_data()
```

#### Monitoring et maintenance
```python
import asyncio
import aiohttp
from datetime import datetime

async def health_check_dashboards():
    """Vérification santé des dashboards critiques"""
    
    critical_dashboards = [
        'sales_overview',
        'financial_summary', 
        'operational_metrics'
    ]
    
    async with aiohttp.ClientSession() as session:
        tasks = []
        for dashboard in critical_dashboards:
            task = check_dashboard_health(session, dashboard)
            tasks.append(task)
            
        results = await asyncio.gather(*tasks)
        
        # Analyse des résultats
        failed_dashboards = [
            result['dashboard'] for result in results 
            if not result['healthy']
        ]
        
        if failed_dashboards:
            await send_maintenance_alert(failed_dashboards)
        else:
            print("Tous les dashboards critiques sont opérationnels")

async def check_dashboard_health(session, dashboard_id):
    """Vérifier la santé d'un dashboard"""
    try:
        async with session.get(
            f'https://api.data-vise.com/dashboards/{dashboard_id}/health',
            headers={'Authorization': f'Bearer {API_TOKEN}'}
        ) as response:
            data = await response.json()
            
            return {
                'dashboard': dashboard_id,
                'healthy': data['status'] == 'healthy',
                'last_update': data.get('last_update'),
                'widget_errors': data.get('widget_errors', [])
            }
    except Exception as e:
        return {
            'dashboard': dashboard_id,
            'healthy': False,
            'error': str(e)
        }
```

### PowerShell (Windows)

#### Synchronisation Active Directory
```powershell
# Script de synchronisation utilisateurs AD vers Data Vise
param(
    [string]$ApiToken,
    [string]$DataViseUrl = "https://api.data-vise.com"
)

Import-Module ActiveDirectory

function Sync-ADUsersToDataVise {
    # Récupération utilisateurs AD
    $adUsers = Get-ADUser -Filter "Enabled -eq 'True'" -Properties Department,Title,Manager,EmailAddress
    
    foreach ($user in $adUsers) {
        $userData = @{
            email = $user.EmailAddress
            firstName = $user.GivenName
            lastName = $user.Surname
            department = $user.Department
            title = $user.Title
            manager = if ($user.Manager) { (Get-ADUser $user.Manager).EmailAddress } else { $null }
        }
        
        # Vérifier si utilisateur existe dans Data Vise
        $existingUser = Invoke-RestMethod -Uri "$DataViseUrl/users/$($user.EmailAddress)" -Method GET -Headers @{Authorization="Bearer $ApiToken"} -ErrorAction SilentlyContinue
        
        if ($existingUser) {
            # Mettre à jour
            Invoke-RestMethod -Uri "$DataViseUrl/users/$($existingUser.id)" -Method PUT -Body ($userData | ConvertTo-Json) -ContentType "application/json" -Headers @{Authorization="Bearer $ApiToken"}
            Write-Host "Utilisateur mis à jour: $($user.EmailAddress)"
        } else {
            # Créer nouveau
            Invoke-RestMethod -Uri "$DataViseUrl/users" -Method POST -Body ($userData | ConvertTo-Json) -ContentType "application/json" -Headers @{Authorization="Bearer $ApiToken"}
            Write-Host "➕ Nouvel utilisateur créé: $($user.EmailAddress)"
        }
    }
}

# Exécution
Sync-ADUsersToDataVise -ApiToken $ApiToken
```

## Personnalisations avancées

### Thèmes et branding

#### CSS personnalisé
```css
/* Thème corporate entreprise */
:root {
  --primary-color: #1e3a8a;      /* Bleu corporate */
  --secondary-color: #059669;     /* Vert d'accent */
  --accent-color: #dc2626;        /* Rouge pour alertes */
  --background: #f8fafc;          /* Gris très clair */
  --surface: #ffffff;             /* Blanc pur */
  --text-primary: #1f2937;        /* Gris foncé */
  --text-secondary: #6b7280;      /* Gris moyen */
  --border: #e5e7eb;              /* Gris clair */
}

/* Header personnalisé */
.dashboard-header {
  background: linear-gradient(135deg, var(--primary-color) 0%, #3b82f6 100%);
  border-bottom: 3px solid var(--secondary-color);
}

.dashboard-header .logo {
  content: url('/assets/logo-entreprise.svg');
  height: 40px;
}

/* Widgets personnalisés */
.widget-kpi {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-left: 4px solid var(--secondary-color);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.widget-kpi .value {
  color: var(--primary-color);
  font-weight: 700;
  font-size: 2.5rem;
}

/* Animations personnalisées */
@keyframes slideInFromTop {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.widget {
  animation: slideInFromTop 0.6s ease-out;
}
```

#### Configuration d'environnement
```javascript
{
  "environment_config": {
    "development": {
      "api_url": "http://localhost:3000/api",
      "debug_mode": true,
      "mock_data": true,
      "hot_reload": true
    },
    "staging": {
      "api_url": "https://staging-api.data-vise.com",
      "debug_mode": false,
      "analytics": false,
      "performance_monitoring": true
    },
    "production": {
      "api_url": "https://api.data-vise.com",
      "debug_mode": false,
      "analytics": true,
      "caching": true,
      "compression": true,
      "cdn": "https://cdn.data-vise.com"
    }
  }
}
```

### Plugins personnalisés

#### Plugin de widget personnalisé
```javascript
// Plugin pour widget météo business
class WeatherBusinessWidget {
  constructor(config) {
    this.config = config;
    this.data = null;
  }
  
  async fetchData() {
    // Récupération données météo + impact business
    const weather = await fetch(`/api/weather/${this.config.location}`);
    const sales = await fetch(`/api/sales/weather-correlation`);
    
    this.data = {
      weather: await weather.json(),
      sales_impact: await sales.json()
    };
  }
  
  render() {
    return `
      <div class="weather-business-widget">
        <div class="weather-info">
          <span class="temperature">${this.data.weather.temp}°C</span>
          <span class="condition">${this.data.weather.condition}</span>
        </div>
        <div class="business-impact">
          <span class="impact-label">Impact sur les ventes:</span>
          <span class="impact-value ${this.data.sales_impact.trend}">
            ${this.data.sales_impact.percentage}%
          </span>
        </div>
      </div>
    `;
  }
}

// Enregistrement du plugin
DataVise.registerWidget('weather-business', WeatherBusinessWidget);
```

---

**Prochaines étapes** : Consultez les [guides d'intégration](/docs/advanced/integrations) ou explorez les [exemples d'API](/docs/advanced/api-examples).
