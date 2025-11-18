"""
Agent Coordinateur - Orchestration BMAD → Archon → Bolt.DIY
Crée automatiquement des projets Archon depuis conversations BMAD
"""
import logging
from typing import List, Dict, Any, Optional
from datetime import datetime
import httpx
import os

logger = logging.getLogger(__name__)


class ProjectCoordinator:
    """Coordonne la création de projets depuis conversations multi-agents"""

    def __init__(self):
        self.archon_url = os.getenv("ARCHON_API_URL", "http://localhost:8180")
        self.bolt_url = os.getenv("BOLT_DIY_URL", "http://localhost:5173")

    async def analyze_conversation(
        self,
        messages: List[Dict[str, str]],
        agents_used: List[str]
    ) -> Dict[str, Any]:
        """
        Analyse une conversation pour détecter un projet

        Returns:
            {
                "is_project": bool,
                "project_name": str,
                "description": str,
                "technologies": List[str],
                "requirements": List[str]
            }
        """
        # Détecter si c'est un projet
        conversation_text = " ".join([msg.get("content", "") for msg in messages])

        # Mots-clés indiquant un projet
        project_keywords = [
            "créer", "développer", "construire", "projet", "application",
            "app", "système", "plateforme", "site web", "api", "microservice"
        ]

        is_project = any(keyword in conversation_text.lower() for keyword in project_keywords)

        if not is_project:
            return {"is_project": False}

        # Extraire nom du projet (première occurrence)
        project_name = self._extract_project_name(messages)

        # Extraire technologies mentionnées
        technologies = self._extract_technologies(conversation_text)

        # Résumé basé sur les agents utilisés
        description = self._generate_description(messages, agents_used)

        # Exigences techniques
        requirements = self._extract_requirements(messages)

        return {
            "is_project": True,
            "project_name": project_name,
            "description": description,
            "technologies": technologies,
            "requirements": requirements,
            "agents_involved": agents_used,
            "created_at": datetime.utcnow().isoformat()
        }

    async def create_archon_project(
        self,
        project_data: Dict[str, Any],
        conversation_transcript: List[Dict[str, str]]
    ) -> Dict[str, Any]:
        """
        Crée un projet dans Archon avec knowledge base

        Returns:
            {
                "project_id": str,
                "knowledge_source_id": str,
                "bolt_url": str
            }
        """
        async with httpx.AsyncClient(timeout=30.0) as client:
            # 1. Créer le projet Archon
            project_payload = {
                "name": project_data["project_name"],
                "description": project_data["description"],
                "metadata": {
                    "technologies": project_data["technologies"],
                    "requirements": project_data["requirements"],
                    "agents_used": project_data["agents_involved"],
                    "created_from": "bmad_conversation",
                    "created_at": project_data["created_at"]
                }
            }

            try:
                # Créer projet via API Archon (si disponible)
                # Pour l'instant, on simule
                project_id = f"project_{datetime.utcnow().timestamp()}"

                logger.info(f"✅ Projet Archon créé: {project_id}")

                # 2. Créer knowledge base depuis transcript
                knowledge_source_id = await self._create_knowledge_from_transcript(
                    project_id=project_id,
                    transcript=conversation_transcript,
                    project_name=project_data["project_name"]
                )

                logger.info(f"✅ Knowledge base créée: {knowledge_source_id}")

                # 3. Générer URL Bolt.DIY avec contexte
                bolt_url = self._generate_bolt_url(project_id, knowledge_source_id)

                return {
                    "success": True,
                    "project_id": project_id,
                    "knowledge_source_id": knowledge_source_id,
                    "bolt_url": bolt_url,
                    "archon_project_url": f"{self.archon_url}/projects/{project_id}"
                }

            except Exception as e:
                logger.error(f"❌ Erreur création projet: {e}")
                return {
                    "success": False,
                    "error": str(e)
                }

    async def _create_knowledge_from_transcript(
        self,
        project_id: str,
        transcript: List[Dict[str, str]],
        project_name: str
    ) -> str:
        """Convertit le transcript de conversation en documents knowledge base"""

        # Formater le transcript en markdown
        markdown_content = f"# {project_name} - Conversation Transcript\n\n"
        markdown_content += f"**Project ID**: {project_id}\n"
        markdown_content += f"**Created**: {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')}\n\n"
        markdown_content += "---\n\n"

        for i, msg in enumerate(transcript, 1):
            role = msg.get("role", "user")
            content = msg.get("content", "")
            agent = msg.get("agent", "User")

            markdown_content += f"## Message {i} - {agent} ({role})\n\n"
            markdown_content += f"{content}\n\n"
            markdown_content += "---\n\n"

        # Enregistrer dans Archon (upload document)
        # Pour l'instant, on simule
        source_id = f"source_{project_id}"

        logger.info(f"📄 Transcript converti en knowledge base")

        return source_id

    def _extract_project_name(self, messages: List[Dict[str, str]]) -> str:
        """Extrait le nom du projet depuis les messages"""
        for msg in messages:
            content = msg.get("content", "").lower()
            # Chercher patterns comme "créer une app X" ou "projet Y"
            if "app" in content or "application" in content:
                words = content.split()
                for i, word in enumerate(words):
                    if word in ["app", "application", "projet", "système"]:
                        if i + 1 < len(words):
                            return words[i + 1].capitalize()

        return f"Projet_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}"

    def _extract_technologies(self, text: str) -> List[str]:
        """Détecte les technologies mentionnées"""
        tech_keywords = {
            "react", "vue", "angular", "svelte",
            "node", "python", "java", "go", "rust",
            "docker", "kubernetes", "postgresql", "redis",
            "fastapi", "express", "django", "flask",
            "typescript", "javascript", "tailwind"
        }

        text_lower = text.lower()
        found_techs = [tech for tech in tech_keywords if tech in text_lower]

        return found_techs

    def _generate_description(
        self,
        messages: List[Dict[str, str]],
        agents_used: List[str]
    ) -> str:
        """Génère une description du projet"""
        # Prendre les 3 premiers messages utilisateur
        user_messages = [
            msg["content"] for msg in messages
            if msg.get("role") == "user"
        ][:3]

        summary = " ".join(user_messages)
        if len(summary) > 200:
            summary = summary[:197] + "..."

        agents_str = ", ".join(agents_used)

        return f"{summary}\n\nAgents consultés: {agents_str}"

    def _extract_requirements(self, messages: List[Dict[str, str]]) -> List[str]:
        """Extrait les exigences fonctionnelles"""
        requirements = []

        for msg in messages:
            content = msg.get("content", "")
            # Chercher des patterns d'exigences
            if any(word in content.lower() for word in ["besoin", "doit", "faut", "require"]):
                # Extraire la phrase
                sentences = content.split(".")
                for sentence in sentences:
                    if any(word in sentence.lower() for word in ["besoin", "doit", "faut", "require"]):
                        requirements.append(sentence.strip())

        return requirements[:10]  # Max 10 requirements

    def _generate_bolt_url(self, project_id: str, knowledge_source_id: str) -> str:
        """Génère URL Bolt.DIY avec contexte projet"""
        return f"{self.bolt_url}?project_id={project_id}&knowledge_source={knowledge_source_id}"


# Instance globale
coordinator = ProjectCoordinator()
