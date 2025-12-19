# 🚀 LANCEMENT IMMÉDIAT DU DÉPLOIEMENT

## ✅ TOUT EST PRÊT!

- ✅ Repository sur GitHub: `https://github.com/bensalemboualem/rag-dz`
- ✅ Scripts de déploiement ultra-automatiques créés
- ✅ VPS prêt: `46.224.3.125`
- ✅ Full setup avec 13 étapes automatiques
- ✅ i18n (FR/AR/EN), Legal pages, SSL, Docker configurés

---

## ⚡ LANCER MAINTENANT (3 options)

### 🥇 Option 1: DOUBLE-CLIC (Le plus facile!)

**Windows**: Double-cliquez sur ce fichier →

```
📁 LANCER_DEPLOIEMENT.bat
```

**Vous entrerez seulement**:
1. Mot de passe root VPS
2. Email Gmail
3. Gmail App Password

**TOUT LE RESTE EST AUTOMATIQUE!** ✨

---

### 🥈 Option 2: PowerShell

Ouvrez PowerShell et tapez:

```powershell
cd D:\IAFactory\rag-dz
.\deploy-ultra-auto.ps1
```

---

### 🥉 Option 3: Git Bash / WSL

```bash
cd /d/IAFactory/rag-dz
chmod +x deploy-ultra-auto.sh
./deploy-ultra-auto.sh
```

---

## 🎯 CE QUI VA SE PASSER

1. ⏱️ **0-2 min**: Script se connecte au VPS
2. ⏱️ **2-5 min**: Clone le repository
3. ⏱️ **5-15 min**: Installation Docker, Nginx, Node.js, PostgreSQL
4. ⏱️ **15-25 min**: Installation next-intl, configuration Nginx/CORS/CSP
5. ⏱️ **25-35 min**: Obtention certificats SSL (Let's Encrypt)
6. ⏱️ **35-45 min**: Build containers Docker, lancement services
7. ✅ **45 min**: Health checks, déploiement terminé!

**DURÉE TOTALE**: ~45 minutes ⏱️

---

## 🌐 RÉSULTAT FINAL

Après le déploiement, vous aurez:

### 🇨🇭 Switzerland - https://iafactory.ch
```
✅ Langue: Français (par défaut)
✅ Direction: LTR
✅ Thème: Rouge (Psychologue)
✅ Legal: Swiss nLPD Privacy Policy
✅ Pages: /privacy, /terms
✅ Favicon: Rouge "IA"
✅ SSL: Let's Encrypt
```

### 🇩🇿 Algeria - https://iafactoryalgeria.com
```
✅ Langue: Arabe (par défaut)
✅ Direction: RTL (dir="rtl")
✅ Thème: Vert (Éducation)
✅ Legal: Algeria Education Privacy
✅ Pages: /privacy, /terms, /mentions-legales
✅ Favicon: Vert "IA"
✅ SSL: Let's Encrypt
```

---

## 📋 VÉRIFICATION POST-DÉPLOIEMENT

### 1. Tester les URLs

```bash
curl -I https://iafactory.ch
curl -I https://iafactoryalgeria.com
```

### 2. Vérifier les containers Docker

```bash
ssh root@46.224.3.125
docker ps
# Devrait montrer: postgres, backend, frontend-ch, frontend-algeria
```

### 3. Vérifier RTL pour l'arabe

Visitez `https://iafactoryalgeria.com` et vérifiez le code HTML:

```html
<html lang="ar" dir="rtl">
```

### 4. Tester le changement de langue

1. Visitez https://iafactory.ch
2. Cliquez sur le sélecteur de langue
3. Choisissez "العربية" (Arabe)
4. Vérifiez que le layout passe en RTL

---

## 🔑 VOS CREDENTIALS

Après le déploiement, tous vos credentials seront sauvegardés dans:

**Localement (Windows)**:
```
C:\Users\VotreNom\rag-dz-credentials.txt
```

**Sur le VPS**:
```
/root/rag-dz-credentials.txt
```

**Contenu**:
```env
POSTGRES_PASSWORD=xxxxx (généré automatiquement)
JWT_SECRET=xxxxx (généré automatiquement)
SMTP_USER=contact@iafactory.ch
SMTP_PASSWORD=xxxxx
DOMAIN_CH=iafactory.ch
DOMAIN_ALGERIA=iafactoryalgeria.com
```

⚠️ **GARDEZ CE FICHIER EN SÉCURITÉ!**

---

## 🆘 EN CAS DE PROBLÈME

### Problème: "plink not found" ou "ssh not found"

**Solution**: Installer PuTTY
- Download: https://www.putty.org/
- Ou OpenSSH: Paramètres > Apps > Fonctionnalités facultatives > OpenSSH Client

### Problème: Le déploiement échoue

**Solution 1**: Relancer manuellement
```bash
ssh root@46.224.3.125
cd ~/rag-dz
sudo ./full_setup.sh
```

**Solution 2**: Vérifier les logs
```bash
docker logs <container_name>
tail -f /var/log/nginx/error.log
journalctl -xe
```

### Problème: Les sites ne répondent pas

**Vérifier DNS**:
```bash
nslookup iafactory.ch
nslookup iafactoryalgeria.com
```

Les deux doivent pointer vers: `46.224.3.125`

Si non configuré, ajoutez sur votre registrar:
```
Type: A
Name: @
Value: 46.224.3.125
TTL: 3600
```

---

## 🎉 C'EST PARTI!

# 👆 DOUBLE-CLIQUEZ SUR "LANCER_DEPLOIEMENT.bat" MAINTENANT!

Ou exécutez:
```powershell
.\deploy-ultra-auto.ps1
```

**Dans 45 minutes, vos 2 sites seront en ligne!** 🚀

---

**Version**: 3.0 Ultra-Automatique
**Date**: 2025-12-17
**Status**: ✅ **PRÊT À LANCER**
**Commits**: 3 nouveaux commits poussés sur GitHub

🔥 **ALLEZ-Y MAINTENANT!** 🔥
