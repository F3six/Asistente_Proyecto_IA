from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from ..database import Base


class ErrorLog(Base):
    __tablename__ = "error_logs"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    project_id = Column(Integer, ForeignKey("projects.id", ondelete="CASCADE"), nullable=True, index=True)
    title = Column(String(300), nullable=False)
    category = Column(String(50), nullable=False)  # Database, Routing, Views, Security
    layer = Column(String(100), nullable=True)  # Controlador, Servicio, Persistencia, etc.
    symptom = Column(Text, nullable=False)
    root_cause = Column(Text, nullable=True)
    solution = Column(Text, nullable=False)
    status = Column(String(20), default="resolved")  # open, resolved, verified
    resolved_by = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relación con el proyecto
    project = relationship("Project", back_populates="error_logs")
