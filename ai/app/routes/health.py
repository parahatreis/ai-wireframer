from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def health():
  return {"ok": True}

@router.get("/health")
def health():
  return {"ok": True}

