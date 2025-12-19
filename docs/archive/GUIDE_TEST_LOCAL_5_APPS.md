# 🧪 GUIDE DE TEST LOCAL - 5 APPLICATIONS IA FACTORY

**Date**: 16 Décembre 2025
**Objectif**: Validation locale avant déploiement

---

## 📋 CHECKLIST APPLICATIONS

| # | App | Port | Status | URL Locale |
|---|-----|------|--------|------------|
| 1 | Landing SaaS | 8000 | ✅ En cours | http://localhost:8000 |
| 2 | AI Agents IA | 3001 | ⏳ À tester | http://localhost:3001 |
| 3 | CAN 2025 PWA | 3002 | ⏳ À tester | http://localhost:3002 |
| 4 | News DZ | 3003 | ⏳ À tester | http://localhost:3003 |
| 5 | Sport Magazine | 3004 | ⏳ À tester | http://localhost:3004 |

---

## 1️⃣ LANDING PAGE (Port 8000)

### Démarrage
```bash
# Déjà en cours sur http://localhost:8000
# Sinon:
cd apps/landing
python -m http.server 8000
```

### Tests à effectuer
- ✅ Header (navigation, boutons langue)
- ✅ Sidebar (New Chat, Projects, History)
- ✅ Footer (6 colonnes alignées, liens fonctionnels)
- ✅ Chatbot (bouton aide en bas à droite)
- ✅ i18n (FR/EN/AR avec RTL arabe)
- ✅ Responsive (mobile + desktop)

### Vérifications
```
✓ Header s'affiche correctement
✓ Sidebar ouvre/ferme
✓ Footer 6 colonnes sur même ligne
✓ Bouton globe change langue
✓ Mode RTL fonctionne en arabe
✓ Chatbot s'ouvre en cliquant sur help
```

---

## 2️⃣ AI AGENTS IA (Port 3001)

### Démarrage
```bash
cd apps/agents-ia
npm install
npm run dev
```

### Agents à tester (5 total)
1. **Agent Commercial** - Conseils business Algérie
2. **Agent Juridique** - Droit algérien
3. **Agent Marketing** - Stratégies marketing DZ
4. **Agent Recrutement** - RH et talents
5. **Agent Formation** - Conseils formation pro

### Tests à effectuer
- [ ] Page d'accueil charge (liste 5 agents)
- [ ] Sélection agent fonctionne
- [ ] Chat conversation marche (envoyer message)
- [ ] Système freemium (10 messages gratuits)
- [ ] Compteur tokens s'affiche
- [ ] Gamification (badges, streaks)
- [ ] Historique conversations

### Vérifications critiques
```
✓ 5 agents s'affichent avec icônes
✓ Chat répond en français
✓ Compteur messages 10/10 → 9/10
✓ System prompts actifs (répond sur Algérie)
✓ UI responsive
```

### Commandes de test
```bash
# Vérifier logs backend si erreur
tail -f apps/agents-ia/logs/dev.log

# Tester API directement
curl http://localhost:3001/api/agents
```

---

## 3️⃣ CAN 2025 PWA (Port 3002)

### Démarrage
```bash
cd apps/can2025
npm install
npm run dev
```

### Fonctionnalités PWA
- Progressive Web App (installable)
- Push notifications (VAPID configuré)
- Service Worker (offline support)
- Countdown CAN 2025 (21 décembre)

### Tests à effectuer
- [ ] Page charge avec countdown
- [ ] Bouton "Install App" visible
- [ ] Installation PWA fonctionne
- [ ] Notifications push (demande permission)
- [ ] Mode offline (désactiver réseau)
- [ ] Calendrier matchs s'affiche
- [ ] Classement équipes visible

### Vérifications PWA
```
✓ manifest.json charge (DevTools > Application)
✓ Service Worker enregistré
✓ Cache API fonctionne
✓ Bouton installer apparaît (Chrome/Edge)
✓ Countdown affiche jours/heures/minutes
✓ Responsive mobile (simulator)
```

### Test Push Notifications
```bash
# Vérifier VAPID keys configurées
cat apps/can2025/.env.local
# Devrait contenir:
# NEXT_PUBLIC_VAPID_PUBLIC_KEY=...
```

---

## 4️⃣ NEWS DZ (Port 3003)

### Démarrage
```bash
cd apps/news-dz
npm install
npm run dev
```

### Fonctionnalités
- Agrégateur 20+ sources RSS algériennes
- 4 catégories (Actualités, Sport, Économie, Tech)
- Recherche et filtrage
- Actualisation auto

