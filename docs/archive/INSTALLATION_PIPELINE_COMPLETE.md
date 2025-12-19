# 🚀 INSTALLATION COMPLÈTE: Pipeline BMAD → ARCHON → BOLT

## **Vue d'Ensemble**

Voici comment installer et utiliser votre pipeline automatisé pour créer des applications complètes.

---

## **Architecture du Système**

```
┌─────────────────────────────────────────────────────────────┐
│                    UTILISATEURS                             │
├─────────────────────┬───────────────────────────────────────┤
│                     │                                       │
│  🌐 Web UI          │  💻 CLI                              │
│  (Simple)           │  (Développeurs)                      │
│                     │                                       │
└─────────┬───────────┴───────────┬───────────────────────────┘
          │                       │
          └───────────┬───────────┘
                      │
                      ▼
          ┌─────────────────────┐
          │   Backend API       │
          │  (FastAPI)          │
          │  Port 8000          │
          └─────────┬───────────┘
                    │
        ┌───────────┼───────────┐
        │           │           │
        ▼           ▼           ▼
    ┌───────┐  ┌────────┐  ┌──────┐
    │ BMAD  │  │ARCHON  │  │ BOLT │
    │:9XXX  │  │:3737   │  │:5173 │
    └───────┘  └────────┘  └──────┘
```

---

## **PARTIE 1: Installation Backend**

### **Étape 1: Enregistrer le Router Pipeline**

Modifier le fichier `backend/rag-compat/app/main.py`:

```python
# Ajouter l'import
from app.routers import pipeline

# Enregistrer le router
app.include_router(pipeline.router)
```

### **Étape 2: Installer les Dépendances**

```bash
cd /opt/iafactory-rag-dz/backend/rag-compat

# Installer pydantic[email] si manquant
pip install "pydantic[email]"

# Redémarrer le backend
docker restart iaf-rag-backend-prod

# OU si vous utilisez le mode dev:
pkill -f "uvicorn"
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload &
```

### **Étape 3: Vérifier l'API**

```bash
# Test simple
curl http://localhost:8000/api/v1/pipeline/list

# Doit retourner:
# {"pipelines": []}
```

---

## **PARTIE 2: Installation Web UI**

### **Étape 1: Configurer Nginx**

Créer le fichier `/etc/nginx/sites-enabled/pipeline.conf`:

```nginx
# Pipeline Creator Web UI
location /pipeline {
    alias /opt/iafactory-rag-dz/apps/pipeline-creator;
    index index.html;
    try_files $uri $uri/ /pipeline/index.html;
}

# API Proxy
location /api/v1/pipeline {
    proxy_pass http://127.0.0.1:8000/api/v1/pipeline;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_read_timeout 600;  # 10 minutes pour le pipeline
}
```

### **Étape 2: Recharger Nginx**

```bash
sudo nginx -t
sudo nginx -s reload
```

### **Étape 3: Tester l'Interface Web**

```bash
# Ouvrir dans le navigateur:
https://iafactoryalgeria.com/pipeline
```

---

## **PARTIE 3: Installation CLI (Pour Développeurs)**

### **Étape 1: Installer le CLI Globalement**

```bash
cd /opt/iafactory-rag-dz/cli

# Installer les dépendances
npm install

# Installer globalement (en mode dev)
npm link

# OU publier sur npm:
npm publish --access public
```

### **Étape 2: Vérifier l'Installation**

```bash
# Vérifier la commande
iafactory --version

# Doit afficher: 1.0.0

# Voir l'aide
iafactory --help
```

### **Étape 3: Configuration Initiale**

```bash
# Login (optionnel pour l'instant)
iafactory login

# Configurer l'API URL si différent
iafactory config --set apiUrl=https://iafactoryalgeria.com
```

---

## **PARTIE 4: Utilisation**

### **Option A: Via Web UI** (Recommandé pour utilisateurs)

```
1. Aller sur: https://iafactoryalgeria.com/pipeline

2. Remplir le formulaire:
   - Nom: Mon E-commerce
   - Description: Site de vente de produits artisanaux
   - Type: E-commerce
   - Email: mon@email.com

3. Cliquer "Lancer le Pipeline"

4. Attendre la création (1-3h)

5. Télécharger le code généré
```

### **Option B: Via CLI** (Pour développeurs)

```bash
# Créer un nouveau projet
iafactory create "Mon E-commerce"

# Suivre les prompts interactifs

# Vérifier le status
iafactory status pipeline_20250106_143022

# Lister tous les pipelines
iafactory list

# Télécharger le code
iafactory download proj_abc123
```

### **Option C: Via Script Bash** (Direct sur VPS)

```bash
cd /opt/iafactory-rag-dz

./scripts/pipeline-auto.sh "Mon Projet"

# Suivre les instructions
```

---

## **PARTIE 5: Ajouter à la Landing Page**

### **Créer la Section Pipeline**

Modifier `apps/landing/index.html` et ajouter avant `<!-- APPS -->`:

```html
<!-- PIPELINE SECTION -->
<section id="pipeline" class="section">
    <h2 class="section-title">🚀 Pipeline Automatisé</h2>
    <p class="section-description">De l'Idée au Code en 3 Étapes Automatisées</p>

    <div class="pipeline-visual">
        <div class="pipeline-step">
            <span class="step-icon">📋</span>
            <h4>1. BMAD</h4>
            <p>Planification IA</p>
            <span class="step-time">30min - 2h</span>
        </div>

        <div class="pipeline-arrow">→</div>

        <div class="pipeline-step">
            <span class="step-icon">🧠</span>
            <h4>2. ARCHON</h4>
            <p>Knowledge Base</p>
            <span class="step-time">5-10min</span>
        </div>

        <div class="pipeline-arrow">→</div>

        <div class="pipeline-step">
            <span class="step-icon">⚡</span>
            <h4>3. BOLT</h4>
            <p>Code Generation</p>
            <span class="step-time">10-30min</span>
        </div>
    </div>

    <div style="text-align: center; margin-top: 2rem;">
        <button class="btn-round btn-primary" onclick="window.location.href='/pipeline'">
            Créer Mon Application
        </button>
    </div>
</section>
```

