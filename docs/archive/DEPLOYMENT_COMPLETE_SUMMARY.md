# 🚀 IA Factory - Deployment Package Complete

**Multi-Tenant SaaS: Switzerland (Psychologist) 🇨🇭 + Algeria (Education) 🇩🇿**

---

## ✅ Deployment Package Contents

### 1. **Docker Configuration**
- ✅ **`docker-compose.production.yml`** - Full multi-service orchestration
  - PostgreSQL (14 tables with RLS)
  - Backend API (FastAPI)
  - Frontend Switzerland (Next.js)
  - Frontend Algeria (Next.js)
  - Nginx (Reverse proxy)
  - Certbot (SSL auto-renewal)

### 2. **Nginx Configuration**
- ✅ **`nginx/nginx.conf`** - Main Nginx configuration
  - Modern SSL/TLS settings
  - Gzip compression
  - Security headers
  - Performance optimizations

- ✅ **`nginx/conf.d/iafactory-ch.conf`** - Switzerland domain
  - HTTP → HTTPS redirect
  - SSL certificate integration
  - Multi-tenant headers:
    - `X-Tenant-Profile: psychologist`
    - `X-Country: CH`
    - `X-Tenant-ID: 814c132a-1cdd-4db6-bc1f-21abd21ec37d`
  - API proxy with 600s timeout
  - WebSocket support

- ✅ **`nginx/conf.d/iafactoryalgeria-com.conf`** - Algeria domain
  - HTTP → HTTPS redirect
  - SSL certificate integration
  - Multi-tenant headers:
    - `X-Tenant-Profile: education`
    - `X-Country: DZ`
    - `X-Tenant-ID: f47ac10b-58cc-4372-a567-0e02b2c3d479`
  - API proxy with 600s timeout
  - WebSocket support

