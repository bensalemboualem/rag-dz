# ⚽ Sport Magazine DZ

Magazine sportif 100% Algérie - Toute l'actualité des Fennecs, Ligue 1 et sport international.

## 🌟 Fonctionnalités

- ✅ **Fennecs**: Équipe nationale algérienne
- ✅ **Ligue 1 DZ**: Championnat algérien
- ✅ **International**: Algériens à l'étranger
- ✅ **CAN 2025**: Widget compte à rebours + matchs Algérie
- ✅ **Articles Markdown**: CMS simple pour rédaction
- ✅ **Design responsive**: Mobile-first avec dark mode

## 🚀 Démarrage Rapide

```bash
cd D:\IAFactory\rag-dz\apps\sport-magazine

# Installer dépendances
npm install

# Lancer en développement
npm run dev
```

L'app sera accessible sur **http://localhost:3004**

## 📁 Structure

```
sport-magazine/
├── app/
│   ├── page.tsx                    # Homepage
│   ├── layout.tsx                  # Layout global
│   ├── globals.css                 # Styles
│   ├── can2025/page.tsx            # Page CAN 2025
│   └── articles/
│       ├── fennecs/page.tsx        # Articles Fennecs
│       ├── ligue1/page.tsx         # Articles Ligue 1
│       └── international/page.tsx  # Articles internationaux
├── public/                         # Assets statiques
├── package.json
└── README.md
```

## 🎨 Design

- **Couleurs**: Vert (#00A651) + Rouge (#D32F2F) + Or (#FFD700)
- **Dark mode**: Natif Tailwind
- **Responsive**: Mobile-first
- **Components**: Cards, badges, gradients

## 🔧 Technologies

- **Next.js 14** (App Router)
- **React 18**
- **TypeScript**
- **Tailwind CSS**
- **gray-matter** (Markdown parsing)
- **remark** (Markdown to HTML)
- **lucide-react** (Icônes)

## 📝 Ajouter des Articles

Les articles sont en Markdown dans `app/articles/[category]/[slug].md`:

```markdown
---
title: "Titre de l'article"
date: "2025-12-16"
category: "fennecs"
image: "/images/article.jpg"
excerpt: "Résumé court de l'article..."
---

# Contenu de l'article

Votre contenu ici...
```

## 🏆 CAN 2025

Widget intégré avec:
- Countdown temps réel
- Matchs Algérie (Groupe E)
- Classement du groupe
- Lien vers app CAN 2025 complète

## 💰 Monétisation

### Publicité
- Google AdSense
- Bannières sponsors
- Articles sponsorisés

### Affiliation
- Maillots officiels
- Équipements sportifs
- Paris sportifs (Betiton, 1xBet DZ)

### Sponsoring
- Clubs Ligue 1
- Marques sportives
- Télécoms (Djezzy, Mobilis, Ooredoo)

## 📊 Analytics

```bash
# Ajouter Google Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

## 🚀 Déploiement VPS

```bash
# Build production
npm run build

# Lancer avec PM2
pm2 start npm --name "sport-magazine" -- start

# Nginx config
server {
    listen 80;
    server_name sport.iafactory.dz;

    location / {
        proxy_pass http://localhost:3004;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 📄 Licence

© 2025 IA Factory - Made with ❤️ in Algeria 🇩🇿

---

**Tout le sport algérien, en temps réel! ⚽🇩🇿**
