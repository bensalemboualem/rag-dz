# 🏢 Plan d'Implémentation Multi-Tenant (P0 CRITIQUE)

**Date**: 16 Décembre 2025
**Priorité**: P0 - BLOQUANT pour déploiement B2B
**Objectif**: Isolation complète des données par tenant_id

---

## 🎯 Contexte et Enjeux

### Pourquoi P0 Critique?
- **École en Algérie**: Besoin d'isoler les données de chaque établissement
- **Clients Professionnels Suisse**: Médecins, avocats, experts-comptables
- **Conformité**: RGPD, secret professionnel, données médicales
- **Sécurité**: Aucune fuite de données entre clients

### Use Cases Prioritaires
1. **École DZ**: Chaque établissement = 1 tenant
2. **Cabinet Médical CH**: Chaque cabinet = 1 tenant
3. **Cabinet d'Avocats CH**: Chaque étude = 1 tenant
4. **Expert-Comptable CH**: Chaque cabinet = 1 tenant

---

## 📐 Architecture Multi-Tenant

### Modèle Choisi: **Row-Level Security (RLS)**

**Avantages**:
- ✅ Base de données unique (simplicité opérationnelle)
- ✅ PostgreSQL natif (Row-Level Security)
- ✅ Scalable jusqu'à 1000+ tenants
- ✅ Isolation garantie au niveau DB

**vs. DB par tenant**: Trop complexe pour 30-100 clients

---

## 🗄️ Phase 1: Schéma Base de Données (3-4 jours)

### 1.1 Créer Table Tenants

```sql
-- backend/rag-compat/alembic/versions/001_create_tenants.py

CREATE TABLE tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(100) UNIQUE NOT NULL,  -- "ecole-ibn-khaldoun-alger"
    name VARCHAR(255) NOT NULL,          -- "École Ibn Khaldoun"
    type VARCHAR(50) NOT NULL,           -- "school", "medical", "legal", "accounting"
    country VARCHAR(2) NOT NULL,         -- "DZ", "CH", "FR"

    -- Abonnement
    plan VARCHAR(50) DEFAULT 'free',     -- "free", "pro", "enterprise"
    status VARCHAR(50) DEFAULT 'active', -- "active", "suspended", "trial"
    trial_ends_at TIMESTAMP,

    -- Contact
    admin_email VARCHAR(255) NOT NULL,
    admin_phone VARCHAR(50),

    -- Métadonnées
    settings JSONB DEFAULT '{}',         -- Config tenant (langue, timezone, etc.)
    metadata JSONB DEFAULT '{}',

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Index pour performance
CREATE INDEX idx_tenants_slug ON tenants(slug);
CREATE INDEX idx_tenants_status ON tenants(status);
CREATE INDEX idx_tenants_type ON tenants(type);
```

### 1.2 Ajouter tenant_id aux Tables Existantes

**Tables à modifier** (liste complète):

```sql
-- Knowledge Base (RAG)
ALTER TABLE knowledge_items ADD COLUMN tenant_id UUID REFERENCES tenants(id);
ALTER TABLE knowledge_crawl_progress ADD COLUMN tenant_id UUID REFERENCES tenants(id);

-- Voice (Transcriptions)
ALTER TABLE voice_transcriptions ADD COLUMN tenant_id UUID REFERENCES tenants(id);
ALTER TABLE voice_sessions ADD COLUMN tenant_id UUID REFERENCES tenants(id);

-- Projects & Tasks
ALTER TABLE projects ADD COLUMN tenant_id UUID REFERENCES tenants(id);
ALTER TABLE tasks ADD COLUMN tenant_id UUID REFERENCES tenants(id);
ALTER TABLE documents ADD COLUMN tenant_id UUID REFERENCES tenants(id);

-- Billing & Credits
ALTER TABLE billing_accounts ADD COLUMN tenant_id UUID REFERENCES tenants(id);
ALTER TABLE credit_transactions ADD COLUMN tenant_id UUID REFERENCES tenants(id);

-- CRM
ALTER TABLE crm_leads ADD COLUMN tenant_id UUID REFERENCES tenants(id);
ALTER TABLE crm_deals ADD COLUMN tenant_id UUID REFERENCES tenants(id);

-- Users (IMPORTANT: 1 user peut appartenir à plusieurs tenants)
CREATE TABLE tenant_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES tenants(id),
    user_id UUID NOT NULL REFERENCES users(id),
    role VARCHAR(50) DEFAULT 'member',  -- "owner", "admin", "member"
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(tenant_id, user_id)
);

-- Index pour performance
CREATE INDEX idx_knowledge_items_tenant ON knowledge_items(tenant_id);
CREATE INDEX idx_voice_transcriptions_tenant ON voice_transcriptions(tenant_id);
CREATE INDEX idx_projects_tenant ON projects(tenant_id);
CREATE INDEX idx_tenant_users_tenant ON tenant_users(tenant_id);
CREATE INDEX idx_tenant_users_user ON tenant_users(user_id);
```

