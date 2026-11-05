"use client";

import { useState, useEffect, useRef } from "react";
import { api } from "@/lib/api";
import { AnalysisResponse, TreeNode, MisplacedFileDetail } from "@/lib/types";

// Base de conocimiento didáctica multipropósito para los frameworks soportados
const FRAMEWORK_GLOSSARY: Record<
  string,
  Record<
    string,
    {
      title: string;
      badge: string;
      layer: string;
      simpleExplanation: string;
      conventions: { good: string; bad: string; reason: string };
      annotations: Array<{ name: string; desc: string }>;
      tip: string;
    }
  >
> = {
  "Spring Boot": {
    models: {
      title: "models/",
      badge: "Spring Boot: Entidades JPA",
      layer: "Capa de Dominio & Datos",
      simpleExplanation:
        "Aquí se definen las estructuras de tus datos. Cada archivo Java dentro de esta carpeta suele representar una tabla en la base de datos relacional, especificando qué columnas contiene y cómo se vincula con otras entidades.",
      conventions: {
        good: "Nombre en Singular (PascalCase): User.java, Product.java, OrderDetail.java",
        bad: "Evita plurales o verbos: UsersList.java, GetProducts.java",
        reason: "Porque cada instancia del objeto representa un único registro de fila.",
      },
      annotations: [
        { name: "@Entity", desc: "Le avisa a Spring: 'Soy una tabla de BD'." },
        { name: "@Id", desc: "Marca la clave primaria (Primary Key)." },
        { name: "@Column", desc: "Personaliza el nombre o límites de columna." },
      ],
      tip: "Evita colocar lógica de negocio o consultas SQL directas dentro de tus modelos. Un modelo debe mantenerse como un POJO representacional.",
    },
    controllers: {
      title: "controllers/",
      badge: "Spring Boot: Endpoints REST",
      layer: "Capa de Presentación Web",
      simpleExplanation:
        "Aquí residen los controladores que reciben las peticiones HTTP del navegador o frontend. Su labor es validar la entrada, invocar la lógica del servicio y devolver el JSON o vista correspondiente.",
      conventions: {
        good: "Nombre con sufijo Controller: EmployeeController.java",
        bad: "No usar plurales ni omitir el sufijo: Employees.java",
        reason: "Identifica unívocamente la clase como componente de enrutamiento web.",
      },
      annotations: [
        { name: "@RestController", desc: "Expone la clase como API REST con JSON automático." },
        { name: "@RequestMapping", desc: "Define la ruta base de la API (ej: /api/empleados)." },
        { name: "@GetMapping", desc: "Mapea peticiones de lectura HTTP GET." },
      ],
      tip: "Mantén los controladores delgados (Thin Controllers). Nunca escribas cálculos pesados ni consultas a BD dentro de un controlador.",
    },
    repositories: {
      title: "repositories/",
      badge: "Spring Data JPA: Acceso a BD",
      layer: "Capa de Persistencia",
      simpleExplanation:
        "Interfaces que extienden de JpaRepository. Spring genera automáticamente las sentencias SQL (SELECT, INSERT, UPDATE, DELETE) en tiempo de ejecución sin escribirlas a mano.",
      conventions: {
        good: "Nombre con sufijo Repository: EmployeeRepository.java",
        bad: "No crear clases normales sino interfaces: interface EmployeeRepo",
        reason: "Spring Data genera la implementación de la interfaz de forma dinámica.",
      },
      annotations: [
        { name: "JpaRepository<T, ID>", desc: "Hereda métodos findAll(), save(), deleteById()." },
        { name: "@Query", desc: "Permite consultas JPQL personalizadas si son requeridas." },
      ],
      tip: "Aprovecha los métodos derivados de nombres de Spring: findByActiveTrue() crea la consulta sin escribir SQL.",
    },
    services: {
      title: "services/",
      badge: "Spring Boot: Lógica de Negocio",
      layer: "Capa de Servicios y Reglas",
      simpleExplanation:
        "El cerebro de la aplicación. Aquí se implementan las reglas de negocio, validaciones complejas, coordinación de repositorios y manejo transaccional.",
      conventions: {
        good: "Nombre con sufijo Service: EmployeeService.java",
        bad: "No acceder a HttpServletRequest en los servicios.",
        reason: "Los servicios deben ser agnósticos del protocolo HTTP para permitir reutilización.",
      },
      annotations: [
        { name: "@Service", desc: "Registra la clase como Bean de servicio de Spring." },
        { name: "@Transactional", desc: "Asegura atomicidad transaccional." },
      ],
      tip: "Usa inyección de dependencias mediante constructor en lugar de @Autowired sobre atributos para facilitar pruebas unitarias.",
    },
    config: {
      title: "config/",
      badge: "Spring Boot: Beans y Ajustes",
      layer: "Capa de Configuración",
      simpleExplanation:
        "Configuraciones de seguridad (Spring Security, JWT), permisos CORS para que el frontend pueda conectarse y ajustes de OpenAPI.",
      conventions: {
        good: "Sufijo Config: SecurityConfig.java, CorsConfig.java",
        bad: "No colocar lógica de negocio en clases de configuración.",
        reason: "Las clases de configuración solo deben instanciar y parametrizar Beans.",
      },
      annotations: [
        { name: "@Configuration", desc: "Declara una fuente de definiciones de Beans." },
        { name: "@Bean", desc: "Indica que un método produce un Bean administrado." },
      ],
      tip: "Separa la configuración de CORS y la de Seguridad en clases distintas para mayor legibilidad.",
    },
  },
  Laravel: {
    controllers: {
      title: "app/Http/Controllers/",
      badge: "Laravel: Controladores HTTP",
      layer: "Capa de Controladores",
      simpleExplanation:
        "Clases que reciben las peticiones tras pasar por el enrutador y middleware. Coordinan la validación y devuelven respuestas JSON o vistas Blade.",
      conventions: {
        good: "PascalCase con sufijo Controller: UserController.php",
        bad: "Evitar nombres en plural sin sufijo: Users.php",
        reason: "Convención estándar de Laravel para autodetección de recursos.",
      },
      annotations: [
        { name: "Request $request", desc: "Inyecta los datos enviados en la petición." },
        { name: "response()->json()", desc: "Retorna una respuesta tipada en JSON." },
      ],
      tip: "Utiliza Form Requests (php artisan make:request) para mantener tus controladores limpios.",
    },
    models: {
      title: "app/Models/",
      badge: "Laravel: Modelos Eloquent",
      layer: "Capa de Dominio ORM",
      simpleExplanation:
        "Cada modelo representa una tabla en tu base de datos mediante Eloquent ORM. Permite consultar y relacionar datos usando métodos PHP orientados a objetos.",
      conventions: {
        good: "PascalCase singular: User.php, Order.php",
        bad: "No usar plurales: Users.php",
        reason: "Eloquent deduce automáticamente el nombre de la tabla pluralizada.",
      },
      annotations: [
        { name: "$fillable", desc: "Lista blanca de campos con asignación masiva permitida." },
        { name: "hasMany / belongsTo", desc: "Métodos de relación entre tablas." },
      ],
      tip: "Define siempre $fillable en tus modelos para proteger la base de datos contra ataques de mass assignment.",
    },
    routes: {
      title: "routes/",
      badge: "Laravel: Enrutamiento",
      layer: "Capa de Rutas HTTP",
      simpleExplanation:
        "Define los puntos de entrada URLs de tu aplicación y qué controlador o acción debe procesar cada ruta.",
      conventions: {
        good: "web.php (sesiones y vistas) y api.php (endpoints REST)",
        bad: "No colocar lógica de negocio extensa dentro de closures en routes.",
        reason: "Las rutas deben delegar inmediatamente al controlador.",
      },
      annotations: [
        { name: "Route::get / post", desc: "Mapea una ruta con su verbo HTTP correspondiente." },
        { name: "Route::apiResource", desc: "Genera automáticamente las 5 rutas CRUD estándar." },
      ],
      tip: "Agrupa rutas que requieran autenticación usando Route::middleware('auth:sanctum').",
    },
  },
  Django: {
    views: {
      title: "views.py o views/",
      badge: "Django: Vistas MTV",
      layer: "Capa de Vistas y Lógica de Petición",
      simpleExplanation:
        "En Django, la 'Vista' equivale al controlador: recibe el objeto HttpRequest y devuelve una respuesta HttpResponse o JSON.",
      conventions: {
        good: "Funciones en snake_case (def list_items) o CBV en PascalCase (class ItemListView)",
        bad: "No colocar lógica SQL directa en las vistas.",
        reason: "Mantener el patrón MTV desacoplado y reusable.",
      },
      annotations: [
        { name: "@api_view", desc: "Decorador de Django REST Framework." },
        { name: "render()", desc: "Combina un template HTML con datos de contexto." },
      ],
      tip: "Prefiere Class-Based Views (CBV) para CRUDs estándar para evitar código repetitivo.",
    },
    models: {
      title: "models.py o models/",
      badge: "Django: Modelos ORM",
      layer: "Capa de Datos y Esquema",
      simpleExplanation:
        "Define las tablas de la base de datos como clases Python. Django genera automáticamente las migraciones SQL a partir de estos modelos.",
      conventions: {
        good: "Clase en PascalCase singular: class Student(models.Model)",
        bad: "No editar la base de datos manualmente sin ejecutar makemigrations.",
        reason: "Django gestiona el ciclo de vida del esquema de base de datos.",
      },
      annotations: [
        { name: "models.CharField", desc: "Campo de texto con longitud máxima." },
        { name: "models.ForeignKey", desc: "Relación de clave foránea 1 a N." },
      ],
      tip: "Implementa siempre def __str__(self) en cada modelo para identificar registros fácilmente en Django Admin.",
    },
  },
};

