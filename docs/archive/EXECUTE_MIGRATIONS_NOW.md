# 🚀 Exécution Migrations Multi-Tenant - MAINTENANT

**Status**: Prêt à exécuter
**Migrations**: 006, 007, 008
**Durée estimée**: 5 minutes

---

## ⚡ Étape 1: Démarrer PostgreSQL

### Option A: Docker (Recommandé)

```bash
# Démarrer Docker Desktop (si pas déjà fait)

# Démarrer PostgreSQL uniquement
docker-compose up -d iafactory-postgres

# Attendre que PostgreSQL soit ready (~30 secondes)
docker-compose logs -f iafactory-postgres
# Attendre le message: "database system is ready to accept connections"
```

### Option B: PostgreSQL Local

Si PostgreSQL est installé localement, assurez-vous qu'il tourne sur le port 5432.

---

## ⚡ Étape 2: Exécuter les 3 Migrations

### Option 1: Avec Docker (Port 6330)

```bash
cd backend/rag-compat/migrations

# Migration 006 - Table tenants
docker exec -i iaf-dz-postgres psql -U postgres -d iafactory_dz < 006_create_tenants_table.sql

# Migration 007 - Ajouter tenant_id
docker exec -i iaf-dz-postgres psql -U postgres -d iafactory_dz < 007_add_tenant_id_to_tables.sql

# Migration 008 - Activer RLS
docker exec -i iaf-dz-postgres psql -U postgres -d iafactory_dz < 008_enable_rls_policies.sql
```

### Option 2: PostgreSQL Local (Port 5432)

```bash
cd backend/rag-compat/migrations

# Exécuter les 3 migrations
psql -U postgres -d iafactory -f 006_create_tenants_table.sql
psql -U postgres -d iafactory -f 007_add_tenant_id_to_tables.sql
psql -U postgres -d iafactory -f 008_enable_rls_policies.sql
```

### Option 3: Script All-in-One

```bash
cd backend/rag-compat/migrations

# Rendre exécutable (première fois seulement)
chmod +x run_migrations.sh

# Exécuter avec Docker
export DB_HOST=localhost
export DB_PORT=6330
export DB_NAME=iafactory_dz
export DB_USER=postgres
export DB_PASSWORD=votre-mot-de-passe-postgres-securise

./run_migrations.sh
```

---

## ⚡ Étape 3: Vérifier l'Installation

### Test Complet RLS

```bash
# Avec Docker
docker exec -i iaf-dz-postgres psql -U postgres -d iafactory_dz < ../test_rls_isolation.sql

# Avec PostgreSQL local
psql -U postgres -d iafactory -f backend/rag-compat/test_rls_isolation.sql
```

**Résultat attendu**:
```
╔════════════════════════════════════════════════════════════╗
║  RLS ISOLATION TESTS COMPLETE                             ║
║                                                            ║
║  ✓ Tenant A can only see own data                         ║
║  ✓ Tenant B can only see own data                         ║
║  ✓ Cross-tenant reads blocked                             ║
║  ✓ Cross-tenant writes blocked                            ║
║  ✓ Cross-tenant updates blocked                           ║
║  ✓ Cross-tenant deletes blocked                           ║
║  ✓ Super-admin can see all data                           ║
║                                                            ║
║  🔒 ISOLATION ÉTANCHE CONFIRMÉE                           ║
╚════════════════════════════════════════════════════════════╝
```

### Vérification Rapide

```bash
# Avec Docker
docker exec -i iaf-dz-postgres psql -U postgres -d iafactory_dz -c "SELECT COUNT(*) as tenant_count FROM tenants;"

# Avec PostgreSQL local
psql -U postgres -d iafactory -c "SELECT COUNT(*) as tenant_count FROM tenants;"
```

**Résultat attendu**: Au moins 1 tenant (system-default)

---

## ⚡ Étape 4: Créer Votre Premier Tenant Réel

### École en Algérie

```bash
# Avec Docker
docker exec -i iaf-dz-postgres psql -U postgres -d iafactory_dz <<EOF
SELECT enable_superadmin_mode();

INSERT INTO tenants (name, slug, region, plan, status, admin_email, metadata)
VALUES (
    'École Ibn Khaldoun Alger',
    'ecole-ibn-khaldoun-alger',
    'DZ',
    'pro',
    'active',
    'admin@ecole-ibn-khaldoun.dz',
    '{"type": "school", "students_count": 500, "city": "Alger"}'::jsonb
)
RETURNING id, name, slug, region;
EOF
```

### Cabinet Médical Suisse

```bash
# Avec Docker
docker exec -i iaf-dz-postgres psql -U postgres -d iafactory_dz <<EOF
SELECT enable_superadmin_mode();

INSERT INTO tenants (name, slug, region, plan, status, admin_email, metadata)
VALUES (
    'Cabinet Dr. Dupont Genève',
    'cabinet-dupont-geneve',
    'CH',
    'enterprise',
    'active',
    'admin@cabinet-dupont.ch',
    '{"type": "medical", "speciality": "general", "city": "Genève"}'::jsonb
)
RETURNING id, name, slug, region;
EOF
```

---

## 🎯 Ce Qui a Été Créé

