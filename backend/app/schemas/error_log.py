from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime


class ErrorLogBase(BaseModel):
    title: str
    category: str  # Database, Routing, Views, Security
    layer: Optional[str] = None
    symptom: str
    root_cause: Optional[str] = None
    solution: str
    status: Optional[str] = "resolved"
    resolved_by: Optional[str] = None


class ErrorLogCreate(ErrorLogBase):
    project_id: Optional[int] = None


class ErrorLogUpdate(BaseModel):
    title: Optional[str] = None
    category: Optional[str] = None
    layer: Optional[str] = None
    symptom: Optional[str] = None
    root_cause: Optional[str] = None
    solution: Optional[str] = None
    status: Optional[str] = None
    resolved_by: Optional[str] = None


class ErrorLogResponse(ErrorLogBase):
    id: int
    project_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
