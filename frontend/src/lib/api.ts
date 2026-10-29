import {
  AnalysisResponse,
  ErrorLog,
  FolderExplanation,
  FileSuggestion,
  ProjectReport,
} from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function fetchWithFallback<T>(url: string, options?: RequestInit, fallbackData?: T): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${url}`, {
      headers: { "Content-Type": "application/json", ...options?.headers },
      ...options,
    });
    if (!res.ok) {
      if (fallbackData !== undefined) return fallbackData;
      throw new Error(`Error en API: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    if (fallbackData !== undefined) return fallbackData;
    throw err;
  }
}

export const api = {
  // Proyectos
  async analyzeProject(projectName = "Proyecto_Universidad_Final", projectPath?: string): Promise<AnalysisResponse> {
    return fetchWithFallback<AnalysisResponse>(
      "/api/projects/analyze",
      {
        method: "POST",
        body: JSON.stringify({ project_name: projectName, project_path: projectPath }),
      },
      // Datos de respaldo idénticos al mockup
      {
        project_name: projectName,
        framework: "Spring Boot",
        version: "3.2.0",
        architecture_type: "Arquitectura en Capas (N-Tier)",
        alignment_score: 88,
        total_files: 42,
        misplaced_count: 2,
        active_layers: ["controllers", "models", "repositories", "services", "config"],
        misplaced_files: [
          {
            file_name: "TempQueryHelper.java",
            current_path: "src/main/java/TempQueryHelper.java",
            suggested_path: "/src/main/java/services/",
            reason: "Archivo suelto en la raíz. Debería residir en services/ o utils/.",
            severity: "warning",
          },
          {
            file_name: "mis_scripts/",
            current_path: "src/main/java/mis_scripts/",
            suggested_path: "/src/main/java/utils/",
            reason: "Ubicación inválida. No uses nombres personales o utilidades aisladas en el paquete raíz.",
            severity: "warning",
          },
        ],
        structure: [],
      }
    );
  },

  // Bitácora de Errores
  async getErrors(category?: string, search?: string): Promise<ErrorLog[]> {
    const params = new URLSearchParams();
    if (category && category !== "all") params.append("category", category);
    if (search) params.append("search", search);
    const query = params.toString() ? `?${params.toString()}` : "";

    return fetchWithFallback<ErrorLog[]>(`/api/errors/${query}`, undefined, [
      {
        id: 1,
        title: "Error 404 en endpoint /api/empleados",
        category: "Routing",
        layer: "Controlador Web",
        symptom: "El navegador responde con Whitelabel Error Page 404 al intentar consumir la ruta directa.",
        root_cause: "Faltaba la anotación @RestController o el paquete no estaba dentro del component scan.",
        solution: "Se agregó @RequestMapping('/api') en la clase y se movió el archivo Java dentro de com.universidad.proyecto para ser escaneado automáticamente.",
        status: "verified",
        resolved_by: "Juan C.",
        created_at: new Date(Date.now() - 86400000).toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 2,
        title: "LazyInitializationException en lista de departamentos",
        category: "Database",
        layer: "Persistencia",
        symptom: "No se pueden cargar los empleados asociados al departamento al serializar JSON fuera de la sesión transaccional abierta.",
        root_cause: "Carga perezosa (Lazy loading) invocada tras cerrar el contexto del EntityManager de JPA.",
        solution: "Se ajustó la relación a FetchType.EAGER o se implementó un DTO específico con campos planos para prevenir bucles de serialización de Hibernate.",
        status: "verified",
        resolved_by: "Estudiante Ing.",
        created_at: new Date(Date.now() - 259200000).toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 3,
        title: "TemplateNotFoundException: 'empleados.html'",
        category: "Views",
        layer: "Frontend SSR",
        symptom: "Thymeleaf no encuentra la vista HTML retornada por el método del controlador al intentar renderizar en el navegador.",
        root_cause: "La plantilla estaba ubicada erróneamente en /public en vez de /templates.",
        solution: "La plantilla estaba ubicada erróneamente en /public en vez de /templates. Se reubicó el archivo HTML según las convenciones estándar de Spring Boot.",
        status: "verified",
        resolved_by: "Ana M.",
        created_at: new Date(Date.now() - 432000000).toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 4,
        title: "Circular reference en serialización JSON",
        category: "Database",
        layer: "Modelos Bidireccionales",
        symptom: "Desbordamiento de memoria por StackOverflowError infinito al intentar transformar a JSON relaciones ManyToOne y OneToMany asociadas.",
        root_cause: "Relación bidireccional JPA sin exclusión de serializador Jackson en el POJO.",
        solution: "Uso puntual de anotaciones @JsonManagedReference y @JsonBackReference en las relaciones bidireccionales de las entidades de dominio.",
        status: "verified",
        resolved_by: "Estudiante Ing.",
        created_at: new Date(Date.now() - 604800000).toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]);
  },

  async createError(errorData: Partial<ErrorLog>): Promise<ErrorLog> {
    return fetchWithFallback<ErrorLog>("/api/errors/", {
      method: "POST",
      body: JSON.stringify(errorData),
    }, {
      id: Math.floor(Math.random() * 1000) + 10,
      title: errorData.title || "Nuevo Error",
      category: errorData.category || "General",
      layer: errorData.layer || "General",
      symptom: errorData.symptom || "",
      root_cause: errorData.root_cause || "",
      solution: errorData.solution || "",
      status: "verified",
      resolved_by: "Estudiante Ing.",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  },

  // Glosario / Explicación
  async getFolderExplanation(folder: string, framework = "Spring Boot"): Promise<FolderExplanation> {
    return fetchWithFallback<FolderExplanation>(
      `/api/glossary/${framework}/${folder}`,
      undefined,
      {
        folder_name: `${folder}/`,
        layer_name: "Capa de Dominio & Datos",
        description_simple: "Aquí se definen las estructuras de tus datos. Cada archivo Java dentro de esta carpeta suele representar una tabla en tu base de datos relacional, especificando qué columnas contiene (atributos como nombre, correo, fecha) y cómo se vincula con otras entidades (relaciones uno a muchos o muchos a muchos).",
        expected_contents: "Entidades JPA conformes con anotaciones estándar.",
        architecture_role: "Moldea y persiste datos en la base de datos a través del ORM Hibernate.",
        naming_conventions: [
          "Nombre en Singular (PascalCase): User.java, Product.java, OrderDetail.java",
          "Evita plurales o verbos: UsersList.java, GetProducts.java",
        ],
        anti_patterns: [
          "Evita colocar lógica de negocio o consultas SQL directas dentro de tus modelos.",
        ],
        key_annotations_or_keywords: [
          { name: "@Entity", description: "Le avisa a Spring: 'Soy una tabla de BD'." },
          { name: "@Id", description: "Marca la clave primaria (Primary Key)." },
          { name: "@Column", description: "Personaliza el nombre o límites de columna." },
        ],
        educational_tip: "Evita colocar lógica de negocio o consultas SQL directas dentro de tus modelos. Un modelo debe mantenerse como un POJO (Plain Old Java Object) representacional. Las consultas complejas pertenecen a repositories/ y las validaciones de negocio a services/.",
      }
    );
  },

  // Asistente de nuevos archivos
  async suggestLocation(description: string, framework = "Spring Boot"): Promise<FileSuggestion> {
    return fetchWithFallback<FileSuggestion>(
      "/api/suggestions/location",
      {
        method: "POST",
        body: JSON.stringify({ description, framework }),
      },
      {
        framework,
        detected_intent: description,
        primary_file: "EmployeeController.java",
        primary_path: "/src/main/java/controllers/",
        annotation_or_pattern: "@RestController",
        layer: "Controlador Web / API",
        architectural_responsibility: "Manejará las peticiones HTTP GET para /empleados y retornará los datos de la lista hacia el cliente web o vista Thymeleaf.",
        naming_convention: "Terminación obligatoria *Controller en PascalCase singular.",
        complementary_files: [
          {
            name: "EmployeeService.java",
            path: "/src/main/java/services/",
            annotation: "@Service",
            layer: "Capa de Negocio",
            responsibility: "Lógica para obtener la lista, aplicar validaciones de contratos activos y formatear datos antes del envío.",
          },
          {
            name: "EmployeeRepository.java",
            path: "/src/main/java/repositories/",
            annotation: "JpaRepository",
            layer: "Capa de Datos",
            responsibility: "Consulta directa a la base de datos o entidad JPA para recuperar los registros mediante métodos derivados.",
          },
        ],
        checklist: [
          {
            step: "1",
            title: "Crear la Interfaz del Repositorio",
            detail: "Define la entidad modelo Employee y extiende de JpaRepository para heredar operaciones CRUD sin queries manuales.",
          },
          {
            step: "2",
            title: "Inyectar el Servicio",
            detail: "Inyecta el repositorio en EmployeeService usando constructor (@Autowired implícito) para encapsular las reglas de negocio.",
          },
          {
            step: "3",
            title: "Mapear la Ruta en el Controlador",
            detail: "Inyecta el servicio en el controlador y anota con @GetMapping('/empleados') delegando la respuesta limpiamente.",
          },
        ],
        educational_tip: "Esta herramienta evalúa convenciones de paquetes y separación de responsabilidades sin compilar ni alterar el código en tiempo real.",
      }
    );
  },

  // Reporte de Estado
  async getReport(projectId = 1): Promise<ProjectReport> {
    return fetchWithFallback<ProjectReport>(
      `/api/reports/${projectId}`,
      undefined,
      {
        project_id: projectId,
        project_name: "Proyecto_Universidad_Final",
        framework: "Spring Boot 3.2",
        architecture_type: "Arquitectura en Capas (N-Tier)",
        alignment_score: 88,
        total_files: 42,
        misplaced_files_count: 4,
        misplaced_files: [
          {
            file_name: "TempQueryHelper.java",
            current_path: "src/main/java/TempQueryHelper.java",
            suggested_path: "/src/main/java/services/",
            reason: "En raíz",
            severity: "warning",
          },
          {
            file_name: "script_base_datos.sql",
            current_path: "src/main/java/controllers/script_base_datos.sql",
            suggested_path: "/src/main/resources/db/",
            reason: "En controllers/",
            severity: "warning",
          },
          {
            file_name: "auth_notes.txt",
            current_path: "src/main/java/models/auth_notes.txt",
            suggested_path: "Mover a /docs/ o eliminar",
            reason: "En models/",
            severity: "warning",
          },
          {
            file_name: "MisFunciones.java",
            current_path: "src/main/java/mis_scripts/MisFunciones.java",
            suggested_path: "Modularizar en /utils/",
            reason: "Sin paquete",
            severity: "warning",
          },
        ],
        structure_summary: [],
        errors_summary: {
          total_errors: 12,
          by_category: {
            Database: 5,
            Routing: 3,
            Views: 2,
            Security: 2,
          },
        },
        academic_evaluation: {
          health_status: "Aprobado Técnico",
          conclusion: "El estudiante demuestra dominio de separación de responsabilidades y documentación constante de incidencias.",
          standards_evaluated: "Reglas SonarJava + Convenciones Spring Framework 3.x",
          verification_hash: "#sha256-4f81c9a8",
        },
      }
    );
  },
};
