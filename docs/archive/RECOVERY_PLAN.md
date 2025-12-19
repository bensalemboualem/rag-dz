# IAFactory RAG-DZ - Complete Recovery & Hardening Plan

**Date**: 2025-11-24
**Status**: 🔴 Action Required
**Estimated Time**: 4-6 weeks for full recovery + hardening

---

## 📊 Executive Summary

### Critical Findings
1. **Backend Code Duplication**: ✅ RESOLVED (app/app/ removed)
2. **Docker Infrastructure**: 🔴 DOWN (Docker Desktop not running)
3. **Git State**: 🟡 UNSTABLE (50+ untracked files, deleted files uncommitted)
4. **Multi-Tenant Architecture**: 🔴 NOT IMPLEMENTED (blocker for B2B SaaS)
5. **Test Coverage**: 🔴 <10% (high regression risk)
6. **Security**: 🟡 BASIC ONLY (needs hardening)

### Recovery Timeline
- **Week 1**: Infrastructure + Git cleanup → ✅ Stable dev environment
- **Week 2-3**: Multi-tenant implementation → ✅ SaaS-ready
- **Week 4-5**: Test coverage + security → ✅ Production-ready
- **Week 6**: Documentation + CI/CD → ✅ Scalable operations

---

## 🚀 PHASE 1: Immediate Recovery (Days 1-3)

### Day 1: Infrastructure Stabilization

#### Step 1.1: Start Docker Infrastructure
```bash
# Windows: Start Docker Desktop manually
# - Open Docker Desktop application
# - Wait for "Docker is running" status

# Verify Docker is running
docker info

# If Docker fails to start:
# - Check Windows virtualization is enabled (WSL2/Hyper-V)
# - Restart Docker Desktop
# - Check logs: %LOCALAPPDATA%\Docker\log.txt
```

#### Step 1.2: Clean Docker Environment
```bash
# Remove old containers and volumes
docker-compose down -v

# Prune unused resources
docker system prune -a -f

# Remove unused volumes
docker volume prune -f

# Verify clean state
docker ps -a
docker images
```

#### Step 1.3: Rebuild and Start Services
```bash
# Build all images (no cache for clean build)
docker-compose build --no-cache

# Start services in correct order
docker-compose up -d iafactory-postgres iafactory-redis iafactory-qdrant

# Wait 15 seconds for databases to be ready
timeout 15

# Start application services
docker-compose up -d iafactory-backend

# Wait 20 seconds for backend to start
timeout 20

# Start frontend services
docker-compose up -d iafactory-hub iafactory-docs iafactory-n8n

# Verify all services
docker-compose ps
```

#### Step 1.4: Run Health Checks
```bash
# Use automated health check script
./scripts/health-check.sh --wait

# Manual verification
curl http://localhost:8180/health      # Backend
curl http://localhost:8182             # Hub UI
curl http://localhost:8183             # Docs UI
curl http://localhost:8185             # n8n

# Check logs for errors
docker logs iaf-dz-backend --tail 50
docker logs iaf-dz-hub --tail 50
```

**Expected Result**: ✅ All 7 services running and healthy

---

### Day 2: Git State Cleanup

#### Step 2.1: Analyze Current Git State
```bash
# View all changes
git status --short

# View untracked files
git ls-files --others --exclude-standard

# View deleted files
git ls-files --deleted

# View modified files
git diff --name-status
```

#### Step 2.2: Safely Stage Changes

**Modified Files** (Review then stage):
```bash
# Review each modified file
git diff backend/rag-compat/app/main.py
git diff backend/rag-compat/app/security.py
git diff docker-compose.yml

# Stage backend changes
git add backend/rag-compat/app/main.py
git add backend/rag-compat/app/routers/bmad_chat.py
git add backend/rag-compat/app/security.py
git add backend/rag-compat/app/services/*.py
git add backend/rag-compat/requirements.txt

# Stage infrastructure changes
git add docker-compose.yml
git add .env.example

# Stage frontend changes
git add frontend/archon-ui/
git add frontend/rag-ui/
```

**Deleted Files** (Confirm deletion):
```bash
# Remove deleted files from git
git rm Archon
git rm backend/rag-compat/requirements.txt.backup
git rm frontend/archon-ui/generate_translations.py
git rm frontend/archon-ui/src/components/LanguageSelector.tsx
git rm -r frontend/archon-ui/src/features/bmad/
git rm -r frontend/archon-ui/src/locales/
```

