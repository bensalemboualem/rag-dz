# Technical Debt Tracker - IAFactory RAG-DZ

**Last Updated**: 2025-11-24
**Status**: 🟡 Medium Priority

---

## 🔴 Critical Priorities

### 1. Multi-Tenant Architecture (P0)
**Status**: ❌ Not Implemented
**Impact**: Cannot scale to B2B SaaS
**Effort**: 4 weeks

**Current Issues**:
- Single shared database (no tenant isolation)
- No tenant_id in data models
- Shared service layer across all users
- Risk of data leakage between clients

**Action Plan**:
1. Add `tenant_id` UUID to all database models
2. Implement Row-Level Security (RLS) in PostgreSQL
3. Add tenant context to FastAPI dependency injection
4. Create tenant provisioning API
5. Add tenant-scoped API keys

**Files to Modify**:
- `backend/rag-compat/app/models/*.py` (all models)
- `backend/rag-compat/app/security.py` (tenant context)
- `backend/rag-compat/app/dependencies.py` (tenant injection)
- `infrastructure/sql/init.sql` (RLS policies)

---

### 2. Test Coverage (P0)
**Status**: ⚠️ <10% coverage
**Impact**: High risk of regressions
**Effort**: 3 weeks

**Missing Tests**:
- Unit tests for routers (0/21 covered)
- Service layer tests (0/9 covered)
- Integration tests for BMAD/Bolt workflows
- E2E frontend tests

**Action Plan**:
1. Create `tests/unit/` structure
2. Write router tests with pytest + httpx
3. Mock external dependencies (LLM, DB)
4. Add integration tests for critical workflows
5. Set up Playwright for frontend E2E

**Target Coverage**: 80%

---

### 3. API Key Reselling Module (P1)
**Status**: 🚧 Partial implementation
**Impact**: Core revenue feature incomplete
**Effort**: 2 weeks

**Current Issues**:
- `user_keys` router exists but not fully tested
- No usage metering/billing integration
- Missing rate limit enforcement per key
- No key rotation/expiry logic

**Action Plan**:
1. Implement usage tracking middleware
2. Add key-scoped rate limiting
3. Create billing/invoice generation
4. Add Stripe/payment integration
5. Build key analytics dashboard

**Files**:
- `backend/rag-compat/app/routers/user_keys.py`
- `backend/rag-compat/app/services/user_key_service.py`
- `backend/rag-compat/app/models/user_key.py`

---

## 🟡 Medium Priorities

### 4. Service Decoupling (P2)
**Status**: ⚠️ Tight coupling detected
**Effort**: 4 weeks

**Issues**:
- 21 routers in monolithic backend
- Services have circular dependencies
- BMAD, Bolt, Archon tightly integrated
- Hard to deploy modules independently

**Refactor Strategy**:
1. Extract BMAD into microservice
2. Create internal gRPC/HTTP APIs
3. Use message queue (RabbitMQ/Redis Streams)
4. Implement API Gateway pattern

---

### 5. Frontend Architecture (P2)
**Status**: ⚠️ Code duplication
**Effort**: 2 weeks

**Issues**:
- Shared components not extracted
- No component library (Storybook)
- API client code duplicated
- i18n removed but still needed

**Refactor**:
1. Create `@iafactory/ui-kit` package
2. Shared API client (`@iafactory/api`)
3. Restore i18n properly (Arabic support)
4. Implement design system

---

### 6. Observability (P2)
**Status**: 🚧 Basic Prometheus only
**Effort**: 1 week

**Missing**:
- Structured logging (JSON)
- Distributed tracing (OpenTelemetry)
- Error tracking (Sentry)
- APM dashboards

**Action Plan**:
1. Add `structlog` for JSON logging
2. Integrate OpenTelemetry SDK
3. Set up Sentry error tracking
4. Create Grafana dashboards
5. Add alerting rules (Prometheus AlertManager)

---

## 🟢 Low Priorities

### 7. CI/CD Pipeline (P3)
**Status**: ❌ Not implemented
**Effort**: 1 week

**Needed**:
- Automated testing on PR
- Docker image builds on merge
- Automated deployment to staging
- Semantic versioning

**Solution**: GitHub Actions workflow created (`.github/workflows/ci.yml`)

---

### 8. Documentation (P3)
**Status**: ⚠️ Incomplete
**Effort**: Ongoing

**Missing**:
- API documentation (OpenAPI complete)
- Architecture diagrams (C4 model)
- Deployment runbooks
- Developer onboarding guide

**Templates Created**: See `docs/templates/`

---

### 9. Security Hardening (P3)
**Status**: ⚠️ Basic security only
**Effort**: 2 weeks

**Improvements Needed**:
- OWASP dependency scanning
- Secret rotation automation
- WAF (Web Application Firewall)
- Penetration testing
- GDPR compliance audit

---

## 📊 Metrics Tracking

| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| Test Coverage | <10% | 80% | 🔴 |
| Multi-Tenant Support | 0% | 100% | 🔴 |
| API Response Time (p95) | ~500ms | <200ms | 🟡 |
| Uptime (30d) | N/A | 99.9% | ⚪ |
| Documentation Coverage | 30% | 90% | 🟡 |
| Service Decoupling | 10% | 80% | 🔴 |

---

## 🔄 Review Cadence

- **Weekly**: Update metrics, triage new debt
- **Monthly**: Review P0/P1 progress
- **Quarterly**: Architectural review

---

## 📝 Recent Changes

**2025-11-24**:
- ✅ Resolved `app/app/` code duplication
- ✅ Created DevOps automation scripts
- ✅ Added CI/CD workflow template
- 🚧 Multi-tenant architecture (in planning)

---

## 🎯 Next Sprint Goals

1. Implement tenant isolation (RLS + models)
2. Write unit tests for top 5 routers
3. Complete API key billing integration
4. Set up Sentry error tracking
5. Create architecture diagrams
