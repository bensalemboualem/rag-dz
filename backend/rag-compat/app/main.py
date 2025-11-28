from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from prometheus_client import generate_latest, CONTENT_TYPE_LATEST
import time
import logging

from .middleware import RequestIDMiddleware
from .security import EnhancedAuthMiddleware, RateLimitMiddleware
from .monitoring import init_metrics
from .routers import test, upload, query, websocket_router, knowledge, progress, bmad, bmad_chat, bmad_orchestration, coordination, orchestrator, auth, bolt, agent_chat, calendar, voice, google, email_agent, twilio, whatsapp, user_keys, studio_video, rag_public, credentials, council, council_custom, ithy
from .config import get_settings

settings = get_settings()

logging.basicConfig(
    level=getattr(logging, settings.log_level),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

init_metrics()

app = FastAPI(
    title="IAFactory API",
    version=settings.service_version,
    description="Plateforme IA complète - Chat, Voice, Calendar, Automations",
    docs_url="/docs" if settings.is_development else None,
    redoc_url="/redoc" if settings.is_development else None,
)

# CORS avec configuration sécurisée
if settings.enable_cors:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.get_allowed_origins(),
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["*"],
        expose_headers=["X-Request-Id", "X-RateLimit-Limit", "X-RateLimit-Remaining"],
        max_age=3600,
    )

# Middlewares (ordre important!)
app.add_middleware(RateLimitMiddleware)
app.add_middleware(EnhancedAuthMiddleware)
app.add_middleware(RequestIDMiddleware)

# Routes
app.include_router(auth.router, tags=["Auth"])  # Auth routes (no prefix - already has /api/auth)
app.include_router(test.router, prefix="/api", tags=["Test"])
app.include_router(upload.router, prefix="/api", tags=["Upload"])
app.include_router(query.router, prefix="/api", tags=["Query"])
app.include_router(knowledge.router, tags=["Knowledge"])
app.include_router(progress.router, tags=["Progress"])
app.include_router(bmad.router, tags=["BMAD"])
app.include_router(bmad_chat.router, tags=["BMAD Chat"])
app.include_router(bmad_orchestration.router, tags=["BMAD Orchestration"])
app.include_router(coordination.router, tags=["Coordination"])
app.include_router(orchestrator.router, tags=["Orchestrator"])
app.include_router(bolt.router, tags=["Bolt SuperPower"])
app.include_router(agent_chat.router, tags=["Agent Chat"])  # Compatibilité Archon-UI
app.include_router(calendar.router, tags=["Calendar"])  # Gestion des rendez-vous
app.include_router(voice.router, tags=["Voice Agent"])  # Agent vocal Vapi.ai
app.include_router(google.router, tags=["Google Integration"])  # Google Calendar & Gmail
app.include_router(email_agent.router, tags=["Email Agent"])  # Agent Email (6ème agent)
app.include_router(twilio.router, tags=["Twilio SMS"])  # SMS et rappels Twilio
app.include_router(whatsapp.router, tags=["WhatsApp"])  # WhatsApp Business via Twilio
app.include_router(user_keys.router, tags=["User Keys"])  # Gestion clés API (Key Reselling)
app.include_router(studio_video.router, tags=["Creative Studio"])  # Studio Creatif (Video/Image/Presentation)
app.include_router(rag_public.router, tags=["RAG Public"])  # RAG API publique pour Bolt
app.include_router(credentials.router, tags=["Credentials"])  # Gestion des credentials AI providers
app.include_router(council.router, tags=["Council"])  # LLM Council - Multi-AI deliberation
app.include_router(council_custom.router, tags=["Council Custom"])  # Council personnalisable
app.include_router(ithy.router, tags=["Ithy MoA"])  # Mixture-of-Agents research assistant
app.include_router(websocket_router.router, tags=["WebSocket"])

@app.get("/health")
async def health():
    return {"status": "healthy", "timestamp": time.time(), "service": "IAFactory"}

@app.get("/metrics")
async def metrics():
    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)

@app.get("/")
async def root():
    return {"message": "IAFactory API", "docs": "/docs"}
