"use client";

import { useState } from "react";
import Link from "next/link";
import { useProject } from "@/context/ProjectContext";
import { api } from "@/lib/api";
import { FileSuggestion } from "@/lib/types";

export default function AsistentePage() {
  const { project, loadSample } = useProject();

  const [query, setQuery] = useState("Una pantalla para listar empleados");
  const [loading, setLoading] = useState(false);
  const [copiedPath, setCopiedPath] = useState<string | null>(null);

  const [suggestion, setSuggestion] = useState<FileSuggestion | null>(null);

  const currentFramework = project?.framework || "Spring Boot";

  const handleAnalyze = async (searchPrompt?: string) => {
    const textToSearch = searchPrompt || query;
    if (!textToSearch.trim()) return;

    setLoading(true);
    try {
      const res = await api.suggestLocation(textToSearch, currentFramework);
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

  // Chips dinámicos según framework del proyecto cargado
  const getInspirationChips = () => {
    if (project?.framework === "Laravel") {
      return [
        { label: "Controlador de empleados", icon: "terminal" },
        { label: "Modelo Eloquent con relaciones", icon: "database" },
        { label: "Rutas REST en api.php", icon: "alt_route" },
        { label: "Validación FormRequest", icon: "fact_check" },
      ];
    }
    if (project?.framework === "Django") {
      return [
        { label: "Vista basada en clase (CBV)", icon: "view_quilt" },
        { label: "Modelo con ForeignKey", icon: "schema" },
        { label: "Configurar URLs del módulo", icon: "alt_route" },
        { label: "Serializer para REST API", icon: "api" },
      ];
    }
    return [
      { label: "Una pantalla para listar empleados", icon: "person_search" },
      { label: "Servicio de auditoría de contratos", icon: "work" },
      { label: "Repositorio JPA de consultas", icon: "database" },
      { label: "Filtro de seguridad JWT", icon: "security" },
    ];
  };

  return (
    <div className="w-full px-4 sm:px-6 py-6 max-w-5xl mx-auto flex flex-col gap-6 relative overflow-hidden">
      {/* Background Neon ambient glows */}
      <div className="absolute top-0 left-1/4 w-80 sm:w-96 h-80 sm:h-96 bg-[#ff2d78]/10 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute top-1/3 right-10 w-80 sm:w-96 h-80 sm:h-96 bg-[#00ffcc]/10 rounded-full blur-3xl pointer-events-none -z-0" />

      {/* Hero Header */}
      <div className="flex flex-col items-center text-center gap-2 mt-2 mb-2 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141422] border border-[#ff2d78]/30 text-[#ff2d78] text-xs font-semibold shadow-[0_0_10px_rgba(255,45,120,0.3)]">
          <span className="material-symbols-outlined text-[16px] text-[#ff2d78]">auto_fix_high</span>
          <span className="tracking-wide">Asistente de Convenciones y Arquitectura</span>
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl text-white font-bold tracking-tight font-headline">
          Asistente de Nuevos Archivos
        </h1>
        <p className="text-xs sm:text-sm text-[#a098b0] max-w-2xl leading-relaxed">
          Antes de crear un archivo, describe qué deseas programar. El asistente te indicará la carpeta exacta, la convención de nombres y los archivos complementarios según el framework de tu proyecto.
        </p>
      </div>

      {/* ESTADO EN BLANCO: Si no hay proyecto cargado */}
      {!project && (
        <div className="bg-[#0f0f1a] border border-[#262438] rounded-xl p-10 flex flex-col items-center justify-center text-center gap-4 shadow-xl relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-[#141424] border border-[#2f2b47] flex items-center justify-center text-[#ff2d78] shadow-[0_0_20px_rgba(255,45,120,0.3)]">
            <span className="material-symbols-outlined text-[36px]">note_add</span>
          </div>
          <div className="max-w-md flex flex-col gap-1.5">
            <h2 className="text-lg font-bold text-white">Ningún proyecto cargado</h2>
            <p className="text-xs text-[#a098b0] leading-relaxed">
              Para sugerir dónde ubicar nuevos archivos y qué convenciones seguir, el asistente necesita conocer el proyecto sobre el cual estás trabajando.
            </p>
          </div>
          <div className="flex items-center gap-3 mt-2 flex-wrap justify-center">
            <Link
              href="/explorador"
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#ff2d78] to-[#d6005c] text-white font-semibold text-xs shadow-[0_0_16px_rgba(255,45,120,0.45)] hover:brightness-110 transition-all cursor-pointer flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">folder_open</span>
              <span>Ir a Cargar Proyecto</span>
            </Link>
            <button
              onClick={loadSample}
              className="px-4 py-2.5 rounded-lg bg-[#18182b] border border-[#2b2742] text-white text-xs font-semibold hover:border-[#00ffcc] hover:text-[#00ffcc] transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px] text-[#00ffcc]">bolt</span>
              <span>Probar con Proyecto de Ejemplo</span>
            </button>
          </div>
        </div>
      )}

      {/* VISTA ACTIVA: Cuando el proyecto está presente */}
      {project && (
        <>
          {/* Banner de Contexto de Proyecto Activo */}
          <div className="bg-[#121220] border border-[#262438] rounded-xl p-3.5 px-4 flex items-center justify-between gap-3 relative z-10">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="material-symbols-outlined text-[#00ffcc] text-[20px]">folder</span>
              <div className="flex items-center gap-2 truncate">
                <span className="text-xs text-[#a098b0]">Proyecto activo:</span>
                <span className="font-mono text-xs font-bold text-white truncate">{project.project_name}</span>
                <span className="px-2 py-0.5 rounded-full bg-[#00ffcc]/15 border border-[#00ffcc]/30 text-[#00ffcc] text-[10px] font-semibold shrink-0">
                  {project.framework}
                </span>
              </div>
            </div>

            {project.detected_entities && project.detected_entities.length > 0 && (
              <div className="hidden md:flex items-center gap-1.5 text-xs text-[#a098b0] shrink-0 font-mono">
                <span>Entidades:</span>
                <span className="text-[#ff2d78] font-semibold">{project.detected_entities.slice(0, 3).join(", ")}</span>
              </div>
            )}
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
                  placeholder={`Describe qué quieres crear en ${project.framework}... Ej: Pantalla para listar clientes, Servicio de reportes...`}
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
              </button>
            </div>

            {/* Chips de Inspiración Adaptables */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[10px] sm:text-[11px] text-[#a098b0] uppercase tracking-wider pl-1 font-semibold">
                Ideas para {project.framework}:
              </span>
              {getInspirationChips().map((chip) => (
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

          {/* Tarjeta de Recomendación Arquitectónica */}
          {suggestion && (
            <div className="flex flex-col gap-6 relative z-10">
              <div className="bg-[#141422] rounded-xl border border-[#262438] shadow-lg p-4 sm:p-6 flex flex-col gap-4">
                {/* Banner de Framework */}
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
                          {project.architecture_type}
                        </span>
                      </div>
                      <p className="text-xs text-[#a098b0] mt-0.5 leading-relaxed">
                        Para &ldquo;{suggestion.detected_intent}&rdquo;, te sugerimos estructurar la funcionalidad respetando la separación de capas del framework.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[#a098b0] self-start sm:self-center font-mono text-xs bg-[#1e1e30] px-2.5 py-1 rounded-lg border border-[#262438] shrink-0">
                    <span className="material-symbols-outlined text-[16px] text-[#00ffcc]">folder_special</span>
                    <span className="text-[#00ffcc] font-semibold">{suggestion.primary_path}</span>
                  </div>
                </div>

                {/* Archivo Primario Foco */}
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

                    {/* Ruta con botón de copiar */}
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

                  {/* Responsabilidad y Convención */}
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

                {/* Archivos Complementarios */}
                <div className="flex flex-col gap-3 mt-1">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-[#ff2d78]">account_tree</span>
                      <span className="font-semibold text-xs sm:text-sm text-white">
                        Archivos Complementarios Recomendados
                      </span>
                    </div>
                    <span className="text-[10px] sm:text-xs text-[#00ffcc] tracking-wide uppercase font-semibold">
                      Desacoplamiento Estructurado
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

                {/* Checklist Mental del Estudiante */}
                <div className="bg-[#11111a] rounded-xl border border-[#262438] p-4 flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-[#00ffcc]">checklist</span>
                    <span className="font-semibold text-xs text-white">Pasos Recomendados de Implementación</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {suggestion.checklist.map((c) => (
                      <div key={c.step} className="p-3 rounded-lg bg-[#161626] border border-[#27263b] flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-[#00ffcc] text-xs font-bold font-mono">
                          <span>Paso {c.step}</span>
                        </div>
                        <span className="text-xs text-white font-semibold">{c.title}</span>
                        <p className="text-[11px] text-[#a098b0] leading-relaxed">{c.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