### **Ajouter le CSS**

Dans la section `<style>`:

```css
.pipeline-visual {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    margin: 2rem 0;
    flex-wrap: wrap;
}

.pipeline-step {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 2rem;
    text-align: center;
    flex: 1;
    min-width: 200px;
    transition: all 0.3s ease;
}

.pipeline-step:hover {
    transform: translateY(-5px);
    border-color: var(--primary);
}

.step-icon {
    font-size: 3rem;
    display: block;
    margin-bottom: 1rem;
}

.step-time {
    display: block;
    margin-top: 0.5rem;
    color: var(--primary);
    font-size: 0.9rem;
    font-weight: 600;
}

.pipeline-arrow {
    font-size: 2rem;
    color: var(--primary);
}

@media (max-width: 768px) {
    .pipeline-arrow {
        transform: rotate(90deg);
    }
}
```

---

## **PARTIE 6: Testing**

### **Test 1: Backend API**

```bash
curl -X POST http://localhost:8000/api/v1/pipeline/create \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Project",
    "description": "Test description",
    "type": "custom"
  }'

# Doit retourner:
# {"success": true, "pipeline_id": "pipeline_...", ...}
```

### **Test 2: Web UI**

```bash
# Ouvrir dans le navigateur
https://iafactoryalgeria.com/pipeline

# Remplir le formulaire
# Cliquer "Lancer le Pipeline"
# Vérifier que ça affiche "Création en Cours..."
```

### **Test 3: CLI**

```bash
iafactory create "Test CLI"
# Suivre les prompts
# Vérifier que ça crée le pipeline
```

### **Test 4: Script Bash**

```bash
cd /opt/iafactory-rag-dz
./scripts/pipeline-auto.sh "Test Bash Script"
# Vérifier les services
# Vérifier la création du projet
```

---

## **PARTIE 7: Déploiement en Production**

### **Checklist Pre-Production:**

- [ ] Backend API accessible (`curl http://localhost:8000/health`)
- [ ] BMAD installé (`ls -la /opt/iafactory-rag-dz/bmad`)
- [ ] ARCHON running (`curl http://localhost:3737`)
- [ ] BOLT running (`curl http://localhost:5173`)
- [ ] Nginx configuré correctement
- [ ] SSL certificates valides
- [ ] Scripts exécutables (`chmod +x scripts/*.sh`)

### **Commandes de Vérification:**

```bash
# 1. Vérifier tous les services
docker ps | grep -E "(rag-backend|archon|bolt)"

# 2. Tester l'API
curl https://iafactoryalgeria.com/api/v1/pipeline/list

# 3. Tester Web UI
curl https://iafactoryalgeria.com/pipeline

# 4. Vérifier les logs
docker logs iaf-rag-backend-prod | tail -20
```

---

## **PARTIE 8: Monitoring & Maintenance**

### **Logs à Surveiller:**

```bash
# Backend logs
docker logs -f iaf-rag-backend-prod

# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# Pipeline logs (à créer)
tail -f /opt/iafactory-rag-dz/logs/pipeline.log
```

### **Métriques à Tracker:**

- Nombre de pipelines créés par jour
- Temps moyen de création (BMAD + ARCHON + BOLT)
- Taux de succès/échec
- Ressources utilisées (CPU, RAM, Disk)

---

## **PARTIE 9: Troubleshooting**

### **Problème 1: API ne répond pas**

```bash
# Vérifier le backend
docker ps | grep rag-backend

# Redémarrer si nécessaire
docker restart iaf-rag-backend-prod

# Vérifier les logs
docker logs iaf-rag-backend-prod | tail -50
```

### **Problème 2: Pipeline bloqué**

```bash
# Vérifier le status
curl http://localhost:8000/api/v1/pipeline/status/pipeline_xxx

# Vérifier les processus BMAD
ps aux | grep bmad

# Tuer si nécessaire
pkill -f bmad
```

### **Problème 3: Web UI inaccessible**

```bash
# Vérifier Nginx
sudo nginx -t

# Recharger Nginx
sudo nginx -s reload

# Vérifier le fichier index.html
ls -la /opt/iafactory-rag-dz/apps/pipeline-creator/index.html
```

---

## **RÉSUMÉ FINAL**

✅ **Ce que vous avez maintenant:**

1. **Backend API** complète avec endpoints Pipeline
2. **Web UI** pour utilisateurs non-techniques
3. **CLI** pour développeurs
4. **Script Bash** pour exécution directe
5. **Documentation** complète
6. **Integration** à la landing page

✅ **Prochaines étapes:**

1. Tester le pipeline end-to-end
2. Ajuster les timeouts si nécessaire
3. Ajouter le monitoring
4. Lancer en beta avec 10 clients
5. Collecter feedback
6. Optimiser et lancer officiellement

---

**Besoin d'aide?**

- 📖 Docs: `/QUICKSTART_PIPELINE.md`
- 💬 Support: support@iafactoryalgeria.com
- 🌐 Web: https://iafactoryalgeria.com

**Bon lancement! 🚀🇩🇿**
