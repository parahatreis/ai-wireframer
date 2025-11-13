from fastapi import APIRouter
from .health import router as health_router
from .html_design import router as html_design_router

router = APIRouter()
router.include_router(health_router)
router.include_router(html_design_router)

