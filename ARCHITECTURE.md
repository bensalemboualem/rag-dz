# IAFactory RAG-DZ - System Architecture

**Version**: 2.0.0
**Last Updated**: 2025-11-24
**Status**: 🚧 In Development (Production-Ready by Week 6)

---

## 🎯 System Overview

### Mission
IAFactory is a **sovereign AI platform** for Algeria, providing:
- **Multi-tenant B2B SaaS** for AI-powered document processing
- **BMAD** (Business Multi-Agent Development) orchestration
- **Bolt-DIY** AI code editor integration
- **Archon** unified dashboard for AI workflows
- **RAG** (Retrieval-Augmented Generation) with Arabic/French/English support

### Key Differentiators
1. **Data Sovereignty**: All data stays in Algeria (timezone: Africa/Algiers)
2. **Multilingual**: Native Arabic, French, English support
3. **Cost-Optimized**: Uses Groq (free), DeepSeek, local Ollama
4. **Multi-Tenant**: Secure tenant isolation (Row-Level Security)
5. **Modular**: Microservices-ready architecture

---

## 🏗️ High-Level Architecture (C4 Level 1 - System Context)

```
┌─────────────────────────────────────────────────────────────┐
│                     External Systems                        │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Groq    │  │ OpenAI   │  │ Anthropic│  │ DeepSeek │   │
│  │   LLM    │  │   API    │  │   API    │  │   API    │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Twilio  │  │  Google  │  │  Vapi.ai │  │  Stripe  │   │
│  │SMS/WhatsApp  │ Calendar │  │  Voice   │  │ Payments │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ▲
                            │ HTTPS/REST
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   IAFactory Platform                        │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Frontend Layer (React)                  │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐          │  │
│  │  │ Archon   │  │ RAG-UI   │  │ Bolt-DIY │          │  │
│  │  │   Hub    │  │   Docs   │  │  Studio  │          │  │
│  │  │ :8182    │  │  :8183   │  │  :8184   │          │  │
│  │  └──────────┘  └──────────┘  └──────────┘          │  │
│  └──────────────────────────────────────────────────────┘  │
│                            ▲                                │
│                            │ REST API / WebSocket           │
│                            ▼                                │
│  ┌──────────────────────────────────────────────────────┐  │
│  │            Backend API (FastAPI :8180)               │  │
│  │  ┌────────────────────────────────────────────────┐ │  │
│  │  │  21 Routers (Auth, RAG, BMAD, Bolt, Voice...)  │ │  │
│  │  └────────────────────────────────────────────────┘ │  │
│  │  ┌────────────────────────────────────────────────┐ │  │
│  │  │  9 Services (Orchestration, Coordination...)   │ │  │
│  │  └────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────┘  │
│                            ▲                                │
│                            │                                │
│                            ▼                                │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Data Layer                              │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐          │  │
│  │  │PostgreSQL│  │  Redis   │  │  Qdrant  │          │  │
│  │  │ +PGVector│  │  Cache   │  │  Vector  │          │  │
│  │  │  :6330   │  │  :6331   │  │  :6332   │          │  │
│  │  └──────────┘  └──────────┘  └──────────┘          │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Orchestration & Monitoring                   │  │
│  │  ┌──────────┐  ┌───────────┐  ┌──────────┐         │  │
│  │  │   n8n    │  │Prometheus │  │ Grafana  │         │  │
│  │  │Workflows │  │  Metrics  │  │Dashboard │         │  │
│  │  │  :8185   │  │  :8187    │  │  :8188   │         │  │
│  │  └──────────┘  └───────────┘  └──────────┘         │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ▲
                            │ Access
                            ▼
                      ┌──────────┐
                      │  Users   │
                      │ (Tenants)│
                      └──────────┘
```

---

## 🔧 Component Architecture (C4 Level 2 - Container Diagram)

### Backend API Components