### 1.3 Migration Alembic

```python
# backend/rag-compat/alembic/versions/002_add_tenant_id.py

"""Add tenant_id to all tables"""

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

def upgrade():
    # Créer table tenants
    op.create_table(
        'tenants',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('slug', sa.String(100), unique=True, nullable=False),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('type', sa.String(50), nullable=False),
        sa.Column('country', sa.String(2), nullable=False),
        sa.Column('plan', sa.String(50), default='free'),
        sa.Column('status', sa.String(50), default='active'),
        sa.Column('trial_ends_at', sa.TIMESTAMP),
        sa.Column('admin_email', sa.String(255), nullable=False),
        sa.Column('admin_phone', sa.String(50)),
        sa.Column('settings', postgresql.JSONB, default={}),
        sa.Column('metadata', postgresql.JSONB, default={}),
        sa.Column('created_at', sa.TIMESTAMP, default=sa.func.now()),
        sa.Column('updated_at', sa.TIMESTAMP, default=sa.func.now())
    )

    # Ajouter tenant_id aux tables
    tables_to_update = [
        'knowledge_items', 'knowledge_crawl_progress',
        'voice_transcriptions', 'voice_sessions',
        'projects', 'tasks', 'documents',
        'billing_accounts', 'credit_transactions',
        'crm_leads', 'crm_deals'
    ]

    for table in tables_to_update:
        op.add_column(table, sa.Column('tenant_id', postgresql.UUID(as_uuid=True)))
        op.create_foreign_key(
            f'fk_{table}_tenant_id',
            table, 'tenants',
            ['tenant_id'], ['id']
        )
        op.create_index(f'idx_{table}_tenant', table, ['tenant_id'])

    # Table tenant_users
    op.create_table(
        'tenant_users',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('tenant_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('role', sa.String(50), default='member'),
        sa.Column('created_at', sa.TIMESTAMP, default=sa.func.now())
    )

def downgrade():
    # Rollback complet si problème
    pass
```

---

## 🔐 Phase 2: Row-Level Security PostgreSQL (1-2 jours)

### 2.1 Activer RLS sur toutes les tables

```sql
-- backend/rag-compat/sql/enable_rls.sql

-- Activer RLS
ALTER TABLE knowledge_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_crawl_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE voice_transcriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
-- ... etc pour toutes les tables

-- Politique RLS: SELECT
CREATE POLICY tenant_isolation_select ON knowledge_items
    FOR SELECT
    USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

-- Politique RLS: INSERT
CREATE POLICY tenant_isolation_insert ON knowledge_items
    FOR INSERT
    WITH CHECK (tenant_id = current_setting('app.current_tenant_id')::UUID);

-- Politique RLS: UPDATE
CREATE POLICY tenant_isolation_update ON knowledge_items
    FOR UPDATE
    USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

-- Politique RLS: DELETE
CREATE POLICY tenant_isolation_delete ON knowledge_items
    FOR DELETE
    USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

-- Répéter pour TOUTES les tables avec tenant_id
```

### 2.2 Fonction pour SET tenant_id

```sql
-- Fonction pour définir le tenant courant
CREATE OR REPLACE FUNCTION set_current_tenant(tenant_uuid UUID)
RETURNS void AS $$
BEGIN
    PERFORM set_config('app.current_tenant_id', tenant_uuid::text, false);
END;
$$ LANGUAGE plpgsql;

-- Utilisation:
-- SELECT set_current_tenant('550e8400-e29b-41d4-a716-446655440000');
```

---

## 🐍 Phase 3: Backend FastAPI (2-3 jours)

### 3.1 Middleware Tenant Context

