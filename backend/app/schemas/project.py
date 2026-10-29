from pydantic import BaseModel, ConfigDict
from typing import Optional, List, Any
from datetime import datetime


class ProjectBase(BaseModel):
    name: str
    path: str


class ProjectCreate(ProjectBase):
    pass


class ProjectResponse(ProjectBase):
    id: int
    framework: Optional[str] = None
    architecture_type: Optional[str] = None
    alignment_score: float = 100.0
    total_files: int = 0
    misplaced_files_count: int = 0
    structure_summary: Optional[Any] = None
    misplaced_details: Optional[List[Any]] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class MisplacedFileDetail(BaseModel):
    file_name: str
    current_path: str
    suggested_path: str
    reason: str
    severity: str = "warning"  # warning, critical


class TreeNode(BaseModel):
    name: str
    path: str
    type: str  # "folder" or "file"
    children: Optional[List["TreeNode"]] = None
    layer: Optional[str] = None
    is_misplaced: bool = False
    warning_reason: Optional[str] = None
    annotation: Optional[str] = None
    metadata: Optional[dict] = None


class AnalysisRequest(BaseModel):
    project_path: Optional[str] = None
    project_name: Optional[str] = None
    file_tree: Optional[List[dict]] = None


class AnalysisResponse(BaseModel):
    project_id: Optional[int] = None
    project_name: str
    framework: str
    version: Optional[str] = None
    architecture_type: str
    alignment_score: float
    total_files: int
    misplaced_count: int
    active_layers: List[str]
    misplaced_files: List[MisplacedFileDetail]
    structure: List[TreeNode]
