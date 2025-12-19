# 🚀 Quick Start: Multi-Tenant Phase 1

**5 minutes pour activer le multi-tenant sur IA Factory**

---

## ⚡ Démarrage Rapide

### 1. Exécuter les Migrations

```bash
cd backend/rag-compat

# Exécuter toutes les migrations (006 + 007)
python run_migrations.py
```

**Résultat attendu**:
```
✓ Migration 006 completed: tenants table created successfully
✓ Migration 007 completed: tenant_id added to all critical tables
✓ Executed: 2
```

### 2. Vérifier Installation

```bash
# Tester l'installation
psql -U postgres -d iafactory -f test_multi_tenant.sql
```

**Résultat attendu**:
```
✓ ALL TESTS PASSED
Multi-Tenant Phase 1 COMPLETE
Ready for Phase 2 (RLS)
```

### 3. Créer Votre Premier Tenant

**Pour École Algérie**:

```sql
psql -U postgres -d iafactory <<EOF
INSERT INTO tenants (name, slug, region, plan, status, admin_email)
VALUES (
    'École Ibn Khaldoun Alger',
    'ecole-ibn-khaldoun-alger',
    'DZ',
    'pro',
    'active',
    'admin@ecole-ibn-khaldoun.dz'
)
RETURNING id, name, slug;
EOF
```

**Pour Cabinet Médical Suisse**:

```sql
psql -U postgres -d iafactory <<EOF
INSERT INTO tenants (name, slug, region, plan, status, admin_email)
VALUES (
    'Cabinet Dr. Dupont Genève',
    'cabinet-dupont-geneve',
    'CH',
    'enterprise',
    'active',
    'admin@cabinet-dupont.ch'
)
RETURNING id, name, slug;
EOF
```

### 4. Lier Utilisateur au Tenant

```sql
# Récupérer tenant_id
TENANT_ID=$(psql -U postgres -d iafactory -tAc "SELECT id FROM tenants WHERE slug = 'ecole-ibn-khaldoun-alger'")

# Lier utilisateur admin (ID=1) au tenant
psql -U postgres -d iafactory <<EOF
INSERT INTO tenant_users (tenant_id, user_id, role)
VALUES (
    '$TENANT_ID',
    1,
    'admin'
);
EOF
```

---

## ✅ C'est Tout!

Votre infrastructure multi-tenant est prête.

**Prochaines étapes**:
1. Phase 2: Activer Row-Level Security (voir MULTI_TENANT_IMPLEMENTATION_PLAN.md)
2. Phase 3: Middleware FastAPI
3. Phase 4: JWT avec tenant_id

---

## 📊 Commandes Utiles

### Lister Tous les Tenants

```sql
SELECT id, name, region, plan, status
FROM tenants
ORDER BY created_at DESC;
```

### Vérifier tenant_id sur Tables

```sql
SELECT table_name, column_name
FROM information_schema.columns
WHERE column_name = 'tenant_id'
ORDER BY table_name;
```

### Compter Données par Tenant

```sql
SELECT
    t.name,
    (SELECT COUNT(*) FROM projects WHERE tenant_id = t.id) as projects,
    (SELECT COUNT(*) FROM knowledge_base WHERE tenant_id = t.id) as documents
FROM tenants t
ORDER BY t.created_at DESC;
```

---

## 🐛 Problèmes Courants

### "relation tenants does not exist"

```bash
# Exécuter migration 006
python run_migrations.py 006
```

### "column tenant_id already exists"

C'est normal - réexécuter est safe (IF NOT EXISTS).

### Besoin d'aide?

Voir documentation complète: [MULTI_TENANT_PHASE1_COMPLETE.md](MULTI_TENANT_PHASE1_COMPLETE.md)

---

**Temps total**: ~5 minutes
**Status**: ✅ Phase 1 prête pour déploiement