### 3. **Deployment Scripts**
- ✅ **`deploy-production.sh`** - Automated deployment script
  - System dependencies installation
  - Docker & Docker Compose setup
  - Firewall configuration (UFW)
  - Environment file creation (prompts for secrets)
  - SSL certificate obtainment (Let's Encrypt)
  - Database migration execution
  - Service build & startup
  - Health checks

### 4. **Documentation**
- ✅ **`DEPLOYMENT_GUIDE.md`** - Complete deployment guide
  - Prerequisites & DNS setup
  - Quick deployment (5 steps)
  - Manual deployment (detailed)
  - Testing & verification
  - Security checklist
  - Monitoring & logs
  - Common operations
  - Troubleshooting

### 5. **Backend Services**
- ✅ **`app/services/notification_service.py`** - Email notification system
  - Profile-specific welcome emails
  - Automatic welcome code generation (100 tokens)
  - HTML + Text email templates
  - SMTP configuration
  - Token low reminder functionality

- ✅ **`app/routers/auth.py`** - Enhanced authentication
  - Registration with domain detection
  - Automatic welcome email sending
  - Multi-tenant profile assignment
  - JWT with profile information

- ✅ **`app/prompts/`** - Specialized prompt library
  - `education_prompts.py` - Algeria education prompts
  - `psychologist_prompts.py` - Geneva psychologist prompts
  - `profile_manager.py` - Profile detection & management

### 6. **Email Templates**
- ✅ **`app/templates/emails/psychologist_welcome.html`** - Swiss psychologist HTML
- ✅ **`app/templates/emails/psychologist_welcome.txt`** - Swiss psychologist text
- ✅ **`app/templates/emails/education_welcome.html`** - Algeria education HTML
- ✅ **`app/templates/emails/education_welcome.txt`** - Algeria education text

### 7. **Frontend Updates**
- ✅ **`app/dashboard/page.tsx`** - Profile-specific dashboard
  - Dynamic flag display (🇨🇭 / 🇩🇿 / 🌍)
  - Profile-specific taglines
  - Feature badges (nLPD Compliant / FR/AR Bilingual / 110+ Cultures)

- ✅ **`app/login/page.tsx`** - Domain-aware login page
  - Profile-specific branding
  - Dynamic colors per domain
  - Two login modes (Email/Password, API Key)
  - Welcome code redemption flow

- ✅ **`lib/providers/TenantProvider.tsx`** - Multi-tenant context
  - Hostname-based profile detection
  - Profile metadata (flag, tagline, focus, colors)
  - Tenant ID assignment

---

## 🎯 Quick Start Commands

### On Fresh Ubuntu VPS:

```bash
# 1. Clone repository
git clone https://github.com/iafactory/rag-dz.git
cd rag-dz

# 2. Run automated deployment
chmod +x deploy-production.sh
sudo ./deploy-production.sh

# 3. Follow prompts for:
#    - PostgreSQL password
#    - JWT secret key
#    - SMTP credentials
#    - Let's Encrypt email
#    - Domain SSL confirmations

# 4. Verify deployment
docker compose -f docker-compose.production.yml ps
curl http://localhost:8002/health

# 5. Test in browser
#    https://iafactory.ch
#    https://iafactoryalgeria.com
```

---

## 🔧 Environment Variables Required

Create `.env` file with:

```bash
# Database
POSTGRES_DB=iafactory
POSTGRES_USER=iafactory
POSTGRES_PASSWORD=<your-strong-password>

# Security
SECRET_KEY=<your-32-char-secret>

# SMTP (for welcome emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=<your-gmail>
SMTP_PASSWORD=<gmail-app-password>
FROM_EMAIL=noreply@iafactory.pro

# Optional: LLM API Keys
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
GOOGLE_API_KEY=
```

---

## 🌐 Domain Configuration

### DNS A Records (Configure before deployment):

| Domain | Record Type | Value |
|--------|-------------|-------|
| iafactory.ch | A | YOUR_VPS_IP |
| www.iafactory.ch | A | YOUR_VPS_IP |
| iafactoryalgeria.com | A | YOUR_VPS_IP |
| www.iafactoryalgeria.com | A | YOUR_VPS_IP |

### SSL Certificates

Auto-obtained via Let's Encrypt during deployment:
- `iafactory.ch` + `www.iafactory.ch`
- `iafactoryalgeria.com` + `www.iafactoryalgeria.com`

Auto-renewal configured via Certbot container.

---

## 🎨 Logo Assets

**Provided by user**:
- 🇩🇿 Algeria: `C:\Users\bbens\Downloads\logoiafactoryalgeria.png`
- 🇨🇭 Switzerland: `C:\Users\bbens\Downloads\logoiafactorysuisse.png`

**Integration**:
```bash
# Copy logos to frontend public directory
cp logoiafactoryalgeria.png frontend/ia-factory-ui/public/logos/algeria.svg
cp logoiafactorysuisse.png frontend/ia-factory-ui/public/logos/switzerland.svg

# Rebuild frontend containers
docker compose -f docker-compose.production.yml build frontend-switzerland frontend-algeria
docker compose -f docker-compose.production.yml up -d
```

---

## 🧪 Testing Checklist

### Visual Verification

**🇨🇭 iafactory.ch**:
- [ ] Shows Swiss flag (🇨🇭) in header
- [ ] Tagline: "IA Factory - Privacy & Precision"
- [ ] Red gradient theme
- [ ] "nLPD Compliant" badge visible
- [ ] Login page has Swiss branding

**🇩🇿 iafactoryalgeria.com**:
- [ ] Shows Algeria flag (🇩🇿) in header
- [ ] Tagline: "IA Factory - Shaping the Future"
- [ ] Green gradient theme
- [ ] "FR/AR Bilingual" badge visible
- [ ] Login page has Algeria branding

### Functional Testing

- [ ] Register account on iafactory.ch
- [ ] Receive Swiss psychologist welcome email
- [ ] Welcome code format: `WELCOME-XXXX-XXXX-XXXX`
- [ ] Redeem code on dashboard (100 tokens)
- [ ] Register account on iafactoryalgeria.com
- [ ] Receive Algeria education welcome email
- [ ] Welcome email in French/Arabic
- [ ] Test voice recording feature
- [ ] Test live transcription
- [ ] Test digital twin sidebar

### Security Testing

- [ ] HTTPS enforced (HTTP redirects to HTTPS)
- [ ] SSL certificate valid (green padlock)
- [ ] Security headers present (`curl -I https://iafactory.ch`)
- [ ] PostgreSQL not publicly accessible
- [ ] Firewall configured (UFW status)
- [ ] RLS policies active (test with different tenant IDs)

---

## 📊 Architecture Overview

```
                    Internet
                       |
                       v
              [DNS: iafactory.ch / iafactoryalgeria.com]
                       |
                       v
              +------------------+
              |   NGINX (Port 80/443)   |
              |  - SSL Termination      |
              |  - Domain Routing       |
              |  - Tenant Headers       |
              +------------------+
                       |
         +-------------+-------------+
         |                           |
         v                           v
+------------------+      +------------------+
| Frontend CH      |      | Frontend DZ      |
| (Next.js:3000)   |      | (Next.js:3000)   |
| Swiss branding   |      | Algeria branding |
+------------------+      +------------------+
         |                           |
         +-------------+-------------+
                       |
                       v
              +------------------+
              | Backend (FastAPI:8002) |
              | - Auth + JWT           |
              | - Profile Detection    |
              | - Notification Service |
              | - LLM Proxy            |
              +------------------+
                       |
                       v
              +------------------+
              | PostgreSQL       |
              | - 14 tables      |
              | - RLS policies   |
              | - Multi-tenant   |
              +------------------+
```

---

## 🔄 Database Migrations

**14 Tables with Row-Level Security**:

1. `001_auth_setup.sql` - Users, authentication
2. `009_tokens.sql` - Token balance, redemption codes
3. `010_digital_twin.sql` - Lexicon, emotion analysis
4. `011_geneva_mode.sql` - Daily briefing, mobile pairing
5. `012_multi_tenant_rls.sql` - Tenant isolation, RLS policies

**Execution**:
```bash
# Auto-run during deployment via docker-compose init
# Or manually:
docker compose -f docker-compose.production.yml exec postgres \
  psql -U iafactory -d iafactory < backend/rag-compat/migrations/001_auth_setup.sql
```

---

## 📧 Welcome Email Flow

### Registration Flow:

1. User visits `https://iafactory.ch/login`
2. Clicks "Register"
3. Enters email, password, full name
4. Frontend sends POST to `/api/auth/register`
5. Backend detects domain → Profile = Psychologist
6. Creates user in database
7. Generates welcome code: `WELCOME-A1B2-C3D4-E5F6`
8. Sends Swiss psychologist welcome email via SMTP
9. Returns JWT with profile metadata
10. User receives email with 100 token code

### Email Content (Switzerland):

**Subject**: "Your Private AI Assistant is Ready | IA Factory Switzerland 🇨🇭"

**Key Sections**:
- Swiss flag & red branding
- "Privacy & Precision" tagline
- Welcome code in styled box
- 3 key features:
  1. Stress Detection (0-10 scale)
  2. Swiss nLPD Compliance
  3. Clinical Neutral Summaries
- Quick Start Guide (3 steps)
- CTA: Access Your Dashboard

### Email Content (Algeria):

**Subject**: "Welcome to the Future of Education | IA Factory Algeria 🇩🇿"

**Key Sections**:
- Algeria flag & green branding
- "Shaping the Future" tagline
- Welcome code in styled box
- 3 key features:
  1. Personal Lexicon & Terminology
  2. Bilingual Summaries FR/AR
  3. Knowledge Extraction
- Quick Start Guide (bilingual)
- CTA: Accéder à Votre Tableau de Bord

---

## 🚀 Production Readiness

### ✅ Completed Features

- [x] Multi-tenant architecture
- [x] Domain-based profile detection
- [x] Specialized prompt library (Education + Psychologist)
- [x] Automated welcome emails
- [x] Token gift system (100 free tokens)
- [x] Profile-specific UI branding
- [x] SSL/HTTPS support
- [x] Database migrations with RLS
- [x] Nginx reverse proxy
- [x] Docker containerization
- [x] Automated deployment script
- [x] Health checks
- [x] Security headers
- [x] Firewall configuration

### 🔜 Optional Enhancements

- [ ] Monitoring (Prometheus + Grafana)
- [ ] Automated backups (pg_dump cron)
- [ ] Rate limiting (Nginx)
- [ ] WAF (ModSecurity)
- [ ] CDN integration (Cloudflare)
- [ ] Email analytics (SendGrid/Postmark)
- [ ] User analytics (Plausible/Umami)

---

## 📞 Support & Resources

- **Deployment Guide**: `DEPLOYMENT_GUIDE.md`
- **Notification Service**: `app/services/NOTIFICATION_README.md`
- **API Documentation**: https://api.iafactory.ch/docs
- **GitHub Issues**: https://github.com/iafactory/rag-dz/issues
- **Email Support**: support@iafactory.pro

---

## 🎉 Ready to Deploy!

All deployment files are ready. To deploy:

1. Ensure DNS records are configured
2. Clone repository on VPS
3. Run `./deploy-production.sh`
4. Test both domains
5. Monitor logs for any issues

**Estimated deployment time**: 15-30 minutes

---

**Built with ❤️ for Privacy & Precision (🇨🇭) | Shaping the Future (🇩🇿)**

*Last updated: 2025-12-16*
