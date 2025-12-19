# 🚀 LANCER LE DÉPLOIEMENT - Guide Rapide

**Status**: ✅ PRÊT À LANCER
**Durée**: 15-20 minutes
**Coût**: €5.83/mois (Hetzner CX22)

---

## ⚡ DÉPLOIEMENT AUTOMATIQUE EN 1 COMMANDE

### Prérequis (5 minutes)

1. **Commander VPS Hetzner**:
   ```
   https://www.hetzner.com/cloud
   → Créer compte
   → Commander CX22 (40 GB, €5.83/mois)
   → Ubuntu 22.04 LTS
   → Noter l'IP du serveur
   ```

2. **Configurer DNS** (optionnel maintenant, peut se faire après):
   ```
   Chez votre registrar:
   Type A: @ → <IP_VPS>
   Type A: www → <IP_VPS>
   ```

### Lancement Automatique (15 minutes)

```bash
# Dans Git Bash ou WSL sur Windows
cd /d/IAFactory/rag-dz

# Rendre le script exécutable
chmod +x deploy-auto-complete.sh

# LANCER LE DÉPLOIEMENT
./deploy-auto-complete.sh
```

**Le script va vous demander**:
- L'IP du VPS
- Confirmation

**Puis fait TOUT automatiquement**:
1. ✅ Vérification outils locaux
2. ✅ Test connexion SSH
3. ✅ Copie projet sur VPS
4. ✅ Configuration environnement
5. ✅ Installation Docker/Nginx/Certbot
6. ✅ Déploiement services
7. ✅ Configuration SSL/HTTPS
8. ✅ Tests post-déploiement

---

## 🌍 QUESTION: LANGUES AR/EN ?

### RECOMMANDATION: **APRÈS LE DÉPLOIEMENT**

**Pourquoi ?**
- ✅ Site FR en ligne en 15 min (aujourd'hui)
- ✅ Tester d'abord que tout fonctionne
- ✅ Ajouter AR/EN progressivement (1-2 jours)
- ✅ Plus facile de développer sur VPS en ligne

**Plan suggéré**:
1. **Maintenant**: Déployer FR → Site en ligne aujourd'hui
2. **Après** (1-2 jours): Ajouter AR/EN avec traduction IA

Voir guide complet: [LANGUES_AR_EN_GUIDE.md](LANGUES_AR_EN_GUIDE.md)

---

## 📋 CE QUI SERA DÉPLOYÉ

### 47 Applications Professionnelles
```
✅ agri-dz, agroalimentaire-dz, billing-panel
✅ bmad, btp-dz, business-dz, clinique-dz
✅ commerce-dz, creative-studio, crm-ia
✅ dashboard, data-dz, dev-portal, developer
✅ ... et 33 autres
```

### Services Backend
```
✅ FastAPI Backend (35+ endpoints)
✅ PostgreSQL + PGVector
✅ Redis Cache
✅ Qdrant Vector Database
```

### Frontend
```
✅ Landing page avec Chat IA
✅ Sidebar avec 47 apps
✅ Dark/Light mode
✅ Multi-providers IA
✅ Directory IA
```

### Infrastructure
```
✅ Docker Compose
✅ Nginx reverse proxy
✅ SSL/HTTPS automatique (Let's Encrypt)
✅ Firewall UFW
```

---

## 🎯 COMMANDE COMPLÈTE

```bash
# 1. Ouvrir Git Bash (Windows) ou Terminal (Linux/Mac)
cd /d/IAFactory/rag-dz

# 2. Lancer le déploiement automatique
chmod +x deploy-auto-complete.sh
./deploy-auto-complete.sh

# 3. Entrer l'IP du VPS quand demandé
# Exemple: 78.46.123.456

# 4. Confirmer avec 'y'

# 5. Attendre 15-20 minutes
# Le script affiche la progression en temps réel

# ✅ TERMINÉ !
```

---

## 📊 APRÈS LE DÉPLOIEMENT

### URLs Disponibles
```
https://iafactory-algeria.com              → Landing page
https://iafactory-algeria.com/apps/        → 47 applications
https://iafactory-algeria.com/docs/        → Directory IA
https://iafactory-algeria.com/api/         → API Backend
https://iafactory-algeria.com/health       → Health check
```

### Configuration Clés API (Optionnel)

```bash
# Se connecter au VPS
ssh root@<IP_VPS>

# Éditer .env
nano /opt/iafactory-rag-dz/.env

# Ajouter au minimum:
GROQ_API_KEY=gsk_xxxxxxxxxxxxx  # Gratuit sur console.groq.com

# Redémarrer
cd /opt/iafactory-rag-dz
docker-compose restart
```

### Ajouter AR/EN (1-2 jours plus tard)

```bash
# Sur le VPS
ssh root@<IP_VPS>
cd /opt/iafactory-rag-dz

# Installer dépendances
pip install anthropic beautifulsoup4

# Configurer clé Claude
export ANTHROPIC_API_KEY="votre-clé"

# Traduire automatiquement
python scripts/translate-all-apps.py

# Redémarrer
systemctl reload nginx
```

---

## 🔧 DÉPANNAGE

### Problème: SSH ne fonctionne pas

```bash
# Vérifier la clé SSH
ssh-keygen -t rsa -b 4096

# Copier la clé publique sur Hetzner
cat ~/.ssh/id_rsa.pub
# → Coller dans Hetzner Cloud Console → SSH Keys
```

### Problème: Script bloqué

```bash
# Se connecter manuellement au VPS
ssh root@<IP_VPS>

# Voir les logs
cd /opt/iafactory-rag-dz
docker-compose logs -f
```

### Problème: Site pas accessible

```bash
# Vérifier DNS (peut prendre 5-10 min)
nslookup iafactory-algeria.com

# Tester avec l'IP directement
curl http://<IP_VPS>:8180/health
```

---

## ✅ CHECKLIST AVANT LANCEMENT

- [ ] VPS Hetzner commandé (CX22 ou supérieur)
- [ ] IP du VPS notée
- [ ] Git Bash installé (Windows) ou Terminal (Linux/Mac)
- [ ] Projet dans: d:\IAFactory\rag-dz
- [ ] (Optionnel) Domaine configuré avec DNS

**Prêt ? Lancez maintenant !**

---

## 🎉 RÉSULTAT ATTENDU

```
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║        🎉 IAFACTORY RAG-DZ EN LIGNE EN 15 MINUTES !         ║
║                                                              ║
║   • 47 applications professionnelles                        ║
║   • Landing page avec Chat IA                               ║
║   • Backend API complet                                     ║
║   • SSL/HTTPS automatique                                   ║
║   • Prêt pour production                                    ║
║                                                              ║
║   Version FR maintenant, AR/EN dans 1-2 jours              ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
```

---

## 🚀 COMMANDE FINALE

```bash
cd /d/IAFactory/rag-dz
chmod +x deploy-auto-complete.sh
./deploy-auto-complete.sh
```

**C'EST TOUT ! Le script fait le reste automatiquement.**

---

**Durée totale**: 15-20 minutes
**Coût mensuel**: €5.83
**Langues**: FR maintenant, AR/EN après
**Support**: Voir DEPLOIEMENT_VPS_RAPIDE.md pour détails