### Migration 006 - Infrastructure Tenants
- ✅ Table `tenants` (id, name, slug, **region**, plan, status, admin_email)
- ✅ Table `tenant_users` (many-to-many: users ↔ tenants)
- ✅ Table `api_keys` (authentification par tenant)
- ✅ Table `usage_events` (tracking usage)
- ✅ Index de performance sur tous les champs clés

### Migration 007 - Ajout tenant_id
- ✅ Colonne `tenant_id` sur 15+ tables:
  - `projects`, `knowledge_base`
  - `bolt_workflows`, `orchestrator_state`, `bmad_workflows`
  - `voice_transcriptions`, `voice_conversations`
  - `crm_leads`, `crm_deals`
  - `billing_accounts`, `credit_transactions`
  - `pme_analyses`
- ✅ ~20 index créés pour performance
- ✅ Données existantes migrées vers tenant par défaut
- ✅ Contraintes NOT NULL sur tenant_id

### Migration 008 - Row-Level Security (RLS)
- ✅ RLS activé sur toutes les tables
- ✅ **60+ politiques de sécurité créées**:
  - SELECT: Voir seulement données de son tenant
  - INSERT: Créer seulement pour son tenant
  - UPDATE: Modifier seulement données de son tenant
  - DELETE: Supprimer seulement données de son tenant
- ✅ **4 fonctions SQL créées**:
  - `set_tenant(tenant_id)` - Définir tenant courant
  - `get_current_tenant()` - Récupérer tenant courant
  - `is_superadmin()` - Vérifier accès super-admin
  - `enable_superadmin_mode()` - Activer mode supervision
- ✅ Accès super-admin pour support technique préservé

---

## 🔐 Utilisation RLS

### Dans le Code Backend (Phase 3)

```python
# Au début de chaque requête FastAPI
@router.get("/api/projects")
async def list_projects(
    tenant_id: str = Depends(get_current_tenant_id),
    db: AsyncSession = Depends(get_db_session)
):
    # Définir le tenant dans la session PostgreSQL
    await db.execute(f"SELECT set_tenant('{tenant_id}')")

    # Ensuite, toutes les requêtes sont filtrées automatiquement par RLS
    projects = await db.execute(select(Project))
    # RLS garantit qu'on ne voit QUE les projets de ce tenant
    return projects.scalars().all()
```

### Mode Super-Admin (Support Technique)

```sql
-- Activer super-admin pour voir tous les tenants
SELECT enable_superadmin_mode();

-- Maintenant on peut voir toutes les données
SELECT * FROM projects;  -- Tous les tenants visibles

-- Lister tous les tenants
SELECT id, name, region, plan, status FROM tenants;
```

### Tester Isolation

```sql
-- Session 1: Tenant A
SELECT set_tenant('ecole-ibn-khaldoun-id');
SELECT * FROM projects;  -- Voit seulement projets École Ibn Khaldoun

-- Session 2: Tenant B (autre école)
SELECT set_tenant('autre-ecole-id');
SELECT * FROM projects;  -- Voit seulement projets Autre École

-- Les 2 sessions ne voient PAS les données de l'autre
```

---

## ✅ Checklist Post-Migration

Après exécution, vérifier:

- [ ] Migration 006 exécutée sans erreur
- [ ] Migration 007 exécutée sans erreur
- [ ] Migration 008 exécutée sans erreur
- [ ] Table `tenants` existe et contient au moins 1 tenant
- [ ] Colonne `tenant_id` existe sur toutes les tables critiques
- [ ] RLS activé sur toutes les tables (`pg_tables.rowsecurity = true`)
- [ ] Tests d'isolation RLS passent à 100%
- [ ] Au moins 1 tenant réel créé (école, cabinet, etc.)

---

## 🐛 Troubleshooting

### "database system is starting up"
**Solution**: Attendre 30-60 secondes que PostgreSQL démarre complètement.

### "relation tenants already exists"
**Situation normale**: Les migrations utilisent `IF NOT EXISTS`, donc c'est safe de réexécuter.

### "permission denied for table tenants"
**Solution**: Exécuter `SELECT enable_superadmin_mode();` avant les opérations admin.

### Docker: "Cannot connect to Docker daemon"
**Solution**: Démarrer Docker Desktop d'abord.

### Port 6330 déjà utilisé
**Solution**: Arrêter le service qui utilise le port ou modifier `docker-compose.yml`.

---

## 📞 Prochaines Étapes

Après migrations réussies:

1. ✅ **Phase 1 COMPLETE**: Schéma DB
2. ✅ **Phase 2 COMPLETE**: Row-Level Security (RLS)
3. 🔜 **Phase 3**: Middleware FastAPI (2-3 jours)
4. 🔜 **Phase 4**: JWT avec tenant_id (1 jour)
5. 🔜 **Phase 5**: Tests d'intégration (2 jours)

Voir [MULTI_TENANT_IMPLEMENTATION_PLAN.md](MULTI_TENANT_IMPLEMENTATION_PLAN.md) pour détails.

---

**Status**: 🚀 Prêt à exécuter
**Temps total**: ~5 minutes
**Priorité**: P0 - CRITICAL

**Créé le**: 16 Décembre 2025
**Par**: Claude Code (Sonnet 4.5)
