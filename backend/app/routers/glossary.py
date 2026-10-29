from fastapi import APIRouter, HTTPException
from typing import List
from ..schemas.framework import FolderExplanation
from ..services.glossary_service import GlossaryService

router = APIRouter(prefix="/api/glossary", tags=["Glosario y Explicador de Estructura"])


@router.get("/{framework}", response_model=List[FolderExplanation], summary="Listar todas las carpetas y roles de un framework")
async def get_framework_glossary(framework: str):
    """
    Devuelve la explicación didáctica de todas las carpetas estándar de un framework
    (ej: Spring Boot, Laravel, Django).
    """
    folders = GlossaryService.get_all_folders(framework)
    return folders


@router.get("/{framework}/{folder_name}", response_model=FolderExplanation, summary="Explicar una carpeta específica en lenguaje simple")
async def get_folder_explanation(framework: str, folder_name: str):
    """
    El estudiante elige una carpeta del árbol y el asistente le explica en palabras
    sencillas para qué sirve, qué va allí, convenciones y antipatrones.
    """
    explanation = GlossaryService.get_explanation(framework, folder_name)
    if not explanation:
        raise HTTPException(
            status_code=404,
            detail=f"No se encontró información didáctica para '{folder_name}' en {framework}"
        )
    return explanation