**New Untracked Files** (Add selectively):
```bash
# Add new scripts
git add scripts/

# Add new routers/services
git add backend/rag-compat/app/routers/auth.py
git add backend/rag-compat/app/routers/bolt.py
git add backend/rag-compat/app/routers/whatsapp.py
git add backend/rag-compat/app/routers/user_keys.py
git add backend/rag-compat/app/services/auth_service.py
git add backend/rag-compat/app/services/bolt_workflow_service.py
git add backend/rag-compat/app/services/whatsapp_service.py
git add backend/rag-compat/app/services/user_key_service.py

# Add new models
git add backend/rag-compat/app/models/user_key.py

# Add documentation
git add docs/
git add TECHNICAL_DEBT.md
git add RECOVERY_PLAN.md
git add .github/workflows/ci.yml

# Add CI/CD files
git add .github/

# DO NOT ADD (exclude from git):
# - .env.local (secrets)
# - backups/ (database backups)
# - logs/ (log files)
# - __pycache__/ (Python cache)
# - node_modules/ (dependencies)
```

#### Step 2.3: Update .gitignore
```bash
# Create comprehensive .gitignore
cat >> .gitignore << 'EOF'

# Environment files
.env.local
.env.prod
.env.*.local

# Backups
backups/
*.sql
*.sql.gz

# Logs
logs/
*.log

# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
venv/
env/
.venv

# Node
node_modules/
dist/
build/
.cache/

# IDEs
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Docker
.docker/

# Legacy backups
backend/rag-compat/app_legacy_backup/
EOF

git add .gitignore
```

#### Step 2.4: Commit Clean State
```bash
# Create comprehensive commit
git commit -m "$(cat <<'EOF'
chore: Major cleanup and infrastructure improvements

## Changes

### Backend
- ✅ Fixed code duplication (removed nested app/app/)
- ✅ Added new routers: auth, bolt, whatsapp, user_keys
- ✅ Added new services: auth, bolt_workflow, whatsapp, user_key
- ✅ Added user_key model for API key reselling
- ✅ Updated main.py with all routers
- ✅ Enhanced security.py with rate limiting
- ✅ Updated requirements.txt

### Frontend
- ✅ Cleaned up Archon-UI (removed unused i18n, BMAD components)
- ✅ Updated RAG-UI configuration
- ✅ Streamlined navigation and layouts

### Infrastructure
- ✅ Updated docker-compose.yml with IAFactory naming
- ✅ Added comprehensive DevOps scripts (health-check, restart, rebuild, logs, backup)
- ✅ Created CI/CD pipeline (.github/workflows/ci.yml)

### Documentation
- ✅ Added TECHNICAL_DEBT.md for tracking improvements
- ✅ Added RECOVERY_PLAN.md for operations
- ✅ Created module and runbook templates

### Cleanup
- 🗑️ Removed legacy code (Archon root folder)
- 🗑️ Removed duplicate requirements.txt.backup
- 🗑️ Removed unused i18n files and components

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

#### Step 2.5: Handle Submodule (bolt-diy)
```bash
# Check submodule status
git submodule status

# If modified, either:
# Option A: Commit submodule changes
cd bolt-diy
git add .
git commit -m "Update bolt-diy integration"
cd ..
git add bolt-diy
git commit -m "Update bolt-diy submodule reference"

# Option B: Reset submodule to original
git submodule update --init --recursive
```

#### Step 2.6: Handle bmad Module
```bash
# Check if bmad should be a submodule or internal
# If internal:
git add bmad/
git commit -m "Add BMAD module"

