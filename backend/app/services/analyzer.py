import os
from pathlib import Path
from typing import List, Dict, Any, Tuple, Optional
from ..schemas.project import AnalysisResponse, MisplacedFileDetail, TreeNode


class FrameworkAnalyzer:
    """Servicio de análisis estático y didáctico de estructuras de proyectos."""

    FRAMEWORK_SIGNATURES = {
        "Spring Boot": [
            "pom.xml", "build.gradle", "build.gradle.kts", "mvnw", "gradlew",
            "src/main/java", "src/main/resources"
        ],
        "Laravel": [
            "artisan", "composer.json", "app/Http/Controllers", "routes/web.php"
        ],
        "Django": [
            "manage.py", "wsgi.py", "asgi.py"
        ]
    }

    SPRING_CONVENTIONS = {
        "controllers": {
            "expected_suffix": ["Controller.java"],
            "layer": "Controladores HTTP",
            "allowed_extensions": [".java"],
        },
        "models": {
            "expected_suffix": [".java"],
            "layer": "Modelos / Entidades JPA",
            "allowed_extensions": [".java"],
        },
        "repositories": {
            "expected_suffix": ["Repository.java"],
            "layer": "Repositorios Data JPA",
            "allowed_extensions": [".java"],
        },
        "services": {
            "expected_suffix": ["Service.java", "ServiceImpl.java"],
            "layer": "Servicios de Negocio",
            "allowed_extensions": [".java"],
        },
        "config": {
            "expected_suffix": ["Config.java"],
            "layer": "Configuración",
            "allowed_extensions": [".java"],
        }
    }

    @classmethod
    def detect_framework_from_paths(cls, paths: List[str]) -> Tuple[str, str, str]:
        """Detecta el framework basándose en la lista de rutas relativas."""
        normalized = [p.replace("\\", "/").lower() for p in paths]

        # Comprobar Spring Boot
        spring_score = sum(1 for sig in cls.FRAMEWORK_SIGNATURES["Spring Boot"] if any(sig.lower() in p for p in normalized))
        # Comprobar Laravel
        laravel_score = sum(1 for sig in cls.FRAMEWORK_SIGNATURES["Laravel"] if any(sig.lower() in p for p in normalized))
        # Comprobar Django
        django_score = sum(1 for sig in cls.FRAMEWORK_SIGNATURES["Django"] if any(sig.lower() in p for p in normalized))

        if spring_score >= 1 or any(p.endswith(".java") for p in normalized):
            return "Spring Boot", "3.2.0", "Arquitectura en Capas (N-Tier)"
        elif laravel_score >= 1 or any("artisan" in p for p in normalized):
            return "Laravel", "11.x", "Modelo-Vista-Controlador (MVC)"
        elif django_score >= 1 or any("manage.py" in p for p in normalized):
            return "Django", "5.x", "Modelo-Template-Vista (MTV)"

        # Por defecto Spring Boot como educativo
        return "Spring Boot", "3.2.0", "Arquitectura en Capas (N-Tier)"

    @classmethod
    def scan_directory(cls, dir_path: str) -> List[str]:
        """Recorre recursivamente una carpeta para obtener rutas relativas de archivos."""
        root = Path(dir_path)
        if not root.exists() or not root.is_dir():
            return []

        relative_paths = []
        ignored_dirs = {".git", ".idea", ".vscode", "target", "build", "node_modules", ".gradle", "__pycache__", "venv", ".venv"}

        for item in root.rglob("*"):
            # Omitir carpetas ignoradas
            if any(part in ignored_dirs for part in item.parts):
                continue
            if item.is_file():
                try:
                    rel = item.relative_to(root).as_posix()
                    relative_paths.append(rel)
                except ValueError:
                    pass

        return relative_paths

    @classmethod
    def analyze(cls, project_name: str, file_paths: List[str]) -> AnalysisResponse:
        """Realiza el análisis completo de cumplimiento didáctico de convenciones."""
        framework, version, arch_type = cls.detect_framework_from_paths(file_paths)

        misplaced: List[MisplacedFileDetail] = []
        conforming_count = 0
        total_relevant = 0

        # Reglas específicas de Spring Boot
        active_layers_set = set()

        for path in file_paths:
            normalized = path.replace("\\", "/")
            parts = normalized.split("/")
            file_name = parts[-1]
            parent_dir = parts[-2] if len(parts) > 1 else ""

            # Omitir archivos de construcción estándar o metadatos
            if file_name in ["pom.xml", "build.gradle", "application.properties", "application.yml", "README.md", ".gitignore", "mvnw", "gradlew"]:
                continue

            total_relevant += 1

            # Caso 1: Archivo Java en la raíz o paquete raíz sin subcarpeta de capa
            if file_name.endswith(".java") and parent_dir in ["", "java", "main", "src"]:
                if not file_name.endswith("Application.java"):  # Application.java es válida en la raíz del paquete
                    misplaced.append(MisplacedFileDetail(
                        file_name=file_name,
                        current_path=normalized,
                        suggested_path="src/main/java/.../services/ o /utils/",
                        reason="Archivo Java suelto en la raíz del paquete sin capa arquitectónica asignada.",
                        severity="warning"
                    ))
                    continue

            # Caso 2: SQL dentro de controladores o código Java
            if file_name.endswith(".sql") and ("controllers" in normalized or "services" in normalized or "src/main/java" in normalized):
                misplaced.append(MisplacedFileDetail(
                    file_name=file_name,
                    current_path=normalized,
                    suggested_path="src/main/resources/db/",
                    reason="Los scripts SQL no deben residir en paquetes de código fuente Java.",
                    severity="warning"
                ))
                continue

            # Caso 3: Archivos de texto o notas temporales en carpetas de código
            if file_name.endswith((".txt", ".md", ".tmp")) and any(d in normalized for d in ["models", "controllers", "services", "repositories"]):
                misplaced.append(MisplacedFileDetail(
                    file_name=file_name,
                    current_path=normalized,
                    suggested_path="docs/ o descartar",
                    reason="Documentos o notas sueltas en paquetes de entidades de dominio.",
                    severity="warning"
                ))
                continue

            # Caso 4: Nombres de carpetas no convencionales (ej: mis_scripts)
            if "mis_scripts" in normalized or "pruebas_locales" in normalized:
                misplaced.append(MisplacedFileDetail(
                    file_name=file_name,
                    current_path=normalized,
                    suggested_path="src/test/java/ o eliminar",
                    reason="Carpeta con nombre personal fuera del estándar del framework.",
                    severity="warning"
                ))
                continue

            # Identificación de capas activas
            for layer_key in cls.SPRING_CONVENTIONS.keys():
                if f"/{layer_key}/" in f"/{normalized}/" or parent_dir == layer_key:
                    active_layers_set.add(layer_key)

            conforming_count += 1

        # Construir árbol esquemático representativo
        structure = cls._build_mock_or_real_tree(file_paths, misplaced)

        # Cálculo de salud
        if total_relevant == 0:
            alignment = 100.0
        else:
            alignment = max(0.0, round(((total_relevant - len(misplaced)) / total_relevant) * 100, 1))

        # Si el usuario no pasó archivos (o es un proyecto nuevo vacío), proveemos la auditoría didáctica de ejemplo
        if not file_paths:
            return cls.get_default_sample_analysis(project_name)

        return AnalysisResponse(
            project_name=project_name,
            framework=framework,
            version=version,
            architecture_type=arch_type,
            alignment_score=alignment,
            total_files=len(file_paths),
            misplaced_count=len(misplaced),
            active_layers=list(active_layers_set) or ["controllers", "models", "repositories", "services", "config"],
            misplaced_files=misplaced,
            structure=structure
        )

    @classmethod
    def _build_mock_or_real_tree(cls, file_paths: List[str], misplaced_list: List[MisplacedFileDetail]) -> List[TreeNode]:
        """Genera nodos de árbol para la interfaz."""
        misplaced_names = {m.file_name: m.reason for m in misplaced_list}

        # Estructura organizada por capas
        layers_map: Dict[str, List[TreeNode]] = {
            "controllers": [],
            "models": [],
            "repositories": [],
            "services": [],
            "config": [],
            "otros": []
        }

        for path in file_paths:
            normalized = path.replace("\\", "/")
            file_name = normalized.split("/")[-1]
            is_mis = file_name in misplaced_names
            warning = misplaced_names.get(file_name)

            node = TreeNode(
                name=file_name,
                path=normalized,
                type="file",
                is_misplaced=is_mis,
                warning_reason=warning
            )

            placed = False
            for layer in ["controllers", "models", "repositories", "services", "config"]:
                if f"/{layer}/" in f"/{normalized}/":
                    layers_map[layer].append(node)
                    placed = True
                    break

            if not placed:
                layers_map["otros"].append(node)

        tree = []
        for layer, children in layers_map.items():
            if children:
                tree.append(TreeNode(
                    name=f"{layer}/",
                    path=f"src/main/java/com/universidad/{layer}",
                    type="folder",
                    layer=layer,
                    children=children
                ))

        return tree

    @classmethod
    def get_default_sample_analysis(cls, project_name: str = "Proyecto_Universidad_Final") -> AnalysisResponse:
        """Devuelve el proyecto didáctico representativo del mockup para uso inicial."""
        misplaced = [
            MisplacedFileDetail(
                file_name="TempQueryHelper.java",
                current_path="src/main/java/TempQueryHelper.java",
                suggested_path="/src/main/java/services/",
                reason="Archivo suelto en la raíz. Debería residir en services/ o utils/.",
                severity="warning"
            ),
            MisplacedFileDetail(
                file_name="script_base_datos.sql",
                current_path="src/main/java/controllers/script_base_datos.sql",
                suggested_path="/src/main/resources/db/",
                reason="Script SQL ubicado dentro del paquete de controladores.",
                severity="warning"
            ),
            MisplacedFileDetail(
                file_name="auth_notes.txt",
                current_path="src/main/java/models/auth_notes.txt",
                suggested_path="docs/ o eliminar",
                reason="Archivo de texto dentro del paquete de modelos de dominio.",
                severity="warning"
            ),
            MisplacedFileDetail(
                file_name="MisFunciones.java",
                current_path="src/main/java/mis_scripts/MisFunciones.java",
                suggested_path="/src/main/java/utils/",
                reason="Carpeta personal 'mis_scripts' fuera de la convención de paquetes.",
                severity="warning"
            )
        ]

        models_children = [
            TreeNode(name="Employee.java", path="src/main/java/models/Employee.java", type="file", annotation="@Entity"),
            TreeNode(name="Department.java", path="src/main/java/models/Department.java", type="file", annotation="@Entity"),
            TreeNode(name="Role.java", path="src/main/java/models/Role.java", type="file", annotation="@Entity"),
        ]

        structure = [
            TreeNode(
                name="controllers/",
                path="src/main/java/controllers",
                type="folder",
                layer="controllers",
                annotation="Endpoints REST",
                children=[
                    TreeNode(name="EmployeeController.java", path="src/main/java/controllers/EmployeeController.java", type="file", annotation="@RestController"),
                    TreeNode(name="DepartmentController.java", path="src/main/java/controllers/DepartmentController.java", type="file", annotation="@RestController"),
                ]
            ),
            TreeNode(
                name="models/",
                path="src/main/java/models",
                type="folder",
                layer="models",
                annotation="3 Entidades JPA",
                children=models_children
            ),
            TreeNode(
                name="repositories/",
                path="src/main/java/repositories",
                type="folder",
                layer="repositories",
                annotation="Acceso a BD",
                children=[
                    TreeNode(name="EmployeeRepository.java", path="src/main/java/repositories/EmployeeRepository.java", type="file", annotation="JpaRepository"),
                    TreeNode(name="DepartmentRepository.java", path="src/main/java/repositories/DepartmentRepository.java", type="file", annotation="JpaRepository"),
                ]
            ),
            TreeNode(
                name="services/",
                path="src/main/java/services",
                type="folder",
                layer="services",
                annotation="Reglas Negocio",
                children=[
                    TreeNode(name="EmployeeService.java", path="src/main/java/services/EmployeeService.java", type="file", annotation="@Service"),
                    TreeNode(name="DepartmentService.java", path="src/main/java/services/DepartmentService.java", type="file", annotation="@Service"),
                ]
            ),
            TreeNode(
                name="config/",
                path="src/main/java/config",
                type="folder",
                layer="config",
                annotation="Ajustes / Beans",
                children=[
                    TreeNode(name="SecurityConfig.java", path="src/main/java/config/SecurityConfig.java", type="file", annotation="@Configuration"),
                ]
            ),
            TreeNode(
                name="mis_scripts/",
                path="src/main/java/mis_scripts",
                type="folder",
                layer="misplaced",
                is_misplaced=True,
                warning_reason="Ubicación inválida. No uses nombres personales o utilidades aisladas en el paquete raíz.",
                children=[
                    TreeNode(name="MisFunciones.java", path="src/main/java/mis_scripts/MisFunciones.java", type="file", is_misplaced=True, warning_reason="Mover a /utils/")
                ]
            )
        ]

        return AnalysisResponse(
            project_name=project_name,
            framework="Spring Boot",
            version="3.2.0",
            architecture_type="Arquitectura en Capas (N-Tier)",
            alignment_score=88.0,
            total_files=42,
            misplaced_count=4,
            active_layers=["controllers", "models", "repositories", "services", "config"],
            misplaced_files=misplaced,
            structure=structure
        )
