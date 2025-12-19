# 🚀 Déploiement en UN CLIC

**VPS**: `46.224.3.125`
**Repository**: `https://github.com/bensalemboualem/rag-dz`
**Status**: ✅ **100% AUTOMATIQUE**

---

## ⚡ MÉTHODE LA PLUS RAPIDE (Windows)

### Option 1: Double-Clic (Le plus facile!)

1. **Double-cliquez** sur: `LANCER_DEPLOIEMENT.bat`
2. **Entrez** le mot de passe root du VPS
3. **Entrez** votre email Gmail
4. **Entrez** votre Gmail App Password
5. **C'est tout!** ☕ Prenez un café pendant 30-45 minutes

---

### Option 2: PowerShell Direct

```powershell
cd D:\IAFactory\rag-dz
.\deploy-ultra-auto.ps1
```

**Ce que le script fait AUTOMATIQUEMENT**:
- ✅ Génère des mots de passe sécurisés (PostgreSQL, JWT)
- ✅ Se connecte au VPS
- ✅ Clone le repository
- ✅ Installe Docker, Nginx, PostgreSQL, Node.js
- ✅ Configure next-intl (i18n FR/AR/EN)
- ✅ Obtient les certificats SSL
- ✅ Build et lance tous les containers
- ✅ Sauvegarde tous les credentials

**Durée totale**: 30-45 minutes ⏱️

---

## 🐧 Pour Linux / macOS / Git Bash

```bash
cd /d/IAFactory/rag-dz  # ou le chemin sur votre système
chmod +x deploy-ultra-auto.sh
./deploy-ultra-auto.sh
```

**Prérequis**: `sshpass` (pour automatisation complète)

Installation:
```bash
# Ubuntu/Debian
sudo apt-get install -y sshpass

# macOS
brew install hudochenkov/sshpass/sshpass
```

---

## 📋 Informations Demandées

Le script vous demandera **UNIQUEMENT** 3 choses:

1. **Mot de passe root VPS** (`46.224.3.125`)
2. **Email Gmail** (ex: `contact@iafactory.ch`)
3. **Gmail App Password** (16 caractères, sans espaces)

**TOUT LE RESTE EST GÉNÉRÉ AUTOMATIQUEMENT!** 🎉

---

## ✅ Après le Déploiement

### Vos sites seront en ligne:

🇨🇭 **Switzerland**: https://iafactory.ch
- Langue par défaut: Français (LTR)
- Thème: Rouge (Psychologue)
- Pages légales: `/privacy` (nLPD), `/terms`

🇩🇿 **Algeria**: https://iafactoryalgeria.com
- Langue par défaut: Arabe (RTL)
- Thème: Vert (Éducation)
- Pages légales: `/privacy`, `/terms`, `/mentions-legales`

### Vos credentials seront sauvegardés:

**Localement**: `C:\Users\VotreNom\rag-dz-credentials.txt`
**Sur le VPS**: `~/rag-dz-credentials.txt`

**Contenu du fichier**:
```
POSTGRES_PASSWORD=xxxxx
JWT_SECRET=xxxxx
SMTP_USER=contact@iafactory.ch
SMTP_PASSWORD=xxxxx
DOMAIN_CH=iafactory.ch
DOMAIN_ALGERIA=iafactoryalgeria.com
```

---

## 🔍 Vérification Post-Déploiement

### Sur votre PC (tester les URLs):

```bash
# Tester Switzerland
curl -I https://iafactory.ch

# Tester Algeria
curl -I https://iafactoryalgeria.com
```

### Sur le VPS (après SSH):

```bash
ssh root@46.224.3.125

# Vérifier les containers
docker ps
# Devrait afficher: postgres, backend, frontend-ch, frontend-algeria

# Vérifier Nginx
systemctl status nginx

# Vérifier les certificats SSL
certbot certificates
```

---

## 🆘 En Cas de Problème

### Problème 1: "PuTTY/plink not found"

**Solution**: Installer PuTTY
- Télécharger: https://www.putty.org/
- Ou installer OpenSSH pour Windows:
  - Paramètres > Applications > Fonctionnalités facultatives
  - Ajouter: "OpenSSH Client"

---

### Problème 2: "Permission denied"

**Solution**: Vérifier le mot de passe root
```bash
ssh root@46.224.3.125
# Si ça marche, le mot de passe est bon
```

---

### Problème 3: Le déploiement s'arrête

**Solution**: Se connecter au VPS et relancer
```bash
ssh root@46.224.3.125
cd ~/rag-dz
sudo ./full_setup.sh
```

---

### Problème 4: Les sites ne répondent pas

**Solution**: Vérifier les DNS

Les domaines doivent pointer vers `46.224.3.125`:
```bash
# Vérifier DNS
nslookup iafactory.ch
nslookup iafactoryalgeria.com
```

Si les DNS ne sont pas configurés:
1. Allez sur votre registrar de domaine
2. Ajoutez un enregistrement A:
   - `iafactory.ch` → `46.224.3.125`
   - `iafactoryalgeria.com` → `46.224.3.125`

---

## 📞 Support Technique

Si vous rencontrez un problème:

1. **Vérifier les logs Docker**:
   ```bash
   docker logs <container_name>
   ```

2. **Vérifier les logs Nginx**:
   ```bash
   tail -f /var/log/nginx/error.log
   ```

3. **Vérifier les logs système**:
   ```bash
   journalctl -xe
   ```

4. **Relire le rapport QA**:
   - [FINAL_QA_VERIFICATION.md](FINAL_QA_VERIFICATION.md)

---

## 🎯 Fichiers du Projet

| Fichier | Description |
|---------|-------------|
| **LANCER_DEPLOIEMENT.bat** | ⭐ **DOUBLE-CLIC POUR TOUT DÉPLOYER** |
| `deploy-ultra-auto.ps1` | Script PowerShell 100% automatique |
| `deploy-ultra-auto.sh` | Script Bash 100% automatique |
| `full_setup.sh` | Script VPS (13 étapes automatiques) |
| `FINAL_QA_VERIFICATION.md` | Rapport QA complet |
| `DEPLOIEMENT_AUTO_INSTRUCTIONS.md` | Guide complet |

---

## 🚀 ALLEZ-Y MAINTENANT!

**Étapes**:
1. ✅ Double-cliquez sur `LANCER_DEPLOIEMENT.bat`
2. ✅ Entrez les 3 infos demandées
3. ✅ Attendez 30-45 minutes
4. ✅ Visitez https://iafactory.ch et https://iafactoryalgeria.com

**C'est parti!** 🎉

---

**Version**: 3.0 (Ultra-Automatique)
**Date**: 2025-12-17
**Status**: ✅ **PRÊT À LANCER**
