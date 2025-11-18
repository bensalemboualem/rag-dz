import json

# Charger EN
with open('src/locales/en/translation.json', 'r', encoding='utf-8') as f:
    en = json.load(f)

# Traductions FR professionnelles
fr = {
    "common": {k: {
        "loading": "Chargement...", "error": "Erreur", "success": "Succès", "warning": "Avertissement",
        "info": "Information", "cancel": "Annuler", "save": "Enregistrer", "delete": "Supprimer",
        "edit": "Modifier", "create": "Créer", "add": "Ajouter", "remove": "Retirer",
        "search": "Rechercher", "filter": "Filtrer", "refresh": "Actualiser", "tryAgain": "Réessayer",
        "close": "Fermer", "confirm": "Confirmer", "back": "Retour", "next": "Suivant",
        "previous": "Précédent", "submit": "Soumettre", "upload": "Téléverser", "download": "Télécharger",
        "copy": "Copier", "paste": "Coller", "cut": "Couper", "undo": "Annuler", "redo": "Refaire",
        "select": "Sélectionner", "selectAll": "Tout sélectionner", "deselectAll": "Tout désélectionner",
        "clear": "Effacer", "reset": "Réinitialiser", "apply": "Appliquer", "export": "Exporter",
        "import": "Importer", "print": "Imprimer", "share": "Partager", "view": "Afficher",
        "details": "Détails", "more": "Plus", "less": "Moins", "expand": "Développer",
        "collapse": "Réduire", "minimize": "Minimiser", "maximize": "Agrandir",
        "fullscreen": "Plein écran", "exitFullscreen": "Quitter le plein écran",
        "yes": "Oui", "no": "Non", "ok": "OK", "done": "Terminé",
        "finish": "Finir", "skip": "Passer", "continue": "Continuer", "retry": "Réessayer",
        "help": "Aide", "about": "À propos", "version": "Version", "status": "Statut",
        "name": "Nom", "description": "Description", "type": "Type", "category": "Catégorie",
        "tags": "Étiquettes", "date": "Date", "time": "Heure", "timestamp": "Horodatage",
        "createdAt": "Créé le", "updatedAt": "Modifié le", "deletedAt": "Supprimé le",
        "author": "Auteur", "owner": "Propriétaire", "user": "Utilisateur", "users": "Utilisateurs",
        "actions": "Actions", "options": "Options", "preferences": "Préférences",
        "settings": "Paramètres", "configuration": "Configuration", "language": "Langue",
        "theme": "Thème", "darkMode": "Mode sombre", "lightMode": "Mode clair",
        "systemTheme": "Thème système", "notifications": "Notifications", "updates": "Mises à jour",
        "changelog": "Journal des modifications", "documentation": "Documentation",
        "tutorial": "Tutoriel", "guide": "Guide", "faq": "FAQ", "support": "Support",
        "contact": "Contact", "feedback": "Retour d'information", "reportBug": "Signaler un bogue",
        "requestFeature": "Demander une fonctionnalité", "privacyPolicy": "Politique de confidentialité",
        "termsOfService": "Conditions d'utilisation", "license": "Licence",
        "copyright": "Droits d'auteur", "allRightsReserved": "Tous droits réservés"
    }[k] for k in en['common']},
    "nav": {k: {
        "home": "Accueil", "dashboard": "Tableau de bord", "knowledge": "Base de connaissances",
        "knowledgeBase": "Base de connaissances", "projects": "Projets", "tasks": "Tâches",
        "documents": "Documents", "mcp": "Serveur MCP", "mcpServer": "Serveur MCP",
        "settings": "Paramètres", "profile": "Profil", "account": "Compte",
        "logout": "Déconnexion", "login": "Connexion", "register": "S'inscrire",
        "agentWorkOrders": "Ordres de travail d'agent", "styleGuide": "Guide de style"
    }[k] for k in en['nav']},
    "knowledge": {k: v.replace("Knowledge Base", "Base de connaissances") if k in en['knowledge'] else "" for k, v in en['knowledge'].items()},
    # Continuer pour tous les autres...
}

print("FR traduit:")
print(json.dumps(fr['common'], indent=2, ensure_ascii=False)[:500])
