# 🔴 TÂCHES URGENTES - POST SESSION 6 DÉC 2025

## ✅ CE QUI EST FAIT
- Landing page API packages déployée: https://www.iafactoryalgeria.com/api-packages/
- Système promo codes backend actif
- Tous les endpoints testés et fonctionnels
- Nginx configuré pour routes publiques

---

## 🔴 TÂCHE 1: WIDGET COUNTER PLACES RESTANTES (URGENT)

### Objectif
Afficher en temps réel le nombre de places restantes sur la landing page.

### Fichier à modifier
`apps/api-packages/index.html`

### Code à ajouter

**1. Dans le HTML (section banner promo, ligne ~150)**:
```html
<div class="promo-banner">
  <div class="promo-content">
    <div class="promo-badge">🔥 OFFRE LIMITÉE</div>
    <h3>30 Premiers Clients Seulement</h3>
    <p class="promo-text">Réduction de <strong>-25% à -33%</strong> pendant <strong>6 mois garantis</strong> !</p>

    <!-- AJOUTER CE BLOC ICI -->
    <div class="promo-counter" id="promo-counter">
      <div class="counter-label">Places restantes</div>
      <div class="counter-value" id="counter-value">30</div>
      <div class="progress-bar">
        <div class="progress-fill" id="progress-fill" style="width: 0%"></div>
      </div>
      <div class="counter-subtitle">sur 30 places disponibles</div>
    </div>
    <!-- FIN BLOC -->

    <div class="promo-cta">
      <a href="#packages" class="btn-promo">Profiter de l'offre →</a>
      <span class="promo-timer">Offre valable jusqu'au 7 janvier 2026</span>
    </div>
  </div>
</div>
```

**2. Dans le CSS (section <style>, ligne ~450)**:
```css
.promo-counter {
  margin: 25px 0;
  padding: 20px;
  background: rgba(0, 166, 81, 0.1);
  border: 1px solid rgba(0, 166, 81, 0.3);
  border-radius: 12px;
}

.counter-label {
  font-size: 14px;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 8px;
}

.counter-value {
  font-size: 48px;
  font-weight: 700;
  color: var(--primary);
  line-height: 1;
  margin-bottom: 12px;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: rgba(0, 166, 81, 0.2);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 8px;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary), #00d46a);
  transition: width 0.5s ease;
  border-radius: 4px;
}

.counter-subtitle {
  font-size: 13px;
  color: var(--muted);
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.promo-counter.updating {
  animation: pulse 0.5s ease-in-out;
}
```

**3. Dans le JavaScript (avant </body>, ligne ~690)**:
```javascript
// Counter pour places restantes
async function updatePromoCounter() {
  try {
    const counterEl = document.getElementById('promo-counter');
    counterEl?.classList.add('updating');

    const res = await fetch('/api/promo/launch30/remaining');
    const data = await res.json();

    const remaining = data.remaining;
    const total = data.total;
    const percentFilled = ((total - remaining) / total) * 100;

    document.getElementById('counter-value').textContent = remaining;
    document.getElementById('progress-fill').style.width = percentFilled + '%';

    setTimeout(() => {
      counterEl?.classList.remove('updating');
    }, 500);
  } catch (error) {
    console.error('Failed to update counter:', error);
  }
}

// Update immédiatement
updatePromoCounter();

// Update toutes les 30 secondes
setInterval(updatePromoCounter, 30000);
```

### Déploiement
```bash
# Uploader fichier modifié
scp "d:/IAFactory/rag-dz/apps/api-packages/index.html" \
  root@46.224.3.125:/opt/iafactory-rag-dz/apps/api-packages/

# Vérifier
curl -I https://www.iafactoryalgeria.com/api-packages/
```

### Test
1. Ouvrir https://www.iafactoryalgeria.com/api-packages/
2. Vérifier que le counter affiche "30"
3. Vérifier que la barre de progression est à 0%
4. Attendre 30s et vérifier que le counter se rafraîchit

---

## 🔴 TÂCHE 2: EMAIL TEMPLATES (URGENT)

### Objectif
Préparer 3 templates HTML pour campagne email.

### Templates à créer

