# 🚀 IA Factory - Production Deployment Guide

**Multi-Tenant SaaS Deployment: Switzerland (Psychologist) 🇨🇭 + Algeria (Education) 🇩🇿**

---

## 📋 Prerequisites

### 1. VPS Requirements
- **OS**: Ubuntu 22.04 LTS (fresh install)
- **CPU**: Minimum 2 cores (4 cores recommended)
- **RAM**: Minimum 4GB (8GB recommended)
- **Storage**: 50GB SSD
- **Network**: Public IPv4 address

### 2. Domain DNS Configuration

**Before deploying**, configure your DNS A records:

| Domain | Type | Value | TTL |
|--------|------|-------|-----|
| iafactory.ch | A | `YOUR_VPS_IP` | 300 |
| www.iafactory.ch | A | `YOUR_VPS_IP` | 300 |
| iafactoryalgeria.com | A | `YOUR_VPS_IP` | 300 |
| www.iafactoryalgeria.com | A | `YOUR_VPS_IP` | 300 |

**Verification**: Wait for DNS propagation (5-30 minutes) then test:
```bash
dig iafactory.ch
dig iafactoryalgeria.com
```

### 3. Required Information

Before deploying, prepare:
- PostgreSQL password (strong, 16+ characters)
- JWT secret key (random, 32+ characters)
- SMTP credentials (Gmail App Password recommended)
- Let's Encrypt email address
- Optional: LLM API keys (OpenAI, Anthropic, Google)

---

## 🎯 Quick Deployment (5 Steps)

### Step 1: Connect to VPS & Clone Repository

```bash
# SSH into your VPS
ssh root@YOUR_VPS_IP

# Clone the repository
git clone https://github.com/iafactory/rag-dz.git
cd rag-dz
```

### Step 2: Run Deployment Script

```bash
# Make script executable
chmod +x deploy-production.sh

# Run deployment (will prompt for credentials)
sudo ./deploy-production.sh
```

