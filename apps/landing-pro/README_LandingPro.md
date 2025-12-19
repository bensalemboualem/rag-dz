# Module 13 : LandingPro-DZ 🚀

## Description

Landing page professionnelle pour iaFactory Algeria — la première plateforme IA complète pour les entreprises algériennes.

## Sections

| Section | Description |
|---------|-------------|
| **Hero** | "Votre CoPilot IA pour l'Algérie" + stats + CTAs |
| **Modules** | Grille des 13+ modules IA (RAG-DZ, Legal, Fiscal, etc.) |
| **RAG-DZ** | Mise en valeur du RAG avec sources officielles |
| **Solutions** | Pack PME, StartupDZ, CRM-DZ |
| **Démo Live** | 3 requêtes gratuites sans compte |
| **Pricing** | Free (0 DZD), Pro (3,900 DZD), Business (9,900 DZD) |
| **FAQ** | Questions fréquentes avec accordéon |
| **Footer** | Liens, légal, réseaux sociaux |

## Fonctionnalités

- ✅ Design glassmorphism moderne
- ✅ Animations fluides (fadeInUp, pulse)
- ✅ Navbar sticky avec blur
- ✅ FAQ interactive (accordéon)
- ✅ Démo chat IA fonctionnelle (3 requêtes)
- ✅ Responsive mobile-first
- ✅ Smooth scroll
- ✅ Gradient text effects

## Stack

- HTML5 / CSS3 (variables, grid, flexbox)
- Vanilla JavaScript
- Google Fonts (Inter)
- nginx:alpine container

## Déploiement

```bash
# Build
docker build -t iaf-landing-pro .

# Run
docker run -d --name iaf-landing-pro \
  --network iaf-prod-network \
  -p 8216:8216 \
  iaf-landing-pro
```

## Configuration nginx

```nginx
# Landing page = Homepage
location = / {
    proxy_pass http://localhost:8216/;
}

location /landing/ {
    proxy_pass http://localhost:8216/;
}
```

## URLs

| Environnement | URL |
|---------------|-----|
| Local | http://localhost:8216 |
| Production | https://www.iafactoryalgeria.com/ |

## Liens internes

La landing page contient des liens vers :
- `/hub/` → Hub principal
- `/rag/` → RAG-DZ
- `/legal/` → Legal Assistant
- `/fiscal/` → Fiscal Assistant
- `/startupdz/` → StartupDZ Onboarding
- `/crm/` → CRM-DZ
- `/pme/` → Pack PME
- `/park/` → iaFactoryPark
- `/studio/` → Creative Studio
- `/n8n/` → n8n Workflows

---

**Module 13** • iaFactory Algeria • 2025
