"""
BMAD Orchestrator Service - Intégration du vrai bmad-method

Utilise le système bmad-method complet pour l'orchestration d'agents.
"""

import os
import json
import subprocess
import logging
from pathlib import Path
from typing import List, Dict, Any, Optional

logger = logging.getLogger(__name__)

# Chemin vers bmad-method installé
BMAD_ROOT = Path(__file__).resolve().parent.parent.parent.parent / "bmad"
BMAD_CLI = BMAD_ROOT / "tools" / "cli" / "bmad-cli.js"


class BMADOrchestrator:
    """Wrapper Python pour bmad-method Node.js"""

    def __init__(self):
        self.bmad_root = BMAD_ROOT
        self.bmad_cli = BMAD_CLI

        if not self.bmad_cli.exists():
            raise FileNotFoundError(f"BMAD CLI not found at {self.bmad_cli}")

    def execute_command(self, command: List[str], timeout: int = 30) -> Dict[str, Any]:
        """
        Exécute une commande bmad-method via Node.js

        Args:
            command: Liste des arguments de commande
            timeout: Timeout en secondes

        Returns:
            Dict avec stdout, stderr, returncode
        """
        try:
            # Construire la commande complète
            full_command = ["node", str(self.bmad_cli)] + command

            logger.info(f"Executing BMAD command: {' '.join(command)}")

            # Exécuter la commande
            result = subprocess.run(
                full_command,
                cwd=str(self.bmad_root),
                capture_output=True,
                text=True,
                timeout=timeout,
                env={**os.environ, "NODE_ENV": "production"}
            )

            return {
                "stdout": result.stdout,
                "stderr": result.stderr,
                "returncode": result.returncode,
                "success": result.returncode == 0
            }

        except subprocess.TimeoutExpired:
            logger.error(f"BMAD command timeout after {timeout}s")
            return {
                "stdout": "",
                "stderr": f"Command timeout after {timeout}s",
                "returncode": -1,
                "success": False
            }
        except Exception as e:
            logger.error(f"Error executing BMAD command: {e}")
            return {
                "stdout": "",
                "stderr": str(e),
                "returncode": -1,
                "success": False
            }

    def get_status(self) -> Dict[str, Any]:
        """Obtient le statut de bmad-method"""
        result = self.execute_command(["status"])

        if result["success"]:
            try:
                # Parser la sortie JSON si possible
                return json.loads(result["stdout"])
            except json.JSONDecodeError:
                return {
                    "status": "running",
                    "output": result["stdout"]
                }

        return {
            "status": "error",
            "error": result["stderr"]
        }

    def list_agents(self) -> List[Dict[str, Any]]:
        """Liste tous les agents BMAD disponibles"""
        agents_dir = self.bmad_root / "src" / "modules"
        agents = []

        # Scanner les modules pour trouver les agents
        for module_dir in agents_dir.iterdir():
            if module_dir.is_dir():
                agents_subdir = module_dir / "agents"
                if agents_subdir.exists():
                    for agent_file in agents_subdir.glob("*.agent.yaml"):
                        try:
                            import yaml
                            with open(agent_file, 'r', encoding='utf-8') as f:
                                agent_data = yaml.safe_load(f)

                            if agent_data and 'agent' in agent_data:
                                agent_info = agent_data['agent']
                                agents.append({
                                    "id": agent_file.stem.replace('.agent', ''),
                                    "module": module_dir.name,
                                    "name": agent_info.get('metadata', {}).get('name', 'Unknown'),
                                    "title": agent_info.get('metadata', {}).get('title', ''),
                                    "description": agent_info.get('metadata', {}).get('tagline', ''),
                                    "file": str(agent_file)
                                })
                        except Exception as e:
                            logger.error(f"Error loading agent {agent_file}: {e}")

        return agents

    def execute_agent_task(
        self,
        agent_id: str,
        task: str,
        context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Exécute une tâche avec un agent BMAD spécifique

        Args:
            agent_id: ID de l'agent (ex: 'architect', 'pm')
            task: Description de la tâche
            context: Contexte additionnel pour l'agent

        Returns:
            Résultat de l'exécution
        """
        # Pour l'instant, bmad-method n'a pas d'API directe pour exécuter des tâches
        # On va utiliser notre approche hybride: personnalité YAML + LLM

        logger.warning(
            "BMAD orchestration not fully implemented yet. "
            "Using hybrid approach (YAML personality + LLM)"
        )

        return {
            "success": False,
            "error": "Full BMAD orchestration not implemented. Use /api/bmad/chat instead."
        }

    def create_workflow(
        self,
        workflow_name: str,
        agents: List[str],
        steps: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """
        Crée un workflow BMAD avec plusieurs agents

        Args:
            workflow_name: Nom du workflow
            agents: Liste des IDs d'agents à utiliser
            steps: Étapes du workflow

        Returns:
            Workflow créé
        """
        # TODO: Implémenter création de workflow BMAD
        logger.warning("Workflow creation not implemented yet")

        return {
            "success": False,
            "error": "Workflow creation not implemented yet"
        }


# Instance globale
bmad_orchestrator = BMADOrchestrator()