```
FastAPI Application (:8180)
│
├── Middleware Layer
│   ├── RequestIDMiddleware (X-Request-Id tracking)
│   ├── EnhancedAuthMiddleware (JWT + API keys)
│   ├── RateLimitMiddleware (Redis-backed rate limiting)
│   └── CORSMiddleware (Cross-origin security)
│
├── Router Layer (21 Routers)
│   ├── /api/auth              → Authentication & registration
│   ├── /api/test              → Health checks
│   ├── /api/upload            → Document upload
│   ├── /api/query             → RAG queries
│   ├── /api/knowledge         → Knowledge base management
│   ├── /api/bmad              → BMAD agent management
│   ├── /api/bmad-chat         → BMAD chat interface
│   ├── /api/bmad-orchestration→ BMAD workflow orchestration
│   ├── /api/coordination      → Multi-agent coordination
│   ├── /api/orchestrator      → General orchestration
│   ├── /api/bolt              → Bolt-DIY integration
│   ├── /api/agent-chat        → Generic agent chat
│   ├── /api/calendar          → Calendar management
│   ├── /api/voice             → Vapi.ai voice agent
│   ├── /api/google            → Google Calendar/Gmail
│   ├── /api/email-agent       → Email agent (6th agent)
│   ├── /api/twilio            → Twilio SMS
│   ├── /api/whatsapp          → WhatsApp Business
│   ├── /api/user-keys         → API key reselling
│   ├── /api/studio-video      → Creative studio
│   └── /api/rag-public        → Public RAG API for Bolt
│
├── Service Layer (9 Core Services)
│   ├── AuthService            → User authentication & JWT
│   ├── BMADOrchestrator       → BMAD multi-agent orchestration
│   ├── BoltWorkflowService    → Bolt workflow management
│   ├── BoltZipService         → Bolt project packaging
│   ├── OrchestratorService    → General task orchestration
│   ├── ProjectCoordinator     → Multi-project coordination
│   ├── UserKeyService         → API key management & billing
│   ├── WhatsAppService        → WhatsApp messaging
│   └── EmailAgentService      → Email automation
│
├── Client Layer (External Integrations)
│   ├── LLMClient              → Multi-provider LLM (Groq, OpenAI, etc.)
│   ├── EmbeddingsClient       → Multilingual embeddings
│   ├── PGVectorClient         → Vector search in PostgreSQL
│   ├── QdrantClient           → Alternative vector DB
│   ├── RerankingClient        → Result reranking
│   ├── DocumentParser         → PDF/DOCX/etc parsing
│   ├── WebCrawler             → Web scraping
│   └── SupabaseClient         → Optional cloud storage
│
└── Data Layer
    ├── PostgreSQL             → Primary database + vectors
    ├── Redis                  → Cache + rate limiting
    └── Qdrant                 → Alternative vector storage
```

---

## 🗄️ Database Schema (Core Tables)

### Multi-Tenant Core

```sql
-- Tenant isolation
tenants (
    id UUID PRIMARY KEY,
    name VARCHAR(255),
    slug VARCHAR(100) UNIQUE,
    plan VARCHAR(50),  -- free, pro, enterprise
    status VARCHAR(50),  -- active, suspended, cancelled
    settings JSONB,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
)

-- Users belong to tenants
users (
    id UUID PRIMARY KEY,
    tenant_id UUID → tenants.id,
    email VARCHAR(255) UNIQUE,
    hashed_password VARCHAR(255),
    role VARCHAR(50),  -- admin, user, tenant_admin
    created_at TIMESTAMP
)
```

### RAG & Knowledge Base

```sql
knowledge_bases (
    id UUID PRIMARY KEY,
    tenant_id UUID → tenants.id,
    name VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP
)

documents (
    id UUID PRIMARY KEY,
    tenant_id UUID → tenants.id,
    knowledge_base_id UUID → knowledge_bases.id,
    filename VARCHAR(255),
    content_type VARCHAR(100),
    storage_path TEXT,
    metadata JSONB,
    created_at TIMESTAMP
)

embeddings (
    id UUID PRIMARY KEY,
    tenant_id UUID → tenants.id,
    document_id UUID → documents.id,
    chunk_text TEXT,
    embedding VECTOR(768),  -- PGVector
    metadata JSONB,
    created_at TIMESTAMP
)

-- Vector search index
CREATE INDEX embeddings_vector_idx ON embeddings
USING ivfflat (embedding vector_cosine_ops);
```

### BMAD Workflows

