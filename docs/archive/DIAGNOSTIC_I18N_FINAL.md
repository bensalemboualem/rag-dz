# DIAGNOSTIC I18N - POURQUOI ÇA NE MARCHE PAS SUR LA LANDING PAGE

**Date**: 6 décembre 2025
**Status**: test-simple.html MARCHE ✅ | index.html NE MARCHE PAS ❌

---

## CE QUI MARCHE

✅ **test-simple.html** (https://www.iafactoryalgeria.com/apps/landing/test-simple.html)
- Changement FR → EN → AR fonctionne
- RTL activé pour l'arabe
- 3 éléments traduits correctement

---

## CE QUI NE MARCHE PAS

❌ **index.html** (https://www.iafactoryalgeria.com/)
- Globe 🌐 visible
- Mais les textes ne changent PAS
- Testé sur 3 navigateurs différents

---

## VÉRIFICATIONS FAITES

✅ Script IAFactoryI18n présent dans index.html
✅ IAFactoryI18n.setLanguage() appelé par le globe dropdown
✅ DOMContentLoaded dans init()
✅ 96 éléments avec data-i18n
✅ Traductions FR/AR/EN définies
✅ Fichier déployé sur VPS
✅ Cache Nginx vidé

---

## HYPOTHÈSES POSSIBLES

### 1. Erreur JavaScript silencieuse
Le code crash avant d'initialiser complètement.

**Test**: Ouvrir console (F12) sur https://www.iafactoryalgeria.com/ et chercher erreurs rouges.

### 2. Conflit entre deux event listeners
Il y a deux morceaux de code qui gèrent le dropdown:
- Le code IAFactoryI18n.init() (ligne 172-186)
- Le code du globe dropdown (ligne 4410-4438)

**Problème potentiel**: Le premier cherche `.lang-btn` avec `data-lang`, mais le globe principal n'a PAS `data-lang`.

### 3. IAFactoryI18n.init() ne s'exécute jamais
Si DOMContentLoaded est déjà passé quand le script s'exécute, l'event listener ne se déclenche jamais.

**Solution**: Appeler setLanguage() immédiatement SI le DOM est déjà chargé:
```javascript
init() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            this.setLanguage(this.currentLang, false);
        });
    } else {
        // DOM déjà chargé
        this.setLanguage(this.currentLang, false);
    }
}
```

### 4. Le globe dropdown ne trigger pas vraiment setLanguage()
Vérifier que le code du globe (ligne 4427-4428) s'exécute vraiment.

**Test console**:
```javascript
document.querySelectorAll('.lang-option').forEach(opt => {
    opt.addEventListener('click', () => {
        console.log('CLICKED:', opt.getAttribute('data-lang'));
    });
});
```

### 5. setLanguage() s'exécute mais ne trouve pas les éléments
Vérifier que `document.querySelectorAll('[data-i18n]')` retourne bien des éléments.

**Test console**:
```javascript
console.log('Elements:', document.querySelectorAll('[data-i18n]').length);
```

---

## SOLUTION PROBABLE

Le problème est l'**hypothèse #3**: Le script s'exécute APRÈS que le DOM soit déjà chargé, donc l'event listener `DOMContentLoaded` ne se déclenche JAMAIS.

**Preuve**: Le script est dans le `<head>` et s'exécute immédiatement avec `IAFactoryI18n.init();` à la ligne 243. À ce moment, le DOM n'est PAS encore chargé. Mais DOMContentLoaded pourrait déjà être passé si le navigateur a du cache ou si le script s'exécute en asynchrone.

**FIX**:
```javascript
init() {
    const applyLang = () => {
        this.setLanguage(this.currentLang, false);

        // Event listeners pour le globe
        const langButtons = document.querySelectorAll('.lang-btn');
        langButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lang = e.currentTarget.dataset.lang;
                this.setLanguage(lang);
            });
        });
    };

    // Si DOM déjà chargé, exécuter immédiatement
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyLang);
    } else {
        applyLang();
    }
}
```

---

## ACTION IMMÉDIATE

Modifier la fonction `init()` dans index.html pour gérer le cas où le DOM est déjà chargé.
