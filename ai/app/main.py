from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import router

# TODO: Add Sentry before production
# from .lib.sentry import init_sentry
# init_sentry()

app = FastAPI(title="AI Service")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