```sql
bmad_agents (
    id UUID PRIMARY KEY,
    tenant_id UUID → tenants.id,
    name VARCHAR(255),
    type VARCHAR(50),  -- assistant, researcher, coder, etc.
    provider VARCHAR(50),  -- groq, openai, anthropic
    config JSONB,
    created_at TIMESTAMP
)

bmad_workflows (
    id UUID PRIMARY KEY,
    tenant_id UUID → tenants.id,
    name VARCHAR(255),
    agents JSONB[],  -- Array of agent references
    status VARCHAR(50),
    created_at TIMESTAMP
)

bmad_executions (
    id UUID PRIMARY KEY,
    tenant_id UUID → tenants.id,
    workflow_id UUID → bmad_workflows.id,
    input JSONB,
    output JSONB,
    status VARCHAR(50),
    duration_ms INTEGER,
    created_at TIMESTAMP
)
```

### API Key Reselling

```sql
user_keys (
    id UUID PRIMARY KEY,
    tenant_id UUID → tenants.id,
    user_id UUID → users.id,
    key_hash VARCHAR(255),
    name VARCHAR(255),
    scopes JSONB,  -- Allowed endpoints
    rate_limit_per_minute INTEGER,
    usage_count INTEGER DEFAULT 0,
    expires_at TIMESTAMP,
    created_at TIMESTAMP
)

api_usage_logs (
    id UUID PRIMARY KEY,
    tenant_id UUID → tenants.id,
    user_key_id UUID → user_keys.id,
    endpoint VARCHAR(255),
    method VARCHAR(10),
    status_code INTEGER,
    response_time_ms INTEGER,
    created_at TIMESTAMP
)
```

---

## 🔒 Security Architecture

### Authentication Flow

```
1. User → POST /api/auth/login {email, password}
2. Backend → Verify password (bcrypt)
3. Backend → Generate JWT token (HS256)
   {
     "sub": "user_email",
     "user_id": "uuid",
     "tenant_id": "tenant_uuid",
     "role": "user",
     "exp": 1700000000
   }
4. Backend → Return {access_token, token_type: "bearer"}
5. User → Include in headers: Authorization: Bearer <token>
```

### Multi-Tenant Isolation (Row-Level Security)

```sql
-- Every table has tenant_id column
-- PostgreSQL RLS policy enforces isolation

CREATE POLICY tenant_isolation_policy ON documents
    USING (tenant_id = current_setting('app.current_tenant_id')::UUID);

-- Set tenant context per request
SET app.current_tenant_id = '<tenant_uuid>';

-- All queries automatically filtered:
SELECT * FROM documents;  -- Returns only current tenant's docs
```

### Rate Limiting

**Implemented in** `backend/rag-compat/app/security.py`

```python
# Global rate limits
60 requests/minute per IP
1000 requests/hour per IP

# API key rate limits (custom per key)
user_keys.rate_limit_per_minute

# Implementation: Redis sliding window
INCR rate_limit:{ip}:{window}
EXPIRE rate_limit:{ip}:{window} 60
```

---

## 🚀 Deployment Architecture

### Local Development (Docker Compose)

```
Port Allocation (8180-8191):
├── 8180 → Backend API (FastAPI)
├── 8181 → (Reserved)
├── 8182 → Archon Hub UI
├── 8183 → RAG Docs UI
├── 8184 → Bolt-DIY Studio
├── 8185 → n8n Workflows
├── 8186 → Ollama (local models)
├── 8187 → Prometheus
└── 8188 → Grafana

Database Ports (6330-6339):
├── 6330 → PostgreSQL (mapped from 5432)
├── 6331 → Redis (mapped from 6379)
└── 6332 → Qdrant (mapped from 6333)
```

### Production (VPS/Cloud)

```
Internet
    │
    ▼
Cloudflare/CDN (SSL termination)
    │
    ▼
Nginx Reverse Proxy (:80, :443)
    │
    ├─→ /api/*         → Backend API (:8180)
    ├─→ /hub/*         → Archon Hub (:8182)
    ├─→ /docs/*        → RAG-UI (:8183)
    └─→ /studio/*      → Bolt-DIY (:8184)
    │
    ▼
Docker Swarm / Kubernetes (optional)
    │
    ├─→ Backend Pod (3 replicas)
    ├─→ Frontend Pods (2 replicas each)
    └─→ Database Cluster (HA PostgreSQL)
```