# If it should be external:
# 1. Create separate repo for bmad
# 2. Add as submodule:
#    git submodule add <bmad-repo-url> bmad
```

**Expected Result**: ✅ Clean git state, all changes committed

---

### Day 3: Verify Functionality

#### Step 3.1: Test Backend API
```bash
# Get JWT token
TOKEN=$(curl -X POST http://localhost:8180/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@rag.dz","password":"test123"}' | jq -r .access_token)

# Test routers
curl -H "Authorization: Bearer $TOKEN" http://localhost:8180/api/knowledge/collections
curl -H "Authorization: Bearer $TOKEN" http://localhost:8180/api/bmad/agents
curl -H "Authorization: Bearer $TOKEN" http://localhost:8180/api/bolt/projects

# Test health endpoints
curl http://localhost:8180/health
curl http://localhost:8180/metrics
```

#### Step 3.2: Test Frontend UIs
```bash
# Open in browser and verify:
# - http://localhost:8182 (Hub UI - should load without errors)
# - http://localhost:8183 (Docs UI - should load and connect to backend)
# - http://localhost:8185 (n8n - should show login)

# Check browser console for errors
# Check network tab for failed requests
```

#### Step 3.3: Database Backup
```bash
# Create first backup
./scripts/db-backup.sh baseline_$(date +%Y%m%d)

# Verify backup exists
ls -lh backups/
```

**Expected Result**: ✅ All services functional, baseline backup created

---

## 🏗️ PHASE 2: Multi-Tenant Architecture (Week 2-3)

### 🔴 CRITICAL: SaaS Readiness Blocker

#### Step 2.1: Database Schema Migration

**Create Migration Script** (`infrastructure/sql/multi_tenant_migration.sql`):
```sql
-- ============================================
-- Multi-Tenant Migration
-- ============================================

-- Add tenant table
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    plan VARCHAR(50) NOT NULL DEFAULT 'free', -- free, pro, enterprise
    status VARCHAR(50) NOT NULL DEFAULT 'active', -- active, suspended, cancelled
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add tenant_id to all tables
ALTER TABLE users ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id);
ALTER TABLE documents ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id);
ALTER TABLE knowledge_bases ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id);
ALTER TABLE user_keys ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id);
ALTER TABLE bolt_workflows ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id);
-- (Add to all other tables)

-- Create indexes on tenant_id
CREATE INDEX IF NOT EXISTS idx_users_tenant_id ON users(tenant_id);
CREATE INDEX IF NOT EXISTS idx_documents_tenant_id ON documents(tenant_id);
CREATE INDEX IF NOT EXISTS idx_knowledge_bases_tenant_id ON knowledge_bases(tenant_id);
CREATE INDEX IF NOT EXISTS idx_user_keys_tenant_id ON user_keys(tenant_id);
CREATE INDEX IF NOT EXISTS idx_bolt_workflows_tenant_id ON bolt_workflows(tenant_id);

-- Enable Row-Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_bases ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE bolt_workflows ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only see their tenant's data
CREATE POLICY tenant_isolation_policy ON users
    USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

CREATE POLICY tenant_isolation_policy ON documents
    USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

CREATE POLICY tenant_isolation_policy ON knowledge_bases
    USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

CREATE POLICY tenant_isolation_policy ON user_keys
    USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

CREATE POLICY tenant_isolation_policy ON bolt_workflows
    USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

-- Create default tenant for existing data
INSERT INTO tenants (id, name, slug, plan, status)
VALUES (
    '00000000-0000-0000-0000-000000000001'::UUID,
    'Default Tenant',
    'default',
    'enterprise',
    'active'
);

-- Assign existing records to default tenant
UPDATE users SET tenant_id = '00000000-0000-0000-0000-000000000001'::UUID WHERE tenant_id IS NULL;
UPDATE documents SET tenant_id = '00000000-0000-0000-0000-000000000001'::UUID WHERE tenant_id IS NULL;
-- (Update all other tables)

-- Make tenant_id NOT NULL after migration
ALTER TABLE users ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE documents ALTER COLUMN tenant_id SET NOT NULL;
-- (Update all other tables)
```

**Apply Migration**:
```bash
# Backup before migration
./scripts/db-backup.sh pre_multi_tenant_$(date +%Y%m%d)

# Apply migration
docker exec -i iaf-dz-postgres psql -U postgres iafactory_dz < infrastructure/sql/multi_tenant_migration.sql

# Verify
docker exec iaf-dz-postgres psql -U postgres -d iafactory_dz -c "\d tenants"
docker exec iaf-dz-postgres psql -U postgres -d iafactory_dz -c "SELECT * FROM tenants;"
```

#### Step 2.2: Update Backend Code

**Add Tenant Model** (`backend/rag-compat/app/models/tenant.py`):
```python
from sqlalchemy import Column, String, DateTime, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
import uuid

from ..db import Base

class Tenant(Base):
    __tablename__ = "tenants"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    slug = Column(String(100), unique=True, nullable=False, index=True)
    plan = Column(String(50), nullable=False, default="free")
    status = Column(String(50), nullable=False, default="active")
    settings = Column(JSON, default={})
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
```

**Add Tenant Context** (`backend/rag-compat/app/dependencies.py`):
```python
from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
import uuid

