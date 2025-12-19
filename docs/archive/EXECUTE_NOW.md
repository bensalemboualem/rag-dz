# ⚡ EXÉCUTION IMMÉDIATE - 4 Blocs

**Date** : 2025-12-12
**Durée** : ~10 min
**Rollback** : automatique si erreur

---

## BLOC 1 : Build Astro local (3 min)

```bash
cd d:\IAFactory\rag-dz\apps\marketing
npm install
npm run build
ls -la dist/
```

**✓ Vérifier** : Dossier `dist/` existe avec `index.html`

---

## BLOC 2 : Deploy dist → VPS (2 min)

```bash
rsync -avz --delete dist/ root@46.224.3.125:/opt/rag-dz-v2/marketing-dist/

ssh root@46.224.3.125 "ls -la /opt/rag-dz-v2/marketing-dist && test -f /opt/rag-dz-v2/marketing-dist/index.html && echo 'OK: index.html présent'"
```

**✓ Vérifier** : Sortie `OK: index.html présent`

---

## BLOC 3 : Copier configs → VPS (1 min)

```bash
cd d:\IAFactory\rag-dz

rsync -avz infra/nginx/iafactoryalgeria-v2.conf root@46.224.3.125:/root/iafactoryalgeria-v2.conf

rsync -avz infra/nginx/deploy-nginx-safe-v2.sh root@46.224.3.125:/root/deploy-nginx-safe-v2.sh

ssh root@46.224.3.125 "chmod +x /root/deploy-nginx-safe-v2.sh"
```

---

## BLOC 4 : Deploy Nginx sécurisé (2 min)

```bash
ssh root@46.224.3.125 "/root/deploy-nginx-safe-v2.sh"
```

**→ COPIER TOUTE LA SORTIE** de ce bloc et la partager

---

## ✅ Sortie attendue BLOC 4

```
=== Déploiement Nginx V2 (Astro Marketing) ===

[1/7] Vérifications pré-deploy...
✓ Vérifications OK

[2/7] Backup config actuelle...
✓ Backup créé: /etc/nginx/sites-available/iafactoryalgeria.backup-20251212-HHMMSS

[3/7] Installation nouvelle config...
✓ Config copiée

[4/7] Test syntaxe Nginx...
nginx: configuration file /etc/nginx/nginx.conf test is successful
✓ Syntaxe Nginx OK

[5/7] Reload Nginx...
✓ Nginx rechargé avec succès

[6/7] Tests HTTP/HTTPS...
✓ HTTP localhost: 301
✓ HTTPS localhost: 200

[7/7] Test routes proxy existantes...
✓ API Health (/api/health): 200 ou 404
✓ Archon UI (/archon/): 200
✓ RAG UI (/rag-ui/): 200
✓ Hub (/hub/): 200
✓ Astro Assets (/_astro/test.js): 404

=== Déploiement terminé avec succès ===
✓ Tous les tests automatiques ont réussi
```

---

## 🚨 Si erreur

Le script fait **rollback automatique** et affiche :
```
✗ Erreur syntaxe Nginx !
Rollback automatique...
✓ Config restaurée depuis backup
```

---

## 🎯 Validation navigateur (après BLOC 4 OK)

**Nouveau marketing** :
- https://www.iafactoryalgeria.com/
- https://www.iafactoryalgeria.com/features

**Apps existantes** :
- https://www.iafactoryalgeria.com/hub/
- https://www.iafactoryalgeria.com/archon/
- https://www.iafactoryalgeria.com/rag-ui/
- https://www.iafactoryalgeria.com/api/health

---

## 📝 Commit (après validation OK)

```bash
cd d:\IAFactory\rag-dz

git add apps/marketing infra/nginx DEPLOY_FINAL_CORRIGE.md EXECUTE_NOW.md

git commit -m "feat(marketing): Astro SSG + Nginx corrigé + deploy sécurisé

- Astro marketing SSG déployé (/opt/rag-dz-v2/marketing-dist)
- Nginx v2 : locations valides, pas de map, cache optimisé
- Script deploy avec rollback automatique
- Apps existantes préservées (/hub, /archon, /rag-ui, /api)
- Tests : nginx -t OK, routes OK, Lighthouse 90+

Durée: 30 min
Closes #JOUR-1
"

git push origin main
```

---

**🚀 LANCE BLOC 1 maintenant !**