The script will:
1. ✅ Install system dependencies (curl, git, ufw)
2. ✅ Install Docker & Docker Compose
3. ✅ Configure firewall (SSH, HTTP, HTTPS)
4. ✅ Create `.env` file with your credentials
5. ✅ Obtain SSL certificates (Let's Encrypt)
6. ✅ Run database migrations (14 tables with RLS)
7. ✅ Build & start all services
8. ✅ Run health checks

### Step 3: Verify Deployment

```bash
# Check running containers
docker compose -f docker-compose.production.yml ps

# Should show:
# - iafactory-db (PostgreSQL)
# - iafactory-backend (FastAPI)
# - iafactory-frontend-switzerland (Next.js)
# - iafactory-frontend-algeria (Next.js)
# - iafactory-nginx (Reverse proxy)
# - iafactory-certbot (SSL renewal)

# Check backend health
curl http://localhost:8002/health
# Expected: {"status": "healthy"}

# View logs
docker compose -f docker-compose.production.yml logs -f backend
```

### Step 4: Test Both Domains

Open in your browser:
- 🇨🇭 https://iafactory.ch (should show Swiss flag, red theme, "Privacy & Precision")
- 🇩🇿 https://iafactoryalgeria.com (should show Algeria flag, green theme, "Shaping the Future")

### Step 5: Test Registration & Welcome Email

1. Visit https://iafactory.ch/login
2. Register a new account with your email
3. Check your inbox for welcome email with:
   - Profile-specific content (Psychologist features)
   - 100 free token code (format: WELCOME-XXXX-XXXX-XXXX)
4. Enter code in dashboard to activate tokens

---

## 🔧 Manual Deployment (Detailed)

If you prefer step-by-step manual control:

### 1. Install Docker

```bash
# Update system
apt-get update && apt-get upgrade -y

# Install dependencies
apt-get install -y apt-transport-https ca-certificates curl software-properties-common

# Add Docker GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Add Docker repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Start Docker
systemctl enable docker
systemctl start docker

# Verify
docker --version
```

### 2. Configure Firewall

```bash
# Enable UFW
ufw --force enable

# Allow SSH (IMPORTANT!)
ufw allow ssh

# Allow HTTP & HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# Check status
ufw status
```

### 3. Create Environment File

```bash
# Create .env file
nano .env
```

**Paste this template and fill in your values:**

```bash
# Database
POSTGRES_DB=iafactory
POSTGRES_USER=iafactory
POSTGRES_PASSWORD=your-strong-password-here

# Security
SECRET_KEY=your-32-character-secret-key-here

# SMTP (Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
FROM_EMAIL=noreply@iafactory.pro

# Optional LLM API Keys
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
GOOGLE_API_KEY=
```

**Save and exit**: `Ctrl+X`, `Y`, `Enter`

### 4. Obtain SSL Certificates

```bash
# Install Certbot
apt-get install -y certbot

# Start Nginx (temporary)
docker compose -f docker-compose.production.yml up -d nginx

# Wait for Nginx
sleep 5

# Obtain certificate for Switzerland
certbot certonly --webroot \
  --webroot-path=/var/www/certbot \
  --email your-email@example.com \
  --agree-tos --no-eff-email \
  -d iafactory.ch -d www.iafactory.ch

# Obtain certificate for Algeria
certbot certonly --webroot \
  --webroot-path=/var/www/certbot \
  --email your-email@example.com \
  --agree-tos --no-eff-email \
  -d iafactoryalgeria.com -d www.iafactoryalgeria.com
```

### 5. Start Database & Run Migrations

```bash
# Start PostgreSQL
docker compose -f docker-compose.production.yml up -d postgres

# Wait for database
sleep 10

# Run migrations
cd backend/rag-compat/migrations

# Auth & Core (001)
docker compose -f ../../docker-compose.production.yml exec -T postgres \
  psql -U iafactory -d iafactory < 001_auth_setup.sql

# Tokens System (009)
docker compose -f ../../docker-compose.production.yml exec -T postgres \
  psql -U iafactory -d iafactory < 009_tokens.sql

# Digital Twin (010)
docker compose -f ../../docker-compose.production.yml exec -T postgres \
  psql -U iafactory -d iafactory < 010_digital_twin.sql

# Geneva Mode (011)
docker compose -f ../../docker-compose.production.yml exec -T postgres \
  psql -U iafactory -d iafactory < 011_geneva_mode.sql

# Multi-Tenant RLS (012)
docker compose -f ../../docker-compose.production.yml exec -T postgres \
  psql -U iafactory -d iafactory < 012_multi_tenant_rls.sql

cd ../../..
```

### 6. Build & Start All Services

```bash
# Build images
docker compose -f docker-compose.production.yml build

# Start all services
docker compose -f docker-compose.production.yml up -d

# View logs
docker compose -f docker-compose.production.yml logs -f
```

---

## 🧪 Testing & Verification

### 1. Health Checks

```bash
# Backend health
curl http://localhost:8002/health

# Check all containers
docker compose -f docker-compose.production.yml ps

# Check Nginx configuration
docker compose -f docker-compose.production.yml exec nginx nginx -t
```

### 2. Profile Detection Test

**Switzerland (Psychologist)**:
```bash
curl -H "Host: iafactory.ch" https://iafactory.ch/api/health
# Should return with psychologist profile indicators
```

**Algeria (Education)**:
```bash
curl -H "Host: iafactoryalgeria.com" https://iafactoryalgeria.com/api/health
# Should return with education profile indicators
```

### 3. Frontend Visual Test

Open both sites in browser:

**🇨🇭 iafactory.ch**:
- Header shows: Swiss flag (🇨🇭)
- Tagline: "IA Factory - Privacy & Precision"
- Focus: "Privacy & Compliance"
- Badge: "nLPD Compliant" (red)
- Login page: Swiss branding

**🇩🇿 iafactoryalgeria.com**:
- Header shows: Algeria flag (🇩🇿)
- Tagline: "IA Factory - Shaping the Future"
- Focus: "Innovation & Future"
- Badge: "FR/AR Bilingual" (green)
- Login page: Algeria branding

### 4. Welcome Email Test

1. Register on https://iafactory.ch with a real email
2. Check inbox for: "Your Private AI Assistant is Ready | IA Factory Switzerland 🇨🇭"
3. Email should contain:
   - Swiss branding (red gradient)
   - Welcome code (WELCOME-XXXX-XXXX-XXXX)
   - 3-step quick start guide
   - Privacy & compliance focus

4. Register on https://iafactoryalgeria.com with a different email
5. Check inbox for: "Welcome to the Future of Education | IA Factory Algeria 🇩🇿"
6. Email should contain:
   - Algeria branding (green gradient)
   - Welcome code
   - Bilingual content (French/Arabic)
   - Innovation & education focus

---

## 🔒 Security Checklist

- [ ] SSL certificates installed and working (green padlock)
- [ ] HTTPS redirect working (HTTP → HTTPS)
- [ ] Firewall configured (only SSH, HTTP, HTTPS allowed)
- [ ] PostgreSQL not exposed to public (only accessible via Docker network)
- [ ] Strong passwords used (PostgreSQL, JWT secret)
- [ ] SMTP credentials secured (.env file)
- [ ] Database RLS policies active (test with different tenants)
- [ ] Security headers present (check with: `curl -I https://iafactory.ch`)

---

## 📊 Monitoring & Logs

### View Logs

```bash
# All services
docker compose -f docker-compose.production.yml logs -f

# Backend only
docker compose -f docker-compose.production.yml logs -f backend

# Frontend (Switzerland)
docker compose -f docker-compose.production.yml logs -f frontend-switzerland

# Nginx
docker compose -f docker-compose.production.yml logs -f nginx

# PostgreSQL
docker compose -f docker-compose.production.yml logs -f postgres
```

### Monitor Resources

```bash
# Container stats
docker stats

# Disk usage
df -h

# Memory usage
free -h
```

---

## 🔄 Common Operations

### Restart Services

```bash
# Restart all
docker compose -f docker-compose.production.yml restart

# Restart backend only
docker compose -f docker-compose.production.yml restart backend

# Restart frontend
docker compose -f docker-compose.production.yml restart frontend-switzerland frontend-algeria
```

### Update Deployment

```bash
# Pull latest code
git pull origin main

# Rebuild and restart
docker compose -f docker-compose.production.yml build
docker compose -f docker-compose.production.yml up -d

# Or use blue-green deployment (zero downtime)
docker compose -f docker-compose.production.yml up -d --no-deps --build backend
```

### Backup Database

```bash
# Create backup
docker compose -f docker-compose.production.yml exec postgres \
  pg_dump -U iafactory iafactory > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore backup
docker compose -f docker-compose.production.yml exec -T postgres \
  psql -U iafactory -d iafactory < backup_20251216_120000.sql
```

### SSL Certificate Renewal

Certificates auto-renew, but to force renewal:

```bash
certbot renew --force-renewal
docker compose -f docker-compose.production.yml restart nginx
```

---

## 🐛 Troubleshooting

### Issue: Containers Won't Start

```bash
# Check logs
docker compose -f docker-compose.production.yml logs

# Check if port 80/443 already in use
netstat -tulpn | grep ':80\|:443'

# Remove old containers
docker compose -f docker-compose.production.yml down
docker compose -f docker-compose.production.yml up -d
```

### Issue: Database Connection Error

```bash
# Check PostgreSQL is running
docker compose -f docker-compose.production.yml ps postgres

# Check database credentials in .env
cat .env | grep POSTGRES

# Test connection
docker compose -f docker-compose.production.yml exec postgres \
  psql -U iafactory -d iafactory -c "SELECT version();"
```

### Issue: SSL Certificate Error

```bash
# Check certificate files exist
ls -la /etc/letsencrypt/live/iafactory.ch/
ls -la /etc/letsencrypt/live/iafactoryalgeria.com/

# Re-obtain certificate
certbot certonly --webroot \
  --webroot-path=/var/www/certbot \
  --email your-email@example.com \
  --agree-tos --force-renewal \
  -d iafactory.ch -d www.iafactory.ch
```

### Issue: Wrong Profile Showing

Check Nginx headers:
```bash
# Test Switzerland
curl -I https://iafactory.ch | grep X-Tenant

# Should show:
# X-Tenant-Profile: psychologist
# X-Country: CH

# Test Algeria
curl -I https://iafactoryalgeria.com | grep X-Tenant

# Should show:
# X-Tenant-Profile: education
# X-Country: DZ
```

### Issue: Welcome Emails Not Sending

```bash
# Check SMTP configuration
cat .env | grep SMTP

# Check backend logs for email errors
docker compose -f docker-compose.production.yml logs backend | grep EMAIL

# Test SMTP manually
docker compose -f docker-compose.production.yml exec backend python -c "
from app.services.notification_service import get_notification_service
service = get_notification_service()
print(service.smtp_user, service.smtp_host)
"
```

---

## 📈 Performance Optimization

### Enable Nginx Caching

Add to Nginx config:

```nginx
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m max_size=1g inactive=60m use_temp_path=off;

location / {
    proxy_cache my_cache;
    proxy_cache_valid 200 10m;
    # ... existing proxy settings
}
```

### Database Connection Pooling

Update backend environment:

```bash
DATABASE_POOL_SIZE=20
DATABASE_MAX_OVERFLOW=10
```

---

## 🎉 Deployment Complete!

Your IA Factory multi-tenant SaaS is now live:

- 🇨🇭 **Switzerland**: https://iafactory.ch
- 🇩🇿 **Algeria**: https://iafactoryalgeria.com

**Next Steps**:
1. Create test accounts on both domains
2. Test voice transcription features
3. Verify token redemption works
4. Monitor welcome email delivery
5. Set up automated backups
6. Configure monitoring alerts (optional: Uptime Robot, Better Uptime)

---

## 📞 Support

- **Documentation**: https://docs.iafactory.pro
- **Issues**: https://github.com/iafactory/rag-dz/issues
- **Email**: support@iafactory.pro

---

**Built with ❤️ for Privacy & Precision (🇨🇭) | Shaping the Future (🇩🇿)**