from .db import get_db
from .models.tenant import Tenant
from .models.user import User

async def get_current_tenant(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
) -> Tenant:
    """Extract tenant from current user's JWT token"""
    if not current_user.tenant_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="No tenant associated with user"
        )

    tenant = await db.get(Tenant, current_user.tenant_id)
    if not tenant or tenant.status != "active":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Tenant not found or inactive"
        )

    # Set PostgreSQL session variable for RLS
    await db.execute(
        f"SET app.current_tenant_id = '{tenant.id}'"
    )

    return tenant

# Use in routers:
# @router.get("/protected-resource")
# async def get_resource(
#     tenant: Tenant = Depends(get_current_tenant),
#     db: AsyncSession = Depends(get_db)
# ):
#     # All queries automatically filtered by RLS
#     results = await db.execute(select(Document))
#     return results.scalars().all()
```

**Update All Models** (add tenant_id):
```python
# Example for User model
from sqlalchemy import Column, ForeignKey
from sqlalchemy.dialects.postgresql import UUID

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), ForeignKey("tenants.id"), nullable=False, index=True)
    # ... other fields
```

#### Step 2.3: Update All Routers

**Add tenant dependency to protected endpoints**:
```python
# Before:
@router.get("/documents")
async def get_documents(db: AsyncSession = Depends(get_db)):
    return await db.execute(select(Document)).scalars().all()

# After:
@router.get("/documents")
async def get_documents(
    tenant: Tenant = Depends(get_current_tenant),
    db: AsyncSession = Depends(get_db)
):
    # RLS automatically filters by tenant_id
    return await db.execute(select(Document)).scalars().all()
```

#### Step 2.4: Test Multi-Tenant Isolation

**Create Test Script** (`tests/test_tenant_isolation.py`):
```python
import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_tenant_data_isolation(client: AsyncClient):
    # Create Tenant A
    tenant_a_token = await create_tenant_and_login("tenant-a")

    # Create Tenant B
    tenant_b_token = await create_tenant_and_login("tenant-b")

    # Tenant A creates document
    response = await client.post(
        "/api/documents",
        headers={"Authorization": f"Bearer {tenant_a_token}"},
        json={"title": "Secret Doc A"}
    )
    doc_a_id = response.json()["id"]

    # Tenant B should NOT see Tenant A's document
    response = await client.get(
        f"/api/documents/{doc_a_id}",
        headers={"Authorization": f"Bearer {tenant_b_token}"}
    )
    assert response.status_code == 404, "Tenant B should not access Tenant A's data"

    # Tenant A should see their own document
    response = await client.get(
        f"/api/documents/{doc_a_id}",
        headers={"Authorization": f"Bearer {tenant_a_token}"}
    )
    assert response.status_code == 200
    assert response.json()["title"] == "Secret Doc A"
```

**Expected Result**: ✅ Complete tenant isolation at database level

---

## 🧪 PHASE 3: Testing & Quality (Week 4-5)

### Step 3.1: Unit Test Framework

**Install Test Dependencies**:
```bash
cd backend/rag-compat
pip install pytest pytest-asyncio pytest-cov httpx
```

**Create Test Structure**:
```
tests/
├── unit/
│   ├── routers/
│   │   ├── test_auth.py
│   │   ├── test_bmad.py
│   │   ├── test_bolt.py
│   │   └── ...
│   ├── services/
│   │   ├── test_auth_service.py
│   │   ├── test_bmad_orchestrator.py
│   │   └── ...
│   └── models/
│       ├── test_user.py
│       ├── test_tenant.py
│       └── ...
├── integration/
│   ├── test_auth_flow.py
│   ├── test_bmad_workflow.py
│   └── test_bolt_workflow.py
├── e2e/
│   └── test_full_workflow.py
└── conftest.py
```

**Create Test Fixtures** (`tests/conftest.py`):
```python
import pytest
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from httpx import AsyncClient

@pytest.fixture
async def db_session():
    """Create test database session"""
    engine = create_async_engine("postgresql+asyncpg://postgres:test@localhost:5432/test_db")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSession(engine) as session:
        yield session

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

@pytest.fixture
async def client(db_session):
    """Create test HTTP client"""
    async with AsyncClient(app=app, base_url="http://test") as client:
        yield client

