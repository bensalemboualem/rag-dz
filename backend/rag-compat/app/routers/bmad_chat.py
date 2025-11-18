"""
BMAD Chat Router - Conversations avec Agents BMAD via DeepSeek API

Charge les personnalités des agents depuis les fichiers YAML BMAD
et utilise DeepSeek pour générer des réponses authentiques.
"""

import os
import logging
import yaml
from pathlib import Path
from typing import List, Dict, Optional
from datetime import datetime

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from openai import OpenAI

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/bmad", tags=["bmad-chat"])

# Chemin vers les agents BMAD
BMAD_PATH = Path(__file__).resolve().parent.parent.parent.parent / "bmad"
AGENTS_PATH = BMAD_PATH / "src" / "modules" / "bmm" / "agents"

# Client DeepSeek (OpenAI compatible)
deepseek_client = None


def get_deepseek_client():
    """Lazy load DeepSeek client"""
    global deepseek_client
    if deepseek_client is None:
        api_key = os.getenv("DEEPSEEK_API_KEY")
        if not api_key:
            raise ValueError("DEEPSEEK_API_KEY not found in environment")
        deepseek_client = OpenAI(
            api_key=api_key,
            base_url="https://api.deepseek.com"
        )
    return deepseek_client


# Models
class ChatMessage(BaseModel):
    role: str  # 'user' or 'assistant'
    content: str


class ChatRequest(BaseModel):
    agent_id: str
    messages: List[ChatMessage]
    temperature: Optional[float] = 0.7


class ChatResponse(BaseModel):
    message: str
    agent_id: str
    timestamp: str


# Cache des personnalités d'agents
agent_personalities: Dict[str, str] = {}


def load_agent_personality(agent_id: str) -> str:
    """
    Charge la personnalité d'un agent depuis son fichier YAML BMAD.

    Args:
        agent_id: ID de l'agent (ex: 'bmm-architect', 'bmm-pm')

    Returns:
        Prompt système avec la personnalité de l'agent
    """
    if agent_id in agent_personalities:
        return agent_personalities[agent_id]

    # Mapping des IDs vers fichiers YAML
    agent_files = {
        "bmm-architect": "architect.agent.yaml",
        "bmm-pm": "pm.agent.yaml",
        "bmm-coder": "dev.agent.yaml",
        "bmm-developer": "dev.agent.yaml",
        "bmm-tester": "tea.agent.yaml",
        "bmm-debugger": "dev.agent.yaml",  # Pas de debugger séparé
        "bmm-documenter": "tech-writer.agent.yaml",
        "bmb-builder": "dev.agent.yaml",  # Utilise dev comme fallback
        "cis-ideator": "dev.agent.yaml",  # Utilise dev comme fallback
        "cis-strategist": "pm.agent.yaml",  # Utilise PM comme fallback
    }

    agent_file = agent_files.get(agent_id)
    if not agent_file:
        logger.warning(f"Unknown agent ID: {agent_id}, using default")
        return create_default_personality(agent_id)

    agent_yaml_path = AGENTS_PATH / agent_file

    if not agent_yaml_path.exists():
        logger.warning(f"Agent file not found: {agent_yaml_path}")
        return create_default_personality(agent_id)

    try:
        with open(agent_yaml_path, "r", encoding="utf-8") as f:
            agent_data = yaml.safe_load(f)

        agent_info = agent_data.get("agent", {})
        metadata = agent_info.get("metadata", {})
        persona = agent_info.get("persona", {})

        # Construire le prompt système
        system_prompt = f"""Tu es {metadata.get('name', 'un agent BMAD')}, {metadata.get('title', 'Expert')}.

**Ton rôle:** {persona.get('role', 'Expert en développement logiciel')}

**Ton identité:** {persona.get('identity', 'Expert avec expérience significative')}

**Ton style de communication:** {persona.get('communication_style', 'Professionnel et clair')}

**Tes principes:**
{persona.get('principles', 'Excellence et qualité dans tout ce que tu fais')}

**Instructions importantes:**
1. Réponds TOUJOURS en français
2. Sois concret et pratique
3. Pose des questions pour clarifier quand nécessaire
4. Propose des exemples de code quand c'est pertinent
5. Reste fidèle à ta personnalité et tes principes
6. Guide l'utilisateur vers les bonnes décisions

Tu travailles dans l'écosystème BMAD (Build More, Architect Dreams) qui suit la philosophie C.O.R.E.:
- **C**ollaboration: Travail humain-AI
- **O**ptimized: Processus optimisés
- **R**eflection: Questions stratégiques
- **E**ngine: Orchestration d'agents

Commence ta première réponse par une salutation amicale et présente-toi brièvement."""

        agent_personalities[agent_id] = system_prompt
        return system_prompt

    except Exception as e:
        logger.error(f"Error loading agent personality: {e}")
        return create_default_personality(agent_id)