**Recommended Stack**:
- **VPS**: Hetzner/DigitalOcean (Germany for GDPR)
- **CDN**: Cloudflare (DDoS protection + caching)
- **SSL**: Let's Encrypt (automatic renewal)
- **Orchestration**: Docker Compose (simple) or Coolify (auto-deploy)

---

## 📊 Data Flow Diagrams

### RAG Query Flow

```
User Query: "What is the capital of Algeria?"
    │
    ▼
Frontend → POST /api/query {"query": "..."}
    │
    ▼
Backend Router (query.py)
    │
    ├─→ Check tenant_id (from JWT)
    ├─→ Rate limit check (Redis)
    └─→ Call HybridSearchService
        │
        ├─→ Generate query embedding (EmbeddingsClient)
        │   └─→ sentence-transformers/paraphrase-multilingual-mpnet
        │
        ├─→ Vector search (PGVectorClient)
        │   └─→ SELECT * FROM embeddings
        │       WHERE tenant_id = :tenant_id
        │       ORDER BY embedding <=> :query_embedding
        │       LIMIT 10
        │
        ├─→ Reranking (RerankingClient)
        │   └─→ cross-encoder/ms-marco-MiniLM-L-6-v2
        │
        ├─→ LLM generation (LLMClient)
        │   └─→ Groq: llama-3.3-70b-versatile
        │       Prompt: "Answer based on: {context}"
        │
        └─→ Return response + citations
            │
            ▼
        Frontend displays answer + sources
```

### BMAD Workflow Execution

```
User: "Create a workflow with 3 agents"
    │
    ▼
POST /api/bmad/workflows/execute
    │
    ▼
BMADOrchestrator.execute()
    │
    ├─→ Agent 1 (Researcher)
    │   ├─→ LLMClient.generate(provider="groq")
    │   └─→ Result: research_data
    │
    ├─→ Agent 2 (Analyzer) [depends on Agent 1]
    │   ├─→ Input: research_data
    │   ├─→ LLMClient.generate(provider="deepseek")
    │   └─→ Result: analysis
    │
    └─→ Agent 3 (Writer) [depends on Agent 2]
        ├─→ Input: analysis
        ├─→ LLMClient.generate(provider="openai")
        └─→ Result: final_report
        │
        ▼
    Store in bmad_executions table
    Return final_report to user
```

---

## 🔄 API Design Patterns

### RESTful Endpoints

```
Resource-based naming:
GET    /api/documents          → List all (tenant-scoped)
POST   /api/documents          → Create new
GET    /api/documents/{id}     → Get specific
PUT    /api/documents/{id}     → Update
DELETE /api/documents/{id}     → Delete

Nested resources:
GET /api/knowledge-bases/{kb_id}/documents
POST /api/agents/{agent_id}/execute

Query parameters:
GET /api/documents?page=1&limit=10&sort=created_at&order=desc

Response format:
{
  "status": "success",
  "data": {...},
  "meta": {"page": 1, "total": 100}
}
```

### WebSocket (Real-time)

```
Connect: ws://localhost:8180/ws?token=<jwt>

Events:
→ {"type": "subscribe", "channel": "agent_status"}
← {"type": "agent_update", "agent_id": "...", "status": "running"}

→ {"type": "chat_message", "message": "Hello"}
← {"type": "chat_response", "message": "Hi!", "agent": "assistant"}
```

---

## 📈 Performance Targets

| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| API Response Time (p50) | ~300ms | <100ms | 🟡 |
| API Response Time (p95) | ~800ms | <200ms | 🟡 |
| RAG Query Latency | ~2s | <1s | 🟡 |
| Database Queries/sec | ~100 | >1000 | ⚪ |
| Concurrent Users | ~50 | >500 | ⚪ |
| Uptime (30d) | N/A | 99.9% | ⚪ |

**Optimization Strategies**:
1. **Caching**: Redis for embeddings, LLM responses (TTL: 1h)
2. **Connection Pooling**: PostgreSQL (max 20 connections)
3. **Async I/O**: FastAPI async endpoints for all DB calls
4. **Load Balancing**: Multiple backend replicas (Round Robin)
5. **CDN**: Static assets (JS/CSS/images) on Cloudflare

