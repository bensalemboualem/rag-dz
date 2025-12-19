"""
BIG RAG - Module Multi-Pays
===========================
RAG international pour DZ + CH + GLOBAL
Détection pays, multi-index, reranker, router IA
"""

from .country_detector import CountryDetector, CountryDetectionResult
from .embedding_pipeline import EmbeddingPipeline
from .reranker_pipeline import RerankerPipeline
from .qdrant_multi import QdrantMultiIndex
from .bigrag_service import BigRAGService, bigrag_service
from .bigrag_router import router as bigrag_router

__all__ = [
    "CountryDetector",
    "CountryDetectionResult",
    "EmbeddingPipeline",
    "RerankerPipeline",
    "QdrantMultiIndex",
    "BigRAGService",
    "bigrag_service",
    "bigrag_router",
]
