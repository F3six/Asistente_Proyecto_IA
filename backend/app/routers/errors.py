from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import or_, desc
from typing import List, Optional

from ..database import get_db
from ..models.error_log import ErrorLog
from ..schemas.error_log import ErrorLogCreate, ErrorLogUpdate, ErrorLogResponse

router = APIRouter(prefix="/api/errors", tags=["Bitácora de Errores"])


@router.get("/", response_model=List[ErrorLogResponse], summary="Listar errores documentados")
async def get_errors(
    category: Optional[str] = Query(None, description="Filtro por categoría: Database, Routing, Views, Security"),
    status: Optional[str] = Query(None, description="Filtro por estado: open, resolved, verified"),
    search: Optional[str] = Query(None, description="Término de búsqueda en título, síntoma o solución"),
    project_id: Optional[int] = Query(None, description="ID del proyecto asociado"),
    db: AsyncSession = Depends(get_db)
):
    query = select(ErrorLog).order_by(desc(ErrorLog.created_at))

    if category and category.lower() != "all" and category.lower() != "todos":
        query = query.where(ErrorLog.category.ilike(category))

    if status:
        query = query.where(ErrorLog.status == status)

    if project_id:
        query = query.where(ErrorLog.project_id == project_id)

    if search:
        search_filter = f"%{search}%"
        query = query.where(
            or_(
                ErrorLog.title.ilike(search_filter),
                ErrorLog.symptom.ilike(search_filter),
                ErrorLog.root_cause.ilike(search_filter),
                ErrorLog.solution.ilike(search_filter),
                ErrorLog.layer.ilike(search_filter)
            )
        )

    result = await db.execute(query)
    return result.scalars().all()


@router.post("/", response_model=ErrorLogResponse, status_code=201, summary="Documentar un nuevo error")
async def create_error(
    payload: ErrorLogCreate,
    db: AsyncSession = Depends(get_db)
):
    new_error = ErrorLog(
        project_id=payload.project_id,
        title=payload.title,
        category=payload.category,
        layer=payload.layer or "General",
        symptom=payload.symptom,
        root_cause=payload.root_cause,
        solution=payload.solution,
        status=payload.status or "resolved",
        resolved_by=payload.resolved_by or "Estudiante Ing."
    )
    db.add(new_error)
    await db.commit()
    await db.refresh(new_error)
    return new_error


@router.get("/{error_id}", response_model=ErrorLogResponse, summary="Obtener detalle de un error")
async def get_error_by_id(error_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ErrorLog).where(ErrorLog.id == error_id))
    error = result.scalars().first()
    if not error:
        raise HTTPException(status_code=404, detail="Error no encontrado en la bitácora")
    return error


@router.put("/{error_id}", response_model=ErrorLogResponse, summary="Actualizar error documentado")
async def update_error(
    error_id: int,
    payload: ErrorLogUpdate,
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(ErrorLog).where(ErrorLog.id == error_id))
    error = result.scalars().first()
    if not error:
        raise HTTPException(status_code=404, detail="Error no encontrado en la bitácora")

    update_data = payload.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        setattr(error, field, val)

    await db.commit()
    await db.refresh(error)
    return error


@router.delete("/{error_id}", status_code=204, summary="Eliminar error de la bitácora")
async def delete_error(error_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ErrorLog).where(ErrorLog.id == error_id))
    error = result.scalars().first()
    if not error:
        raise HTTPException(status_code=404, detail="Error no encontrado en la bitácora")

    await db.delete(error)
    await db.commit()
    return None