---

## 🧩 Module Integration Map

```
                    ┌─────────────┐
                    │   Archon    │ (Main Dashboard)
                    │  (React UI) │
                    └──────┬──────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
    ┌──────────┐     ┌──────────┐    ┌──────────┐
    │ RAG-UI   │     │   BMAD   │    │   Bolt   │
    │ (Docs)   │     │ (Agents) │    │ (Studio) │
    └────┬─────┘     └────┬─────┘    └────┬─────┘
         │                │                │
         └────────────────┼────────────────┘
                          │
                          ▼
                  ┌───────────────┐
                  │  Backend API  │
                  │   (FastAPI)   │
                  └───────┬───────┘
                          │
          ┌───────────────┼───────────────┐
          │               │               │
          ▼               ▼               ▼
    ┌──────────┐    ┌──────────┐   ┌──────────┐
    │PostgreSQL│    │  Redis   │   │  Qdrant  │
    └──────────┘    └──────────┘   └──────────┘
```

**Communication**:
- **Frontend ↔ Backend**: REST API + WebSocket
- **Backend ↔ Databases**: SQLAlchemy (async) + Redis-py
- **Backend ↔ External APIs**: httpx (async HTTP client)
- **n8n ↔ Backend**: Webhooks + HTTP requests

---

## 🔮 Future Architecture (Phase 2)

### Microservices Decomposition

```
API Gateway (Kong/Traefik)
    │
    ├─→ Auth Service (Go/Rust) - JWT generation
    ├─→ RAG Service (Python) - Document processing
    ├─→ BMAD Service (Python) - Agent orchestration
    ├─→ Bolt Service (Node.js) - Code generation
    ├─→ Billing Service (Go) - API key usage & invoicing
    └─→ Notification Service (Go) - Email/SMS/WhatsApp

Message Queue (RabbitMQ/Kafka)
    ├─→ Document processing jobs
    ├─→ Workflow execution tasks
    └─→ Notification events

Shared Cache (Redis Cluster)
Shared DB (PostgreSQL HA with Patroni)
```

### Edge Computing (for MENA region)

```
Algeria (Primary)
    ├─→ Backend (Algiers)
    └─→ Database Master

Morocco (Secondary)
    └─→ Backend Read Replica

Egypt (Secondary)
    └─→ Backend Read Replica

Europe (Compliance)
    └─→ Backup & DR (GDPR compliance)
```

---

## 📚 Architecture Decision Records (ADRs)

### ADR-001: PostgreSQL + PGVector vs. Separate Vector DB

**Decision**: Use PostgreSQL with PGVector extension

**Rationale**:
- Single database = simpler operations
- ACID transactions for data + vectors
- PGVector performance good for <1M vectors
- Row-Level Security works across all data

**Trade-offs**:
- May need Qdrant for >10M vectors
- Less specialized than Pinecone/Weaviate

---

### ADR-002: FastAPI vs. Django vs. Flask

**Decision**: FastAPI

**Rationale**:
- Native async/await (better performance)
- Automatic OpenAPI documentation
- Pydantic validation (type safety)
- Modern Python 3.11+ features

---

### ADR-003: Monolith First, Microservices Later

**Decision**: Start with modular monolith, extract services when needed

**Rationale**:
- Faster initial development
- Easier debugging and deployment
- Clear module boundaries allow extraction
- Premature microservices = operational complexity

**When to extract**:
- Service needs independent scaling
- Team size >10 developers
- Different tech stack requirements

---

## 🎓 Learning Resources

**For New Developers**:
1. **FastAPI Tutorial**: https://fastapi.tiangolo.com/tutorial/
2. **PostgreSQL Row-Level Security**: https://www.postgresql.org/docs/current/ddl-rowsecurity.html
3. **React + TypeScript**: https://react.dev/learn
4. **Docker Compose**: https://docs.docker.com/compose/

**Internal Docs**:
- `RECOVERY_PLAN.md` - Operational procedures
- `TECHNICAL_DEBT.md` - Known issues & roadmap
- `docs/templates/MODULE_TEMPLATE.md` - Documentation standard

---

**Architecture Version**: 2.0.0
**Next Review**: 2025-12-24
**Maintained By**: [Tech Lead Name]