@pytest.fixture
async def test_tenant(db_session):
    """Create test tenant"""
    tenant = Tenant(name="Test Tenant", slug="test", plan="pro")
    db_session.add(tenant)
    await db_session.commit()
    return tenant

@pytest.fixture
async def test_user(db_session, test_tenant):
    """Create test user"""
    user = User(
        email="test@example.com",
        tenant_id=test_tenant.id,
        hashed_password=hash_password("password123")
    )
    db_session.add(user)
    await db_session.commit()
    return user
```

**Example Router Test** (`tests/unit/routers/test_auth.py`):
```python
import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_login_success(client: AsyncClient, test_user):
    response = await client.post(
        "/api/auth/login",
        json={"email": "test@example.com", "password": "password123"}
    )
    assert response.status_code == 200
    assert "access_token" in response.json()

@pytest.mark.asyncio
async def test_login_invalid_password(client: AsyncClient, test_user):
    response = await client.post(
        "/api/auth/login",
        json={"email": "test@example.com", "password": "wrong"}
    )
    assert response.status_code == 401

@pytest.mark.asyncio
async def test_protected_endpoint_requires_auth(client: AsyncClient):
    response = await client.get("/api/documents")
    assert response.status_code == 401
```

**Run Tests**:
```bash
# Run all tests
pytest tests/ -v

# Run with coverage
pytest tests/ --cov=app --cov-report=html

# View coverage report
open htmlcov/index.html
```

**Coverage Goal**: 80% (focus on critical paths first)

---

### Step 3.2: Integration Tests

**Example BMAD Workflow Test** (`tests/integration/test_bmad_workflow.py`):
```python
@pytest.mark.asyncio
async def test_bmad_agent_execution_flow(client: AsyncClient, auth_token):
    # 1. Create agent
    response = await client.post(
        "/api/bmad/agents",
        headers={"Authorization": f"Bearer {auth_token}"},
        json={
            "name": "Test Agent",
            "type": "assistant",
            "provider": "groq"
        }
    )
    agent_id = response.json()["id"]
    assert response.status_code == 201

    # 2. Execute agent task
    response = await client.post(
        f"/api/bmad/agents/{agent_id}/execute",
        headers={"Authorization": f"Bearer {auth_token}"},
        json={"prompt": "Hello, world!"}
    )
    assert response.status_code == 200
    assert "result" in response.json()

    # 3. Verify execution history
    response = await client.get(
        f"/api/bmad/agents/{agent_id}/history",
        headers={"Authorization": f"Bearer {auth_token}"}
    )
    assert response.status_code == 200
    assert len(response.json()) == 1
```

---

## 🔐 PHASE 4: Security Hardening (Week 5-6)

### Step 4.1: Dependency Scanning

**Install Security Tools**:
```bash
# Python
pip install safety bandit

# Node.js
npm install -g npm-audit-resolver

# Docker
# Install Trivy: https://aquasecurity.github.io/trivy/
```

**Run Security Scans**:
```bash
# Python dependencies
cd backend/rag-compat
safety check
bandit -r app/

# Node.js dependencies
cd frontend/archon-ui
npm audit
npm audit fix

# Docker images
trivy image iafactory-backend:latest
```

### Step 4.2: Secret Management

**Use Environment Variables (NOT in code)**:
```python
# ❌ BAD
API_KEY = "sk-1234567890abcdef"

# ✅ GOOD
import os
API_KEY = os.getenv("API_KEY")
if not API_KEY:
    raise ValueError("API_KEY environment variable not set")
```

**Use Secret Scanner**:
```bash
# Scan for accidentally committed secrets
trufflehog filesystem . --only-verified
```

### Step 4.3: Rate Limiting

**Already implemented** in `backend/rag-compat/app/security.py`

**Verify it works**:
```bash
# Send 100 requests rapidly
for i in {1..100}; do
  curl http://localhost:8180/health &
done

# Should see 429 Too Many Requests after hitting limit
```

### Step 4.4: Input Validation

**Add Pydantic models for all inputs**:
```python
from pydantic import BaseModel, validator, EmailStr

