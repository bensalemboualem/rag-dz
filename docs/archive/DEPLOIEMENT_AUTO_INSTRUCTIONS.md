# 🚀 Instructions de Déploiement Automatique

**VPS IP**: `46.224.3.125`
**Repository**: `https://github.com/bensalemboualem/rag-dz`
**Status**: ✅ Prêt à déployer

---

## 🎯 Option 1: Déploiement Automatique (Recommandé)

### Pour Windows (PowerShell)

1. **Clic droit** sur `deploy-auto-vps.ps1` → **Exécuter avec PowerShell**

   OU dans PowerShell:
   ```powershell
   cd D:\IAFactory\rag-dz
   .\deploy-auto-vps.ps1
   ```

2. **Entrez le mot de passe root** quand demandé

3. **Le script va automatiquement**:
   - Se connecter au VPS
   - Cloner le repository
   - Lancer `full_setup.sh`
   - Installer Docker, Nginx, PostgreSQL
   - Configurer SSL avec Let's Encrypt
   - Déployer les 2 frontends + backend

4. **Temps estimé**: 30-45 minutes

---

### Pour Git Bash / WSL / Linux

1. **Rendre le script exécutable**:
   ```bash
   chmod +x deploy-auto-vps.sh
   ```

2. **Exécuter**:
   ```bash
   ./deploy-auto-vps.sh
   ```

3. **Entrez le mot de passe root** quand demandé

---

## 🎯 Option 2: Déploiement Manuel (Si SSH ne fonctionne pas)

### Étape 1: Se connecter au VPS

**Windows (PowerShell)**:
```powershell
ssh root@46.224.3.125
```

**Windows (PuTTY)**:
- Host: `46.224.3.125`
- Port: `22`
- Username: `root`
- Cliquez sur "Open"

---

### Étape 2: Cloner et déployer

Une fois connecté au VPS, exécutez:

```bash
# Aller dans le répertoire home
cd ~

# Supprimer l'ancien clone si existe
rm -rf rag-dz

# Cloner le repository
git clone https://github.com/bensalemboualem/rag-dz.git

# Entrer dans le répertoire
cd rag-dz

# Vérifier que les fichiers sont là
ls -lh full_setup.sh FINAL_QA_VERIFICATION.md

# Rendre le script exécutable
chmod +x full_setup.sh

# LANCER LE DÉPLOIEMENT
sudo ./full_setup.sh
```

---

## 📋 Ce que le script va vous demander

Pendant l'exécution de `full_setup.sh`, vous serez invité à entrer:

1. **POSTGRES_PASSWORD**: Mot de passe pour la base de données PostgreSQL
2. **JWT_SECRET**: Généré automatiquement ou entrez le vôtre
3. **SMTP_USER**: Votre email Gmail (ex: `contact@iafactory.ch`)
4. **SMTP_PASSWORD**: Votre Gmail App Password (16 caractères sans espaces)
5. **DOMAIN_CH**: `iafactory.ch` (défaut)
6. **DOMAIN_ALGERIA**: `iafactoryalgeria.com` (défaut)

---

## ✅ Vérification après déploiement

Une fois terminé (environ 30-45 minutes), vérifiez:

### 1. Services Docker
```bash
docker ps
# Devrait afficher 4 containers: postgres, backend, frontend-ch, frontend-algeria
```

### 2. Nginx
```bash
systemctl status nginx
# Devrait être "active (running)"
```

### 3. Certificats SSL
```bash
certbot certificates
# Devrait afficher 2 certificats: iafactory.ch et iafactoryalgeria.com
```

### 4. Tester les sites

**Suisse (Français)**:
```bash
curl -I https://iafactory.ch
# Devrait retourner 200 OK
```

**Algérie (Arabe RTL)**:
```bash
curl -I https://iafactoryalgeria.com
# Devrait retourner 200 OK
```

---

## 🌐 URLs de Production

Une fois déployé, vos sites seront accessibles:

- 🇨🇭 **Switzerland**: https://iafactory.ch
  - Langue par défaut: Français
  - Thème: Rouge (Psychologue)
  - Legal: nLPD compliant

- 🇩🇿 **Algeria**: https://iafactoryalgeria.com
  - Langue par défaut: Arabe (RTL)
  - Thème: Vert (Éducation)
  - Legal: Mentions Légales

---

## 🆘 En cas de problème

### Problème 1: SSH ne fonctionne pas

**Solution**: Installer OpenSSH pour Windows
1. Paramètres Windows > Applications > Fonctionnalités facultatives
2. Ajouter une fonctionnalité > "OpenSSH Client"
3. Redémarrer PowerShell

**Alternative**: Utiliser PuTTY
- Télécharger: https://www.putty.org/
- Configuration: Host=`46.224.3.125`, Port=`22`, Username=`root`

---

### Problème 2: Permission denied

```bash
# Rendre le script exécutable
chmod +x full_setup.sh

# Exécuter avec sudo
sudo ./full_setup.sh
```

---

### Problème 3: Git n'est pas installé sur le VPS

```bash
# Installer Git
apt-get update
apt-get install -y git

# Puis relancer le clonage
git clone https://github.com/bensalemboualem/rag-dz.git
```

---

### Problème 4: Le script s'arrête pendant l'exécution

```bash
# Vérifier les logs
journalctl -xe

# Vérifier l'espace disque
df -h

# Relancer le script
cd ~/rag-dz
sudo ./full_setup.sh
```

---

## 📞 Support

Si vous avez des questions pendant le déploiement:

1. **Vérifier le fichier de QA**: [FINAL_QA_VERIFICATION.md](FINAL_QA_VERIFICATION.md)
2. **Vérifier les logs Docker**: `docker logs <container_name>`
3. **Vérifier les logs Nginx**: `tail -f /var/log/nginx/error.log`
4. **Vérifier les logs système**: `journalctl -f`

---

## 🎉 Après le déploiement

1. **Tester l'authentification**:
   - Créer un compte sur https://iafactory.ch/register
   - Vérifier l'email de confirmation
   - Se connecter

2. **Tester le password reset**:
   - Cliquer sur "Mot de passe oublié"
   - Vérifier l'email de réinitialisation
   - Réinitialiser le mot de passe

3. **Tester le changement de langue**:
   - Cliquer sur le sélecteur de langue
   - Changer vers l'arabe
   - Vérifier que le layout passe en RTL

4. **Vérifier les pages légales**:
   - https://iafactory.ch/privacy (Swiss nLPD)
   - https://iafactoryalgeria.com/mentions-legales (Algeria)

---

**Version**: 2.0
**Dernière mise à jour**: 2025-12-17
**Status**: ✅ Ready for Production

🚀 **BON DÉPLOIEMENT!**
