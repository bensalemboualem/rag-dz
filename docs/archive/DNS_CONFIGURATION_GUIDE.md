# 🌐 Guide Configuration DNS - 4 Apps

**Date**: 16 Décembre 2025
**Domaine**: iafactory.dz
**Apps à configurer**: 4

---

## 📋 Enregistrements DNS Requis

### Configuration Complète

**VPS IP**: `[VOTRE_IP_VPS]` ⬅️ **À REMPLACER**

#### Enregistrements A (IPv4)
```dns
Type    Nom                     Valeur              TTL
────────────────────────────────────────────────────────
A       agents.iafactory.dz     [VOTRE_IP_VPS]     3600
A       can2025.iafactory.dz    [VOTRE_IP_VPS]     3600
A       news.iafactory.dz       [VOTRE_IP_VPS]     3600
A       sport.iafactory.dz      [VOTRE_IP_VPS]     3600
```

#### Optionnel: AAAA (IPv6)
```dns
Type    Nom                     Valeur              TTL
────────────────────────────────────────────────────────
AAAA    agents.iafactory.dz     [IPv6_VPS]         3600
AAAA    can2025.iafactory.dz    [IPv6_VPS]         3600
AAAA    news.iafactory.dz       [IPv6_VPS]         3600
AAAA    sport.iafactory.dz      [IPv6_VPS]         3600
```

---

## 🔧 Configuration par Registrar

### 1. Namecheap
```
1. Login → Domain List → Manage
2. Advanced DNS
3. Add New Record:
   - Type: A Record
   - Host: agents
   - Value: [IP_VPS]
   - TTL: Automatic

4. Répéter pour: can2025, news, sport
5. Save All Changes
```

### 2. GoDaddy
```
1. Login → My Products → DNS
2. Add:
   - Type: A
   - Name: agents
   - Value: [IP_VPS]
   - TTL: 1 Hour

3. Répéter pour: can2025, news, sport
4. Save
```

### 3. OVH
```
1. Espace Client → Domaines → iafactory.dz
2. Zone DNS → Ajouter une entrée
3. Type: A
   - Sous-domaine: agents
   - Cible: [IP_VPS]

4. Répéter pour: can2025, news, sport
5. Valider
```

### 4. Cloudflare (Recommandé)
```
1. Dashboard → iafactory.dz → DNS
2. Add Record:
   - Type: A
   - Name: agents
   - IPv4: [IP_VPS]
   - Proxy: ✅ Proxied (CDN + SSL auto)
   - TTL: Auto

3. Répéter pour: can2025, news, sport
4. Save
```

**Avantages Cloudflare**:
- ✅ SSL automatique (pas besoin certbot)
- ✅ CDN global (performance)
- ✅ DDoS protection
- ✅ Analytics gratuits
- ✅ Cache automatique

---

## 🕒 Propagation DNS

### Temps de Propagation
```
Local Cache:       0-5 minutes
ISP Cache:         1-4 heures
Global:            24-48 heures (maximum)
Moyenne:           2-6 heures
```

### Vérifier la Propagation

#### Méthode 1: dig (Linux/Mac)
```bash
dig agents.iafactory.dz
dig can2025.iafactory.dz
dig news.iafactory.dz
dig sport.iafactory.dz
```

#### Méthode 2: nslookup (Windows)
```cmd
nslookup agents.iafactory.dz
nslookup can2025.iafactory.dz
nslookup news.iafactory.dz
nslookup sport.iafactory.dz
```

#### Méthode 3: En ligne
- https://dnschecker.org
- https://www.whatsmydns.net
- https://mxtoolbox.com/DNSLookup.aspx

**Exemple vérification**:
```
Entrer: agents.iafactory.dz
Type: A
Résultat attendu: [IP_VPS] (checkmarks verts)
```

---

## 🎯 Configuration Recommandée Complète

### Enregistrements Principaux
```dns
# Apps (4 enregistrements A)
agents.iafactory.dz     → [IP_VPS]
can2025.iafactory.dz    → [IP_VPS]
news.iafactory.dz       → [IP_VPS]
sport.iafactory.dz      → [IP_VPS]

# Domaine principal (optionnel)
iafactory.dz            → [IP_VPS]
www.iafactory.dz        → [IP_VPS]
```

### Redirections
```nginx
# Sur Nginx VPS:
# Rediriger iafactory.dz → agents.iafactory.dz
server {
    server_name iafactory.dz www.iafactory.dz;
    return 301 https://agents.iafactory.dz$request_uri;
}
```

### Email (optionnel)
```dns
# MX Records pour emails @iafactory.dz
Type    Priorité    Valeur
──────────────────────────────────
MX      10          mail.iafactory.dz
A       -           [IP_MAIL_SERVER]
```

---

## ✅ Checklist DNS

### Avant Configuration
- [ ] Obtenir IP VPS: `curl ifconfig.me` sur le VPS
- [ ] Login registrar domaine
- [ ] Backup zone DNS existante (export)

