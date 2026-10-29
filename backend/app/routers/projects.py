from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Optional

from ..database import get_db
from ..models.project import Project
from ..models.error_log import ErrorLog
from ..schemas.project import ProjectResponse, AnalysisRequest, AnalysisResponse
from ..services.analyzer import FrameworkAnalyzer

router = APIRouter(prefix="/api/projects", tags=["Proyectos"])


@router.post("/analyze", response_model=AnalysisResponse, summary="Analiza la estructura de un proyecto y detecta el framework")
async def analyze_project(
    payload: AnalysisRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    Lee la estructura de un proyecto (o analiza una ruta/muestra),
    detecta el framework (Spring Boot, Laravel, Django), calcula el índice de alineación
    y marca los archivos fuera de convención.
    """
    project_name = payload.project_name or "Proyecto_Universidad_Final"

    if payload.project_path:
        scanned_files = FrameworkAnalyzer.scan_directory(payload.project_path)
    elif payload.file_tree:
        scanned_files = [f.get("path", "") for f in payload.file_tree if f.get("path")]
    else:
        scanned_files = []

    analysis = FrameworkAnalyzer.analyze(project_name=project_name, file_paths=scanned_files)

    # Persistir o actualizar proyecto en la base de datos
    result = await db.execute(select(Project).where(Project.name == project_name))
    project = result.scalars().first()

    if not project:
        project = Project(
            name=project_name,
            path=payload.project_path or "c:/Users/Usuario/Projects/" + project_name,
            framework=analysis.framework,
            architecture_type=analysis.architecture_type,
            alignment_score=analysis.alignment_score,
            total_files=analysis.total_files,
            misplaced_files_count=analysis.misplaced_count,
            structure_summary=[n.model_dump() for n in analysis.structure],
            misplaced_details=[m.model_dump() for m in analysis.misplaced_files]
        )
        db.add(project)
        await db.commit()
        await db.refresh(project)
        analysis.project_id = project.id

        # Insertar errores iniciales de ejemplo si es nuevo para la bitácora educativa
        sample_errors = [
            ErrorLog(
                project_id=project.id,
                title="Error 404 en endpoint /api/empleados",
                category="Routing",
                layer="Controlador Web",
                symptom="El navegador responde con Whitelabel Error Page 404 al intentar consumir la ruta directa.",
                root_cause="Faltaba la anotación @RestController o el paquete no estaba dentro del component scan.",
                solution="Se agregó @RequestMapping('/api') en la clase y se movió el archivo Java dentro de com.universidad.proyecto.",
                status="verified",
                resolved_by="Juan C."
            ),
            ErrorLog(
                project_id=project.id,
                title="LazyInitializationException en lista de departamentos",
                category="Database",
                layer="Persistencia",
                symptom="No se pueden cargar los empleados asociados al departamento al serializar JSON fuera de la sesión transaccional abierta.",
                root_cause="Carga perezosa (Lazy loading) invocada tras cerrar el contexto del EntityManager de JPA.",
                solution="Se ajustó la relación a FetchType.EAGER o se implementó un DTO específico con campos planos para prevenir bucles de serialización de Hibernate.",
                status="verified",
                resolved_by="Estudiante Ing."
            ),
            ErrorLog(
                project_id=project.id,
                title="TemplateNotFoundException: 'empleados.html'",
                category="Views",
                layer="Frontend SSR",
                symptom="Thymeleaf no encuentra la vista HTML retornada por el método del controlador al intentar renderizar en el navegador.",
                root_cause="La plantilla estaba ubicada erróneamente en /public en vez de /templates.",
                solution="Se reubicó el archivo HTML dentro de src/main/resources/templates según las convenciones estándar de Spring Boot.",
                status="verified",
                resolved_by="Ana M."
            ),
            ErrorLog(
                project_id=project.id,
                title="Circular reference en serialización JSON",
                category="Database",
                layer="Modelos Bidireccionales",
                symptom="Desbordamiento de memoria por StackOverflowError infinito al intentar transformar a JSON relaciones ManyToOne y OneToMany asociadas.",
                root_cause="Relación bidireccional JPA sin exclusión de serializador Jackson en el POJO.",
                solution="Uso puntual de anotaciones @JsonManagedReference y @JsonBackReference en las relaciones bidireccionales de las entidades de dominio.",
                status="verified",
                resolved_by="Estudiante Ing."
            )
        ]
        db.add_all(sample_errors)
        await db.commit()
    else:
        project.framework = analysis.framework
        project.architecture_type = analysis.architecture_type
        project.alignment_score = analysis.alignment_score
        project.total_files = analysis.total_files
        project.misplaced_files_count = analysis.misplaced_count
        project.structure_summary = [n.model_dump() for n in analysis.structure]
        project.misplaced_details = [m.model_dump() for m in analysis.misplaced_files]
        await db.commit()
        await db.refresh(project)
        analysis.project_id = project.id

    return analysis


@router.get("/", response_model=List[ProjectResponse], summary="Lista proyectos analizados")
async def list_projects(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Project).order_by(Project.updated_at.desc()))
    return result.scalars().all()


@router.get("/{project_id}", response_model=ProjectResponse, summary="Obtiene el detalle de un proyecto")
async def get_project(project_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Project).where(Project.id == project_id))
    project = result.scalars().first()
    if not project:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
    return project