class UserCreateRequest(BaseModel):
    email: EmailStr
    password: str

    @validator('password')
    def password_strength(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        if not any(c.isupper() for c in v):
            raise ValueError('Password must contain uppercase letter')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain digit')
        return v
```

---

## 📊 PHASE 5: Monitoring & Observability (Week 6)

### Step 5.1: Structured Logging

**Install structlog**:
```bash
pip install structlog
```

**Configure** (`backend/rag-compat/app/logging_config.py`):
```python
import structlog

structlog.configure(
    processors=[
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.stdlib.add_log_level,
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.JSONRenderer()
    ],
    context_class=dict,
    logger_factory=structlog.stdlib.LoggerFactory(),
)

logger = structlog.get_logger()

# Usage:
logger.info("user_login", user_id=user.id, tenant_id=tenant.id, ip=request.client.host)
```

### Step 5.2: Error Tracking (Sentry)

**Install**:
```bash
pip install sentry-sdk[fastapi]
```

**Configure** (`backend/rag-compat/app/main.py`):
```python
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration

if settings.sentry_dsn:
    sentry_sdk.init(
        dsn=settings.sentry_dsn,
        integrations=[FastApiIntegration()],
        traces_sample_rate=0.1,  # 10% of transactions
        environment=settings.environment,
    )
```

### Step 5.3: Metrics & Dashboards

**Grafana Dashboard** (already configured in docker-compose.yml):
```bash
# Start monitoring stack
docker-compose --profile monitoring up -d

# Access Grafana
open http://localhost:8188
# Login: admin/admin

# Import dashboards from infrastructure/monitoring/grafana/dashboards/
```

---

## ✅ PHASE 6: Production Deployment Checklist

### Pre-Deployment
- [ ] All tests passing (unit + integration)
- [ ] Security scan clean (no critical vulnerabilities)
- [ ] Database backup created
- [ ] Environment variables configured (.env.prod)
- [ ] SSL certificates ready (Let's Encrypt)
- [ ] Domain DNS configured
- [ ] Monitoring dashboards configured
- [ ] Error tracking (Sentry) configured
- [ ] CI/CD pipeline working

### Deployment Steps (VPS/Cloud)
```bash
# 1. Clone repository on server
git clone <repo-url> /opt/iafactory
cd /opt/iafactory

# 2. Copy production environment
cp .env.prod.example .env.local
nano .env.local  # Edit with production values

# 3. Build images
docker-compose -f docker-compose.prod.yml build

# 4. Start services
docker-compose -f docker-compose.prod.yml up -d

# 5. Run migrations
docker exec iaf-dz-backend alembic upgrade head

# 6. Create first tenant
docker exec -it iaf-dz-backend python -c "
from app.models.tenant import Tenant
from app.db import SessionLocal
db = SessionLocal()
tenant = Tenant(name='Production Tenant', slug='prod', plan='enterprise')
db.add(tenant)
db.commit()
print(f'Tenant created: {tenant.id}')
"

# 7. Health check
./scripts/health-check.sh --wait

# 8. Set up automated backups (cron)
crontab -e
# Add: 0 2 * * * /opt/iafactory/scripts/db-backup.sh
```

### Post-Deployment
- [ ] Verify all services accessible
- [ ] Test user registration/login
- [ ] Test critical workflows (BMAD, Bolt)
- [ ] Verify tenant isolation
- [ ] Check logs for errors
- [ ] Verify metrics collection
- [ ] Set up alerting (PagerDuty/Slack)
- [ ] Document runbook procedures

---

## 🚨 Rollback Procedure

If deployment fails:
```bash
# 1. Stop new services
docker-compose down

# 2. Restore database from backup
gunzip < backups/pre_deployment_backup.sql.gz | \
  docker exec -i iaf-dz-postgres psql -U postgres iafactory_dz

# 3. Checkout previous commit
git checkout <previous-commit-sha>

# 4. Rebuild and restart
docker-compose build
docker-compose up -d

# 5. Verify rollback
./scripts/health-check.sh
```

---

## 📞 Support & Escalation

### Internal Team
- **DevOps Lead**: [Contact]
- **Backend Lead**: [Contact]
- **Security Lead**: [Contact]

### External Resources
- FastAPI Docs: https://fastapi.tiangolo.com
- PostgreSQL RLS: https://www.postgresql.org/docs/current/ddl-rowsecurity.html
- Docker Docs: https://docs.docker.com

---

## 📚 Next Steps After Recovery

1. **Week 7-8**: Implement API key reselling billing
2. **Week 9-10**: Performance optimization (caching, query tuning)
3. **Week 11-12**: Advanced features (webhooks, SSO, audit logs)

**Recovery Status**: 🟡 IN PROGRESS
**Last Updated**: 2025-11-24