### Configuration
- [ ] Ajouter A record: agents.iafactory.dz
- [ ] Ajouter A record: can2025.iafactory.dz
- [ ] Ajouter A record: news.iafactory.dz
- [ ] Ajouter A record: sport.iafactory.dz

### Vérification
- [ ] Test propagation: dnschecker.org
- [ ] Test résolution locale: `nslookup`
- [ ] Attendre 2-6h pour propagation globale

### Post-Configuration
- [ ] Tester HTTP: `curl http://agents.iafactory.dz`
- [ ] Vérifier Nginx logs sur VPS
- [ ] Installer SSL (Certbot ou Cloudflare)

---

## 🔒 SSL Après DNS

### Option 1: Let's Encrypt (Certbot)
```bash
# Sur VPS après propagation DNS
sudo certbot --nginx -d agents.iafactory.dz
sudo certbot --nginx -d can2025.iafactory.dz
sudo certbot --nginx -d news.iafactory.dz
sudo certbot --nginx -d sport.iafactory.dz

# Renouvellement auto
sudo certbot renew --dry-run
```

### Option 2: Cloudflare (Automatique)
```
1. DNS → Proxy: ✅ Enabled (orange cloud)
2. SSL/TLS → Full (strict)
3. Edge Certificates → Always Use HTTPS
✅ HTTPS activé automatiquement!
```

---

## 🧪 Tests Post-DNS

### Test 1: Résolution DNS
```bash
# Doit retourner l'IP VPS
dig +short agents.iafactory.dz
dig +short can2025.iafactory.dz
dig +short news.iafactory.dz
dig +short sport.iafactory.dz
```

### Test 2: Connexion HTTP
```bash
# Doit retourner 200 ou 301
curl -I http://agents.iafactory.dz
curl -I http://can2025.iafactory.dz
curl -I http://news.iafactory.dz
curl -I http://sport.iafactory.dz
```

### Test 3: HTTPS (après SSL)
```bash
# Doit retourner 200
curl -I https://agents.iafactory.dz
curl -I https://can2025.iafactory.dz
curl -I https://news.iafactory.dz
curl -I https://sport.iafactory.dz
```

### Test 4: Accès Browser
```
✅ https://agents.iafactory.dz    → 5 AI Agents
✅ https://can2025.iafactory.dz   → PWA CAN 2025
✅ https://news.iafactory.dz      → Agrégateur News
✅ https://sport.iafactory.dz     → Magazine Sport
```

---

## ⚠️ Troubleshooting

### DNS ne résout pas
```bash
# 1. Vérifier propagation
dig agents.iafactory.dz @8.8.8.8  # Google DNS
dig agents.iafactory.dz @1.1.1.1  # Cloudflare DNS

# 2. Flush DNS local
# Windows:
ipconfig /flushdns

# Linux/Mac:
sudo dnsmasq -k
sudo systemd-resolve --flush-caches
```

### NXDOMAIN Error
```
Cause: DNS pas encore propagé OU mauvaise config
Solution:
1. Attendre 2-6h
2. Vérifier enregistrement A dans registrar
3. Vérifier nameservers du domaine
```

### Connection Refused
```
Cause: DNS OK mais Nginx pas configuré
Solution:
1. Vérifier Nginx sur VPS: sudo nginx -t
2. Vérifier app PM2: pm2 status
3. Vérifier firewall: sudo ufw status
```

---

## 📊 Exemple Complet

### Domaine: iafactory.dz
### VPS IP: 123.45.67.89 (exemple)

**Configuration DNS**:
```dns
agents.iafactory.dz     A    123.45.67.89    3600
can2025.iafactory.dz    A    123.45.67.89    3600
news.iafactory.dz       A    123.45.67.89    3600
sport.iafactory.dz      A    123.45.67.89    3600
```

**Vérification**:
```bash
$ dig +short agents.iafactory.dz
123.45.67.89

$ curl -I http://agents.iafactory.dz
HTTP/1.1 200 OK
```

**SSL**:
```bash
$ sudo certbot --nginx -d agents.iafactory.dz
Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/...

$ curl -I https://agents.iafactory.dz
HTTP/2 200
```

✅ **Fonctionnel!**

---

## 📋 Résumé Configuration

| Sous-domaine | IP VPS | Port | App | SSL |
|--------------|--------|------|-----|-----|
| agents.iafactory.dz | [IP] | 3001 | AI Agents | ✅ |
| can2025.iafactory.dz | [IP] | 3002 | CAN 2025 PWA | ✅ |
| news.iafactory.dz | [IP] | 3003 | News DZ | ✅ |
| sport.iafactory.dz | [IP] | 3004 | Sport Magazine | ✅ |

---

## 🚀 Prochaine Étape

**Après DNS configuré et propagé** (2-6h):
→ Lancer le déploiement VPS complet
→ `./deploy-all-apps.sh`

---

**Guide DNS Complet** ✅
**Prêt pour configuration registrar** 🌐
