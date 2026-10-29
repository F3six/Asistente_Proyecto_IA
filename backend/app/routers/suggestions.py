from fastapi import APIRouter
from ..schemas.framework import SuggestionRequest, FileSuggestion
from ..services.suggestion_service import SuggestionService

router = APIRouter(prefix="/api/suggestions", tags=["Asistente de Nuevos Archivos"])


@router.post("/location", response_model=FileSuggestion, summary="Sugerir ubicación y convención para un nuevo archivo")
async def suggest_file_location(payload: SuggestionRequest):
    """
    Antes de crear algo nuevo, el estudiante describe qué quiere hacer
    (“una pantalla para listar empleados”) y el asistente le indica en qué carpeta va,
    cómo conviene nombrarlo y qué archivos complementarios (Service, Repository) necesitará.
    """
    suggestion = SuggestionService.suggest_location(
        description=payload.description,
        framework=payload.framework or "Spring Boot"
    )
    return suggestion
