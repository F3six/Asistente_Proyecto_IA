import re
from typing import List, Dict, Any
from ..schemas.framework import FileSuggestion, ComplementaryFile


class SuggestionService:
    """Asistente inteligente que dice dónde ubicar archivos antes de crearlos."""

    @classmethod
    def suggest_location(cls, description: str, framework: str = "Spring Boot") -> FileSuggestion:
        desc_lower = description.lower()

        # Extraer concepto sustantivo clave (ej: "empleados", "usuario", "producto", "cliente", "factura")
        entity_name = "Item"
        if "empleado" in desc_lower:
            entity_name = "Employee"
        elif "usuario" in desc_lower or "login" in desc_lower or "auth" in desc_lower:
            entity_name = "User"
        elif "producto" in desc_lower or "articulo" in desc_lower:
            entity_name = "Product"
        elif "cliente" in desc_lower:
            entity_name = "Customer"
        elif "pedido" in desc_lower or "orden" in desc_lower:
            entity_name = "Order"
        elif "factura" in desc_lower:
            entity_name = "Invoice"
        elif "rol" in desc_lower or "permiso" in desc_lower:
            entity_name = "Role"
        elif "notificacion" in desc_lower or "correo" in desc_lower:
            entity_name = "Notification"
        else:
            # Extraer primera palabra significativa
            words = [w for w in re.findall(r'\b[a-zA-Z]{4,}\b', description) if w.lower() not in ["para", "hacer", "crear", "listar", "mostrar", "pantalla", "nuevo", "nueva"]]
            if words:
                entity_name = words[0].capitalize()

        # Determinar si la intención principal es vista/controlador, servicio o persistencia
        if any(k in desc_lower for k in ["pantalla", "listar", "vista", "endpoint", "api", "ruta", "controlador", "mostrar"]):
            primary_file = f"{entity_name}Controller.java"
            primary_path = "/src/main/java/controllers/"
            annotation = "@RestController"
            layer = "Controlador Web / API"
            responsibility = f"Manejará las peticiones HTTP GET/POST para /{entity_name.lower()}s y retornará los datos de la lista hacia el cliente web o vista."
            naming_conv = "Terminación obligatoria *Controller en PascalCase singular."
            comp_files = [
                ComplementaryFile(
                    name=f"{entity_name}Service.java",
                    path="/src/main/java/services/",
                    annotation="@Service",
                    layer="Capa de Negocio",
                    responsibility=f"Lógica para obtener la lista de {entity_name.lower()}s, aplicar validaciones y formatear datos antes del envío."
                ),
                ComplementaryFile(
                    name=f"{entity_name}Repository.java",
                    path="/src/main/java/repositories/",
                    annotation="JpaRepository",
                    layer="Capa de Datos",
                    responsibility=f"Consulta directa a la base de datos para recuperar los registros mediante métodos de Spring Data."
                )
            ]
        elif any(k in desc_lower for k in ["guardar", "tabla", "base de datos", "entidad", "columna", "modelo"]):
            primary_file = f"{entity_name}.java"
            primary_path = "/src/main/java/models/"
            annotation = "@Entity"
            layer = "Capa de Dominio & Datos"
            responsibility = f"Representará la tabla en la base de datos relacional con sus atributos y relaciones."
            naming_conv = "Nombre en singular en PascalCase (sin sufijo Model)."
            comp_files = [
                ComplementaryFile(
                    name=f"{entity_name}Repository.java",
                    path="/src/main/java/repositories/",
                    annotation="JpaRepository",
                    layer="Capa de Datos",
                    responsibility="Interfaz para ejecutar operaciones CRUD sobre la tabla."
                ),
                ComplementaryFile(
                    name=f"{entity_name}DTO.java",
                    path="/src/main/java/dto/",
                    annotation="record / POJO",
                    layer="Capa de Transferencia",
                    responsibility="Objeto ligero para recibir y devolver datos sin exponer directamente la entidad JPA."
                )
            ]
        elif any(k in desc_lower for k in ["seguridad", "filtro", "token", "jwt", "cors", "config"]):
            primary_file = f"{entity_name}Config.java" if not entity_name.endswith("Config") else f"{entity_name}.java"
            primary_path = "/src/main/java/config/"
            annotation = "@Configuration"
            layer = "Capa de Configuración e Infraestructura"
            responsibility = "Declarará los Beans e interceptores necesarios para habilitar la funcionalidad."
            naming_conv = "PascalCase con sufijo Config."
            comp_files = [
                ComplementaryFile(
                    name=f"{entity_name}Filter.java",
                    path="/src/main/java/config/filters/",
                    annotation="OncePerRequestFilter",
                    layer="Filtro de Seguridad",
                    responsibility="Intercepta cada petición HTTP entrante para validar tokens o encabezados."
                )
            ]
        else:
            primary_file = f"{entity_name}Service.java"
            primary_path = "/src/main/java/services/"
            annotation = "@Service"
            layer = "Capa de Negocio"
            responsibility = f"Contendrá los algoritmos y cálculos de {description} aislados del protocolo HTTP."
            naming_conv = "PascalCase con sufijo Service."
            comp_files = [
                ComplementaryFile(
                    name=f"{entity_name}Controller.java",
                    path="/src/main/java/controllers/",
                    annotation="@RestController",
                    layer="Capa de Presentación",
                    responsibility="Punto de acceso HTTP que llamará a este servicio."
                )
            ]

        checklist = [
            {
                "step": "1",
                "title": "Crear la Interfaz del Repositorio",
                "detail": f"Define la entidad modelo {entity_name} y extiende de JpaRepository<{entity_name}, Long> para heredar operaciones CRUD sin SQL manual."
            },
            {
                "step": "2",
                "title": "Inyectar el Servicio",
                "detail": f"Inyecta el repositorio en {entity_name}Service mediante constructor (@Autowired implícito) para encapsular las reglas de negocio."
            },
            {
                "step": "3",
                "title": "Mapear la Ruta en el Controlador",
                "detail": f"Inyecta el servicio en {entity_name}Controller y anota con @GetMapping o @PostMapping delegando la respuesta limpiamente."
            }
        ]

        return FileSuggestion(
            framework=framework,
            detected_intent=description,
            primary_file=primary_file,
            primary_path=primary_path,
            annotation_or_pattern=annotation,
            layer=layer,
            architectural_responsibility=responsibility,
            naming_convention=naming_conv,
            complementary_files=comp_files,
            checklist=checklist,
            educational_tip="Sigue el flujo de responsabilidad: Controlador (recibe HTTP) -> Servicio (valida y procesa) -> Repositorio (guarda en BD)."
        )