### Tests à effectuer
- [ ] Page charge avec articles récents
- [ ] 4 catégories cliquables
- [ ] Articles s'affichent (titre, source, date)
- [ ] Recherche fonctionne (keywords)
- [ ] Filtrage par source
- [ ] Pagination fonctionne
- [ ] Liens externes ouvrent articles

### Vérifications
```
✓ Minimum 10 articles chargés
✓ Images articles s'affichent
✓ Dates en français (Il y a X heures)
✓ Icônes sources correctes
✓ Responsive grid (3 cols desktop, 1 col mobile)
```

### Test Sources RSS
```bash
# Vérifier parsing RSS fonctionne
curl http://localhost:3003/api/rss/test
```

---

## 5️⃣ SPORT MAGAZINE (Port 3004)

### Démarrage
```bash
cd apps/sport-magazine
npm install
npm run dev
```

### Fonctionnalités
- Magazine sport 100% Algérie
- Widget CAN 2025 intégré
- CMS Markdown (articles éditables)
- Galerie photos

### Tests à effectuer
- [ ] Page accueil charge (hero + articles)
- [ ] Widget CAN 2025 s'affiche (sidebar)
- [ ] Articles listés (grid cards)
- [ ] Clic article → page détail
- [ ] Images chargent correctement
- [ ] Markdown rendu (gras, titres, listes)
- [ ] Partage social (boutons)

### Vérifications
```
✓ Hero banner avec image
✓ Minimum 5 articles de test
✓ Widget CAN affiche countdown
✓ Markdown parse correctement
✓ Images responsive
✓ SEO meta tags présents
```

### Test CMS
```bash
# Vérifier articles Markdown
ls apps/sport-magazine/content/articles/
# Devrait contenir fichiers .md
```

---

## 🔧 COMMANDES UTILES

### Lancer toutes les apps en parallèle
```bash
# Terminal 1
cd apps/landing && python -m http.server 8000

# Terminal 2
cd apps/agents-ia && npm run dev

# Terminal 3
cd apps/can2025 && npm run dev

# Terminal 4
cd apps/news-dz && npm run dev

# Terminal 5
cd apps/sport-magazine && npm run dev
```

### Vérifier ports utilisés
```bash
netstat -ano | findstr ":3001"
netstat -ano | findstr ":3002"
netstat -ano | findstr ":3003"
netstat -ano | findstr ":3004"
netstat -ano | findstr ":8000"
```

### Tuer un port bloqué
```bash
# Windows
taskkill /PID <PID> /F

# Git Bash
kill -9 <PID>
```

---

## ✅ VALIDATION FINALE

### Checklist avant déploiement
- [ ] Landing page: Tous composants (header/sidebar/footer/chatbot) OK
- [ ] AI Agents: 5 agents conversent correctement
- [ ] CAN 2025: PWA installable + notifications
- [ ] News DZ: RSS feeds chargent + recherche fonctionne
- [ ] Sport Magazine: Articles Markdown affichent + widget CAN OK

### Tests critiques
1. **i18n**: FR/EN/AR fonctionnent (landing)
2. **API**: Agents répondent avec Claude 3.5 Sonnet
3. **PWA**: Installation + offline fonctionne (CAN 2025)
4. **RSS**: Parsing articles sans erreurs (News DZ)
5. **CMS**: Markdown render correct (Sport Magazine)

---

## 🐛 TROUBLESHOOTING

### Erreur "Port already in use"
```bash
# Trouver processus
netstat -ano | findstr ":3001"
# Tuer processus
taskkill /PID <PID> /F
```

### Erreur "Module not found"
```bash
cd apps/<app-name>
rm -rf node_modules package-lock.json
npm install
```

### Erreur CORS (API)
```bash
# Vérifier .env.local contient:
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Build errors Next.js
```bash
# Clear cache Next.js
rm -rf .next
npm run dev
```

---

## 📝 RAPPORT DE TEST

**À remplir après tests**:

| App | Status | Issues trouvés | Notes |
|-----|--------|----------------|-------|
| Landing | ⏳ | - | - |
| AI Agents | ⏳ | - | - |
| CAN 2025 | ⏳ | - | - |
| News DZ | ⏳ | - | - |
| Sport Magazine | ⏳ | - | - |

**Blockers identifiés**:
- [ ] Aucun
- [ ] Liste ici...

**Prêt pour déploiement**: ⏳ OUI / ❌ NON

---

**Session**: Test local 16 Décembre 2025
**Next Step**: Déploiement VPS si tous tests OK ✅
