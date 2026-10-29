"use client";

import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { ErrorLog } from "@/lib/types";

export default function BitacoraPage() {
  const [errors, setErrors] = useState<ErrorLog[]>([]);
  const [currentFilter, setCurrentFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Formulario de nuevo error
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Database");
  const [newLayer, setNewLayer] = useState("Controlador");
  const [newSymptom, setNewSymptom] = useState("");
  const [newCause, setNewCause] = useState("");
  const [newSolution, setNewSolution] = useState("");

  useEffect(() => {
    loadErrors();
  }, []);

  const loadErrors = async () => {
    try {
      const data = await api.getErrors();
      setErrors(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateError = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await api.createError({
        title: newTitle,
        category: newCategory,
        layer: newLayer,
        symptom: newSymptom,
        root_cause: newCause,
        solution: newSolution,
        status: "verified",
        resolved_by: "Estudiante Ing.",
      });

      setErrors([created, ...errors]);
      setIsModalOpen(false);
      // Reset form
      setNewTitle("");
      setNewSymptom("");
      setNewCause("");
      setNewSolution("");
    } catch (err) {
      console.error(err);
    }
  };

  const filteredErrors = errors.filter((item) => {
    const matchesCat = currentFilter === "all" || item.category.toLowerCase() === currentFilter.toLowerCase();
    const matchesSearch =
      searchTerm === "" ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.symptom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.root_cause && item.root_cause.toLowerCase().includes(searchTerm.toLowerCase())) ||
      item.solution.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const categories = ["all", "Database", "Routing", "Views", "Security"];

  return (
    <div className="flex flex-col w-full max-w-[1440px] mx-auto px-6 py-6">
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
              Documenta errores comunes durante el desarrollo y cómo los solucionaste para no tropezar dos veces en tus proyectos.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#ff2d78] to-[#d6005c] text-white rounded-lg text-sm font-semibold hover:shadow-[0_0_20px_rgba(255,45,120,0.5)] transition-all self-start lg:self-auto cursor-pointer border border-[#ff6699]/40 shrink-0"
          >
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
            <span>+ Documentar nuevo error</span>
          </button>
        </div>

        {/* Search & Filter Category Row */}
        <div className="mt-6 pt-5 border-t border-[#26233a] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a098b0] text-[18px]">
              search
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por excepción, síntoma o solución..."
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
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#ff2d78] text-white shadow-[0_0_12px_rgba(255,45,120,0.4)] border border-[#ff5e99]"
                      : "bg-[#141423] text-[#a098b0] border border-[#2b2842] hover:text-white hover:border-[#4d486e]"
                  }`}
                >
                  {cat === "all" ? "Todos" : cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2 Column Layout: Cards + Documentation Guide Sidebar */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Column: Error Cards */}
        <div className="xl:col-span-8 flex flex-col gap-4">
          {filteredErrors.length === 0 ? (
            <div className="bg-[#121220] border border-[#252338] rounded-xl p-8 text-center flex flex-col items-center gap-2">
              <span className="material-symbols-outlined text-[36px] text-[#a098b0]">
                search_off
              </span>
              <span className="text-sm text-white font-semibold">
                No se encontraron errores con ese criterio
              </span>
              <p className="text-xs text-[#a098b0]">
                Prueba buscando otro término o cambia la categoría de filtro.
              </p>
            </div>
          ) : (
            filteredErrors.map((err) => {
              const isDb = err.category.toLowerCase() === "database";
              const isViews = err.category.toLowerCase() === "views";
              const isSec = err.category.toLowerCase() === "security";

              const badgeColor = isDb
                ? "bg-[#00ffcc]/15 border-[#00ffcc]/40 text-[#00ffcc]"
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
                          Spring Boot
                        </span>
                        <span className="font-mono text-[11px] text-[#a098b0]">
                          Capa: {err.layer || "Controlador"}
                        </span>
                      </div>
                      <h2 className="text-base sm:text-lg text-white font-semibold truncate group-hover:text-[#ff80aa] transition-colors">
                        {err.title}
                      </h2>
                    </div>

                    <div className="w-9 h-9 rounded-lg bg-[#1a192e] border border-[#312c4d] flex items-center justify-center text-[#ff2d78] shrink-0 shadow-[0_0_8px_rgba(255,45,120,0.2)]">
                      <span className="material-symbols-outlined text-[20px]">{icon}</span>
                    </div>
                  </div>

                  {/* Two column diagnostics: Sintoma & Causa Raiz */}
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

                  {/* Solution Box */}
                  <div className="bg-[#00382b]/30 border border-[#00ffcc]/30 rounded-lg p-4 flex flex-col gap-1.5 shadow-[inset_0_0_15px_rgba(0,255,204,0.03)]">
                    <div className="flex items-center gap-1.5 text-[#00ffcc] text-xs font-semibold">
                      <span className="material-symbols-outlined text-[16px] drop-shadow-[0_0_5px_#00ffcc]">
                        check_circle
                      </span>
                      <span>Solución Aplicada</span>
                    </div>
                    <p className="text-xs text-white leading-relaxed">{err.solution}</p>
                  </div>

                  {/* Card Footer */}
                  <div className="flex items-center justify-between pt-1 border-t border-[#1c1a2e] text-[#a098b0] text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[14px]">history</span>
                      <span>Resuelto por {err.resolved_by || "Estudiante"}</span>
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

        {/* Right Column: Sidebar Guide & Progress Tracker */}
        <aside className="xl:col-span-4 flex flex-col gap-4 sticky top-20">
          {/* Documentation Guide */}
          <div className="bg-[#121220] border border-[#252338] rounded-xl p-6 shadow-xl flex flex-col gap-5">
            <div className="flex items-center justify-between border-b border-[#201e33] pb-4">
              <div className="flex items-center gap-2 text-white text-sm font-semibold">
                <span className="material-symbols-outlined text-[20px] text-[#ff2d78] drop-shadow-[0_0_8px_rgba(255,45,120,0.6)]">
                  assignment
                </span>
                <span>Guía de Documentación</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-[#1a192c] border border-[#312c4d] text-[#ff80aa] text-[10px] font-medium">
                Paso a Paso
              </span>
            </div>

            <p className="text-xs text-[#a098b0] leading-relaxed">
              Estructurar la solución con claridad evita perder tiempo buscando en foros y consolida el aprendizaje del equipo.
            </p>

            <div className="flex flex-col gap-4">
              <div className="flex gap-3 items-start">
                <div className="w-7 h-7 rounded bg-gradient-to-br from-[#ff2d78] to-[#99004d] text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-[0_0_10px_rgba(255,45,120,0.4)]">
                  1
                </div>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-xs text-white font-semibold">¿Qué mensaje viste?</span>
                  <span className="text-xs text-[#a098b0] leading-relaxed">
                    Describe el comportamiento anómalo o código HTTP sin copiar volcados de memoria ilegibles.
                  </span>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="w-7 h-7 rounded bg-[#1a192e] border border-[#312d4d] text-white flex items-center justify-center text-xs font-bold shrink-0">
                  2
                </div>
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-xs text-white font-semibold">¿En qué capa ocurrió?</span>
                  <span className="text-xs text-[#a098b0] leading-relaxed">
                    Ubica si pertenece a Modelos (DB), Controladores (Routing) o Vistas (SSR/API).
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
                    Resume la corrección exacta, anotaciones añadidas o reubicación de archivos efectuada.
                  </span>
                </div>
              </div>
            </div>

            {/* Tip Callout */}
            <div className="p-3.5 rounded-lg bg-[#18182b] border border-[#ff2d78]/20 flex flex-col gap-1 shadow-inner relative overflow-hidden">
              <div className="absolute -right-3 -top-3 w-12 h-12 bg-[#ff2d78]/10 rounded-full blur-lg pointer-events-none" />
              <div className="flex items-center gap-1.5 text-[#ff2d78] text-xs font-semibold">
                <span className="material-symbols-outlined text-[16px]">tips_and_updates</span>
                <span>Consejo Didáctico</span>
              </div>
              <p className="text-xs text-[#b8b3cc] leading-relaxed">
                Los errores no son tropiezos, son la forma en la que el framework te enseña cómo funciona su ciclo de vida interno.
              </p>
            </div>
          </div>

          {/* Progress Tracker */}
          <div className="bg-[#121220] border border-[#252338] rounded-xl p-5 shadow-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#00ffcc]/10 border border-[#00ffcc]/30 flex items-center justify-center text-[#00ffcc] shadow-[0_0_12px_rgba(0,255,204,0.2)]">
                <span className="material-symbols-outlined text-[22px]">workspace_premium</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm text-white font-semibold">
                  {errors.length} Errores superados
                </span>
                <span className="text-xs text-[#a098b0]">Semana actual de trabajo</span>
              </div>
            </div>
            <div className="w-12 h-12 relative flex items-center justify-center">
              <svg className="w-12 h-12 -rotate-90 drop-shadow-[0_0_8px_rgba(0,255,204,0.4)]" viewBox="0 0 36 36">
                <path
                  className="text-[#202035]"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <path
                  className="text-[#00ffcc]"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeDasharray="100, 100"
                  strokeLinecap="round"
                  strokeWidth="3"
                />
              </svg>
              <span className="absolute text-white font-bold text-xs tracking-tight">100%</span>
            </div>
          </div>
        </aside>
      </div>

      {/* Modal Dialog: Documentar Nuevo Error */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#121222] border border-[#2b2742] rounded-xl max-w-xl w-full p-6 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto relative">
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
                  placeholder="Ej: NoHandlerFoundException en /login"
                  className="px-3 py-2 bg-[#0c0c16] border border-[#28253e] rounded-lg text-xs text-white placeholder:text-[#a098b0] focus:outline-none focus:border-[#ff2d78] focus:ring-1 focus:ring-[#ff2d78]"
                />
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
                  className="px-4 py-2 bg-[#1a192c] border border-[#302b47] text-[#a098b0] hover:text-white rounded-lg text-xs font-semibold hover:bg-[#25233d] transition-all"
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
