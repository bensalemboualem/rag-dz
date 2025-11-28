# IAFactory RAG-DZ 🇩🇿

**Sovereign AI Platform for Algeria**
Multi-tenant B2B SaaS for RAG, BMAD, and Bolt-DIY integration

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Python](https://img.shields.io/badge/python-3.11+-blue.svg)](https://www.python.org/downloads/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-green.svg)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://react.dev)
[![Docker](https://img.shields.io/badge/Docker-required-blue.svg)](https://www.docker.com)

---

## 🚀 Quick Start (5 Minutes)

```bash
# 1. Clone repository
git clone <repository-url>
cd rag-dz

# 2. Copy environment file
cp .env.example .env.local
# Edit .env.local with your API keys (optional - works without)

# 3. Start services (Docker Desktop must be running)
./scripts/dev-setup.sh

# 4. Verify health
./scripts/health-check.sh

# 5. Access services
# Backend API: http://localhost:8180/docs
# Hub UI:      http://localhost:8182
# Docs UI:     http://localhost:8183
```

**That's it!** 🎉 All services are running.

---

## 📖 What is IAFactory?

IAFactory is a **sovereign AI platform** designed for the Algerian market, providing:

### 🎯 Core Features

1. **RAG (Retrieval-Augmented Generation)**
   - Upload documents (PDF, DOCX, TXT)
   - Multilingual support (Arabic, French, English)
   - Vector search with PGVector + Qdrant
   - Context-aware AI responses

2. **BMAD (Business Multi-Agent Development)**
   - Create custom AI agents
   - Multi-agent workflow orchestration
   - Support for Groq, OpenAI, Anthropic, DeepSeek
   - Visual workflow builder (n8n integration)

3. **Bolt-DIY Integration**
   - AI-powered code editor
   - Generate full-stack applications
   - Export to zip for deployment

4. **Archon Unified Dashboard**
   - Centralized control panel
   - Calendar management (Google Calendar)
   - Voice agents (Vapi.ai)
   - WhatsApp/SMS automation (Twilio)

5. **API Key Reselling** 🚧 *In Development*
   - Sell API access to your clients
   - Usage-based billing
   - Per-key rate limiting

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────┐
│              Frontend Layer                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │ Archon   │  │ RAG-UI   │  │ Bolt-DIY │      │
│  │   Hub    │  │   Docs   │  │  Studio  │      │
│  │  :8182   │  │  :8183   │  │  :8184   │      │
│  └──────────┘  └──────────┘  └──────────┘      │
└─────────────────────────────────────────────────┘
                     ▲ REST API
                     │
┌─────────────────────────────────────────────────┐
│          Backend API (FastAPI :8180)            │
│  - 21 Routers (Auth, RAG, BMAD, Bolt...)       │
│  - 9 Services (Orchestration, Coordination...)  │
│  - Multi-tenant support (PostgreSQL RLS)        │
└─────────────────────────────────────────────────┘
                     ▲
                     │
┌─────────────────────────────────────────────────┐
│              Data Layer                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐     │
│  │PostgreSQL│  │  Redis   │  │  Qdrant  │     │
│  │ +PGVector│  │  Cache   │  │  Vector  │     │
│  └──────────┘  └──────────┘  └──────────┘     │
└─────────────────────────────────────────────────┘
```

**See `ARCHITECTURE.md` for detailed system design.**

---

## 📚 Documentation

| Document | Description | When to Read |
|----------|-------------|--------------|
| **[AUDIT_SUMMARY.md](AUDIT_SUMMARY.md)** | Complete project audit | 📍 START HERE |
| **[RECOVERY_PLAN.md](RECOVERY_PLAN.md)** | Step-by-step recovery guide | 🚨 If issues arise |
| **[ARCHITECTURE.md](ARCHITECTURE.md)** | System design & data flows | 🏗️ Understanding system |
| **[TECHNICAL_DEBT.md](TECHNICAL_DEBT.md)** | Issue tracking & roadmap | 📋 Planning work |
| **[docs/templates/](docs/templates/)** | Module & runbook templates | 📝 Creating new docs |

---

## 🛠️ Development

### Prerequisites

- **Docker Desktop** (required)
- **Git** (required)
- **Node.js 20+** (for frontend development)
- **Python 3.11+** (for backend development)

### Project Structure

```
rag-dz/
├── backend/
│   └── rag-compat/         # FastAPI backend
│       ├── app/
│       │   ├── routers/    # 21 API routers
│       │   ├── services/   # 9 business services
│       │   ├── models/     # Database models
│       │   └── clients/    # External integrations
│       ├── tests/          # Unit & integration tests
│       └── Dockerfile
│
├── frontend/
│   ├── archon-ui/          # Archon dashboard (React)
│   └── rag-ui/             # RAG interface (React)
│
├── bmad/                   # BMAD module
├── bolt-diy/               # Bolt-DIY submodule
│
├── infrastructure/
│   ├── sql/                # Database migrations
│   ├── monitoring/         # Prometheus + Grafana
│   └── n8n/                # Workflow automation
│
├── scripts/                # DevOps automation
│   ├── health-check.sh     # Verify all services
│   ├── restart-stack.sh    # Safe restart
│   ├── rebuild-all.sh      # Full rebuild
│   ├── logs.sh             # Centralized logs
│   ├── db-backup.sh        # Database backup
│   └── dev-setup.sh        # One-command setup
│
└── docs/                   # Documentation
```

### Common Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
./scripts/logs.sh backend --follow
./scripts/logs.sh all

# Restart specific service
./scripts/restart-stack.sh iafactory-backend

# Full rebuild (if issues)
./scripts/rebuild-all.sh --no-cache

# Health check
./scripts/health-check.sh

# Database backup
./scripts/db-backup.sh my_backup_name
```

### Running Tests

```bash
# Backend tests
cd backend/rag-compat
pytest tests/ -v

# With coverage
pytest tests/ --cov=app --cov-report=html

# Integration tests only
pytest tests/integration/ -v

# Frontend tests
cd frontend/archon-ui
npm test
```

### Environment Variables

**Required** (in `.env.local`):
```bash
# Database
POSTGRES_PASSWORD=your_secure_password
DATABASE_URL=postgresql://postgres:password@iafactory-postgres:5432/iafactory_dz

# Security
JWT_SECRET_KEY=your_secret_key_here
API_SECRET_KEY=your_api_secret_here

# LLM Provider (at least one)
GROQ_API_KEY=gsk_xxxxxxxxxxxxx  # Free forever
# OR
OPENAI_API_KEY=sk-xxxxxxxxxxxxx
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx
DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxx
```

**Optional**:
```bash
# Twilio (for SMS/WhatsApp)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+1234567890

# Google Calendar
GOOGLE_CLIENT_ID=xxxxxxxxxxxxx
GOOGLE_CLIENT_SECRET=xxxxxxxxxxxxx

# Monitoring
SENTRY_DSN=https://xxxxxxxxxxxxx@sentry.io/xxxxxxxxxxxxx
```

---

## 🚢 Deployment

### Local Development
```bash
./scripts/dev-setup.sh
```

### Production (VPS/Cloud)

**See `RECOVERY_PLAN.md` Phase 6 for full deployment guide.**

Quick version:
```bash
# 1. SSH to server
ssh user@your-server.com

# 2. Clone repository
git clone <repo-url> /opt/iafactory
cd /opt/iafactory

# 3. Configure environment
cp .env.prod.example .env.local
nano .env.local  # Add production secrets

# 4. Build and start
docker-compose -f docker-compose.prod.yml build
docker-compose -f docker-compose.prod.yml up -d

# 5. Verify
./scripts/health-check.sh --wait
```

**Recommended Hosting**:
- **VPS**: Hetzner CPX51 (16 CPU, 32GB RAM) - €49/month
- **CDN**: Cloudflare (free tier)
- **SSL**: Let's Encrypt (automatic with Traefik)

---

## 🔒 Security

### Multi-Tenant Isolation
- PostgreSQL Row-Level Security (RLS)
- Each tenant has unique `tenant_id`
- All queries automatically filtered
- See `RECOVERY_PLAN.md` Phase 2 for implementation

### Authentication
- JWT tokens (HS256)
- Password hashing (bcrypt)
- API key support
- Rate limiting (Redis-backed)

### Best Practices
- Never commit `.env.local` (secrets)
- Use environment variables for all secrets
- Run `safety check` for dependency scanning
- Enable Sentry for error tracking

---

## 🧪 Testing

### Current Status
- **Test Coverage**: <10% 🔴
- **Target**: 80% by Week 5

### Running Tests
```bash
# All tests
pytest tests/ -v

# Specific test file
pytest tests/unit/routers/test_auth.py -v

# With coverage report
pytest tests/ --cov=app --cov-report=html
open htmlcov/index.html
```

### Writing Tests
See `RECOVERY_PLAN.md` Phase 3 for test framework setup and examples.

---

## 📊 Monitoring

### Metrics (Prometheus)
```bash
# Start monitoring stack
docker-compose --profile monitoring up -d

# Access Prometheus
open http://localhost:8187

# Access Grafana
open http://localhost:8188
# Login: admin/admin
```

### Logs
```bash
# Structured JSON logs
docker logs iaf-dz-backend | jq .

# Real-time logs
./scripts/logs.sh backend --follow

# Search logs
docker logs iaf-dz-backend | grep "ERROR"
```

### Error Tracking
1. Sign up for [Sentry](https://sentry.io) (free tier: 5k errors/month)
2. Add `SENTRY_DSN` to `.env.local`
3. Restart backend: `docker-compose restart iafactory-backend`

---

## 🤝 Contributing

### Workflow
1. Create feature branch: `git checkout -b feature/my-feature`
2. Make changes
3. Write tests
4. Run tests: `pytest tests/`
5. Commit: `git commit -m "feat: add my feature"`
6. Push: `git push origin feature/my-feature`
7. Open Pull Request

### Code Style
- **Python**: Black + Ruff + isort
- **TypeScript/React**: ESLint + Prettier
- **Commits**: Conventional Commits (feat/fix/docs/chore)

### Before Committing
```bash
# Format Python code
cd backend/rag-compat
black app/
isort app/
ruff check app/

# Format frontend code
cd frontend/archon-ui
npm run lint
npm run format
```

---

## 📈 Roadmap

### ✅ Completed (v1.0)
- [x] FastAPI backend with 21 routers
- [x] React frontends (Archon, RAG-UI)
- [x] Bolt-DIY integration
- [x] BMAD orchestration
- [x] PostgreSQL + PGVector
- [x] Docker containerization
- [x] DevOps automation scripts

### 🚧 In Progress (v1.5 - Week 2-6)
- [ ] Multi-tenant architecture (RLS)
- [ ] Test coverage (80%)
- [ ] API key reselling + billing
- [ ] Sentry error tracking
- [ ] CI/CD pipeline (GitHub Actions)

### 📅 Planned (v2.0 - Month 3-6)
- [ ] Microservices architecture
- [ ] Kubernetes deployment
- [ ] Advanced analytics dashboard
- [ ] Webhook system
- [ ] SSO integration (OAuth2)
- [ ] Mobile app (React Native)

---

## 🐛 Known Issues

See `TECHNICAL_DEBT.md` for complete list.

**Critical**:
1. Multi-tenant not implemented (P0)
2. Test coverage <10% (P0)
3. API key billing incomplete (P1)

**Medium**:
4. Service coupling tight (P2)
5. Frontend code duplication (P2)

---

## 📞 Support

### Issues
- **GitHub Issues**: [Link to issues]
- **Email**: support@iafactory.dz
- **Slack**: [Internal Slack channel]

### Documentation
- API Documentation: http://localhost:8180/docs (Swagger UI)
- Architecture: `ARCHITECTURE.md`
- Operations: `RECOVERY_PLAN.md`

### Troubleshooting

**Services not starting?**
```bash
# Check Docker
docker info

# Restart everything
./scripts/restart-stack.sh

# View logs
./scripts/logs.sh backend
```

**Database errors?**
```bash
# Check PostgreSQL
docker exec iaf-dz-postgres pg_isready

# View connections
docker exec iaf-dz-postgres psql -U postgres -c "SELECT count(*) FROM pg_stat_activity;"
```

**Frontend not loading?**
```bash
# Rebuild frontend
docker-compose build iafactory-hub
docker-compose up -d iafactory-hub

# Check logs
./scripts/logs.sh hub
```

---

## 📄 License

MIT License - See [LICENSE](LICENSE) file

---

## 🙏 Acknowledgments

**Built With**:
- [FastAPI](https://fastapi.tiangolo.com) - Modern Python web framework
- [React](https://react.dev) - UI library
- [PostgreSQL](https://www.postgresql.org) - Database
- [PGVector](https://github.com/pgvector/pgvector) - Vector similarity search
- [Docker](https://www.docker.com) - Containerization

**AI Providers**:
- [Groq](https://groq.com) - Free LLM API (Llama 3)
- [OpenAI](https://openai.com) - GPT models
- [Anthropic](https://anthropic.com) - Claude models
- [DeepSeek](https://deepseek.com) - Cost-effective models

**Special Thanks**:
- Claude Code (Anthropic) - Project audit & architecture
- Algerian developer community

---

## 🚀 Getting Help

**Quick Links**:
- 📖 [Full Documentation](#-documentation)
- 🏗️ [Architecture Guide](ARCHITECTURE.md)
- 🚨 [Recovery Procedures](RECOVERY_PLAN.md)
- 📋 [Technical Debt Tracker](TECHNICAL_DEBT.md)
- 🔍 [Complete Audit](AUDIT_SUMMARY.md)

**Start Here**: Run `./scripts/dev-setup.sh` and open http://localhost:8180/docs

---

**Version**: 1.0.0
**Status**: 🚧 Development (70% Complete)
**Last Updated**: 2025-11-24

Made with ❤️ in Algeria 🇩🇿
