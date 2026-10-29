"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { FileSuggestion } from "@/lib/types";

export default function AsistentePage() {
  const [query, setQuery] = useState("Una pantalla para listar empleados");
  const [loading, setLoading] = useState(false);
  const [copiedPath, setCopiedPath] = useState<string | null>(null);

  const [suggestion, setSuggestion] = useState<FileSuggestion>({
    framework: "Spring Boot",
    detected_intent: "Una pantalla para listar empleados",
    primary_file: "EmployeeController.java",
    primary_path: "/src/main/java/controllers/",
    annotation_or_pattern: "@RestController",
    layer: "Controlador Web / API",
    architectural_responsibility:
      "Manejará las peticiones HTTP GET para /empleados y retornará los datos de la lista hacia el cliente web o vista Thymeleaf.",
    naming_convention: "Terminación obligatoria *Controller en PascalCase singular.",
    complementary_files: [
      {
        name: "EmployeeService.java",
        path: "/src/main/java/services/",
        annotation: "@Service",
        layer: "Capa de Negocio",
        responsibility:
          "Lógica para obtener la lista, aplicar validaciones de contratos activos y formatear datos antes del envío.",
      },
      {
        name: "EmployeeRepository.java",
        path: "/src/main/java/repositories/",
        annotation: "JpaRepository",
        layer: "Capa de Datos",
        responsibility:
          "Consulta directa a la base de datos o entidad JPA para recuperar los registros mediante métodos derivados.",
      },
    ],
    checklist: [
      {
        step: "1",
        title: "Crear la Interfaz del Repositorio",
        detail:
          "Define la entidad modelo Employee y extiende de JpaRepository para heredar operaciones CRUD sin queries manuales.",
      },
      {
        step: "2",
        title: "Inyectar el Servicio",
        detail:
          "Inyecta el repositorio en EmployeeService usando constructor (@Autowired implícito) para encapsular las reglas de negocio.",
      },
      {
        step: "3",
        title: "Mapear la Ruta en el Controlador",
        detail:
          "Inyecta el servicio en el controlador y anota con @GetMapping('/empleados') delegando la respuesta limpiamente.",
      },
    ],
    educational_tip:
      "Esta herramienta evalúa convenciones de paquetes y separación de responsabilidades sin compilar ni alterar el código en tiempo real.",
  });

  const handleAnalyze = async (searchPrompt?: string) => {
    const textToSearch = searchPrompt || query;
    if (!textToSearch.trim()) return;

    setLoading(true);
    try {
      const res = await api.suggestLocation(textToSearch, "Spring Boot");
      setSuggestion(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (path: string) => {
    navigator.clipboard.writeText(path);
    setCopiedPath(path);
    setTimeout(() => setCopiedPath(null), 2000);
  };

  const inspirationChips = [
    { label: "Registrar usuario", icon: "person_add" },
    { label: "Conectar API externa", icon: "hub" },
    { label: "Filtro de búsqueda de clientes", icon: "filter_alt" },
    { label: "Enviar correos de notificación", icon: "mail" },
  ];

  return (
    <div className="w-full px-4 sm:px-6 py-6 max-w-5xl mx-auto flex flex-col gap-6 relative overflow-hidden">
      {/* Background Neon ambient glows (contained inside overflow-hidden) */}
      <div className="absolute top-0 left-1/4 w-80 sm:w-96 h-80 sm:h-96 bg-[#ff2d78]/10 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute top-1/3 right-10 w-80 sm:w-96 h-80 sm:h-96 bg-[#00ffcc]/10 rounded-full blur-3xl pointer-events-none -z-0" />

      {/* Hero Header */}
      <div className="flex flex-col items-center text-center gap-2 mt-2 mb-2 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141422] border border-[#ff2d78]/30 text-[#ff2d78] text-xs font-semibold shadow-[0_0_10px_rgba(255,45,120,0.3)]">
          <span className="material-symbols-outlined text-[16px] text-[#ff2d78]">auto_fix_high</span>
          <span className="tracking-wide">Asistente de Convenciones y Arquitectura</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl text-white font-bold tracking-tight font-headline">
          Asistente Guiado de Nuevos Archivos
        </h1>
        <p className="text-xs sm:text-sm text-[#a098b0] max-w-2xl leading-relaxed">
          Describe qué funcionalidad deseas agregar y la herramienta te indicará la convención exacta de nomenclatura, rol arquitectónico y ubicación sin compilar.
        </p>
      </div>

      {/* Smart Input Prompt Container */}
      <div className="w-full bg-[#141422] rounded-xl border border-[#262438] shadow-[0_8px_32px_rgba(0,0,0,0.5)] p-3 sm:p-4 flex flex-col gap-3 backdrop-blur-md relative z-10">
        <div className="relative flex flex-col sm:flex-row sm:items-center bg-[#0c0c16] rounded-lg p-1.5 border border-[#262438] focus-within:border-[#00ffcc] focus-within:shadow-[0_0_16px_rgba(0,255,204,0.25)] transition-all gap-2">
          <div className="flex items-center flex-1 min-w-0 pl-1">
            <span className="material-symbols-outlined text-[22px] text-[#00ffcc] mr-2 shrink-0">
              psychology
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAnalyze();
              }}
              placeholder="¿Qué quieres construir hoy? Ej: Autenticación JWT, Exportar a PDF..."
              className="w-full py-1.5 bg-transparent text-xs sm:text-sm md:text-base text-white placeholder:text-[#a098b0]/50 focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="text-[#a098b0] hover:text-white p-1 rounded-lg transition-colors shrink-0"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            )}
          </div>

          <button
            onClick={() => handleAnalyze()}
            disabled={loading}
            className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-[#ff2d78] to-[#ff1493] text-white px-4 py-2 rounded-lg text-xs font-semibold hover:shadow-[0_0_20px_rgba(255,45,120,0.45)] hover:brightness-110 active:scale-95 transition-all cursor-pointer shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">neurology</span>
            <span>{loading ? "Analizando..." : "Analizar Convención"}</span>
            <span className="hidden md:inline font-mono text-[10px] bg-black/40 text-pink-200 px-1 py-0.5 rounded ml-1 border border-white/20">
              ⌘ Enter
            </span>
          </button>
        </div>

        {/* Quick Suggestion Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[10px] sm:text-[11px] text-[#a098b0] uppercase tracking-wider pl-1 font-semibold">
            Inspiración:
          </span>
          {inspirationChips.map((chip) => (
            <button
              key={chip.label}
              onClick={() => {
                setQuery(chip.label);
                handleAnalyze(chip.label);
              }}
              className="group flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-lg bg-[#1e1e30]/60 hover:bg-[#1e1e30] border border-[#262438] hover:border-[#00ffcc]/40 text-[#a098b0] hover:text-[#00ffcc] text-xs transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[14px] text-[#00ffcc] group-hover:scale-110 transition-transform shrink-0">
                {chip.icon}
              </span>
              <span className="truncate">{chip.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Architectural Recommendation Card */}
      <div className="flex flex-col gap-6 relative z-10">
        <div className="bg-[#141422] rounded-xl border border-[#262438] shadow-lg p-4 sm:p-6 flex flex-col gap-4">
          {/* Framework & Status Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0c0c16]/90 border border-[#262438] p-4 rounded-xl">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-[#00ffcc]/10 border border-[#00ffcc]/30 flex items-center justify-center text-[#00ffcc] shadow-[0_0_10px_rgba(0,255,204,0.2)] shrink-0">
                <span className="material-symbols-outlined text-[22px]">verified</span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-xs sm:text-sm text-white">
                    Recomendación para {suggestion.framework}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#00ffcc]/15 border border-[#00ffcc]/30 text-[#00ffcc] text-[10px] sm:text-[11px] font-semibold tracking-wide">
                    Patrón MVC Capas
                  </span>
                </div>
                <p className="text-xs text-[#a098b0] mt-0.5 leading-relaxed">
                  Para esta funcionalidad, necesitas crear un controlador que exponga la vista o endpoint y un servicio que gestione los datos.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[#a098b0] self-start sm:self-center font-mono text-xs bg-[#1e1e30] px-2.5 py-1 rounded-lg border border-[#262438] shrink-0">
              <span className="material-symbols-outlined text-[16px] text-[#00ffcc]">folder_special</span>
              <span className="text-[#00ffcc] font-semibold">src/main/java/</span>
            </div>
          </div>

          {/* Hero File Focus Card */}
          <div className="relative bg-[#1e1e30]/90 border border-[#ff2d78]/40 rounded-xl p-4 shadow-[0_4px_24px_rgba(255,45,120,0.12)] overflow-hidden flex flex-col gap-3">
            <div className="absolute -right-12 -bottom-12 w-40 h-40 bg-[#ff2d78]/10 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-start justify-between flex-wrap gap-2">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-lg bg-[#ff2d78] text-white flex items-center justify-center shadow-[0_0_10px_rgba(255,45,120,0.4)] shrink-0">
                  <span className="material-symbols-outlined text-[20px]">terminal</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] sm:text-[11px] text-[#ff2d78] uppercase font-bold tracking-wider">
                      Punto de Entrada Primario
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#ff2d78]/20 text-[#ff80aa] border border-[#ff2d78]/30 font-mono text-[10px] sm:text-[11px] font-semibold">
                      {suggestion.annotation_or_pattern}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="font-mono text-sm sm:text-base font-bold text-white tracking-tight">
                      {suggestion.primary_file}
                    </span>
                    <span className="text-[#a098b0] text-xs">· {suggestion.layer}</span>
                  </div>
                </div>
              </div>

              {/* Path Box with Copy Action */}
              <div className="flex items-center gap-2 bg-[#0c0c16] px-2.5 sm:px-3 py-1 rounded-lg border border-[#262438] shrink-0">
                <span className="material-symbols-outlined text-[14px] text-[#00ffcc]">folder_open</span>
                <span className="font-mono text-xs text-white select-all truncate max-w-[200px] sm:max-w-none">
                  {suggestion.primary_path}
                </span>
                <button
                  onClick={() => copyToClipboard(suggestion.primary_path + suggestion.primary_file)}
                  className="p-1 rounded hover:bg-[#1e1e30] text-[#a098b0] hover:text-[#ff2d78] transition-colors flex items-center cursor-pointer"
                  title="Copiar ruta absoluta"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {copiedPath === suggestion.primary_path + suggestion.primary_file ? "check" : "content_copy"}
                  </span>
                </button>
              </div>
            </div>

            {/* Semantic Role Explanation */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-1 pt-1">
              <div className="md:col-span-2 bg-[#0c0c16]/80 border border-[#262438] p-3 rounded-lg flex items-start gap-3">
                <div className="p-1 rounded bg-[#ff2d78]/20 text-[#ff2d78] border border-[#ff2d78]/30 mt-0.5 shrink-0">
                  <span className="material-symbols-outlined text-[18px]">assignment_turned_in</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-semibold text-xs text-white">Responsabilidad Arquitectónica</span>
                  <p className="text-xs text-[#a098b0] mt-0.5 leading-relaxed">
                    {suggestion.architectural_responsibility}
                  </p>
                </div>
              </div>

              <div className="bg-[#0c0c16]/80 border border-[#262438] p-3 rounded-lg flex items-start gap-3">
                <div className="p-1 rounded bg-[#00ffcc]/20 text-[#00ffcc] border border-[#00ffcc]/30 mt-0.5 shrink-0">
                  <span className="material-symbols-outlined text-[18px]">verified_user</span>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-semibold text-xs text-white">Convención Sugerida</span>
                  <span className="text-xs text-[#a098b0] mt-0.5 leading-relaxed">
                    {suggestion.naming_convention}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Complementary Files Section */}
          <div className="flex flex-col gap-3 mt-1">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px] text-[#ff2d78]">account_tree</span>
                <span className="font-semibold text-xs sm:text-sm text-white">
                  Archivos Complementarios Recomendados
                </span>
              </div>
              <span className="text-[10px] sm:text-xs text-[#00ffcc] tracking-wide uppercase font-semibold">
                Patrón de 3 capas ordenado
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {suggestion.complementary_files.map((file) => (
                <div
                  key={file.name}
                  className="bg-[#1e1e30]/60 border border-[#262438] hover:border-[#ff2d78]/50 p-4 rounded-xl flex flex-col justify-between gap-3 transition-all hover:bg-[#1e1e30] min-w-0"
                >
                  <div className="flex flex-col gap-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] text-[#ff2d78] uppercase font-bold tracking-wider">
                        {file.layer}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[#ff2d78]/20 text-[#ff80aa] border border-[#ff2d78]/30 font-mono text-[10px]">
                        {file.annotation}
                      </span>
                    </div>
                    <span className="font-mono text-sm text-white font-bold mt-1 truncate">
                      {file.name}
                    </span>
                    <p className="text-xs text-[#a098b0] leading-relaxed">
                      {file.responsibility}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-1 bg-[#0c0c16] px-3 py-1.5 rounded-lg border border-[#262438]">
                    <div className="flex items-center gap-1 font-mono text-xs text-[#a098b0] truncate min-w-0">
                      <span className="material-symbols-outlined text-[14px] text-[#00ffcc] shrink-0">folder</span>
                      <span className="truncate">{file.path}</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(file.path + file.name)}
                      className="p-1 hover:text-[#ff2d78] transition-colors text-[#a098b0] flex items-center shrink-0 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">
                        {copiedPath === file.path + file.name ? "check" : "content_copy"}
                      </span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Student Mental Checklist */}
        <div className="bg-[#141422] rounded-xl border border-[#262438] shadow-lg p-4 sm:p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#1e1e30] border border-[#ff2d78]/30 flex items-center justify-center text-[#ff2d78] shadow-[0_0_10px_rgba(255,45,120,0.3)] shrink-0">
                <span className="material-symbols-outlined text-[20px]">checklist</span>
              </div>
              <div>
                <h2 className="font-semibold text-xs sm:text-sm text-white">Checklist Mental del Estudiante</h2>
                <p className="text-xs text-[#a098b0]">
                  Sigue este orden de pensamiento antes de escribir una sola línea de lógica:
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#00ffcc]/10 border border-[#00ffcc]/30 text-[#00ffcc] text-xs font-semibold hidden sm:inline-flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">lightbulb</span>
              Buenas Prácticas
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-1">
            {suggestion.checklist.map((item) => (
              <div
                key={item.step}
                className="bg-[#1e1e30]/70 border border-[#262438] hover:border-[#ff2d78]/50 p-4 rounded-xl flex flex-col gap-2 transition-all min-w-0"
              >
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-full bg-[#ff2d78] text-white text-xs font-bold flex items-center justify-center shadow-[0_0_10px_rgba(255,45,120,0.3)] shrink-0">
                    {item.step}
                  </span>
                  <span className="text-[10px] text-[#a098b0] uppercase tracking-wider font-semibold">
                    Paso {item.step}
                  </span>
                </div>
                <h3 className="font-semibold text-xs text-white mt-1">{item.title}</h3>
                <p className="text-xs text-[#a098b0] leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pedagogical Assurance Banner */}
        <div className="bg-[#1e1e30]/50 border border-[#262438] p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#141422] border border-[#ff2d78]/30 text-[#ff2d78] flex items-center justify-center shadow-[0_0_10px_rgba(255,45,120,0.3)] shrink-0">
              <span className="material-symbols-outlined text-[20px]">school</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-xs text-white">Diseño Estructural Puro</span>
              <span className="text-xs text-[#a098b0] leading-relaxed">
                {suggestion.educational_tip}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <span className="px-2.5 py-1 rounded bg-[#0c0c16] text-[#a098b0] font-mono text-[10px] border border-[#262438]">
              ISO/IEC 25010
            </span>
            <span className="px-2.5 py-1 rounded bg-[#0c0c16] text-[#00ffcc] font-mono text-[10px] border border-[#00ffcc]/30">
              Clean Architecture
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
