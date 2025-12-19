from fastapi import APIRouter
from typing import List, Optional

from app.schemas import TemplateResponse

router = APIRouter()


# Predefined templates
TEMPLATES = [
    TemplateResponse(
        id="1",
        name="Pub Produit E-commerce",
        description="Présentez vos produits avec des animations modernes et dynamiques",
        category="E-commerce",
        thumbnail_url="/templates/ecommerce.jpg",
        duration=15,
        credits=15,
        parameters={
            "product_image": {"type": "image", "required": True},
            "product_name": {"type": "text", "required": True},
            "price": {"type": "text", "required": False},
            "call_to_action": {"type": "text", "default": "Achetez maintenant!"},
        },
    ),
    TemplateResponse(
        id="2",
        name="Story Instagram Promo",
        description="Format vertical optimisé pour les stories avec call-to-action",
        category="Social Media",
        thumbnail_url="/templates/story.jpg",
        duration=10,
        credits=10,
        parameters={
            "background_image": {"type": "image", "required": True},
            "title": {"type": "text", "required": True},
            "subtitle": {"type": "text", "required": False},
        },
    ),
    TemplateResponse(
        id="3",
        name="Intro YouTube",
        description="Intro professionnelle pour chaîne YouTube avec logo animé",
        category="YouTube",
        thumbnail_url="/templates/youtube.jpg",
        duration=5,
        credits=8,
        parameters={
            "logo": {"type": "image", "required": True},
            "channel_name": {"type": "text", "required": True},
        },
    ),
    TemplateResponse(
        id="4",
        name="CAN 2025 - Match Preview",
        description="Template spécial CAN 2025 pour présenter les matchs à venir",
        category="Sport",
        thumbnail_url="/templates/can2025.jpg",
        duration=20,
        credits=20,
        parameters={
            "team1_logo": {"type": "image", "required": True},
            "team2_logo": {"type": "image", "required": True},
            "team1_name": {"type": "text", "required": True},
            "team2_name": {"type": "text", "required": True},
            "match_date": {"type": "text", "required": True},
            "stadium": {"type": "text", "required": False},
        },
    ),
    TemplateResponse(
        id="5",
        name="Immobilier - Visite Virtuelle",
        description="Présentez des biens immobiliers avec survol cinématique",
        category="Immobilier",
        thumbnail_url="/templates/realestate.jpg",
        duration=30,
        credits=25,
        parameters={
            "property_images": {"type": "images", "required": True, "max": 5},
            "property_title": {"type": "text", "required": True},
            "price": {"type": "text", "required": True},
            "location": {"type": "text", "required": True},
            "features": {"type": "text", "required": False},
        },
    ),
    TemplateResponse(
        id="6",
        name="Restaurant - Menu du Jour",
        description="Mettez en valeur vos plats avec des plans appétissants",
        category="Food",
        thumbnail_url="/templates/food.jpg",
        duration=15,
        credits=12,
        parameters={
            "dish_images": {"type": "images", "required": True, "max": 3},
            "restaurant_name": {"type": "text", "required": True},
            "menu_items": {"type": "text", "required": True},
            "price": {"type": "text", "required": False},
        },
    ),
]


@router.get("", response_model=List[TemplateResponse])
async def list_templates(category: Optional[str] = None):
    """List all available templates"""
    if category:
        return [t for t in TEMPLATES if t.category.lower() == category.lower()]
    return TEMPLATES


@router.get("/{template_id}", response_model=TemplateResponse)
async def get_template(template_id: str):
    """Get a specific template by ID"""
    for template in TEMPLATES:
        if template.id == template_id:
            return template
    return None
