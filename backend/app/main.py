from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .config import settings
from .database import init_db
from .routers import (
    projects_router,
    errors_router,
    glossary_router,
    suggestions_router,
    reports_router
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Inicialización de tablas SQLite / PostgreSQL
    await init_db()
    yield


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Backend del Asistente Didáctico de Proyectos para Estudiantes de Ingeniería de Sistemas (DevEdu Shell).",
    lifespan=lifespan
)

# Configuración de CORS
is_wildcard = "*" in settings.CORS_ORIGINS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if is_wildcard else settings.CORS_ORIGINS,
    allow_credentials=not is_wildcard,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registro de enrutadores
app.include_router(projects_router)
app.include_router(errors_router)
app.include_router(glossary_router)
app.include_router(suggestions_router)
app.include_router(reports_router)


@app.get("/", tags=["General"])
async def root():
    return {
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "online",
        "docs_url": "/docs",
        "didactic_scope": "Herramienta de análisis estructural sin compilación en vivo"
    }


@app.get("/health", tags=["General"])
async def health():
    return {"status": "ok"}
