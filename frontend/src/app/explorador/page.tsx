"use client";

import { useState } from "react";

export default function ExploradorPage() {
  const [selectedFolder, setSelectedFolder] = useState<string>("models");
  const [filterQuery, setFilterQuery] = useState<string>("");

  const folderDetails: Record<string, {
    title: string;
    badge: string;
    layer: string;
    simpleExplanation: string;
    conventions: { good: string; bad: string; reason: string };
    annotations: Array<{ name: string; desc: string }>;
    files: Array<{ name: string; desc: string; tag1: string; tag2: string }>;
    tip: string;
  }> = {
    models: {
      title: "models/",
      badge: "Spring Boot: Entidades JPA",
      layer: "Capa de Dominio & Datos",
      simpleExplanation:
        "Aquí se definen las estructuras de tus datos. Cada archivo Java dentro de esta carpeta suele representar una tabla en tu base de datos relacional, especificando qué columnas contiene (atributos como nombre, correo, fecha) y cómo se vincula con otras entidades (relaciones uno a muchos o muchos a muchos).",
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
      files: [
        {
          name: "Employee.java",
          desc: "Representa a los miembros del personal universitario.",
          tag1: "ID: Long",
          tag2: "Relación: Department",
        },
        {
          name: "Department.java",
          desc: "Departamentos académicos o facultades adscritas.",
          tag1: "ID: UUID",
          tag2: "1 a N con Employee",
        },
        {
          name: "Role.java",
          desc: "Catálogo de permisos y privilegios de acceso.",
          tag1: "ID: Integer",
          tag2: "Lookup Table",
        },
      ],
      tip: "Evita colocar lógica de negocio o consultas SQL directas dentro de tus modelos. Un modelo debe mantenerse como un POJO (Plain Old Java Object) representacional. Las consultas complejas pertenecen a repositories/ y las validaciones de negocio a services/.",
    },
    controllers: {
      title: "controllers/",
      badge: "Spring Boot: Endpoints REST",
      layer: "Capa de Presentación Web",
      simpleExplanation:
        "Aquí residen los controladores que reciben las peticiones HTTP del navegador o frontend. Su labor es validar la entrada, invocar la lógica del servicio y devolver el JSON o vista correspondiente con el código HTTP adecuado.",
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
      files: [
        {
          name: "EmployeeController.java",
          desc: "Expone endpoints CRUD para gestión de empleados.",
          tag1: "REST API",
          tag2: "Rutas: /api/empleados",
        },
        {
          name: "DepartmentController.java",
          desc: "Controlador de áreas y departamentos de la universidad.",
          tag1: "REST API",
          tag2: "Rutas: /api/departamentos",
        },
      ],
      tip: "Mantén los controladores 'delgados' (Thin Controllers). Nunca escribas cálculos pesados o consultas directas a base de datos dentro de un método de controlador.",
    },
    repositories: {
      title: "repositories/",
      badge: "Spring Data JPA: Acceso a BD",
      layer: "Capa de Persistencia",
      simpleExplanation:
        "Interfaces que extienden de JpaRepository. Spring genera automáticamente las sentencias SQL (SELECT, INSERT, UPDATE, DELETE) en tiempo de ejecución sin que tengas que escribirlas a mano.",
      conventions: {
        good: "Nombre con sufijo Repository: EmployeeRepository.java",
        bad: "No crear clases normales sino interfaces: interface EmployeeRepo",
        reason: "Spring Data genera la implementación de la interfaz de forma dinámica.",
      },
      annotations: [
        { name: "JpaRepository<T, ID>", desc: "Hereda métodos findAll(), save(), deleteById()." },
        { name: "@Query", desc: "Permite consultas JPQL personalizadas si son requeridas." },
      ],
      files: [
        {
          name: "EmployeeRepository.java",
          desc: "Consultas de empleados por departamento y estado activo.",
          tag1: "Interface",
          tag2: "JpaRepository<Employee, Long>",
        },
      ],
      tip: "Aprovecha los métodos derivados de nombres de Spring: findByDepartmentIdAndActiveTrue() crea la consulta perfecta sin escribir una sola línea de SQL.",
    },
    services: {
      title: "services/",
      badge: "Spring Boot: Lógica de Negocio",
      layer: "Capa de Servicios y Reglas",
      simpleExplanation:
        "El cerebro de tu aplicación. Aquí se implementan las reglas de negocio, validaciones complejas, cálculo de sueldos, coordinación de múltiples repositorios y manejo transaccional.",
      conventions: {
        good: "Nombre con sufijo Service: EmployeeService.java",
        bad: "No acceder a HttpServletRequest en los servicios.",
        reason: "Los servicios deben ser agnósticos del protocolo HTTP para permitir reutilización y tests limpios.",
      },
      annotations: [
        { name: "@Service", desc: "Registra la clase como Bean de servicio de Spring." },
        { name: "@Transactional", desc: "Asegura atomicidad: si falla una operación, se revierte todo." },
        { name: "@Autowired", desc: "Inyección de dependencias (preferible por constructor)." },
      ],
      files: [
        {
          name: "EmployeeService.java",
          desc: "Validaciones de contratos y orquestación de operaciones de personal.",
          tag1: "Bean @Service",
          tag2: "Transaccional",
        },
      ],
      tip: "Usa inyección de dependencias mediante constructor en lugar de @Autowired sobre atributos. Hace tu código más seguro y facilita las pruebas unitarias con Mockito.",
    },
    config: {
      title: "config/",
      badge: "Spring Boot: Beans y Ajustes",
      layer: "Capa de Configuración",
      simpleExplanation:
        "Configuraciones de seguridad (Spring Security, JWT), permisos CORS para que el frontend pueda conectarse y ajustes de Swagger/OpenAPI.",
      conventions: {
        good: "Sufijo Config: SecurityConfig.java, CorsConfig.java",
        bad: "No colocar lógica de negocio en clases de configuración.",
        reason: "Las clases de configuración solo deben instanciar y parametrizar Beans.",
      },
      annotations: [
        { name: "@Configuration", desc: "Declara una fuente de definiciones de Beans." },
        { name: "@Bean", desc: "Indica que un método produce un Bean administrado por Spring." },
      ],
      files: [
        {
          name: "SecurityConfig.java",
          desc: "Reglas de autorización HTTP y filtros de sesión.",
          tag1: "@Configuration",
          tag2: "SecurityFilterChain",
        },
      ],
      tip: "Separa la configuración de CORS y la de Seguridad en dos clases distintas para que sea fácil de mantener por el equipo de trabajo.",
    },
  };

  const activeData = folderDetails[selectedFolder] || folderDetails["models"];

  return (
    <div className="flex flex-col w-full gap-6 px-4 sm:px-6 py-6 max-w-[1440px] mx-auto overflow-x-hidden">
      {/* Top Context & Architectural Health Banner */}
      <div className="relative overflow-hidden rounded-xl bg-[#0f0f1a] border border-[#262438] shadow-[0_8px_32px_rgba(0,0,0,0.4)] p-4 sm:p-6">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-[#ff2d78]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-48 -bottom-16 w-52 h-52 bg-[#00ffcc]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-col gap-1 max-w-2xl min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded bg-[#ff2d78]/20 text-[#ff2d78] border border-[#ff2d78]/50 text-xs uppercase tracking-wider font-bold shadow-[0_0_8px_rgba(255,45,120,0.3)]">
                Framework Inspector
              </span>
              <span className="text-[#a098b0] font-mono text-xs">
                v3.2.0 • Arquitectura en Capas (N-Tier)
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl text-white font-extrabold tracking-tight font-headline">
              Explorador Didáctico de Estructura
            </h1>
            <p className="text-xs sm:text-sm text-[#a098b0] leading-relaxed">
              Comprende el propósito de cada directorio en Spring Boot sin la distracción de terminales o compiladores. Aprende dónde y por qué ubicar cada archivo.
            </p>
          </div>

          {/* Quick Metrics pill group */}
          <div className="flex items-center gap-2 bg-[#141422] p-2 rounded-xl border border-[#262438] shadow-inner shrink-0 flex-wrap sm:flex-nowrap">
            <div className="flex items-center gap-2 px-3 py-2 rounded bg-[#1e1e30] border border-[#00ffcc]/30 shadow-[0_0_12px_rgba(0,255,204,0.15)] flex-1 sm:flex-none">
              <span className="material-symbols-outlined text-[#00ffcc] text-[20px]">
                check_circle
              </span>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] text-[#a098b0] leading-none uppercase font-semibold">
                  Alineación
                </span>
                <span className="text-base text-[#00ffcc] font-bold leading-tight font-mono">
                  88%
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 rounded bg-[#1e1e30] border border-[#ffe04a]/40 shadow-[0_0_12px_rgba(255,224,74,0.15)] flex-1 sm:flex-none">
              <span className="material-symbols-outlined text-[#ffe04a] text-[20px]">
                warning
              </span>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] text-[#a098b0] leading-none uppercase font-semibold">
                  Por Corregir
                </span>
                <span className="text-base text-[#ffe04a] font-bold leading-tight font-mono">
                  2 ítems
                </span>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded bg-[#1e1e30] border border-[#ff2d78]/40 shadow-[0_0_12px_rgba(255,45,120,0.15)]">
              <span className="material-symbols-outlined text-[#ff2d78] text-[20px]">
                layers
              </span>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] text-[#a098b0] leading-none uppercase font-semibold">
                  Capas Activas
                </span>
                <span className="text-base text-[#ff2d78] font-bold leading-tight font-mono">
                  5 de 5
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Split Architecture View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT PANEL: Interactive Project Hierarchy (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4 bg-[#0f0f1a] rounded-xl border border-[#262438] shadow-[0_4px_24px_rgba(0,0,0,0.4)] p-4 min-w-0">
          {/* Header & Path Breadcrumbs */}
          <div className="flex flex-col gap-2 pb-3 border-b border-[#201e30]">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm text-white font-bold truncate">Estructura del Proyecto</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#141422] border border-[#2b2940] text-[#00ffcc] font-semibold shrink-0">
                Java / Maven
              </span>
            </div>
            <div className="flex items-center flex-wrap gap-1 px-2.5 py-1.5 bg-[#111118] rounded border border-[#201e30] text-xs font-mono text-[#a098b0] overflow-x-auto">
              <span>src</span>
              <span className="text-[#43445c]">/</span>
              <span>main</span>
              <span className="text-[#43445c]">/</span>
              <span>java</span>
              <span className="text-[#43445c]">/</span>
              <span className="font-bold text-[#00ffcc]">com.universidad.proyecto</span>
            </div>
          </div>

          {/* Quick Search Filter */}
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-3 text-[#a098b0] text-[18px]">
              filter_list
            </span>
            <input
              type="text"
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              placeholder="Filtrar carpeta o convención..."
              className="w-full pl-9 pr-3 py-1.5 bg-[#111118] rounded text-xs text-white placeholder:text-[#a098b0]/70 border border-[#262438] focus:outline-none focus:border-[#00ffcc] transition-all"
            />
          </div>

          {/* Interactive Directory Tree */}
          <div className="flex flex-col gap-1 font-mono text-xs select-none">
            {/* Root level package */}
            <div className="flex items-center gap-2 px-2 py-1 text-[#a098b0]">
              <span className="material-symbols-outlined text-[16px] text-[#00ffcc] shrink-0">folder_open</span>
              <span className="truncate">com/universidad/proyecto</span>
            </div>

            {/* Folder: controllers */}
            <div
              onClick={() => setSelectedFolder("controllers")}
              className={`ml-3 sm:ml-4 flex items-center justify-between px-2.5 py-2 rounded cursor-pointer transition-all gap-2 ${
                selectedFolder === "controllers"
                  ? "bg-[#1e1e30] text-[#ff2d78] font-bold border border-[#ff2d78]/60 shadow-[0_0_14px_rgba(255,45,120,0.25)]"
                  : "text-[#e8e0f0] hover:bg-[#18182b] hover:text-white border border-transparent"
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className={`material-symbols-outlined text-[18px] shrink-0 ${selectedFolder === "controllers" ? "text-[#ff2d78]" : "text-[#736e8c]"}`}>
                  folder
                </span>
                <span className="text-white font-medium truncate">controllers/</span>
              </div>
              <span className="text-[#a098b0] text-[10px] sm:text-[11px] shrink-0">Endpoints REST</span>
            </div>

            {/* Folder: models (ACTIVE by default) */}
            <div
              onClick={() => setSelectedFolder("models")}
              className={`ml-3 sm:ml-4 flex items-center justify-between px-2.5 py-2 rounded cursor-pointer transition-all gap-2 ${
                selectedFolder === "models"
                  ? "bg-[#1e1e30] text-[#ff2d78] font-bold border border-[#ff2d78]/60 shadow-[0_0_14px_rgba(255,45,120,0.25)]"
                  : "text-[#e8e0f0] hover:bg-[#18182b] hover:text-white border border-transparent"
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="material-symbols-outlined text-[#ff2d78] text-[18px] shrink-0">
                  folder
                </span>
                <span className="text-white font-bold truncate">models/</span>
                <span className="w-2 h-2 rounded-full bg-[#ff2d78] shadow-[0_0_8px_#ff2d78] animate-pulse shrink-0" />
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <span className="px-1.5 py-0.5 rounded bg-[#ff2d78]/20 text-[#ff2d78] border border-[#ff2d78]/40 text-[10px]">
                  3 Entidades
                </span>
                <span className="material-symbols-outlined text-[#ff2d78] text-[16px]">
                  chevron_right
                </span>
              </div>
            </div>

            {/* Sub-items inside models */}
            {selectedFolder === "models" && (
              <div className="ml-8 sm:ml-9 flex flex-col gap-1 border-l-2 border-[#ff2d78]/40 pl-2 my-0.5">
                <div className="flex items-center justify-between gap-2 px-1 py-1 rounded text-[#e8e0f0] hover:bg-[#18182b] transition-colors">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="material-symbols-outlined text-[#00ffcc] text-[16px] shrink-0">description</span>
                    <span className="text-white truncate">Employee.java</span>
                  </div>
                  <span className="text-[10px] text-[#00ffcc] bg-[#00ffcc]/15 border border-[#00ffcc]/30 px-1.5 py-0.5 rounded shrink-0">
                    @Entity
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 px-1 py-1 rounded text-[#e8e0f0] hover:bg-[#18182b] transition-colors">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="material-symbols-outlined text-[#00ffcc] text-[16px] shrink-0">description</span>
                    <span className="text-white truncate">Department.java</span>
                  </div>
                  <span className="text-[10px] text-[#00ffcc] bg-[#00ffcc]/15 border border-[#00ffcc]/30 px-1.5 py-0.5 rounded shrink-0">
                    @Entity
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2 px-1 py-1 rounded text-[#e8e0f0] hover:bg-[#18182b] transition-colors">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="material-symbols-outlined text-[#00ffcc] text-[16px] shrink-0">description</span>
                    <span className="text-white truncate">Role.java</span>
                  </div>
                  <span className="text-[10px] text-[#00ffcc] bg-[#00ffcc]/15 border border-[#00ffcc]/30 px-1.5 py-0.5 rounded shrink-0">
                    @Entity
                  </span>
                </div>
              </div>
            )}

            {/* Folder: repositories */}
            <div
              onClick={() => setSelectedFolder("repositories")}
              className={`ml-3 sm:ml-4 flex items-center justify-between px-2.5 py-2 rounded cursor-pointer transition-all gap-2 ${
                selectedFolder === "repositories"
                  ? "bg-[#1e1e30] text-[#ff2d78] font-bold border border-[#ff2d78]/60 shadow-[0_0_14px_rgba(255,45,120,0.25)]"
                  : "text-[#e8e0f0] hover:bg-[#18182b] hover:text-white border border-transparent"
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="material-symbols-outlined text-[#736e8c] text-[18px] shrink-0">folder</span>
                <span className="text-white font-medium truncate">repositories/</span>
              </div>
              <span className="text-[#a098b0] text-[10px] sm:text-[11px] shrink-0">Acceso a BD</span>
            </div>

            {/* Folder: services */}
            <div
              onClick={() => setSelectedFolder("services")}
              className={`ml-3 sm:ml-4 flex items-center justify-between px-2.5 py-2 rounded cursor-pointer transition-all gap-2 ${
                selectedFolder === "services"
                  ? "bg-[#1e1e30] text-[#ff2d78] font-bold border border-[#ff2d78]/60 shadow-[0_0_14px_rgba(255,45,120,0.25)]"
                  : "text-[#e8e0f0] hover:bg-[#18182b] hover:text-white border border-transparent"
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="material-symbols-outlined text-[#736e8c] text-[18px] shrink-0">folder</span>
                <span className="text-white font-medium truncate">services/</span>
              </div>
              <span className="text-[#a098b0] text-[10px] sm:text-[11px] shrink-0">Reglas Negocio</span>
            </div>

            {/* Folder: config */}
            <div
              onClick={() => setSelectedFolder("config")}
              className={`ml-3 sm:ml-4 flex items-center justify-between px-2.5 py-2 rounded cursor-pointer transition-all gap-2 ${
                selectedFolder === "config"
                  ? "bg-[#1e1e30] text-[#ff2d78] font-bold border border-[#ff2d78]/60 shadow-[0_0_14px_rgba(255,45,120,0.25)]"
                  : "text-[#e8e0f0] hover:bg-[#18182b] hover:text-white border border-transparent"
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="material-symbols-outlined text-[#736e8c] text-[18px] shrink-0">folder</span>
                <span className="text-white font-medium truncate">config/</span>
              </div>
              <span className="text-[#a098b0] text-[10px] sm:text-[11px] shrink-0">Ajustes / Beans</span>
            </div>

            {/* OUT OF CONVENTION 1: mis_scripts/ */}
            <div className="ml-3 sm:ml-4 relative flex items-center justify-between px-2.5 py-2 rounded bg-[#ffe04a]/10 border border-[#ffe04a]/50 text-[#ffe04a] shadow-[0_0_10px_rgba(255,224,74,0.15)] gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="material-symbols-outlined text-[18px] text-[#ffe04a] shrink-0">warning</span>
                <span className="font-semibold line-through opacity-80 truncate">mis_scripts/</span>
              </div>
              <span className="px-1.5 py-0.5 rounded bg-[#ffe04a]/20 border border-[#ffe04a]/40 text-[10px] font-bold shrink-0">
                Fuera de convención
              </span>
            </div>

            {/* Root standard file */}
            <div className="ml-3 sm:ml-4 flex items-center justify-between px-2.5 py-2 rounded text-[#e8e0f0] hover:bg-[#18182b] transition-colors gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="material-symbols-outlined text-[#ff2d78] text-[18px] shrink-0">terminal</span>
                <span className="text-white font-medium truncate">ProyectoApplication.java</span>
              </div>
              <span className="text-[10px] sm:text-[11px] text-[#a098b0] shrink-0">Clase Principal</span>
            </div>

            {/* OUT OF CONVENTION 2: TempQueryHelper.java */}
            <div className="ml-3 sm:ml-4 relative flex items-center justify-between px-2.5 py-2 rounded bg-[#ffe04a]/10 border border-[#ffe04a]/50 text-[#ffe04a] shadow-[0_0_10px_rgba(255,224,74,0.15)] gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="material-symbols-outlined text-[18px] text-[#ffe04a] shrink-0">error</span>
                <span className="font-semibold truncate">TempQueryHelper.java</span>
              </div>
              <span className="px-1.5 py-0.5 rounded bg-[#ffe04a]/20 border border-[#ffe04a]/40 text-[10px] font-bold shrink-0">
                Mover a /services
              </span>
            </div>
          </div>

          {/* Quick Diagnostic Action */}
          <div className="mt-2 p-3 bg-[#141422] rounded border border-[#262438] flex items-center justify-between gap-2 flex-wrap sm:flex-nowrap">
            <div className="flex items-center gap-2 text-[#a098b0] min-w-0">
              <span className="material-symbols-outlined text-[#ffe04a] text-[18px] shrink-0">auto_fix_high</span>
              <span className="text-xs text-white truncate">2 archivos sugieren reubicación</span>
            </div>
            <button
              onClick={() => alert("Sugerencia: TempQueryHelper.java pertenece a /services/ y mis_scripts/ debe reemplazarse por paquetes de convención.")}
              className="px-3 py-1 rounded bg-[#ff2d78]/20 hover:bg-[#ff2d78]/30 text-[#ff2d78] border border-[#ff2d78]/50 shadow-[0_0_10px_rgba(255,45,120,0.3)] text-xs font-bold transition-all shrink-0 cursor-pointer"
            >
              Ver Sugerencia
            </button>
          </div>
        </div>

        {/* RIGHT PANEL: Dynamic Architecture & Pedagogical Glossary (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6 min-w-0">
          {/* Dynamic Header Card */}
          <div className="bg-[#0f0f1a] rounded-xl border border-[#262438] shadow-[0_4px_24px_rgba(0,0,0,0.4)] p-4 sm:p-6 flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#201e30]">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded bg-[#ff2d78]/20 border border-[#ff2d78]/50 flex items-center justify-center text-[#ff2d78] shadow-[0_0_12px_rgba(255,45,120,0.4)] shrink-0">
                  <span className="material-symbols-outlined text-[24px]">dataset</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[10px] text-[#00ffcc] uppercase tracking-widest font-bold">
                    {activeData.layer}
                  </span>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm sm:text-base text-white font-bold">Carpeta Seleccionada:</span>
                    <span className="font-mono text-sm font-bold text-[#ff2d78] bg-[#ff2d78]/10 border border-[#ff2d78]/40 px-2 py-0.5 rounded shadow-[0_0_8px_rgba(255,45,120,0.25)]">
                      {activeData.title}
                    </span>
                  </div>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#00ffcc]/15 text-[#00ffcc] border border-[#00ffcc]/40 text-xs font-bold flex items-center gap-1.5 shadow-[0_0_8px_rgba(0,255,204,0.2)] shrink-0">
                <span className="w-2 h-2 rounded-full bg-[#00ffcc] shadow-[0_0_6px_#00ffcc] animate-pulse" />
                {activeData.badge}
              </span>
            </div>

            {/* Plain Pedagogical Concept Card */}
            <div className="bg-[#141422] rounded-xl p-4 flex flex-col gap-2 border border-[#262438]">
              <div className="flex items-center gap-2 text-[#00ffcc] text-xs sm:text-sm font-semibold">
                <span className="material-symbols-outlined text-[20px] text-[#00ffcc]">lightbulb</span>
                <span>¿Qué es esta carpeta en palabras sencillas?</span>
              </div>
              <p className="text-xs sm:text-sm text-[#e8e0f0] leading-relaxed">
                {activeData.simpleExplanation}
              </p>
            </div>

            {/* Illustrated Architectural Flow */}
            <div className="p-4 rounded-xl bg-[#111118] border border-[#201e30] flex flex-col gap-2">
              <span className="text-[10px] text-[#a098b0] uppercase tracking-widest font-bold">
                Flujo de Responsabilidad en el Sistema
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-1 items-center text-center">
                <div
                  onClick={() => setSelectedFolder("controllers")}
                  className={`flex flex-col items-center p-3 rounded border cursor-pointer transition-all ${
                    selectedFolder === "controllers"
                      ? "bg-[#ff2d78]/20 border-[#ff2d78]/60 shadow-[0_0_12px_rgba(255,45,120,0.3)]"
                      : "bg-[#0f0f1a] border-[#262438] opacity-70 hover:opacity-100"
                  }`}
                >
                  <span className="material-symbols-outlined text-[22px] text-[#00ffcc]">devices</span>
                  <span className="font-mono text-xs font-semibold text-white mt-1">controllers/</span>
                  <span className="text-[10px] text-[#a098b0] mt-0.5">Recibe petición HTTP</span>
                </div>

                <div
                  onClick={() => setSelectedFolder("services")}
                  className={`flex flex-col items-center p-3 rounded border cursor-pointer transition-all ${
                    selectedFolder === "services"
                      ? "bg-[#ff2d78]/20 border-[#ff2d78]/60 shadow-[0_0_12px_rgba(255,45,120,0.3)]"
                      : "bg-[#0f0f1a] border-[#262438] opacity-70 hover:opacity-100"
                  }`}
                >
                  <span className="material-symbols-outlined text-[22px] text-[#ffe04a]">psychology</span>
                  <span className="font-mono text-xs font-semibold text-white mt-1">services/</span>
                  <span className="text-[10px] text-[#a098b0] mt-0.5">Aplica la lógica</span>
                </div>

                <div
                  onClick={() => setSelectedFolder("models")}
                  className={`flex flex-col items-center p-3 rounded border cursor-pointer transition-all ${
                    selectedFolder === "models"
                      ? "bg-[#ff2d78]/20 border-[#ff2d78]/60 shadow-[0_0_14px_rgba(255,45,120,0.3)]"
                      : "bg-[#0f0f1a] border-[#262438] opacity-70 hover:opacity-100"
                  }`}
                >
                  <span className="material-symbols-outlined text-[22px] text-[#ff2d78]">storage</span>
                  <span className="font-mono text-xs font-bold text-white mt-1">models/ & repo</span>
                  <span className="text-[10px] text-[#ff2d78] font-medium mt-0.5">Moldea y persiste datos</span>
                </div>
              </div>
            </div>
          </div>

          {/* Conventions & Annotations Bento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Conventions */}
            <div className="bg-[#0f0f1a] rounded-xl border border-[#262438] shadow-[0_4px_24px_rgba(0,0,0,0.4)] p-4 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-white text-xs sm:text-sm font-bold">
                <span className="material-symbols-outlined text-[#00ffcc] text-[20px]">spellcheck</span>
                <span>Convenciones de Nombres</span>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[#00ffcc] text-[18px] mt-0.5 shrink-0">check</span>
                  <span className="text-xs text-white leading-relaxed">{activeData.conventions.good}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="material-symbols-outlined text-[#ff4444] text-[18px] mt-0.5 shrink-0">close</span>
                  <span className="text-xs text-[#a098b0] line-through leading-relaxed">{activeData.conventions.bad}</span>
                </div>
              </div>
              <div className="mt-auto pt-2 bg-[#141422] p-2.5 rounded border border-[#262438]">
                <p className="text-xs text-[#a098b0] leading-relaxed">
                  <strong className="text-white">¿Por qué? </strong>
                  {activeData.conventions.reason}
                </p>
              </div>
            </div>

            {/* Key Annotations */}
            <div className="bg-[#0f0f1a] rounded-xl border border-[#262438] shadow-[0_4px_24px_rgba(0,0,0,0.4)] p-4 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-white text-xs sm:text-sm font-bold">
                <span className="material-symbols-outlined text-[#ff2d78] text-[20px]">tag</span>
                <span>Anotaciones Clave</span>
              </div>
              <div className="flex flex-col gap-2">
                {activeData.annotations.map((ann) => (
                  <div
                    key={ann.name}
                    className="flex items-center justify-between p-2 rounded bg-[#141422] border border-[#262438] gap-2"
                  >
                    <span className="font-mono text-xs font-bold text-[#ff2d78] shrink-0">{ann.name}</span>
                    <span className="text-xs text-[#a098b0] text-right truncate">{ann.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Identified Files in Selected Folder */}
          <div className="bg-[#0f0f1a] rounded-xl border border-[#262438] shadow-[0_4px_24px_rgba(0,0,0,0.4)] p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-[#201e30] pb-2 gap-2 flex-wrap">
              <div className="flex items-center gap-2 min-w-0">
                <span className="material-symbols-outlined text-[#00ffcc] text-[20px] shrink-0">folder_special</span>
                <span className="text-sm text-white font-bold truncate">
                  Archivos Identificados en {activeData.title}
                </span>
              </div>
              <span className="text-xs text-[#00ffcc] font-semibold shrink-0">
                {activeData.files.length} clases conformes
              </span>
            </div>
            <div className="flex flex-col gap-2">
              {activeData.files.map((file) => (
                <div
                  key={file.name}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded bg-[#141422] hover:bg-[#1e1e30] border border-[#262438] transition-colors gap-2"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded bg-[#ff2d78]/20 border border-[#ff2d78]/40 flex items-center justify-center text-[#ff2d78] shrink-0">
                      <span className="material-symbols-outlined text-[18px]">badge</span>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-mono text-xs font-bold text-white truncate">{file.name}</span>
                      <span className="text-xs text-[#a098b0] truncate">{file.desc}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                    <span className="px-2 py-0.5 rounded bg-[#1e1e30] text-[#a098b0] border border-[#262438] font-mono text-[11px]">
                      {file.tag1}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#00ffcc]/15 text-[#00ffcc] border border-[#00ffcc]/30 font-mono text-[11px] font-semibold">
                      {file.tag2}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Educational Tip Callout */}
          <div className="rounded-xl bg-[#ffe04a]/10 border border-[#ffe04a]/40 p-4 flex items-start gap-3 shadow-[0_0_20px_rgba(255,224,74,0.1)]">
            <div className="w-10 h-10 rounded bg-[#ffe04a]/20 border border-[#ffe04a]/50 text-[#ffe04a] flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(255,224,74,0.4)]">
              <span className="material-symbols-outlined text-[22px]">tips_and_updates</span>
            </div>
            <div className="flex flex-col gap-1 min-w-0">
              <span className="text-xs text-[#ffe04a] font-bold uppercase tracking-wider">
                Tip de Ingeniería & Buenas Prácticas
              </span>
              <p className="text-xs sm:text-sm text-[#e8e0f0] leading-relaxed">
                {activeData.tip}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
