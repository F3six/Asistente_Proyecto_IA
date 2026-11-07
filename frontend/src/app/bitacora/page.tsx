"use client";

import { useState } from "react";
import Link from "next/link";
import { useProject } from "@/context/ProjectContext";

export default function BitacoraPage() {
  const { project, errors, addError, loadSample } = useProject();

  const [currentFilter, setCurrentFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Formulario de nuevo error
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Database");
  const [newLayer, setNewLayer] = useState("Controlador");
  const [newRelatedFile, setNewRelatedFile] = useState("");
  const [newSymptom, setNewSymptom] = useState("");
  const [newCause, setNewCause] = useState("");
  const [newSolution, setNewSolution] = useState("");

  const handleCreateError = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addError({
        title: newTitle,
        category: newCategory,
        layer: newLayer,
        related_file: newRelatedFile || null,
        symptom: newSymptom,
        root_cause: newCause,
        solution: newSolution,
        status: "verified",
        resolved_by: "Equipo de Desarrollo",
      });

      setIsModalOpen(false);
      // Reset form
      setNewTitle("");
      setNewRelatedFile("");
      setNewSymptom("");
      setNewCause("");
      setNewSolution("");
    } catch (err) {
      console.error(err);
    }
  };

  const filteredErrors = errors.filter((item) => {
    const matchesCat =
      currentFilter === "all" ||
      item.category.toLowerCase() === currentFilter.toLowerCase();
    const matchesSearch =
      searchTerm === "" ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.symptom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.root_cause && item.root_cause.toLowerCase().includes(searchTerm.toLowerCase())) ||
      item.solution.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.related_file && item.related_file.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  const categories = ["all", "Database", "Routing", "Views", "Security"];

  return (
    <div className="flex flex-col w-full max-w-[1440px] mx-auto px-4 sm:px-6 py-6 overflow-x-hidden">
      {/* Top Banner / Hero Card */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#131322] via-[#16162a] to-[#121220] border border-[#2b2742] p-6 shadow-xl mb-6">
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-[#ff2d78]/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-80 h-80 rounded-full bg-[#00ffcc]/5 blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="flex flex-col gap-1.5 max-w-2xl">
            <div className="flex items-center gap-1.5 text-[#ff2d78] text-xs uppercase tracking-wider font-semibold">
              <span className="material-symbols-outlined text-[18px] drop-shadow-[0_0_6px_rgba(255,45,120,0.8)]">
                verified
              </span>
              <span>Knowledge Base Didáctica</span>
            </div>
            <h1 className="text-2xl lg:text-3xl text-white font-bold tracking-tight font-headline">
              Bitácora de Errores y Aprendizaje
            </h1>
            <p className="text-xs sm:text-sm text-[#a098b0]">
              Documenta errores técnicos durante el desarrollo y asócialos con los archivos y capas de tu proyecto para no tropezar dos veces.
            </p>
          </div>

          {project && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#ff2d78] to-[#d6005c] text-white rounded-lg text-sm font-semibold hover:shadow-[0_0_20px_rgba(255,45,120,0.5)] transition-all self-start lg:self-auto cursor-pointer border border-[#ff6699]/40 shrink-0"
            >
              <span className="material-symbols-outlined text-[20px]">add_circle</span>
              <span>+ Documentar nuevo error</span>
            </button>
          )}
        </div>

        {/* Search & Filter Category Row */}
        {project && (
          <div className="mt-6 pt-5 border-t border-[#26233a] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a098b0] text-[18px]">
                search
              </span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por archivo, excepción o síntoma..."
                className="w-full pl-10 pr-4 py-2 bg-[#0c0c16] border border-[#2b2742] rounded-lg text-xs text-white placeholder:text-[#a098b0] focus:outline-none focus:border-[#ff2d78] focus:ring-1 focus:ring-[#ff2d78] shadow-inner transition-all"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
              {categories.map((cat) => {
                const isSelected = currentFilter.toLowerCase() === cat.toLowerCase();
                return (
                  <button
                    key={cat}
                    onClick={() => setCurrentFilter(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
                      isSelected
                        ? "bg-[#ff2d78] text-white shadow-[0_0_12px_rgba(255,45,120,0.4)]"
                        : "bg-[#18182b] text-[#a098b0] hover:bg-[#202035] hover:text-white"
                    }`}
                  >
                    {cat === "all" ? "Todos los Errores" : cat}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ESTADO EN BLANCO: Si no hay proyecto cargado */}
      {!project && (
        <div className="bg-[#0f0f1a] border border-[#262438] rounded-xl p-10 flex flex-col items-center justify-center text-center gap-4 shadow-xl mb-6">
          <div className="w-16 h-16 rounded-2xl bg-[#141424] border border-[#2f2b47] flex items-center justify-center text-[#ff2d78] shadow-[0_0_20px_rgba(255,45,120,0.3)]">
            <span className="material-symbols-outlined text-[36px]">history_edu</span>
          </div>
          <div className="max-w-md flex flex-col gap-1.5">
            <h2 className="text-lg font-bold text-white">Ningún proyecto seleccionado</h2>
            <p className="text-xs text-[#a098b0] leading-relaxed">
              Carga tu proyecto para que la bitácora conozca todos los archivos existentes y puedas vincular incidencias y soluciones a las capas de tu código.
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
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          {/* Columna Izquierda: Listado de Errores Documentados (8 cols) */}
          <div className="xl:col-span-8 flex flex-col gap-4">
            {filteredErrors.length === 0 ? (
              <div className="bg-[#121220] border border-[#262438] rounded-xl p-10 flex flex-col items-center justify-center text-center gap-3">
                <span className="material-symbols-outlined text-[40px] text-[#a098b0]/50">
                  search_off
                </span>
                <span className="text-sm font-semibold text-white">
                  No hay errores registrados con el filtro actual
                </span>
                <p className="text-xs text-[#a098b0]">
                  Usa el botón &ldquo;+ Documentar nuevo error&rdquo; para registrar el primer aprendizaje en este proyecto.
                </p>
              </div>
            ) : (
              filteredErrors.map((err) => {
                const isDb = err.category.toLowerCase() === "database";
                const isViews = err.category.toLowerCase() === "views";
                const isSec = err.category.toLowerCase() === "security";

                const badgeColor = isDb
                  ? "bg-[#00ffcc]/15 border-[#00ffcc]/30 text-[#00ffcc]"
                  : isViews
                  ? "bg-[#b3004e]/25 border-[#ff2d78]/40 text-[#ff80aa]"
                  : isSec
                  ? "bg-[#ff4444]/20 border-[#ff4444]/40 text-[#ff8080]"
                  : "bg-[#ff2d78]/15 border-[#ff2d78]/40 text-[#ff80aa]";

                const icon = isDb ? "database" : isViews ? "web" : isSec ? "security" : "alt_route";

                return (
                  <article
                    key={err.id}
                    className="bg-[#121220] border border-[#252338] hover:border-[#ff2d78]/50 rounded-xl p-5 shadow-lg transition-all flex flex-col gap-4 relative overflow-hidden group"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex flex-col gap-1.5 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full border text-[11px] font-semibold tracking-wide ${badgeColor}`}>
                            {err.category}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-[#1b1b2d] border border-[#302c48] text-[#a098b0] text-[11px]">
                            {project.framework}
                          </span>
                          <span className="font-mono text-[11px] text-[#a098b0]">
                            Capa: {err.layer || "Controlador"}
                          </span>
                          {err.related_file && (
                            <span className="px-2 py-0.5 rounded bg-[#1e1e30] border border-[#ff2d78]/30 font-mono text-[10px] text-[#ff80aa] flex items-center gap-1 truncate max-w-[200px]">
                              <span className="material-symbols-outlined text-[13px] text-[#ff2d78]">description</span>
                              <span className="truncate">{err.related_file}</span>
                            </span>
                          )}
                        </div>
                        <h2 className="text-base sm:text-lg text-white font-semibold line-clamp-2 break-words group-hover:text-[#ff80aa] transition-colors">
                          {err.title}
                        </h2>
                      </div>

                      <div className="w-9 h-9 rounded-lg bg-[#1a192e] border border-[#312c4d] flex items-center justify-center text-[#ff2d78] shrink-0 shadow-[0_0_8px_rgba(255,45,120,0.2)]">
                        <span className="material-symbols-outlined text-[20px]">{icon}</span>
                      </div>
                    </div>

                    {/* Síntoma & Causa Raíz */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-[#0d0d17] border border-[#1f1e30] rounded-lg p-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-[#ff4444] text-xs font-semibold">
                          <span className="material-symbols-outlined text-[16px]">visibility</span>
                          <span>Síntoma Visible</span>
                        </div>
                        <p className="text-xs text-[#b8b3cc] leading-relaxed">{err.symptom}</p>
                      </div>

                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5 text-[#ffe04a] text-xs font-semibold">
                          <span className="material-symbols-outlined text-[16px]">psychology_alt</span>
                          <span>Causa Raíz</span>
                        </div>
                        <p className="text-xs text-[#b8b3cc] leading-relaxed">
                          {err.root_cause || "No especificada"}
                        </p>
                      </div>
                    </div>

                    {/* Solución Aplicada */}
                    <div className="bg-[#00382b]/30 border border-[#00ffcc]/30 rounded-lg p-4 flex flex-col gap-1.5 shadow-[inset_0_0_15px_rgba(0,255,204,0.03)]">
                      <div className="flex items-center gap-1.5 text-[#00ffcc] text-xs font-semibold">
                        <span className="material-symbols-outlined text-[16px] drop-shadow-[0_0_5px_#00ffcc]">
                          check_circle
                        </span>
                        <span>Solución Aplicada</span>
                      </div>
                      <p className="text-xs text-white leading-relaxed">{err.solution}</p>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-1 border-t border-[#1c1a2e] text-[#a098b0] text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[14px]">history</span>
                        <span>Resuelto por {err.resolved_by || "Equipo"}</span>
                      </div>
                      <span className="inline-flex items-center gap-1.5 font-semibold text-[#00ffcc]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00ffcc] shadow-[0_0_6px_#00ffcc]" />
                        Verificado
                      </span>
                    </div>
                  </article>
                );
              })
            )}
          </div>

          {/* Columna Derecha: Guía de Documentación y Tracker (4 cols) */}
          <aside className="xl:col-span-4 flex flex-col gap-4 sticky top-20">
            {/* Guía */}
            <div className="bg-[#121220] border border-[#252338] rounded-xl p-6 shadow-xl flex flex-col gap-5">
              <div className="flex items-center justify-between border-b border-[#201e33] pb-4">
                <div className="flex items-center gap-2 text-white text-sm font-semibold">
                  <span className="material-symbols-outlined text-[20px] text-[#ff2d78] drop-shadow-[0_0_8px_rgba(255,45,120,0.6)]">
                    assignment
                  </span>
                  <span>Guía de Documentación</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-[#1a192c] border border-[#312c4d] text-[#ff80aa] text-[10px] font-medium">
                  Didáctico
                </span>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex gap-3 items-start">
                  <div className="w-7 h-7 rounded bg-gradient-to-br from-[#ff2d78] to-[#99004d] text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-[0_0_10px_rgba(255,45,120,0.4)]">
                    1
                  </div>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-xs text-white font-semibold">¿Qué mensaje viste?</span>
                    <span className="text-xs text-[#a098b0] leading-relaxed">
                      Describe el comportamiento anómalo o código HTTP sin volcados de memoria ilegibles.
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="w-7 h-7 rounded bg-[#1a192e] border border-[#312d4d] text-white flex items-center justify-center text-xs font-bold shrink-0">
                    2
                  </div>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-xs text-white font-semibold">¿En qué archivo ocurrió?</span>
                    <span className="text-xs text-[#a098b0] leading-relaxed">
                      Asocia el error directamente al archivo de tu proyecto que falló o necesitó ajuste.
                    </span>
                  </div>
                </div>

                <div className="flex gap-3 items-start">
                  <div className="w-7 h-7 rounded bg-[#1a192e] border border-[#312d4d] text-white flex items-center justify-center text-xs font-bold shrink-0">
                    3
                  </div>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <span className="text-xs text-white font-semibold">¿Cómo lo arreglaste?</span>
                    <span className="text-xs text-[#a098b0] leading-relaxed">
                      Resume la corrección exacta, anotaciones añadidas o reubicación efectuada.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tracker de Errores Superados */}
            <div className="bg-[#121220] border border-[#252338] rounded-xl p-5 shadow-xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#00ffcc]/10 border border-[#00ffcc]/30 flex items-center justify-center text-[#00ffcc] shadow-[0_0_12px_rgba(0,255,204,0.2)]">
                  <span className="material-symbols-outlined text-[22px]">workspace_premium</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-white font-semibold">
                    {errors.length} Errores documentados
                  </span>
                  <span className="text-xs text-[#a098b0]">En {project.project_name}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Modal Dialog: Documentar Nuevo Error */}
      {isModalOpen && project && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[70] flex items-center justify-center p-4">
          <div className="bg-[#121222] border border-[#2b2742] rounded-xl max-w-xl w-full p-4 sm:p-6 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto relative my-auto">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#ff2d78]/15 rounded-full blur-3xl pointer-events-none" />
            <div className="flex items-center justify-between pb-2 border-b border-[#232135]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ff2d78] text-[22px] drop-shadow-[0_0_6px_#ff2d78]">
                  add_box
                </span>
                <h2 className="text-lg text-white font-bold">Documentar Nuevo Error</h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#a098b0] hover:text-white p-1 rounded transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateError} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-white font-semibold">
                  Título del error o excepción
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ej: NoHandlerFoundException en /api/empleados"
                  className="px-3 py-2 bg-[#0c0c16] border border-[#28253e] rounded-lg text-xs text-white placeholder:text-[#a098b0] focus:outline-none focus:border-[#ff2d78] focus:ring-1 focus:ring-[#ff2d78]"
                />
              </div>

              {/* Selector de Archivo Real del Proyecto */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-white font-semibold">
                  Archivo relacionado en {project.project_name} (opcional)
                </label>
                <select
                  value={newRelatedFile}
                  onChange={(e) => setNewRelatedFile(e.target.value)}
                  className="px-3 py-2 bg-[#0c0c16] border border-[#28253e] rounded-lg text-xs text-white focus:outline-none focus:border-[#ff2d78]"
                >
                  <option value="">-- Seleccionar archivo del proyecto --</option>
                  {(project.all_files || []).map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-white font-semibold">Categoría</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="px-3 py-2 bg-[#0c0c16] border border-[#28253e] rounded-lg text-xs text-white focus:outline-none focus:border-[#ff2d78]"
                  >
                    <option value="Database">Database</option>
                    <option value="Routing">Routing</option>
                    <option value="Views">Views</option>
                    <option value="Security">Security</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs text-white font-semibold">¿En qué capa ocurrió?</label>
                  <input
                    type="text"
                    required
                    value={newLayer}
                    onChange={(e) => setNewLayer(e.target.value)}
                    placeholder="Ej: Controlador, Repositorio, Filtros..."
                    className="px-3 py-2 bg-[#0c0c16] border border-[#28253e] rounded-lg text-xs text-white placeholder:text-[#a098b0] focus:outline-none focus:border-[#ff2d78] focus:ring-1 focus:ring-[#ff2d78]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-white font-semibold">1. ¿Qué síntoma o mensaje viste?</label>
                <textarea
                  required
                  rows={2}
                  value={newSymptom}
                  onChange={(e) => setNewSymptom(e.target.value)}
                  placeholder="Resumen claro del síntoma que provocaba el fallo..."
                  className="p-3 bg-[#0c0c16] border border-[#28253e] rounded-lg text-xs text-white placeholder:text-[#a098b0] focus:outline-none focus:border-[#ff2d78] focus:ring-1 focus:ring-[#ff2d78]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-white font-semibold">2. Causa raíz identificada</label>
                <input
                  type="text"
                  required
                  value={newCause}
                  onChange={(e) => setNewCause(e.target.value)}
                  placeholder="¿Por qué sucedía realmente?"
                  className="px-3 py-2 bg-[#0c0c16] border border-[#28253e] rounded-lg text-xs text-white placeholder:text-[#a098b0] focus:outline-none focus:border-[#ff2d78] focus:ring-1 focus:ring-[#ff2d78]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-white font-semibold">3. ¿Cómo lo arreglaste? (Solución)</label>
                <textarea
                  required
                  rows={2}
                  value={newSolution}
                  onChange={(e) => setNewSolution(e.target.value)}
                  placeholder="Acción concreta que resolvió el error sin dejar dudas..."
                  className="p-3 bg-[#0c0c16] border border-[#28253e] rounded-lg text-xs text-white placeholder:text-[#a098b0] focus:outline-none focus:border-[#ff2d78] focus:ring-1 focus:ring-[#ff2d78]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#232135]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-[#1a192c] border border-[#302b47] text-[#a098b0] hover:text-white rounded-lg text-xs font-semibold hover:bg-[#25233d] transition-all cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-[#ff2d78] to-[#d6005c] text-white rounded-lg text-xs font-semibold hover:shadow-[0_0_15px_rgba(255,45,120,0.5)] transition-all cursor-pointer"
                >
                  Guardar en Bitácora
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
