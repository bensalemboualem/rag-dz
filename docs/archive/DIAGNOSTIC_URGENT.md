# 🔧 DIAGNOSTIC ET SOLUTION URGENTE

**Date**: 2025-12-17
**Problèmes détectés**:
1. ❌ `https://iafactory.ch` - Pas de changement
2. ❌ `https://iafactoryalgeria.com` - ERR_CERT_COMMON_NAME_INVALID

---

## 🚨 SOLUTION IMMÉDIATE

### Étape 1: Corriger le SSL (iafactoryalgeria.com)

**DOUBLE-CLIQUEZ SUR CE FICHIER** →

```
📁 FIX_SSL_URGENT.bat
```

**OU en PowerShell**:
```powershell
cd D:\IAFactory\rag-dz
.\fix-ssl-maintenant.ps1
```

**Ce script va**:
1. ✅ Se connecter au VPS
2. ✅ Arrêter Nginx
3. ✅ Supprimer l'ancien certificat problématique
4. ✅ Générer un nouveau certificat SSL valide
5. ✅ Configurer Nginx correctement
6. ✅ Redémarrer Nginx
7. ✅ Tester le site

**Durée**: 2-3 minutes

---

### Étape 2: Vérifier l'état du déploiement

Le déploiement complet n'a peut-être pas été lancé ou est incomplet.

**Se connecter au VPS pour diagnostiquer**:

```bash
ssh root@46.224.3.125
```

**Puis exécuter ces commandes**:

#### A. Vérifier si le code a été cloné

```bash
ls -la ~/rag-dz/
```

**Si le dossier n'existe pas** → Le déploiement n'a pas été lancé

**Si le dossier existe** → Continuer le diagnostic

---

#### B. Vérifier l'état des services Docker

```bash
docker ps
```

**Vous devriez voir 4 containers**:
- `postgres` (Port 5432)
- `rag-backend` (Port 8002)
- `frontend-ch` (Port 3001)
- `frontend-algeria` (Port 3002)

**Si les containers ne tournent pas** → Le déploiement est incomplet

---

#### C. Vérifier Nginx

```bash
systemctl status nginx
```

**Devrait afficher**: `active (running)`

**Si Nginx n'est pas actif**:
```bash
systemctl start nginx
```

---

#### D. Vérifier les certificats SSL

```bash
certbot certificates
```

**Vous devriez voir**:
- `iafactory.ch` (valide)
- `iafactoryalgeria.com` (valide)

**Si les certificats manquent** → Exécutez le script de fix SSL

---

## 🚀 SOLUTION COMPLÈTE: Lancer le Déploiement Complet

Si le diagnostic montre que le déploiement n'a pas été lancé, voici les étapes:

### Option 1: Déploiement Ultra-Auto (Depuis votre PC)

```powershell
cd D:\IAFactory\rag-dz
.\deploy-ultra-auto.ps1
```

### Option 2: Déploiement Manuel (Sur le VPS)

```bash
# Se connecter au VPS
ssh root@46.224.3.125

# Cloner le repository
cd ~
git clone https://github.com/bensalemboualem/rag-dz.git
cd rag-dz

# Rendre le script exécutable
chmod +x full_setup.sh

# Lancer le déploiement
sudo ./full_setup.sh
```

**Le script va demander**:
1. `POSTGRES_PASSWORD` - Créez un mot de passe sécurisé
2. `JWT_SECRET` - Appuyez sur Enter (auto-généré)
3. `SMTP_USER` - Votre email Gmail
4. `SMTP_PASSWORD` - Votre Gmail App Password
5. `DOMAIN_CH` - `iafactory.ch`
6. `DOMAIN_ALGERIA` - `iafactoryalgeria.com`

**Durée**: 30-45 minutes

---

## 🔍 DIAGNOSTIC DÉTAILLÉ

### Problème 1: ERR_CERT_COMMON_NAME_INVALID

**Cause**: Le certificat SSL pour `iafactoryalgeria.com` est:
- Manquant
- Expiré
- Configuré pour un autre domaine

