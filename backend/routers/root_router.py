from fastapi import APIRouter
from routers.auth_router import auth_router
from routers.app_router import app_router
router = APIRouter()  

router.include_router(auth_router, prefix="/auth", tags=["Auth"])
router.include_router(app_router, prefix="/app", tags=["App"])