export default function ExploradorPage() {
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<string>("models");
  const [filterQuery, setFilterQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showManualInput, setShowManualInput] = useState<boolean>(false);
  const [manualPathInput, setManualPathInput] = useState<string>("");
  const [notification, setNotification] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Intentar cargar proyecto previamente guardado al iniciar
  useEffect(() => {
    const saved = localStorage.getItem("devedu_active_project");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAnalysis(parsed);
        if (parsed.structure && parsed.structure.length > 0) {
          const firstFolder = parsed.structure[0].name.replace("/", "").toLowerCase();
          setSelectedFolder(firstFolder);
        }
      } catch {
        // En blanco si no hay datos válidos
      }
    }
  }, []);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Manejador para elegir carpeta local desde el computador del usuario
  const handleFolderSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsLoading(true);
    try {
      const firstRelativePath = files[0].webkitRelativePath || files[0].name;
      const rootFolderName = firstRelativePath.split("/")[0] || "Proyecto_Local";

      const ignoredDirs = [
        "node_modules",
        ".git",
        ".next",
        "target",
        ".gradle",
        "build",
        "dist",
        ".idea",
        ".vscode",
        "__pycache__",
        "venv",
        ".venv",
        ".bin",
      ];

      const relativePaths: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const relPath = files[i].webkitRelativePath;
        if (!relPath) continue;

        // Omitir carpetas de dependencias y compilados
        const parts = relPath.split("/");
        if (parts.some((p) => ignoredDirs.includes(p))) {
          continue;
        }

        // Ruta relativa respecto a la raíz del proyecto
        const pathWithoutRoot = parts.slice(1).join("/");
        if (pathWithoutRoot) {
          relativePaths.push(pathWithoutRoot);
        }
      }

      const result = await api.analyzeProject(rootFolderName, undefined, relativePaths);
      setAnalysis(result);
      localStorage.setItem("devedu_active_project", JSON.stringify(result));
      window.dispatchEvent(new Event("projectChanged"));

      if (result.structure && result.structure.length > 0) {
        const initial = result.structure[0].name.replace("/", "").toLowerCase();
        setSelectedFolder(initial);
      }

      showToast(`Proyecto "${rootFolderName}" cargado: Framework detectado "${result.framework}".`);
    } catch (err) {
      console.error(err);
      showToast("Error al analizar la carpeta seleccionada.");
    } finally {
      setIsLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  // Carga didáctica de ejemplo para demostración rápida
  const handleLoadSample = async () => {
    setIsLoading(true);
    try {
      const sample = await api.analyzeProject("Proyecto_Universidad_Final");
      setAnalysis(sample);
      localStorage.setItem("devedu_active_project", JSON.stringify(sample));
      window.dispatchEvent(new Event("projectChanged"));
      setSelectedFolder("models");
      showToast("Proyecto de ejemplo Spring Boot cargado con éxito.");
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Análisis por ruta en disco ingresada manualmente
  const handleAnalyzeManualPath = async () => {
    if (!manualPathInput.trim()) return;
    setIsLoading(true);
    try {
      const folderName = manualPathInput.replace(/\\/g, "/").split("/").filter(Boolean).pop() || "Proyecto_Local";
      const result = await api.analyzeProject(folderName, manualPathInput.trim());
      setAnalysis(result);
      localStorage.setItem("devedu_active_project", JSON.stringify(result));
      window.dispatchEvent(new Event("projectChanged"));
      setShowManualInput(false);
      showToast(`Ruta analizada correctamente: ${result.framework} detectado.`);
    } catch (err) {
      console.error(err);
      showToast("No se pudo leer la ruta especificada. Verifica que exista.");
    } finally {
      setIsLoading(false);
    }
  };

  // Obtener explicación pedagógica de la carpeta activa
  const currentFramework = analysis?.framework || "Spring Boot";
  const frameworkGlossary = FRAMEWORK_GLOSSARY[currentFramework] || FRAMEWORK_GLOSSARY["Spring Boot"];

  const activeExplanation =
    frameworkGlossary[selectedFolder.toLowerCase()] ||
    frameworkGlossary["models"] || {
      title: `${selectedFolder}/`,
      badge: `${currentFramework}: Paquete de Código`,
      layer: "Capa de Código Fuente",
      simpleExplanation: `Contiene los archivos de trabajo organizados bajo la convención "${selectedFolder}". En esta carpeta se agrupan componentes con responsabilidades afines en la arquitectura del proyecto.`,
      conventions: {
        good: "Nombre descriptivo y cohesivo",
        bad: "No mezclar capas distintas en el mismo paquete",
        reason: "Mantiene la separación de responsabilidades y modularidad.",
      },
      annotations: [
        { name: "Módulo", desc: "Unidad funcional del sistema." },
      ],
      tip: "Verifica que cada archivo tenga una única responsabilidad bien delimitada.",
    };

  // Filtrar árbol de directorios según texto de búsqueda
  const filteredStructure = (analysis?.structure || []).filter((folder) => {
    if (!filterQuery) return true;
    const matchesFolder = folder.name.toLowerCase().includes(filterQuery.toLowerCase());
    const matchesFiles = folder.children?.some((f) =>
      f.name.toLowerCase().includes(filterQuery.toLowerCase())
    );
    return matchesFolder || matchesFiles;
  });

  // Obtener archivos reales de la carpeta seleccionada actualmente
  const activeFolderNode = analysis?.structure?.find(
    (node) => node.name.replace("/", "").toLowerCase() === selectedFolder.toLowerCase()
  );
  const currentFiles = activeFolderNode?.children || [];

  return (
    <div className="flex flex-col w-full gap-6 px-4 sm:px-6 py-6 max-w-[1440px] mx-auto overflow-x-hidden">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-[60] flex items-center gap-2 bg-[#161629] text-white border border-[#00ffcc]/40 px-4 py-3 rounded-xl shadow-[0_0_20px_rgba(0,255,204,0.3)] text-xs font-medium animate-bounce">
          <span className="material-symbols-outlined text-[20px] text-[#00ffcc]">check_circle</span>
          <span>{notification}</span>
        </div>
      )}

      {/* Input nativo oculto para selección de directorio local */}
      <input
        type="file"
        ref={fileInputRef}
        // @ts-expect-error - webkitdirectory es un atributo no estándar de HTML5 soportado por todos los navegadores modernos
        webkitdirectory=""
        directory=""
        multiple
        className="hidden"
        onChange={handleFolderSelect}
      />

      {/* Barra de Control de Producción: Elegir Proyecto de mi Computador */}
      <div className="bg-[#121220] border border-[#262438] rounded-xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#ff2d78] to-[#99004d] flex items-center justify-center text-white shadow-[0_0_12px_rgba(255,45,120,0.4)] shrink-0">
            <span className="material-symbols-outlined text-[22px]">snippet_folder</span>
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white truncate">
                {analysis ? analysis.project_name : "Ningún proyecto cargado"}
              </span>
              {analysis && (
                <span className="px-2 py-0.5 rounded-full bg-[#00ffcc]/15 border border-[#00ffcc]/40 text-[#00ffcc] text-[10px] font-semibold shrink-0">
                  {analysis.framework}
                </span>
              )}
            </div>
            <span className="text-xs text-[#a098b0] truncate">
              {analysis
                ? `${analysis.total_files} archivos auditados según estructura real`
                : "Elige un proyecto local en tu equipo para iniciar el análisis didáctico"}
            </span>
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex items-center gap-2.5 flex-wrap w-full md:w-auto justify-end">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#ff2d78] to-[#d6005c] hover:brightness-110 text-white font-semibold text-xs transition-all shadow-[0_0_14px_rgba(255,45,120,0.4)] border border-[#ff6699]/40 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isLoading ? "hourglass_empty" : "folder_open"}
            </span>
            <span>{isLoading ? "Analizando..." : "Elegir Proyecto de mi PC"}</span>
          </button>

          <button
            onClick={handleLoadSample}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#18182b] border border-[#2e2a44] hover:border-[#00ffcc] hover:text-[#00ffcc] text-[#e8e0f0] text-xs font-semibold transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px] text-[#00ffcc]">bolt</span>
            <span>Cargar Ejemplo</span>
          </button>

          <button
            onClick={() => setShowManualInput(!showManualInput)}
            className="p-2 rounded-lg bg-[#18182b] border border-[#2e2a44] text-[#a098b0] hover:text-white transition-all cursor-pointer"
            title="Ingresar ruta de disco manualmente"
          >
            <span className="material-symbols-outlined text-[18px]">drive_file_move</span>
          </button>
        </div>
      </div>

      {/* Input de Ruta Local Manual (Desplegable) */}
      {showManualInput && (
        <div className="bg-[#10101c] border border-[#2d2945] rounded-xl p-3 flex flex-col sm:flex-row gap-2 items-center">
          <span className="text-xs text-[#a098b0] shrink-0 font-mono">Ruta local:</span>
          <input
            type="text"
            value={manualPathInput}
            onChange={(e) => setManualPathInput(e.target.value)}
            placeholder="Ej: C:\Proyectos\mi-proyecto-spring  o  /home/usuario/app-laravel"
            className="flex-1 w-full bg-[#161628] border border-[#302c48] px-3 py-1.5 rounded-lg text-xs text-white placeholder:text-[#a098b0] focus:outline-none focus:border-[#ff2d78]"
          />
          <button
            onClick={handleAnalyzeManualPath}
            disabled={isLoading}
            className="w-full sm:w-auto px-4 py-1.5 bg-[#ff2d78] text-white rounded-lg text-xs font-semibold hover:bg-[#d6005c] transition-all cursor-pointer shrink-0"
          >
            Escanear
          </button>
        </div>
      )}

      {/* Estado "En Blanco" cuando no hay proyecto seleccionado */}
      {!analysis && !isLoading && (
        <div className="bg-[#0f0f1a] border border-[#262438] rounded-xl p-10 flex flex-col items-center justify-center text-center gap-4 shadow-xl">
          <div className="w-16 h-16 rounded-2xl bg-[#141424] border border-[#2f2b47] flex items-center justify-center text-[#ff2d78] shadow-[0_0_20px_rgba(255,45,120,0.3)]">
            <span className="material-symbols-outlined text-[36px]">folder_special</span>
          </div>
          <div className="max-w-md flex flex-col gap-1.5">
            <h2 className="text-lg font-bold text-white">Listo para Analizar un Proyecto</h2>
            <p className="text-xs text-[#a098b0] leading-relaxed">
              Selecciona una carpeta desde tu computadora para que DevEdu Shell reconozca el framework (Spring Boot, Laravel o Django), identifique sus capas y audite su orden según los archivos que contiene.
            </p>
          </div>
          <div className="flex items-center gap-3 mt-2 flex-wrap justify-center">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#ff2d78] to-[#d6005c] text-white font-semibold text-xs shadow-[0_0_16px_rgba(255,45,120,0.45)] hover:brightness-110 transition-all cursor-pointer"
            >
              Seleccionar Carpeta en este Equipo
            </button>
            <button
              onClick={handleLoadSample}
              className="px-4 py-2.5 rounded-lg bg-[#18182b] border border-[#2b2742] text-white text-xs font-semibold hover:border-[#00ffcc] hover:text-[#00ffcc] transition-all cursor-pointer"
            >
              Probar con Proyecto de Ejemplo
            </button>
          </div>
        </div>
      )}

      {/* Vista Principal Activa cuando hay proyecto analizado */}
      {analysis && (
        <>
          {/* Top Context & Architectural Health Banner */}
          <div className="relative overflow-hidden rounded-xl bg-[#0f0f1a] border border-[#262438] shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-4 sm:p-6">
            <div className="absolute -right-12 -top-12 w-64 h-64 bg-[#ff2d78]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute right-48 -bottom-16 w-52 h-52 bg-[#00ffcc]/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex flex-col gap-1 max-w-2xl min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-0.5 rounded bg-[#ff2d78]/20 text-[#ff2d78] border border-[#ff2d78]/50 text-xs uppercase tracking-wider font-bold shadow-[0_0_8px_rgba(255,45,120,0.3)]">
                    {analysis.framework}
                  </span>
                  <span className="text-[#a098b0] font-mono text-xs">
                    {analysis.version || "Detectado"} • {analysis.architecture_type}
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl text-white font-extrabold tracking-tight font-headline">
                  Explorador Didáctico de Estructura
                </h1>
                <p className="text-xs sm:text-sm text-[#a098b0] leading-relaxed">
                  Representación directa de las carpetas y archivos de tu proyecto local. Aprende el propósito de cada sector sin necesidad de compilar.
                </p>
              </div>

              {/* Indicadores Clave de Alineación */}
              <div className="flex items-center gap-2 bg-[#141422] p-2 rounded-xl border border-[#262438] shadow-inner shrink-0 flex-wrap sm:flex-nowrap">
                <div className="flex items-center gap-2 px-3 py-2 rounded bg-[#1e1e30] border border-[#00ffcc]/30 shadow-[0_0_12px_rgba(0,255,204,0.15)] flex-1 sm:flex-none">
                  <span className="material-symbols-outlined text-[#00ffcc] text-[20px]">check_circle</span>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] text-[#a098b0] leading-none uppercase font-semibold">
                      Alineación
                    </span>
                    <span className="text-base text-[#00ffcc] font-bold leading-tight font-mono">
                      {analysis.alignment_score}%
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 px-3 py-2 rounded bg-[#1e1e30] border border-[#ffe04a]/40 shadow-[0_0_12px_rgba(255,224,74,0.15)] flex-1 sm:flex-none">
                  <span className="material-symbols-outlined text-[#ffe04a] text-[20px]">warning</span>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] text-[#a098b0] leading-none uppercase font-semibold">
                      Por Corregir
                    </span>
                    <span className="text-base text-[#ffe04a] font-bold leading-tight font-mono">
                      {analysis.misplaced_count} ítems
                    </span>
                  </div>
                </div>

                <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded bg-[#1e1e30] border border-[#ff2d78]/40 shadow-[0_0_12px_rgba(255,45,120,0.15)]">
                  <span className="material-symbols-outlined text-[#ff2d78] text-[20px]">layers</span>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] text-[#a098b0] leading-none uppercase font-semibold">
                      Capas Activas
                    </span>
                    <span className="text-base text-[#ff2d78] font-bold leading-tight font-mono">
                      {analysis.active_layers.length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Rejilla Principal: Árbol Estructural (5 cols) + Glosario Pedagógico (7 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* PANEL IZQUIERDO: Estructura Real del Proyecto */}
            <div className="lg:col-span-5 flex flex-col gap-4 bg-[#0f0f1a] rounded-xl border border-[#262438] shadow-[0_4px_24px_rgba(0,0,0,0.4)] p-4 min-w-0">
              <div className="flex flex-col gap-2 pb-3 border-b border-[#201e30]">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm text-white font-bold truncate">Estructura del Proyecto</span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#141422] border border-[#2b2940] text-[#00ffcc] font-semibold shrink-0">
                    {analysis.framework}
                  </span>
                </div>
                <div className="flex items-center gap-1 px-2.5 py-1.5 bg-[#111118] rounded border border-[#201e30] text-xs font-mono text-[#a098b0] overflow-x-auto truncate">
                  <span className="text-[#00ffcc] font-semibold">{analysis.project_name}</span>
                  <span className="text-[#43445c]">/</span>
                  <span>{filteredStructure.length} carpetas detectadas</span>
                </div>
              </div>

              {/* Filtro Rápido */}
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-[#a098b0] text-[18px]">
                  filter_list
                </span>
                <input
                  type="text"
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  placeholder="Filtrar carpeta o archivo..."
                  className="w-full pl-9 pr-3 py-1.5 bg-[#111118] rounded text-xs text-white placeholder:text-[#a098b0]/70 border border-[#262438] focus:outline-none focus:border-[#00ffcc] transition-all"
                />
              </div>

              {/* Árbol de Directorios Real */}
              <div className="flex flex-col gap-1.5 font-mono text-xs select-none max-h-[500px] overflow-y-auto pr-1">
                {filteredStructure.length === 0 ? (
                  <div className="text-center py-6 text-xs text-[#a098b0]">
                    No se encontraron carpetas coincidentes.
                  </div>
                ) : (
                  filteredStructure.map((folderNode) => {
                    const folderKey = folderNode.name.replace("/", "").toLowerCase();
                    const isSelected = selectedFolder.toLowerCase() === folderKey;
                    const hasMisplaced = folderNode.children?.some((c) => c.is_misplaced);

                    return (
                      <div key={folderNode.name} className="flex flex-col gap-1">
                        <div
                          onClick={() => setSelectedFolder(folderKey)}
                          className={`flex items-center justify-between px-2.5 py-2 rounded cursor-pointer transition-all gap-2 ${
                            isSelected
                              ? "bg-[#1e1e30] text-[#ff2d78] font-bold border border-[#ff2d78]/60 shadow-[0_0_14px_rgba(255,45,120,0.25)]"
                              : "text-[#e8e0f0] hover:bg-[#18182b] hover:text-white border border-transparent"
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span
                              className={`material-symbols-outlined text-[18px] shrink-0 ${
                                isSelected ? "text-[#ff2d78]" : "text-[#736e8c]"
                              }`}
                            >
                              folder
                            </span>
                            <span className="text-white font-medium truncate">{folderNode.name}</span>
                            {isSelected && (
                              <span className="w-2 h-2 rounded-full bg-[#ff2d78] shadow-[0_0_8px_#ff2d78] animate-pulse shrink-0" />
                            )}
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            {hasMisplaced && (
                              <span className="px-1.5 py-0.5 rounded bg-[#ffe04a]/20 text-[#ffe04a] border border-[#ffe04a]/40 text-[10px] font-bold">
                                Revisar
                              </span>
                            )}
                            <span className="text-[#a098b0] text-[10px]">
                              {folderNode.children?.length || 0} archivos
                            </span>
                            <span className="material-symbols-outlined text-[#736e8c] text-[16px]">
                              {isSelected ? "expand_more" : "chevron_right"}
                            </span>
                          </div>
                        </div>

                        {/* Archivos reales contenidos en la carpeta seleccionada */}
                        {isSelected && folderNode.children && folderNode.children.length > 0 && (
                          <div className="ml-4 flex flex-col gap-1 border-l-2 border-[#ff2d78]/40 pl-2 my-0.5">
                            {folderNode.children.map((file) => (
                              <div
                                key={file.path}
                                className={`flex items-center justify-between gap-2 px-1.5 py-1 rounded transition-colors ${
                                  file.is_misplaced
                                    ? "bg-[#ffe04a]/10 border border-[#ffe04a]/40 text-[#ffe04a]"
                                    : "text-[#e8e0f0] hover:bg-[#18182b]"
                                }`}
                              >
                                <div className="flex items-center gap-1.5 min-w-0">
                                  <span
                                    className={`material-symbols-outlined text-[15px] shrink-0 ${
                                      file.is_misplaced ? "text-[#ffe04a]" : "text-[#00ffcc]"
                                    }`}
                                  >
                                    {file.is_misplaced ? "warning" : "description"}
                                  </span>
                                  <span className="text-white text-[11px] truncate">{file.name}</span>
                                </div>
                                {file.is_misplaced ? (
                                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#ffe04a]/20 border border-[#ffe04a]/40 text-[#ffe04a] shrink-0">
                                    Desordenado
                                  </span>
                                ) : (
                                  <span className="text-[9px] text-[#a098b0] bg-[#141423] px-1 py-0.5 rounded shrink-0">
                                    OK
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Diagnóstico rápido si existen archivos fuera de convención */}
              {analysis.misplaced_count > 0 && (
                <div className="mt-2 p-3 bg-[#141422] rounded border border-[#262438] flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
                  <div className="flex items-center gap-2 text-[#a098b0] min-w-0">
                    <span className="material-symbols-outlined text-[#ffe04a] text-[18px] shrink-0">
                      auto_fix_high
                    </span>
                    <span className="text-xs text-white truncate">
                      {analysis.misplaced_count} archivos sugieren reubicación
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      alert(
                        `Archivos desordenados:\n${analysis.misplaced_files
                          .map((m: MisplacedFileDetail) => `- ${m.file_name}: ${m.reason} -> Sugerido: ${m.suggested_path}`)
                          .join("\n")}`
                      )
                    }
                    className="px-3 py-1 rounded bg-[#ff2d78]/20 hover:bg-[#ff2d78]/30 text-[#ff2d78] border border-[#ff2d78]/50 shadow-[0_0_10px_rgba(255,45,120,0.3)] text-xs font-bold transition-all shrink-0 cursor-pointer"
                  >
                    Ver Detalles
                  </button>
                </div>
              )}
            </div>

            {/* PANEL DERECHO: Explicación Didáctica y Glosario Arquitectónico */}
            <div className="lg:col-span-7 flex flex-col gap-6 min-w-0">
              <div className="bg-[#0f0f1a] rounded-xl border border-[#262438] shadow-[0_4px_24px_rgba(0,0,0,0.4)] p-4 sm:p-6 flex flex-col gap-4">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#201e30]">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded bg-[#ff2d78]/20 border border-[#ff2d78]/50 flex items-center justify-center text-[#ff2d78] shadow-[0_0_12px_rgba(255,45,120,0.4)] shrink-0">
                      <span className="material-symbols-outlined text-[24px]">dataset</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[10px] text-[#00ffcc] uppercase tracking-widest font-bold">
                        {activeExplanation.layer}
                      </span>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm sm:text-base text-white font-bold">Carpeta Seleccionada:</span>
                        <span className="font-mono text-sm font-bold text-[#ff2d78] bg-[#ff2d78]/10 border border-[#ff2d78]/40 px-2 py-0.5 rounded shadow-[0_0_8px_rgba(255,45,120,0.25)]">
                          {selectedFolder}/
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-[#00ffcc]/15 text-[#00ffcc] border border-[#00ffcc]/40 text-xs font-bold flex items-center gap-1.5 shadow-[0_0_8px_rgba(0,255,204,0.2)] shrink-0">
                    <span className="w-2 h-2 rounded-full bg-[#00ffcc] shadow-[0_0_6px_#00ffcc] animate-pulse" />
                    {activeExplanation.badge}
                  </span>
                </div>

                {/* Explicación en lenguaje sencillo */}
                <div className="bg-[#141422] rounded-xl p-4 flex flex-col gap-2 border border-[#262438]">
                  <div className="flex items-center gap-2 text-[#00ffcc] text-xs sm:text-sm font-semibold">
                    <span className="material-symbols-outlined text-[20px] text-[#00ffcc]">lightbulb</span>
                    <span>¿Qué es esta carpeta en palabras sencillas?</span>
                  </div>
                  <p className="text-xs sm:text-sm text-[#e8e0f0] leading-relaxed">
                    {activeExplanation.simpleExplanation}
                  </p>
                </div>

                {/* Convenciones de nombrado */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#111118] border border-[#201e30] rounded-xl p-4 flex flex-col gap-2">
                    <div className="flex items-center gap-1.5 text-[#00ffcc] text-xs font-semibold">
                      <span className="material-symbols-outlined text-[18px]">verified</span>
                      <span>Convención Recomendada</span>
                    </div>
                    <p className="text-xs text-[#a098b0] leading-relaxed">
                      {activeExplanation.conventions.good}
                    </p>
                    <span className="text-[10px] text-[#736e8c] italic mt-auto">
                      {activeExplanation.conventions.reason}
                    </span>
                  </div>

                  <div className="bg-[#111118] border border-[#201e30] rounded-xl p-4 flex flex-col gap-2">
                    <div className="flex items-center gap-1.5 text-[#ff4444] text-xs font-semibold">
                      <span className="material-symbols-outlined text-[18px]">cancel</span>
                      <span>Nombre a Evitar</span>
                    </div>
                    <p className="text-xs text-[#a098b0] leading-relaxed">
                      {activeExplanation.conventions.bad}
                    </p>
                  </div>
                </div>

                {/* Archivos Reales Presentes en esta Carpeta */}
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white font-semibold flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[18px] text-[#00ffcc]">folder_open</span>
                      Archivos reales en tu proyecto ({currentFiles.length})
                    </span>
                    <span className="text-[10px] text-[#a098b0] font-mono">
                      {currentFiles.length === 0 ? "Carpeta vacía o sin archivos" : "Listado según proyecto"}
                    </span>
                  </div>

                  {currentFiles.length === 0 ? (
                    <div className="p-3 bg-[#111118] rounded-lg border border-[#201e30] text-center text-xs text-[#a098b0]">
                      No hay archivos en esta carpeta dentro del proyecto analizado.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {currentFiles.map((f) => (
                        <div
                          key={f.path}
                          className={`p-2.5 rounded-lg border text-xs flex items-center justify-between gap-2 ${
                            f.is_misplaced
                              ? "bg-[#ffe04a]/10 border-[#ffe04a]/40 text-[#ffe04a]"
                              : "bg-[#141423] border-[#25233a] text-white"
                          }`}
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="material-symbols-outlined text-[16px] text-[#00ffcc] shrink-0">
                              description
                            </span>
                            <span className="font-mono text-[11px] truncate">{f.name}</span>
                          </div>
                          {f.is_misplaced && (
                            <span className="text-[9px] px-1 py-0.5 rounded bg-[#ffe04a]/20 border border-[#ffe04a]/40 shrink-0">
                              Mover
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Consejo didáctico del asistente */}
                <div className="p-3 rounded-lg bg-[#141424] border border-[#27263d] flex items-start gap-2.5 text-[#a098b0]">
                  <span className="material-symbols-outlined text-[20px] text-[#ff2d78] shrink-0">
                    tips_and_updates
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs text-white font-semibold">Consejo del Asistente</span>
                    <p className="text-xs leading-relaxed">{activeExplanation.tip}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
