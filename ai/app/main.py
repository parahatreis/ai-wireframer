from fastapi import FastAPI
from .routes import router

# TODO: Add Sentry before production
# from .lib.sentry import init_sentry
# init_sentry()

app = FastAPI(title="AI Service")
app.include_router(router)