```python
# backend/rag-compat/app/middleware/tenant_middleware.py

from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
import logging

logger = logging.getLogger(__name__)

class TenantContextMiddleware(BaseHTTPMiddleware):
    """
    Middleware pour extraire tenant_id du JWT et le stocker en contexte
    """

    async def dispatch(self, request: Request, call_next):
        # Extraire tenant_id du JWT
        tenant_id = self._extract_tenant_from_jwt(request)

        if not tenant_id:
            # Endpoints publics sans tenant
            if request.url.path.startswith("/api/auth") or request.url.path == "/health":
                return await call_next(request)

            logger.warning(f"No tenant_id in request: {request.url.path}")
            raise HTTPException(status_code=403, detail="Tenant ID required")

        # Stocker en contexte request
        request.state.tenant_id = tenant_id

        # Appeler le endpoint
        response = await call_next(request)

        return response

    def _extract_tenant_from_jwt(self, request: Request) -> str | None:
        """
        Extrait tenant_id du JWT token

        Format JWT payload:
        {
            "sub": "user_id",
            "tenant_id": "550e8400-e29b-41d4-a716-446655440000",
            "tenant_slug": "ecole-ibn-khaldoun",
            "role": "admin"
        }
        """
        # Récupérer token depuis header Authorization
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return None

        token = auth_header.split(" ")[1]

        # Décoder JWT (utiliser existing auth logic)
        try:
            from ..security import decode_access_token
            payload = decode_access_token(token)
            return payload.get("tenant_id")
        except Exception as e:
            logger.error(f"Error decoding JWT: {e}")
            return None
```

### 3.2 Database Session avec Tenant ID

```python
# backend/rag-compat/app/database.py

from sqlalchemy import create_engine, event
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from contextvars import ContextVar
import logging

logger = logging.getLogger(__name__)

# Context var pour stocker tenant_id
current_tenant_id: ContextVar[str] = ContextVar("current_tenant_id", default=None)

# Engine PostgreSQL
DATABASE_URL = "postgresql+asyncpg://user:pass@localhost/iafactory"
engine = create_async_engine(DATABASE_URL, echo=False, future=True)

# Session maker
async_session = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

async def get_db_session() -> AsyncSession:
    """
    Retourne une session DB avec tenant_id configuré via RLS
    """
    async with async_session() as session:
        tenant_id = current_tenant_id.get()

        if tenant_id:
            # SET PostgreSQL session variable pour RLS
            await session.execute(
                f"SELECT set_config('app.current_tenant_id', '{tenant_id}', false)"
            )
            logger.debug(f"DB session configured with tenant_id={tenant_id}")

        yield session

# Event listener pour auto-set tenant_id sur INSERT
@event.listens_for(AsyncSession, "before_flush")
def receive_before_flush(session, flush_context, instances):
    """
    Avant chaque flush, auto-assigner tenant_id aux nouveaux objets
    """
    tenant_id = current_tenant_id.get()

    if not tenant_id:
        return

    for instance in session.new:
        if hasattr(instance, 'tenant_id') and instance.tenant_id is None:
            instance.tenant_id = tenant_id
```

### 3.3 Dependency Injection pour Tenant

```python
# backend/rag-compat/app/dependencies.py

from fastapi import Request, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from .database import get_db_session, current_tenant_id
import logging

logger = logging.getLogger(__name__)

def get_current_tenant_id(request: Request) -> str:
    """
    Extrait tenant_id du contexte de la requête

    Usage:
        @router.get("/api/knowledge")
        async def list_knowledge(tenant_id: str = Depends(get_current_tenant_id)):
            # tenant_id automatiquement injecté
    """
    tenant_id = getattr(request.state, "tenant_id", None)

    if not tenant_id:
        logger.error("No tenant_id in request state")
        raise HTTPException(status_code=403, detail="Tenant context required")

    # Stocker en ContextVar pour DB session
    current_tenant_id.set(tenant_id)

    return tenant_id

async def get_current_tenant(
    tenant_id: str = Depends(get_current_tenant_id),
    db: AsyncSession = Depends(get_db_session)
):
    """
    Récupère l'objet Tenant complet

    Usage:
        @router.get("/api/settings")
        async def get_settings(tenant = Depends(get_current_tenant)):
            return tenant.settings
    """
    from .models.tenant import Tenant

    tenant = await db.get(Tenant, tenant_id)

    if not tenant:
        raise HTTPException(status_code=404, detail="Tenant not found")

    if tenant.status != "active":
        raise HTTPException(status_code=403, detail=f"Tenant {tenant.status}")

    return tenant
```

