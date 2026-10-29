from .projects import router as projects_router
from .errors import router as errors_router
from .glossary import router as glossary_router
from .suggestions import router as suggestions_router
from .reports import router as reports_router

__all__ = [
    "projects_router",
    "errors_router",
    "glossary_router",
    "suggestions_router",
    "reports_router"
]
