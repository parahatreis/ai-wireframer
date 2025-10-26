from fastapi import APIRouter
from .health import router as health_router
from .generation import router as generation_router

router = APIRouter()
router.include_router(health_router)
router.include_router(generation_router)