#### Template 1: `email-template-annonce.html`
**Sujet**: 🚀 IAFactory AI - Offre Spéciale Lancement: -33% pour 30 Premiers Clients!

**Contenu**:
- Header avec logo
- Accroche: "Soyez parmi les 30 fondateurs"
- Présentation offre (25-33% réduction)
- 3 avantages clés
- CTA: "Réserver ma place"
- Footer avec réseaux sociaux

#### Template 2: `email-template-confirmation.html`
**Sujet**: ✅ Bienvenue chez IAFactory - Votre accès est activé!

**Contenu**:
- Félicitations pour inscription
- Récapitulatif package choisi
- Détails réduction appliquée
- Badge "Founding Member"
- Instructions accès API
- Support contact

#### Template 3: `email-template-relance.html`
**Sujet**: ⏰ Derniers jours - Plus que X places sur 30!

**Contenu**:
- Rappel offre limitée
- Counter places restantes (dynamique)
- Témoignages fictifs de premiers clients
- Urgence: "Expire dans 3 jours"
- CTA: "Je ne veux pas rater cette offre"

### Base HTML pour templates
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>IAFactory AI</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background-color: #f7f5f0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background: #ffffff;
    }
    .header {
      background: linear-gradient(135deg, #020617 0%, #1e293b 100%);
      padding: 40px 20px;
      text-align: center;
    }
    .logo {
      font-size: 28px;
      font-weight: 700;
      color: #00a651;
    }
    .content {
      padding: 40px 30px;
    }
    h1 {
      font-size: 28px;
      color: #020617;
      margin: 0 0 20px 0;
    }
    p {
      font-size: 16px;
      line-height: 1.6;
      color: #475569;
      margin: 0 0 15px 0;
    }
    .cta-button {
      display: inline-block;
      padding: 16px 32px;
      background: linear-gradient(135deg, #00a651 0%, #00d46a 100%);
      color: #ffffff;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      margin: 20px 0;
    }
    .footer {
      background: #f7f5f0;
      padding: 30px;
      text-align: center;
      font-size: 14px;
      color: #64748b;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">⚡ IAFactory AI</div>
    </div>

    <div class="content">
      <!-- CONTENU ICI -->
    </div>

    <div class="footer">
      <p>IAFactory Algeria - AI Solutions</p>
      <p>46.224.3.125 | contact@iafactoryalgeria.com</p>
    </div>
  </div>
</body>
</html>
```

### Fichiers à créer
```
apps/email-templates/
  ├── annonce-lancement.html
  ├── confirmation-inscription.html
  └── relance-urgent.html
```

---

## 🟡 TÂCHE 3: CAMPAGNE MARKETING (PRIORITAIRE)

### LinkedIn Post
**Date**: 9 décembre 2025 (J+3)

**Contenu**:
```
🚀 LANCEMENT: IAFactory AI - L'API IA Multi-Modèles pour Développeurs Algériens

Nous lançons aujourd'hui notre plateforme d'API IA avec:
✅ 15+ providers (OpenAI, Anthropic, Groq, DeepSeek...)
✅ Latence moyenne 279ms
✅ Uptime 99.9%
✅ Prix en DZD

🎁 OFFRE SPÉCIALE 30 PREMIERS CLIENTS:
→ -25% sur Starter (7,500 DZD/mois)
→ -33% sur Dev (10,000 DZD/mois)
→ 6 mois prix garantis
→ Badge "Founding Member"

🔗 Découvrir: https://www.iafactoryalgeria.com/api-packages/

#IA #AI #Algeria #Algérie #DZ #Developers #API #Startup
```

**Image à créer**: Screenshot landing page avec counter "30 places"

### Facebook Ads
**Budget**: 50,000 DZD sur 30 jours

**Ciblage**:
- Pays: Algérie
- Âge: 20-45 ans
- Intérêts: Programmation, IA, Startup, Tech
- Langues: Français, Arabe, Anglais

**Creative**:
- Carousel 4 slides (4 packages)
- Vidéo 15s: Demo API call latency
- Image statique: "30 premiers clients -33%"

**Landing**: https://www.iafactoryalgeria.com/api-packages/

### Partenaires à contacter
1. **Incubateurs**:
   - AlgerieStartup
   - GreenTech
   - 1337
   - ANEM

2. **Écoles**:
   - ESI Alger
   - USTHB Informatique
   - Université Constantine
   - Écoles privées informatique

3. **Communautés**:
   - GDG Algeria
   - DZ Developers
   - Algeria Tech Community
   - Facebook Groups Dev

**Email type**:
```
Sujet: Offre spéciale lancement IAFactory AI pour vos membres

Bonjour,

Nous lançons IAFactory AI, une plateforme d'API IA multi-modèles
destinée aux développeurs algériens.

Pour le lancement, nous offrons -33% à vos membres (30 places).

Seriez-vous intéressé pour partager cette offre avec votre communauté?

Détails: https://www.iafactoryalgeria.com/api-packages/

Cordialement,
IAFactory Team
```

---

## 🟡 TÂCHE 4: TRACKING ANALYTICS

### Google Analytics
```html
<!-- Ajouter dans <head> de index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### Events à tracker
```javascript
// Click CTA package
document.querySelectorAll('.package-cta').forEach(btn => {
  btn.addEventListener('click', () => {
    gtag('event', 'package_click', {
      package_name: btn.dataset.package
    });
  });
});

// Scroll 50%
let scrolled50 = false;
window.addEventListener('scroll', () => {
  if (!scrolled50 && window.scrollY > document.body.scrollHeight * 0.5) {
    scrolled50 = true;
    gtag('event', 'scroll_50');
  }
});

// FAQ click
document.querySelectorAll('.faq-item').forEach(faq => {
  faq.addEventListener('click', () => {
    gtag('event', 'faq_click', {
      question: faq.querySelector('h4').textContent
    });
  });
});
```

---

## 📊 MÉTRIQUES À SUIVRE

### KPIs Journaliers
- [ ] Visiteurs uniques landing page
- [ ] Taux conversion (visiteurs → inscriptions)
- [ ] Places restantes (target: 0 en 30 jours)
- [ ] Sources trafic (LinkedIn, Facebook, Direct, Organic)

### KPIs Hebdomadaires
- [ ] Coût par acquisition (CPA)
- [ ] Revenue generated (MRR)
- [ ] Taux ouverture emails
- [ ] Taux click emails

### Objectifs 7 jours
- **Visiteurs**: 500+
- **Inscriptions**: 5 (17% des 30 places)
- **MRR**: 37,500 DZD
- **CPA**: < 7,500 DZD

---

## 🔧 OUTILS NÉCESSAIRES

### Email Marketing
- **Plateforme**: Mailchimp / SendGrid / Brevo
- **Setup**: Créer compte + importer template
- **Liste**: Contacts prospects (100+)

### Ads Management
- **Facebook Ads Manager**: Compte Business
- **LinkedIn Campaign Manager**: Compte
- **Budget carte**: Préparer carte Algérie CIB

### Analytics
- **Google Analytics**: Compte + Property
- **Plausible** (alternative): Plus simple, GDPR-friendly

---

## ⏰ TIMELINE RECOMMANDÉE

### Jour 1-2 (Aujourd'hui)
- [ ] Widget counter places restantes
- [ ] Email templates (3 versions)
- [ ] Google Analytics setup

### Jour 3-4
- [ ] Post LinkedIn création + publication
- [ ] Facebook Ads setup + lancement
- [ ] Contact 10 premiers partenaires

### Jour 5-7
- [ ] Analyse premiers résultats
- [ ] Ajustement campagnes
- [ ] Relance partenaires

### Jour 8-14
- [ ] Email relance prospects
- [ ] Optimisation landing page basé analytics
- [ ] Nouvelles variantes Ads

---

## 📞 SUPPORT

Si besoin d'aide:
1. Lire `STATUS_FINAL_SESSION_2025-12-06_21H.md`
2. Tester endpoints: https://www.iafactoryalgeria.com/api/promo/health
3. Vérifier backend: `ssh root@46.224.3.125 "docker logs iaf-dz-backend"`

---

**Créé**: 6 décembre 2025 - 21:55
**Priorité**: 🔴 URGENT
**Deadline**: Widget counter dans 24h, Marketing sous 72h
