"""
Growth Grid - Business Plan & Pitch Generator Service
Génération de business plans professionnels avec IA
"""

import os
import json
from typing import Dict, Any, List, Optional
from datetime import datetime
import anthropic
import openai
from jinja2 import Template

class GrowthGridService:
    """Service pour générer des business plans avec IA"""

    def __init__(self):
        self.anthropic_key = os.getenv("ANTHROPIC_API_KEY")
        self.openai_key = os.getenv("OPENAI_API_KEY")

        # Templates par secteur
        self.sector_templates = {
            "tech": self._get_tech_template(),
            "ecommerce": self._get_ecommerce_template(),
            "food": self._get_food_template(),
            "retail": self._get_retail_template(),
            "service": self._get_service_template(),
            "education": self._get_education_template()
        }

    async def generate_business_plan(
        self,
        data: Dict[str, Any],
        language: str = "fr",
        detail_level: str = "standard"
    ) -> Dict[str, Any]:
        """
        Génère un business plan complet avec IA

        Args:
            data: Données du formulaire
            language: Langue (fr/ar/en)
            detail_level: Niveau de détail (concise/standard/detailed)

        Returns:
            Business plan formaté en HTML
        """

        # Préparer le prompt pour l'IA
        prompt = self._build_prompt(data, language, detail_level)

        # Générer avec Claude ou GPT
        if self.anthropic_key:
            content = await self._generate_with_claude(prompt, language, detail_level)
        elif self.openai_key:
            content = await self._generate_with_gpt(prompt, language, detail_level)
        else:
            # Fallback: template statique
            content = self._generate_from_template(data, language)

        return {
            "content": content,
            "generated_at": datetime.now().isoformat(),
            "language": language,
            "detail_level": detail_level
        }

    def _build_prompt(self, data: Dict[str, Any], language: str, detail_level: str) -> str:
        """Construit le prompt pour l'IA"""

        page_counts = {
            "concise": "5-10 pages",
            "standard": "15-20 pages",
            "detailed": "25-30 pages"
        }

        prompt = f"""Tu es un expert en création de business plans pour le marché algérien.

CONTEXTE DU PROJET:
- Type: {data.get('projectType', 'N/A')}
- Nom entreprise: {data.get('companyName', 'N/A')}
- Forme juridique: {data.get('legalForm', 'N/A')}
- Localisation: {data.get('location', 'N/A')}

DESCRIPTION:
{data.get('shortDescription', 'N/A')}

MISSION & VISION:
{data.get('missionVision', 'N/A')}

MARCHÉ:
- Cible: {data.get('targetMarket', 'N/A')}
- Problème résolu: {data.get('problemSolved', 'N/A')}
- Concurrence: {data.get('competition', 'N/A')}
- Avantages: {data.get('competitiveAdvantage', 'N/A')}

FINANCES:
- Capital initial: {data.get('initialCapital', 'N/A')} DZD
- Besoin financement: {data.get('fundingNeeded', 'N/A')} DZD
- Modèle revenus: {data.get('revenueModel', 'N/A')}
- CA An 1: {data.get('revenueYear1', 'N/A')} DZD
- CA An 3: {data.get('revenueYear3', 'N/A')} DZD
- Charges mensuelles: {data.get('monthlyExpenses', 'N/A')} DZD

INSTRUCTIONS:
Crée un business plan professionnel en {language.upper()} de niveau {detail_level} ({page_counts.get(detail_level, '15-20 pages')}).

Le business plan doit contenir:
1. **Executive Summary** - Résumé exécutif (1-2 pages)
2. **Présentation de l'entreprise** - Histoire, mission, vision, valeurs
3. **Produits et services** - Offre détaillée, proposition de valeur unique
4. **Analyse du marché** - Taille du marché, tendances, segmentation
5. **Analyse concurrentielle** - Concurrents directs/indirects, positionnement
6. **Stratégie marketing** - Mix marketing 4P, canaux d'acquisition
7. **Plan opérationnel** - Processus, ressources, fournisseurs
8. **Équipe et organisation** - Structure, profils clés, recrutement
9. **Plan financier** - Prévisions 3 ans, compte de résultat, bilan, trésorerie
10. **Risques et mitigation** - Risques identifiés et stratégies

IMPORTANT:
- Adapte le contenu au marché algérien (réglementation DZ, fiscalité, culture business)
- Utilise des données réalistes pour l'Algérie
- Inclus des conseils spécifiques pour le secteur {data.get('projectType', '')}
- Formate en HTML avec balises <h2>, <h3>, <p>, <ul>, <li>, <table>
- Utilise des tableaux pour les données financières
- Ajoute des graphiques textuels si pertinent

Format de sortie: HTML complet, bien formaté, prêt à afficher."""

        return prompt

    async def _generate_with_claude(self, prompt: str, language: str, detail_level: str) -> str:
        """Génère avec Claude (Anthropic)"""

        client = anthropic.Anthropic(api_key=self.anthropic_key)

        # Tokens selon niveau de détail
        max_tokens = {
            "concise": 4000,
            "standard": 8000,
            "detailed": 16000
        }.get(detail_level, 8000)

        try:
            message = client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=max_tokens,
                temperature=0.7,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )

            return message.content[0].text

        except Exception as e:
            print(f"Error with Claude: {e}")
            raise

    async def _generate_with_gpt(self, prompt: str, language: str, detail_level: str) -> str:
        """Génère avec GPT-4 (OpenAI)"""

        client = openai.OpenAI(api_key=self.openai_key)

        # Tokens selon niveau de détail
        max_tokens = {
            "concise": 4000,
            "standard": 8000,
            "detailed": 16000
        }.get(detail_level, 8000)

        try:
            response = client.chat.completions.create(
                model="gpt-4-turbo-preview",
                messages=[
                    {"role": "system", "content": "Tu es un expert en création de business plans pour le marché algérien."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=max_tokens,
                temperature=0.7
            )

            return response.choices[0].message.content

        except Exception as e:
            print(f"Error with GPT: {e}")
            raise

    def _generate_from_template(self, data: Dict[str, Any], language: str) -> str:
        """Génère depuis template (fallback sans IA)"""

        project_type = data.get('projectType', 'service')
        template = self.sector_templates.get(project_type, self.sector_templates['service'])

        # Remplacer les variables
        content = template.replace('{{COMPANY_NAME}}', data.get('companyName', 'Votre Entreprise'))
        content = content.replace('{{DESCRIPTION}}', data.get('shortDescription', 'Description non fournie'))
        content = content.replace('{{TARGET_MARKET}}', data.get('targetMarket', 'Marché non défini'))
        content = content.replace('{{CAPITAL}}', str(data.get('initialCapital', '0')))

        return content

    def _get_tech_template(self) -> str:
        """Template pour secteur Tech"""
        return """
        <h2>1. Executive Summary</h2>
        <p><strong>{{COMPANY_NAME}}</strong> est une entreprise technologique innovante qui vise à révolutionner le marché algérien.</p>
        <p>{{DESCRIPTION}}</p>

        <h2>2. Présentation de l'Entreprise</h2>
        <h3>2.1 Vision</h3>
        <p>Devenir le leader technologique en Algérie dans notre domaine.</p>

        <h3>2.2 Mission</h3>
        <p>Fournir des solutions technologiques de haute qualité adaptées au marché local.</p>

        <h2>3. Analyse du Marché</h2>
        <h3>3.1 Marché Cible</h3>
        <p>{{TARGET_MARKET}}</p>

        <h3>3.2 Taille du Marché</h3>
        <p>Le marché du digital en Algérie connaît une croissance de 15% par an avec plus de 30 millions d'utilisateurs internet.</p>

        <h2>4. Plan Financier</h2>
        <h3>4.1 Capital Initial</h3>
        <p>Capital de départ: {{CAPITAL}} DZD</p>

        <h3>4.2 Prévisions</h3>
        <table border="1" cellpadding="10" style="border-collapse: collapse; width: 100%; margin: 20px 0;">
            <tr style="background: #f0f0f0;">
                <th>Année</th>
                <th>Chiffre d'Affaires (DZD)</th>
                <th>Charges (DZD)</th>
                <th>Résultat (DZD)</th>
            </tr>
            <tr>
                <td>An 1</td>
                <td>5,000,000</td>
                <td>4,000,000</td>
                <td>1,000,000</td>
            </tr>
            <tr>
                <td>An 2</td>
                <td>12,000,000</td>
                <td>8,000,000</td>
                <td>4,000,000</td>
            </tr>
            <tr>
                <td>An 3</td>
                <td>25,000,000</td>
                <td>15,000,000</td>
                <td>10,000,000</td>
            </tr>
        </table>

        <h2>5. Stratégie Marketing</h2>
        <h3>5.1 Canaux d'Acquisition</h3>
        <ul>
            <li>Marketing digital (Facebook, Instagram, LinkedIn)</li>
            <li>SEO et content marketing</li>
            <li>Partenariats stratégiques</li>
            <li>Événements et conférences tech</li>
        </ul>

        <h2>6. Risques et Mitigation</h2>
        <h3>6.1 Risques Identifiés</h3>
        <ul>
            <li><strong>Risque concurrentiel</strong>: Nouveaux entrants sur le marché</li>
            <li><strong>Risque technologique</strong>: Évolution rapide des technologies</li>
            <li><strong>Risque financier</strong>: Besoin de fonds supplémentaires</li>
        </ul>

        <h3>6.2 Stratégies de Mitigation</h3>
        <ul>
            <li>Innovation continue et R&D</li>
            <li>Diversification des sources de revenus</li>
            <li>Partenariats solides avec investisseurs</li>
        </ul>
        """

    def _get_ecommerce_template(self) -> str:
        """Template pour E-commerce"""
        return """
        <h2>1. Executive Summary</h2>
        <p><strong>{{COMPANY_NAME}}</strong> est une plateforme e-commerce innovante pour le marché algérien.</p>
        <p>{{DESCRIPTION}}</p>

        <h2>2. Modèle E-commerce</h2>
        <h3>2.1 Type de Plateforme</h3>
        <ul>
            <li>Boutique en ligne B2C</li>
            <li>Livraison rapide en Algérie</li>
            <li>Paiement sécurisé (CCP, BaridiMob, carte bancaire)</li>
        </ul>

        <h2>3. Catalogue Produits</h2>
        <p>Large gamme de produits adaptés au marché local.</p>

        <h2>4. Logistique</h2>
        <h3>4.1 Stockage</h3>
        <p>Entrepôt central + points relais dans les grandes villes.</p>

        <h3>4.2 Livraison</h3>
        <ul>
            <li>Livraison domicile: 48-72h</li>
            <li>Points relais: 24-48h</li>
            <li>Frais de port dégressifs</li>
        </ul>

        <h2>5. Plan Financier</h2>
        <table border="1" cellpadding="10" style="border-collapse: collapse; width: 100%; margin: 20px 0;">
            <tr style="background: #f0f0f0;">
                <th>Metric</th>
                <th>An 1</th>
                <th>An 2</th>
                <th>An 3</th>
            </tr>
            <tr>
                <td>Commandes/mois</td>
                <td>500</td>
                <td>2,000</td>
                <td>5,000</td>
            </tr>
            <tr>
                <td>Panier moyen (DZD)</td>
                <td>5,000</td>
                <td>6,000</td>
                <td>7,000</td>
            </tr>
            <tr>
                <td>CA mensuel (DZD)</td>
                <td>2,500,000</td>
                <td>12,000,000</td>
                <td>35,000,000</td>
            </tr>
        </table>
        """

    def _get_food_template(self) -> str:
        """Template pour Restauration"""
        return """
        <h2>1. Concept Restaurant</h2>
        <p><strong>{{COMPANY_NAME}}</strong> - {{DESCRIPTION}}</p>

        <h2>2. Menu et Offre</h2>
        <h3>2.1 Carte</h3>
        <p>Menu varié alliant tradition et modernité, adapté aux goûts algériens.</p>

        <h3>2.2 Prix</h3>
        <p>Positionnement: Milieu de gamme (300-1500 DZD/plat)</p>

        <h2>3. Emplacement</h2>
        <p>{{TARGET_MARKET}}</p>
        <p>Zone à fort passage, accessible, parking disponible.</p>

        <h2>4. Équipe</h2>
        <ul>
            <li>Chef cuisinier expérimenté</li>
            <li>2-3 cuisiniers</li>
            <li>4-6 serveurs</li>
            <li>Gérant/Manager</li>
        </ul>

        <h2>5. Investissements</h2>
        <h3>5.1 Aménagement</h3>
        <ul>
            <li>Travaux et décoration: 3,000,000 DZD</li>
            <li>Équipement cuisine: 2,500,000 DZD</li>
            <li>Mobilier salle: 1,500,000 DZD</li>
            <li>Fonds de roulement: 1,000,000 DZD</li>
        </ul>

        <h3>5.2 Total</h3>
        <p><strong>Capital initial: {{CAPITAL}} DZD</strong></p>
        """

    def _get_retail_template(self) -> str:
        """Template pour Commerce"""
        return self._get_ecommerce_template()  # Similar structure

    def _get_service_template(self) -> str:
        """Template pour Services"""
        return self._get_tech_template()  # Similar structure

    def _get_education_template(self) -> str:
        """Template pour Éducation"""
        return """
        <h2>1. Centre de Formation</h2>
        <p><strong>{{COMPANY_NAME}}</strong> - Centre de formation professionnelle</p>
        <p>{{DESCRIPTION}}</p>

        <h2>2. Programmes de Formation</h2>
        <h3>2.1 Catalogue</h3>
        <ul>
            <li>Formations courtes (1-3 mois)</li>
            <li>Formations longues (6-12 mois)</li>
            <li>Certifications professionnelles</li>
        </ul>

        <h2>3. Infrastructure</h2>
        <ul>
            <li>Salles de cours équipées</li>
            <li>Matériel pédagogique moderne</li>
            <li>Plateforme e-learning</li>
        </ul>

        <h2>4. Modèle Économique</h2>
        <table border="1" cellpadding="10" style="border-collapse: collapse; width: 100%;">
            <tr>
                <th>Formation</th>
                <th>Durée</th>
                <th>Prix (DZD)</th>
                <th>Stagiaires/an</th>
            </tr>
            <tr>
                <td>Formation courte</td>
                <td>3 mois</td>
                <td>50,000</td>
                <td>200</td>
            </tr>
            <tr>
                <td>Formation longue</td>
                <td>12 mois</td>
                <td>150,000</td>
                <td>80</td>
            </tr>
        </table>
        """

# Export service instance
growth_grid_service = GrowthGridService()