### 3.4 Modifier tous les Routers

**Exemple: Knowledge Router**

```python
# backend/rag-compat/app/routers/knowledge.py

from fastapi import APIRouter, Depends
from ..dependencies import get_current_tenant_id
from ..database import get_db_session

router = APIRouter(prefix="/api/knowledge")

@router.post("/")
async def create_knowledge(
    payload: KnowledgeCreate,
    tenant_id: str = Depends(get_current_tenant_id),  # 🆕 Tenant injection
    db: AsyncSession = Depends(get_db_session)
):
    """
    Créer une nouvelle knowledge base

    tenant_id est automatiquement:
    1. Extrait du JWT par TenantContextMiddleware
    2. Injecté par get_current_tenant_id()
    3. Configuré dans la DB session (RLS)
    """
    knowledge = KnowledgeItem(
        title=payload.title,
        url=payload.url,
        # tenant_id est auto-assigné par before_flush event
    )

    db.add(knowledge)
    await db.commit()

    return knowledge

@router.get("/")
async def list_knowledge(
    tenant_id: str = Depends(get_current_tenant_id),  # 🆕 Tenant injection
    db: AsyncSession = Depends(get_db_session)
):
    """
    Liste toutes les knowledge bases DU TENANT

    RLS garantit qu'on ne voit que les données du tenant
    """
    from sqlalchemy import select
    from ..models.knowledge import KnowledgeItem

    result = await db.execute(
        select(KnowledgeItem)
        # Pas besoin de .filter(KnowledgeItem.tenant_id == tenant_id)
        # RLS le fait automatiquement!
    )

    return result.scalars().all()
```

---

## 🔑 Phase 4: Authentication & JWT (1 jour)

### 4.1 Modifier JWT Payload

```python
# backend/rag-compat/app/security.py

from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from typing import Optional

SECRET_KEY = "your-secret-key-from-env"
ALGORITHM = "HS256"

def create_access_token(
    user_id: str,
    tenant_id: str,           # 🆕 Tenant ID
    tenant_slug: str,         # 🆕 Tenant slug
    role: str = "member",     # 🆕 Role dans le tenant
    expires_delta: Optional[timedelta] = None
):
    """
    Créer un JWT avec tenant_id
    """
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(hours=24)

    payload = {
        "sub": user_id,
        "tenant_id": tenant_id,
        "tenant_slug": tenant_slug,
        "role": role,
        "exp": expire,
        "iat": datetime.utcnow()
    }

    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def decode_access_token(token: str) -> dict:
    """
    Décoder JWT et extraire tenant_id
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError as e:
        raise HTTPException(status_code=401, detail="Invalid token")
```

### 4.2 Login avec Sélection Tenant

```python
# backend/rag-compat/app/routers/auth.py

@router.post("/login")
async def login(
    credentials: LoginCredentials,
    db: AsyncSession = Depends(get_db_session)
):
    """
    Login utilisateur

    Si l'utilisateur appartient à plusieurs tenants, retourner la liste
    pour qu'il choisisse
    """
    # Vérifier email/password
    user = await authenticate_user(credentials.email, credentials.password, db)

    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Récupérer tenants de l'utilisateur
    tenants = await db.execute(
        select(TenantUser, Tenant)
        .join(Tenant)
        .filter(TenantUser.user_id == user.id)
    )
    user_tenants = tenants.all()

    if len(user_tenants) == 0:
        raise HTTPException(status_code=403, detail="No tenant assigned")

    if len(user_tenants) == 1:
        # 1 seul tenant: auto-select
        tenant_user, tenant = user_tenants[0]

        token = create_access_token(
            user_id=user.id,
            tenant_id=tenant.id,
            tenant_slug=tenant.slug,
            role=tenant_user.role
        )

        return {
            "access_token": token,
            "token_type": "bearer",
            "tenant": {
                "id": tenant.id,
                "slug": tenant.slug,
                "name": tenant.name
            }
        }

    else:
        # Plusieurs tenants: retourner liste pour sélection
        return {
            "requires_tenant_selection": True,
            "tenants": [
                {
                    "id": t.id,
                    "slug": t.slug,
                    "name": t.name,
                    "role": tu.role
                }
                for tu, t in user_tenants
            ],
            "user_id": user.id
        }

@router.post("/select-tenant")
async def select_tenant(
    payload: TenantSelection,
    db: AsyncSession = Depends(get_db_session)
):
    """
    Sélectionner un tenant après login (si plusieurs tenants)
    """
    # Vérifier que user appartient bien à ce tenant
    tenant_user = await db.execute(
        select(TenantUser, Tenant)
        .join(Tenant)
        .filter(
            TenantUser.user_id == payload.user_id,
            TenantUser.tenant_id == payload.tenant_id
        )
    )
    result = tenant_user.first()

    if not result:
        raise HTTPException(status_code=403, detail="Unauthorized tenant")

    tenant_user, tenant = result

    token = create_access_token(
        user_id=payload.user_id,
        tenant_id=tenant.id,
        tenant_slug=tenant.slug,
        role=tenant_user.role
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "tenant": {
            "id": tenant.id,
            "slug": tenant.slug,
            "name": tenant.name
        }
    }
```

