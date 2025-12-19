# IAFactory Algeria - Infrastructure Services

**Généré:** $(date)
**Serveur:** iafactorysuisse (46.224.3.125)

## Containers Actifs

$(docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | head -50)

## Services Principaux

### Core Infrastructure
- PostgreSQL (6330) - Base de données principale
- Ollama (11434) - LLM local  
- Qdrant (6333) - Vector database

### Frontend
- Archon (archon.iafactoryalgeria.com) - Agent framework
- RAG-UI - Interface principale

### Monitoring
- Prometheus (9090)
- Grafana (3033)
- Loki, Promtail

### Backups
- PostgreSQL: quotidien 2h AM
- Rétention: 30j / 12 semaines / 12 mois

---
**Dernière mise à jour:** $(date)
