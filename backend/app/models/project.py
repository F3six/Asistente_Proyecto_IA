from sqlalchemy import Column, Integer, String, Float, DateTime, Text, JSON
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from ..database import Base


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(200), nullable=False)
    path = Column(String(500), nullable=False)
    framework = Column(String(50), nullable=True)  # Spring Boot, Laravel, Django
    architecture_type = Column(String(100), nullable=True)  # MVC N-Tier, MVC, MTV
    alignment_score = Column(Float, default=100.0)  # Porcentaje de orden
    total_files = Column(Integer, default=0)
    misplaced_files_count = Column(Integer, default=0)
    structure_summary = Column(JSON, nullable=True)  # Árbol resumido en JSON
    misplaced_details = Column(JSON, nullable=True)  # Lista de hallazgos
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relación con la bitácora de errores
    error_logs = relationship("ErrorLog", back_populates="project", cascade="all, delete-orphan")
