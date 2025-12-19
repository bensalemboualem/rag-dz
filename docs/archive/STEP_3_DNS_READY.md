# ✅ ÉTAPE 3 PRÉPARÉE: Configuration DNS

**Date**: 16 Décembre 2025 - 02:02
**Status**: 📋 GUIDE READY (action manuelle requise)

---

## 🌐 Configuration DNS Nécessaire

### 4 Sous-domaines à Créer

**VPS IP**: `[À OBTENIR DU VPS]`

```dns
Type    Nom                     Valeur          TTL
─────────────────────────────────────────────────────
A       agents.iafactory.dz     [IP_VPS]       3600
A       can2025.iafactory.dz    [IP_VPS]       3600
A       news.iafactory.dz       [IP_VPS]       3600
A       sport.iafactory.dz      [IP_VPS]       3600
```

---

## 📝 Actions Requises

### 1. Obtenir l'IP du VPS
```bash
# Se connecter au VPS
ssh user@vps

# Obtenir l'IP publique
curl ifconfig.me

# Exemple résultat: 123.45.67.89
```

### 2. Configurer le Registrar

**Étapes selon votre registrar**:

#### Namecheap
1. Login → Domain List → Manage
2. Advanced DNS
3. Add New Record (×4):
   - Type: **A Record**
   - Host: `agents`, `can2025`, `news`, `sport`
   - Value: **[IP_VPS]**
   - TTL: Automatic
4. Save All Changes

#### GoDaddy
1. Login → My Products → DNS
2. Add Record (×4):
   - Type: **A**
   - Name: `agents`, `can2025`, `news`, `sport`
   - Value: **[IP_VPS]**
   - TTL: 1 Hour
3. Save

#### OVH
1. Espace Client → Domaines → iafactory.dz
2. Zone DNS → Ajouter une entrée (×4)
3. Type: **A**
   - Sous-domaine: `agents`, `can2025`, `news`, `sport`
   - Cible: **[IP_VPS]**
4. Valider

#### Cloudflare (Recommandé 🌟)
1. Dashboard → iafactory.dz → DNS
2. Add Record (×4):
   - Type: **A**
   - Name: `agents`, `can2025`, `news`, `sport`
   - IPv4: **[IP_VPS]**
   - Proxy: **✅ Proxied** (CDN + SSL auto)
   - TTL: Auto
3. Save

**Avantages Cloudflare**:
- ✅ SSL automatique
- ✅ CDN global
- ✅ Cache intelligent
- ✅ DDoS protection
- ✅ Analytics

### 3. Attendre Propagation DNS

**Durée**: 2-6 heures (24h max)

**Vérifier propagation**:
- https://dnschecker.org
- Entrer: `agents.iafactory.dz`
- Type: A
- Résultat: Checkmarks verts globalement

### 4. Tester Résolution

```bash
# Windows
nslookup agents.iafactory.dz
nslookup can2025.iafactory.dz
nslookup news.iafactory.dz
nslookup sport.iafactory.dz

# Linux/Mac
dig agents.iafactory.dz
dig can2025.iafactory.dz
dig news.iafactory.dz
dig sport.iafactory.dz
```

**Résultat attendu**: Tous retournent `[IP_VPS]`

---

## 📁 Documentation Créée

✅ **[DNS_CONFIGURATION_GUIDE.md](./DNS_CONFIGURATION_GUIDE.md)**

**Contenu**:
- Configuration par registrar (Namecheap, GoDaddy, OVH, Cloudflare)
- Vérification propagation DNS
- Tests post-configuration
- Troubleshooting DNS
- Configuration SSL après DNS
- Exemples complets

---

## ⏱️ Timeline DNS

```
Maintenant:        Configuration registrar (5 min)
↓
+5 min:            DNS local résout
↓
+30 min:           Propagation locale/régionale
↓
+2-6h:             Propagation globale complète
↓
Après propagation: Déploiement VPS (Étape 4)
```

---

## ✅ Checklist DNS

### Configuration (À faire manuellement)
- [ ] Se connecter au VPS: `ssh user@vps`
- [ ] Obtenir IP: `curl ifconfig.me`
- [ ] Login registrar domaine
- [ ] Ajouter A record: `agents.iafactory.dz → [IP]`
- [ ] Ajouter A record: `can2025.iafactory.dz → [IP]`
- [ ] Ajouter A record: `news.iafactory.dz → [IP]`
- [ ] Ajouter A record: `sport.iafactory.dz → [IP]`
- [ ] Sauvegarder changements

### Vérification (Après 2-6h)
- [ ] Test dnschecker.org (4 domaines)
- [ ] Test nslookup local (4 domaines)
- [ ] Tous domaines résolvent vers IP VPS

### Post-DNS
- [ ] Prêt pour déploiement (Étape 4)

---

## 🚀 Impact

**Avant DNS**:
- ❌ Domaines non accessibles
- ❌ Apps non visibles sur internet
- ❌ SSL impossible

**Après DNS**:
- ✅ 4 sous-domaines actifs
- ✅ Apps accessibles publiquement
- ✅ SSL Certbot/Cloudflare possible
- ✅ Prêt production

---

## 📊 Prochaines Étapes

### ✅ Étape 1: Icônes PWA - TERMINÉE
- ✅ 3 icônes PNG générées

### ✅ Étape 2: Clés VAPID - TERMINÉE
- ✅ Push notifications configurées

### 📋 Étape 3: DNS - GUIDE PRÊT
- 📋 Configuration manuelle requise
- 📋 Attendre propagation 2-6h

### 🚀 Étape 4: Déploiement VPS
**Prérequis**:
- ✅ DNS propagé
- ✅ Domaines résolvent vers VPS

**Actions**:
1. Éditer `deploy-all-apps.sh` (ajouter IP VPS)
2. Créer `.env.production` sur VPS
3. Lancer `./deploy-all-apps.sh`
4. Vérifier 4 apps en ligne

---

## 🎯 Résumé

**DNS Configuration**:
- ✅ Guide complet créé
- ✅ Instructions par registrar
- ✅ Tests et troubleshooting
- 📋 Action manuelle requise (5 min)
- ⏱️ Attente propagation (2-6h)

**Après DNS**:
→ **Étape 4**: Déploiement automatique complet! 🚀

---

**Session**: Marathon 16 Décembre 2025
**Documentation**: DNS_CONFIGURATION_GUIDE.md
**Status**: ✅ **STEP 3 READY** (awaiting manual config)