def create_default_personality(agent_id: str) -> str:
    """Crée une personnalité par défaut si le fichier YAML n'existe pas"""
    agent_names = {
        "bmm-architect": "Winston, l'Architecte Système",
        "bmm-pm": "John, le Product Manager",
        "bmm-coder": "le Developer",
        "bmm-developer": "le Developer",
        "bmm-tester": "le Test Architect",
        "bmm-debugger": "le Debugger",
        "bmm-documenter": "le Technical Writer",
        "bmb-builder": "le BMad Builder",
        "cis-ideator": "l'Ideator créatif",
        "cis-strategist": "le Strategist",
    }

    name = agent_names.get(agent_id, "un agent BMAD")

    return f"""Tu es {name}, membre de l'équipe BMAD (Build More, Architect Dreams).

Tu es un expert dans ton domaine et tu aides les utilisateurs à construire de meilleurs produits.

**Ton style:**
- Professionnel mais accessible
- Pose des questions pour clarifier
- Donne des exemples concrets
- Reste pratique et pragmatique

**Tes responsabilités:**
- Guider l'utilisateur vers les bonnes décisions
- Poser les bonnes questions
- Proposer des solutions concrètes
- Partager ton expertise

Réponds TOUJOURS en français. Commence par te présenter brièvement."""


@router.post("/chat", response_model=ChatResponse)
async def chat_with_agent(request: ChatRequest):
    """
    Converse avec un agent BMAD en utilisant DeepSeek API.

    L'agent charge sa personnalité depuis les fichiers YAML BMAD
    et utilise DeepSeek pour générer des réponses authentiques.
    """
    try:
        # Charger la personnalité de l'agent
        system_prompt = load_agent_personality(request.agent_id)

        # Obtenir le client DeepSeek
        client = get_deepseek_client()

        # Convertir les messages au format OpenAI
        openai_messages = [
            {"role": "system", "content": system_prompt}
        ]

        # Ajouter les messages de conversation
        for msg in request.messages:
            openai_messages.append({
                "role": msg.role,
                "content": msg.content
            })

        # Appeler DeepSeek API (OpenAI compatible)
        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=openai_messages,
            max_tokens=2048,
            temperature=request.temperature,
        )

        # Extraire la réponse
        assistant_message = response.choices[0].message.content

        logger.info(f"Chat response generated for agent {request.agent_id} via DeepSeek")

        return ChatResponse(
            message=assistant_message,
            agent_id=request.agent_id,
            timestamp=datetime.utcnow().isoformat(),
        )

    except Exception as e:
        logger.error(f"Error in chat_with_agent: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate chat response: {str(e)}",
        )


@router.get("/agents/{agent_id}/personality")
async def get_agent_personality(agent_id: str):
    """
    Récupère la personnalité d'un agent (pour debug).
    """
    try:
        personality = load_agent_personality(agent_id)
        return {
            "agent_id": agent_id,
            "personality": personality,
            "source": "BMAD YAML" if agent_id in agent_personalities else "default",
        }
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to load personality: {str(e)}"
        )


@router.get("/chat/health")
async def chat_health():
    """Vérifie que l'API DeepSeek est accessible"""
    try:
        client = get_deepseek_client()

        # Test simple avec DeepSeek
        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=[{"role": "user", "content": "test"}],
            max_tokens=10,
        )

        return {
            "status": "healthy",
            "deepseek_api": "connected",
            "model": "deepseek-chat",
            "agents_loaded": len(agent_personalities),
            "bmad_path": str(BMAD_PATH),
            "agents_path_exists": AGENTS_PATH.exists(),
        }
    except Exception as e:
        logger.error(f"Chat health check failed: {e}")
        return {
            "status": "degraded",
            "error": str(e),
            "deepseek_api": "error",
        }