**Solution**: Exécuter `FIX_SSL_URGENT.bat`

---

### Problème 2: iafactory.ch pas de changement

**Causes possibles**:

#### A. Le frontend n'est pas déployé

**Vérifier**:
```bash
docker ps | grep frontend-ch
```

**Si absent**, lancer le container:
```bash
cd ~/rag-dz
docker-compose up -d frontend-ch
```

---

#### B. Nginx ne route pas correctement

**Vérifier la config**:
```bash
cat /etc/nginx/sites-enabled/iafactory.ch
```

**Devrait contenir**:
```nginx
location / {
    proxy_pass http://localhost:3001;
}
```

**Si la config est incorrecte**, remplacer par:
```bash
sudo nano /etc/nginx/sites-available/iafactory.ch
```

Coller la config correcte (voir `nginx/sites-available/iafactory-ch-UPDATED.conf`)

---

#### C. Le port 3001 n'est pas ouvert

**Tester**:
```bash
curl http://localhost:3001
```

**Si erreur**, le frontend ne tourne pas. Lancer:
```bash
cd ~/rag-dz
docker-compose up -d frontend-ch
```

---

#### D. Cache navigateur

**Solution**:
1. Ouvrir le navigateur
2. Appuyer sur `Ctrl+Shift+R` (hard refresh)
3. Ou vider le cache:
   - Chrome: `Ctrl+Shift+Delete`
   - Firefox: `Ctrl+Shift+Delete`

---

## ✅ CHECKLIST DE VÉRIFICATION

Après avoir appliqué les corrections, vérifiez:

### 1. SSL fonctionne

```bash
curl -I https://iafactoryalgeria.com
```

**Devrait retourner**: `200 OK` sans erreur SSL

---

### 2. Les deux sites répondent

```bash
curl -I https://iafactory.ch
curl -I https://iafactoryalgeria.com
```

**Les deux devraient retourner**: `200 OK`

---

### 3. Les containers tournent

```bash
docker ps
```

**Devrait afficher**: 4 containers actifs

---

### 4. Nginx est actif

```bash
systemctl status nginx
```

**Devrait afficher**: `active (running)`

---

### 5. Les certificats sont valides

```bash
certbot certificates
```

**Devrait afficher**: 2 certificats valides

---

## 🎯 ACTIONS IMMÉDIATES

### Action 1: Corriger le SSL (2 minutes)

```
👆 Double-cliquez sur: FIX_SSL_URGENT.bat
```

---

### Action 2: Diagnostiquer l'état du VPS (5 minutes)

```bash
ssh root@46.224.3.125

# Vérifier le code
ls ~/rag-dz

# Vérifier les containers
docker ps

# Vérifier Nginx
systemctl status nginx

# Vérifier les certificats
certbot certificates
```

---

### Action 3: Lancer le déploiement si nécessaire (45 minutes)

Si le diagnostic montre que rien n'est déployé:

```powershell
cd D:\IAFactory\rag-dz
.\deploy-ultra-auto.ps1
```

---

## 📞 SUPPORT RAPIDE

### Commande de diagnostic tout-en-un

```bash
ssh root@46.224.3.125 "echo '=== GIT ==='; ls -la ~/rag-dz/ 2>&1; echo '=== DOCKER ==='; docker ps; echo '=== NGINX ==='; systemctl status nginx --no-pager; echo '=== SSL ==='; certbot certificates 2>&1"
```

Cette commande affiche l'état complet en une seule fois.

---

## 🚀 PROCHAINES ÉTAPES

1. ✅ **Maintenant**: Exécuter `FIX_SSL_URGENT.bat`
2. ✅ **Après**: Se connecter au VPS et diagnostiquer
3. ✅ **Si besoin**: Lancer le déploiement complet

---

**Status**: 🔧 **EN COURS DE CORRECTION**
**Durée estimée**: 5-10 minutes pour le fix SSL, 45 minutes pour le déploiement complet si nécessaire