---

## 🧪 Phase 5: Tests d'Isolation (2 jours)

### 5.1 Tests Unitaires

```python
# backend/rag-compat/tests/test_tenant_isolation.py

import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_tenant_isolation_knowledge():
    """
    Test: Un tenant ne peut pas voir les knowledge d'un autre tenant
    """
    # Créer 2 tenants
    tenant1 = await create_test_tenant("ecole-alger")
    tenant2 = await create_test_tenant("ecole-oran")

    # Créer knowledge pour tenant1
    token1 = create_access_token(user_id="user1", tenant_id=tenant1.id)

    async with AsyncClient() as client:
        response = await client.post(
            "/api/knowledge",
            headers={"Authorization": f"Bearer {token1}"},
            json={"title": "Secret Alger", "url": "https://example.com"}
        )
        assert response.status_code == 200

    # Tenter de lire avec tenant2
    token2 = create_access_token(user_id="user2", tenant_id=tenant2.id)

    async with AsyncClient() as client:
        response = await client.get(
            "/api/knowledge",
            headers={"Authorization": f"Bearer {token2}"}
        )
        knowledge_list = response.json()

        # tenant2 ne doit PAS voir "Secret Alger"
        assert len(knowledge_list) == 0
        assert not any(k["title"] == "Secret Alger" for k in knowledge_list)

@pytest.mark.asyncio
async def test_rls_prevents_cross_tenant_insert():
    """
    Test: Impossible d'insérer avec un tenant_id différent
    """
    tenant1 = await create_test_tenant("ecole-alger")
    tenant2 = await create_test_tenant("ecole-oran")

    token1 = create_access_token(user_id="user1", tenant_id=tenant1.id)

    async with AsyncClient() as client:
        # Tenter d'insérer avec tenant_id=tenant2 alors que JWT=tenant1
        response = await client.post(
            "/api/knowledge",
            headers={"Authorization": f"Bearer {token1}"},
            json={
                "title": "Hack",
                "tenant_id": tenant2.id  # ❌ Devrait échouer
            }
        )

        # RLS doit bloquer
        assert response.status_code in [403, 422]
```

### 5.2 Tests d'Intégration

```bash
# Script de test manuel

# 1. Créer 2 tenants
curl -X POST http://localhost:3000/api/admin/tenants \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "ecole-alger",
    "name": "École Alger",
    "type": "school",
    "country": "DZ",
    "admin_email": "admin@ecole-alger.dz"
  }'

curl -X POST http://localhost:3000/api/admin/tenants \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "ecole-oran",
    "name": "École Oran",
    "type": "school",
    "country": "DZ",
    "admin_email": "admin@ecole-oran.dz"
  }'

# 2. Login tenant1
TOKEN1=$(curl -X POST http://localhost:3000/api/auth/login \
  -d '{"email":"admin@ecole-alger.dz","password":"test123"}' \
  | jq -r '.access_token')

# 3. Créer knowledge pour tenant1
curl -X POST http://localhost:3000/api/knowledge \
  -H "Authorization: Bearer $TOKEN1" \
  -d '{"title":"Secret Alger","url":"https://example.com"}'

# 4. Login tenant2
TOKEN2=$(curl -X POST http://localhost:3000/api/auth/login \
  -d '{"email":"admin@ecole-oran.dz","password":"test123"}' \
  | jq -r '.access_token')

# 5. Lister knowledge avec tenant2 (doit être vide)
curl http://localhost:3000/api/knowledge \
  -H "Authorization: Bearer $TOKEN2"

# Résultat attendu: []
```

