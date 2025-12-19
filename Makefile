# Makefile pour RAG.dz
.PHONY: help start stop restart logs clean test test-backend test-frontend setup ports

# Couleurs pour output
GREEN := \033[0;32m
YELLOW := \033[0;33m
BLUE := \033[0;34m
RED := \033[0;31m
NC := \033[0m # No Color

help: ## Affiche l'aide
	@echo "$(GREEN)RAG.dz - Commandes disponibles:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-20s$(NC) %s\n", $$1, $$2}'

setup: ## Configuration initiale
	@echo "$(GREEN)Configuration initiale...$(NC)"
	@if [ ! -f .env ]; then \
		cp .env.example .env; \
		echo "$(YELLOW)✓ .env créé. Éditez-le avant de continuer!$(NC)"; \
	else \
		echo "$(YELLOW)✓ .env existe déjà$(NC)"; \
	fi

# ========================================
# Gestion des Services
# ========================================

start: ## Démarre tous les services (sauf Bolt)
	@echo "$(GREEN)Démarrage de RAG.dz...$(NC)"
	docker-compose up -d
	@echo "$(GREEN)✓ Services démarrés$(NC)"
	@make ports

start-all: ## Démarre TOUS les services (inclus Bolt)
	@echo "$(GREEN)Démarrage de TOUS les services...$(NC)"
	docker-compose --profile bolt up -d
	@echo "$(GREEN)✓ Tous les services démarrés$(NC)"
	@make ports

start-archon: ## Démarre uniquement Archon UI (port 3737)
	@echo "$(BLUE)Démarrage Archon UI...$(NC)"
	docker-compose up -d frontend
	@echo "$(GREEN)✓ Archon UI: http://localhost:3737$(NC)"

start-ragui: ## Démarre uniquement RAG-UI Simple (port 5173)
	@echo "$(BLUE)Démarrage RAG-UI Simple...$(NC)"
	docker-compose up -d rag-ui
	@echo "$(GREEN)✓ RAG-UI: http://localhost:5173$(NC)"

start-bolt: ## Démarre uniquement Bolt.diy (port 5174)
	@echo "$(BLUE)Démarrage Bolt.diy...$(NC)"
	docker-compose --profile bolt up -d bolt-diy
	@echo "$(GREEN)✓ Bolt.diy: http://localhost:5174$(NC)"

start-monitoring: ## Démarre Prometheus + Grafana
	@echo "$(BLUE)Démarrage monitoring...$(NC)"
	docker-compose --profile monitoring up -d iafactory-prometheus iafactory-grafana
	@echo "$(GREEN)✓ Prometheus: http://localhost:8187$(NC)"
	@echo "$(GREEN)✓ Grafana   : http://localhost:8188$(NC)"

stop-monitoring: ## Arrête Prometheus + Grafana
	@echo "$(YELLOW)Arrêt monitoring...$(NC)"
	docker-compose --profile monitoring stop iafactory-prometheus iafactory-grafana
	@echo "$(GREEN)✓ Monitoring arrêté$(NC)"

# ========================================
# Autres commandes
# ========================================

stop: ## Arrête tous les services
	@echo "$(YELLOW)Arrêt des services...$(NC)"
	docker-compose --profile bolt down
	@echo "$(GREEN)✓ Services arrêtés$(NC)"

restart: ## Redémarre tous les services
	@make stop
	@make start

restart-all: ## Redémarre TOUS les services (inclus Bolt)
	@make stop
	@make start-all

# ========================================
# Logs
# ========================================

logs: ## Affiche les logs (tous les services)
	docker-compose logs -f

logs-backend: ## Logs backend uniquement
	docker-compose logs -f backend

logs-archon: ## Logs Archon UI
	docker-compose logs -f frontend

logs-ragui: ## Logs RAG-UI Simple
	docker-compose logs -f rag-ui

logs-bolt: ## Logs Bolt.diy
	docker-compose logs -f bolt-diy

logs-db: ## Logs PostgreSQL
	docker-compose logs -f postgres

load-test: ## Lance le test de charge k6 (ex: make load-test SCENARIO=orchestrator-smoke)
	@SCENARIO=$${SCENARIO:-orchestrator-smoke} ./scripts/load-test.sh $$SCENARIO

# ========================================
# Status et Tests
# ========================================

status: ## Affiche le status des services
	@echo "$(GREEN)Status des services:$(NC)"
	@docker-compose ps

ports: ## Test tous les ports et affiche les URLs
	@echo "$(GREEN)Test de tous les ports...$(NC)"
	@python test_all_ports.py

urls: ## Affiche les URLs des services
	@echo "$(GREEN)═══════════════════════════════════════════════$(NC)"
	@echo "$(GREEN)        RAG.dz - Interfaces Disponibles       $(NC)"
	@echo "$(GREEN)═══════════════════════════════════════════════$(NC)"
	@echo ""
	@echo "$(BLUE)🎨 Frontends:$(NC)"
	@echo "  • Archon UI:       http://localhost:3737"
	@echo "  • RAG-UI Simple:   http://localhost:5173"
	@echo "  • Bolt.diy:        http://localhost:5174"
	@echo ""
	@echo "$(BLUE)⚡ Backend & API:$(NC)"
	@echo "  • API Docs:        http://localhost:8180/docs"
	@echo "  • Health Check:    http://localhost:8180/health"
	@echo "  • Metrics:         http://localhost:8180/metrics"
	@echo ""
	@echo "$(BLUE)📊 Monitoring:$(NC)"
	@echo "  • Grafana:         http://localhost:3001 (admin/admin)"
	@echo "  • Prometheus:      http://localhost:9090"
	@echo "  • Qdrant:          http://localhost:6333/dashboard"
	@echo ""
	@echo "$(GREEN)═══════════════════════════════════════════════$(NC)"

health: ## Vérifie la santé des services
	@echo "$(GREEN)Vérification santé...$(NC)"
	@curl -s http://localhost:8180/health | jq '.' || echo "Backend non disponible"

test: ## Lance tous les tests
	@echo "$(GREEN)Lancement de tous les tests...$(NC)"
	@make test-ports
	@make test-backend
	@make test-frontend

test-ports: ## Test de tous les ports
	@python test_all_ports.py

test-backend: ## Tests backend (pytest)
	@echo "$(GREEN)Tests backend...$(NC)"
	cd rag-compat && pytest -v --cov=app

test-frontend: ## Tests frontend (vitest)
	@echo "$(GREEN)Tests frontend...$(NC)"
	cd rag-ui && npm run test

test-security: ## Tests de sécurité uniquement
	cd rag-compat && pytest -v -m security

install-backend: ## Installe dépendances backend
	cd rag-compat && pip install -r requirements.txt

install-frontend: ## Installe dépendances frontend
	cd rag-ui && npm install

clean: ## Nettoie les volumes et images
	@echo "$(YELLOW)Nettoyage des volumes...$(NC)"
	docker-compose down -v
	@echo "$(GREEN)✓ Nettoyage terminé$(NC)"

clean-cache: ## Vide le cache Redis
	@echo "$(YELLOW)Vidage du cache Redis...$(NC)"
	docker-compose exec redis redis-cli FLUSHALL
	@echo "$(GREEN)✓ Cache vidé$(NC)"

db-shell: ## Ouvre un shell PostgreSQL
	docker-compose exec postgres psql -U postgres -d archon

redis-cli: ## Ouvre redis-cli
	docker-compose exec redis redis-cli

backup-db: ## Backup PostgreSQL
	@echo "$(GREEN)Backup PostgreSQL...$(NC)"
	docker-compose exec postgres pg_dump -U postgres archon > backup_$(shell date +%Y%m%d_%H%M%S).sql
	@echo "$(GREEN)✓ Backup créé$(NC)"

restore-db: ## Restore PostgreSQL (usage: make restore-db FILE=backup.sql)
	@echo "$(YELLOW)Restore PostgreSQL...$(NC)"
	@if [ -z "$(FILE)" ]; then \
		echo "Usage: make restore-db FILE=backup.sql"; \
		exit 1; \
	fi
	docker-compose exec -T postgres psql -U postgres archon < $(FILE)
	@echo "$(GREEN)✓ Restore terminé$(NC)"

dev-backend: ## Mode dev backend (hot reload)
	cd rag-compat && uvicorn app.main:app --reload --host 0.0.0.0 --port 8180

dev-frontend: ## Mode dev frontend (hot reload)
	cd rag-ui && npm run dev

metrics: ## Affiche les métriques Prometheus
	@curl -s http://localhost:8180/metrics | head -20

cache-stats: ## Stats du cache Redis
	@docker-compose exec redis redis-cli INFO stats | grep -E "(keyspace_hits|keyspace_misses)"

# Production
prod-build: ## Build pour production
	docker-compose -f docker-compose.yml build

prod-deploy: ## Deploy en production
	@echo "$(YELLOW)Deploy production...$(NC)"
	docker-compose -f docker-compose.yml up -d
	@echo "$(GREEN)✓ Déployé$(NC)"

# Qualité du code
lint-backend: ## Lint backend (ruff)
	cd rag-compat && ruff check .

lint-frontend: ## Lint frontend (eslint)
	cd rag-ui && npm run lint

format-backend: ## Format backend (black)
	cd rag-compat && black .

format-frontend: ## Format frontend (prettier)
	cd rag-ui && npm run format

# Documentation
docs-api: ## Ouvre la doc API
	@echo "$(GREEN)Documentation API:$(NC)"
	@echo "  http://localhost:8180/docs"
	@xdg-open http://localhost:8180/docs 2>/dev/null || open http://localhost:8180/docs 2>/dev/null || echo "Ouvrez manuellement"

# Monitoring
grafana-open: ## Ouvre Grafana
	@xdg-open http://localhost:3001 2>/dev/null || open http://localhost:3001 2>/dev/null || echo "http://localhost:3001"

prometheus-open: ## Ouvre Prometheus
	@xdg-open http://localhost:9090 2>/dev/null || open http://localhost:9090 2>/dev/null || echo "http://localhost:9090"