---

## 📋 Checklist de Déploiement

### Avant Production

- [ ] Toutes les tables ont tenant_id
- [ ] RLS activé sur toutes les tables
- [ ] Migration Alembic testée (up + down)
- [ ] Middleware TenantContext activé
- [ ] JWT inclut tenant_id
- [ ] Tests d'isolation passent à 100%
- [ ] Pas de régression sur endpoints existants
- [ ] Documentation API mise à jour
- [ ] Script de création tenant admin
- [ ] Monitoring tenant_id dans logs

### Migration Données Existantes

```sql
-- Script de migration pour données existantes
-- À exécuter AVANT d'activer RLS

-- 1. Créer tenant par défaut pour données existantes
INSERT INTO tenants (id, slug, name, type, country, admin_email)
VALUES (
    'ffffffff-ffff-ffff-ffff-ffffffffffff',
    'legacy-data',
    'Legacy Data (à migrer)',
    'school',
    'DZ',
    'admin@iafactoryalgeria.com'
);

-- 2. Assigner toutes les données existantes au tenant legacy
UPDATE knowledge_items
SET tenant_id = 'ffffffff-ffff-ffff-ffff-ffffffffffff'
WHERE tenant_id IS NULL;

UPDATE voice_transcriptions
SET tenant_id = 'ffffffff-ffff-ffff-ffff-ffffffffffff'
WHERE tenant_id IS NULL;

-- Répéter pour toutes les tables...

-- 3. Rendre tenant_id NOT NULL (après migration)
ALTER TABLE knowledge_items ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE voice_transcriptions ALTER COLUMN tenant_id SET NOT NULL;
-- etc.
```

---

## 🚀 Roadmap d'Implémentation

### Semaine 1 (Jours 1-3)
- ✅ Créer table tenants
- ✅ Ajouter tenant_id à toutes les tables
- ✅ Migration Alembic
- ✅ Activer RLS sur 3 tables prioritaires (knowledge, voice, projects)

### Semaine 1 (Jours 4-5)
- ✅ Middleware TenantContext
- ✅ Database session avec RLS
- ✅ Dependencies get_current_tenant_id
- ✅ Modifier 5 routers prioritaires (knowledge, voice, projects, billing, crm)

### Semaine 2 (Jours 6-8)
- ✅ Tests d'isolation (unitaires + intégration)
- ✅ Login avec sélection tenant
- ✅ Modifier tous les routers restants
- ✅ Documentation

### Semaine 2 (Jours 9-10)
- ✅ Tests en staging
- ✅ Migration données existantes
- ✅ Déploiement production
- ✅ Monitoring

---

## 🔍 Points de Vigilance

### Sécurité
- ⚠️ **Vérifier JWT**: Ne JAMAIS faire confiance à tenant_id dans le body/query, toujours depuis JWT
- ⚠️ **RLS obligatoire**: Si RLS désactivé, data leak catastrophique
- ⚠️ **Logs sanitized**: Ne pas logger tenant_id dans logs publics

### Performance
- ⚠️ **Index tenant_id**: TOUTES les tables doivent avoir index sur tenant_id
- ⚠️ **Connection pooling**: 1 pool par tenant si >100 tenants actifs
- ⚠️ **Cache**: Invalider cache par tenant_id

### Migration
- ⚠️ **Backup DB**: Backup complet avant migration
- ⚠️ **Rollback plan**: Tester downgrade Alembic
- ⚠️ **Données orphelines**: Vérifier que toutes les données ont tenant_id

---

## 📞 Support et Questions

**En cas de blocage**:
1. Check logs: `docker-compose logs -f backend`
2. Vérifier RLS: `SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';`
3. Debug tenant_id: `SELECT current_setting('app.current_tenant_id', true);`

**Contact**:
- Tech Lead: [votre email]
- Documentation: `/docs/multi-tenant.md`

---

**Créé le**: 16 Décembre 2025
**Par**: Claude Code (Sonnet 4.5)
**Priorité**: P0 - BLOQUANT POUR DÉPLOIEMENT
**Estimation**: 10 jours de dev + 2 jours de tests
