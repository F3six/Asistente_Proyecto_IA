"use client";

import { useState } from "react";

export default function ReportePage() {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      showToast("Enlace de auditoría copiado al portapapeles.");
    }
  };

  const handleExportPdf = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      showToast('PDF "Reporte_Estado_Proyecto_Universidad.pdf" descargado.');
    }, 1400);
  };

  const misplacedFiles = [
    {
      name: "TempQueryHelper.java",
      currentLocation: "En raíz",
      recommended: "/src/main/java/services/",
      icon: "draft",
    },
    {
      name: "script_base_datos.sql",
      currentLocation: "En controllers/",
      recommended: "/src/main/resources/db/",
      icon: "database",
    },
    {
      name: "auth_notes.txt",
      currentLocation: "En models/",
      recommended: "Mover a /docs/ o eliminar",
      icon: "description",
    },
    {
      name: "MisFunciones.java",
      currentLocation: "Sin paquete",
      recommended: "Modularizar en /utils/",
      icon: "code_off",
    },
  ];

  return (
    <div className="flex flex-col w-full max-w-[1440px] mx-auto px-6 py-6">
      {/* Sub-header & Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs uppercase tracking-wider text-[#ff2d78] font-bold drop-shadow-[0_0_6px_rgba(255,45,120,0.5)]">
              Auditoría Académica v3.2
            </span>
            <span className="inline-block w-1 h-1 rounded-full bg-[#ff2d78]/60" />
            <span className="text-xs text-[#a098b0]">Ciclo Lectivo 2025</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight font-headline">
            Reporte de Estado del Proyecto
          </h1>
          <p className="text-xs sm:text-sm text-[#a098b0] mt-1 max-w-3xl">
            Diagnóstico estructural automatizado, registro de incidencias y balance curricular para evaluación docente.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 flex-wrap shrink-0">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#151525] border border-[#2e2d46] text-[#e8e0f0] hover:border-[#00ffcc] hover:text-[#00ffcc] hover:shadow-[0_0_12px_rgba(0,255,204,0.25)] transition-all text-xs font-semibold"
          >
            <span className="material-symbols-outlined text-[18px]">share</span>
            <span>Compartir Enlace</span>
          </button>

          <button
            onClick={handleExportPdf}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#ff2d78] to-[#ff156a] text-white hover:brightness-110 transition-all shadow-[0_0_18px_rgba(255,45,120,0.45)] border border-[#ff2d78]/40 text-xs font-bold tracking-wide"
          >
            <span className={`material-symbols-outlined text-[18px] ${isExporting ? "animate-spin" : ""}`}>
              {isExporting ? "refresh" : "picture_as_pdf"}
            </span>
            <span>{isExporting ? "Compilando PDF..." : "Exportar PDF para Profesor"}</span>
          </button>
        </div>
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#161629] text-white border border-[#00ffcc]/40 px-4 py-3 rounded-xl shadow-[0_0_20px_rgba(0,255,204,0.3)] text-xs font-medium animate-bounce">
          <span className="material-symbols-outlined text-[20px] text-[#00ffcc]">
            check_circle
          </span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Metric Badges / KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* KPI 1: Archivos desordenados */}
        <div className="bg-[#121221] border border-[#26243d] hover:border-[#ffe04a]/60 rounded-xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.35)] flex flex-col justify-between relative overflow-hidden group transition-all">
          <div className="absolute -right-4 -bottom-4 w-28 h-28 rounded-full bg-[#ffe04a]/10 blur-xl pointer-events-none" />
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs text-[#a098b0] font-medium block uppercase tracking-wider">
                Archivos desordenados
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-bold text-white tracking-tight">4</span>
                <span className="text-xs text-[#a098b0]">de 42 clases</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#ffe04a]/15 border border-[#ffe04a]/30 flex items-center justify-center text-[#ffe04a] shadow-[0_0_12px_rgba(255,224,74,0.25)]">
              <span className="material-symbols-outlined text-[22px]">warning</span>
            </div>
          </div>
          <div className="mt-4 pt-2 border-t border-[#1d1d32] flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono text-[11px] bg-[#ffe04a]/15 text-[#ffe04a] border border-[#ffe04a]/30 font-semibold shadow-[0_0_8px_rgba(255,224,74,0.2)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ffe04a] animate-pulse" />
              Alerta
            </span>
            <span className="text-xs text-[#a098b0]">Requieren reubicación según convenciones</span>
          </div>
        </div>

        {/* KPI 2: Errores documentados */}
        <div className="bg-[#121221] border border-[#26243d] hover:border-[#ff2d78]/60 rounded-xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.35)] flex flex-col justify-between relative overflow-hidden group transition-all">
          <div className="absolute -right-4 -bottom-4 w-28 h-28 rounded-full bg-[#ff2d78]/10 blur-xl pointer-events-none" />
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs text-[#a098b0] font-medium block uppercase tracking-wider">
                Errores documentados
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-3xl font-bold text-[#ff2d78] tracking-tight drop-shadow-[0_0_10px_rgba(255,45,120,0.4)]">
                  12
                </span>
                <span className="text-xs text-[#a098b0]">bitácora al día</span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#ff2d78]/15 border border-[#ff2d78]/30 flex items-center justify-center text-[#ff2d78] shadow-[0_0_12px_rgba(255,45,120,0.3)]">
              <span className="material-symbols-outlined text-[22px]">assignment_turned_in</span>
            </div>
          </div>
          <div className="mt-4 pt-2 border-t border-[#1d1d32] flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono text-[11px] bg-[#ff2d78]/15 text-[#ff2d78] border border-[#ff2d78]/30 font-semibold shadow-[0_0_8px_rgba(255,45,120,0.2)]">
              <span className="material-symbols-outlined text-[14px]">done_all</span>
              Resuelto
            </span>
            <span className="text-xs text-[#a098b0]">100% con solución registrada</span>
          </div>
        </div>

        {/* KPI 3: Framework detectado */}
        <div className="bg-[#121221] border border-[#26243d] hover:border-[#00ffcc]/60 rounded-xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.35)] flex flex-col justify-between relative overflow-hidden group transition-all">
          <div className="absolute -right-4 -bottom-4 w-28 h-28 rounded-full bg-[#00ffcc]/10 blur-xl pointer-events-none" />
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs text-[#a098b0] font-medium block uppercase tracking-wider">
                Framework detectado
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl font-bold text-[#00ffcc] tracking-tight drop-shadow-[0_0_10px_rgba(0,255,204,0.4)]">
                  Spring Boot 3.2
                </span>
              </div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#00ffcc]/15 border border-[#00ffcc]/30 flex items-center justify-center text-[#00ffcc] shadow-[0_0_12px_rgba(0,255,204,0.3)]">
              <span className="material-symbols-outlined text-[22px]">verified</span>
            </div>
          </div>
          <div className="mt-4 pt-2 border-t border-[#1d1d32] flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono text-[11px] bg-[#00ffcc]/15 text-[#00ffcc] border border-[#00ffcc]/30 font-semibold shadow-[0_0_8px_rgba(0,255,204,0.2)]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00ffcc]" />
              Validado
            </span>
            <span className="text-xs text-[#a098b0]">Estructura MVC estándar</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Architecture Schema + Audit Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
        {/* Left Column: Visual Architecture Presentation (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div className="bg-[#121221] border border-[#26243d] rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.35)] flex flex-col">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1d1d32]">
              <div>
                <span className="text-xs text-[#ff2d78] uppercase tracking-widest block font-bold">
                  Presentación Académica
                </span>
                <h2 className="text-lg font-bold text-white mt-0.5 font-headline">
                  Resumen Visual del Esquema del Proyecto
                </h2>
              </div>
              <div className="flex items-center gap-1 text-[#00ffcc] text-xs bg-[#00ffcc]/10 border border-[#00ffcc]/30 px-2.5 py-1 rounded-full shadow-[0_0_8px_rgba(0,255,204,0.15)]">
                <span className="material-symbols-outlined text-[16px]">layers</span>
                <span className="font-semibold">4 Niveles Decoupled</span>
              </div>
            </div>

            <p className="text-xs text-[#a098b0] mb-4 leading-relaxed">
              Mapeo de flujo unidireccional y aislamiento de capas detectado mediante escaneo estático de dependencias Java/Spring.
            </p>

            {/* Clean Interactive Architectural Diagram */}
            <div className="bg-[#0b0b14] border border-[#202034] rounded-xl p-4 flex flex-col gap-2">
              {/* Layer 1: Controllers */}
              <div className="bg-[#161629] border border-[#2d2c47] rounded-lg p-3 shadow-md flex items-center justify-between transition-all hover:border-[#ff2d78]/60 hover:shadow-[0_0_16px_rgba(255,45,120,0.25)]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-[#ff2d78]/20 border border-[#ff2d78]/40 flex items-center justify-center text-[#ff2d78] font-mono text-xs font-bold shadow-[0_0_8px_rgba(255,45,120,0.3)]">
                    C1
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-white leading-tight">Controladores</span>
                    <span className="text-xs text-[#a098b0]">Puntos de Entrada HTTP REST (@RestController)</span>
                  </div>
                </div>
                <span className="font-mono text-xs bg-[#1f1f35] border border-[#343353] px-2 py-0.5 rounded text-[#ff2d78] font-medium">
                  4 endpoints
                </span>
              </div>

              {/* Connector */}
              <div className="flex items-center justify-center py-0.5">
                <div className="flex items-center gap-1 text-[#a098b0]/70 font-mono text-xs">
                  <span className="material-symbols-outlined text-[18px] text-[#ff2d78]">south</span>
                  <span className="text-[11px] text-[#a098b0]">Inyección @Autowired (DTO payload)</span>
                </div>
              </div>

              {/* Layer 2: Services */}
              <div className="bg-[#161629] border border-[#2d2c47] rounded-lg p-3 shadow-md flex items-center justify-between transition-all hover:border-[#00ffcc]/60 hover:shadow-[0_0_16px_rgba(0,255,204,0.25)]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-[#00ffcc]/20 border border-[#00ffcc]/40 flex items-center justify-center text-[#00ffcc] font-mono text-xs font-bold shadow-[0_0_8px_rgba(0,255,204,0.3)]">
                    S2
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-white leading-tight">Servicios</span>
                    <span className="text-xs text-[#a098b0]">Lógica de Negocio y Reglas Curriculares (@Service)</span>
                  </div>
                </div>
                <span className="font-mono text-xs bg-[#1f1f35] border border-[#343353] px-2 py-0.5 rounded text-[#00ffcc] font-medium">
                  5 servicios
                </span>
              </div>

              {/* Connector */}
              <div className="flex items-center justify-center py-0.5">
                <div className="flex items-center gap-1 text-[#a098b0]/70 font-mono text-xs">
                  <span className="material-symbols-outlined text-[18px] text-[#00ffcc]">south</span>
                  <span className="text-[11px] text-[#a098b0]">Transaccionalidad @Transactional</span>
                </div>
              </div>

              {/* Layer 3: Repositories */}
              <div className="bg-[#161629] border border-[#2d2c47] rounded-lg p-3 shadow-md flex items-center justify-between transition-all hover:border-cyan-400/60 hover:shadow-[0_0_16px_rgba(0,240,255,0.25)]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 font-mono text-xs font-bold shadow-[0_0_8px_rgba(0,240,255,0.3)]">
                    R3
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-white leading-tight">Repositorios</span>
                    <span className="text-xs text-[#a098b0]">Acceso a Datos y Consultas Derivadas (JpaRepository)</span>
                  </div>
                </div>
                <span className="font-mono text-xs bg-[#1f1f35] border border-[#343353] px-2 py-0.5 rounded text-cyan-300 font-medium">
                  3 interfaces
                </span>
              </div>

              {/* Connector */}
              <div className="flex items-center justify-center py-0.5">
                <div className="flex items-center gap-1 text-[#a098b0]/70 font-mono text-xs">
                  <span className="material-symbols-outlined text-[18px] text-cyan-400">south</span>
                  <span className="text-[11px] text-[#a098b0]">Mapeo ORM Hibernate</span>
                </div>
              </div>

              {/* Layer 4: Models */}
              <div className="bg-[#161629] border border-[#2d2c47] rounded-lg p-3 shadow-md flex items-center justify-between transition-all hover:border-[#ffe04a]/60 hover:shadow-[0_0_16px_rgba(255,224,74,0.25)]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-[#ffe04a]/20 border border-[#ffe04a]/40 flex items-center justify-center text-[#ffe04a] font-mono text-xs font-bold shadow-[0_0_8px_rgba(255,224,74,0.3)]">
                    M4
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-white leading-tight">Modelos / Entidades</span>
                    <span className="text-xs text-[#a098b0]">Persistencia y Esquema Relacional (@Entity)</span>
                  </div>
                </div>
                <span className="font-mono text-xs bg-[#1f1f35] border border-[#343353] px-2 py-0.5 rounded text-[#ffe04a] font-medium">
                  6 tablas
                </span>
              </div>
            </div>

            {/* Metric Bar Indicator */}
            <div className="mt-4 p-4 rounded-xl bg-[#0e0f1a] border border-[#24233a] flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px] text-[#00ffcc] drop-shadow-[0_0_6px_rgba(0,255,204,0.6)]">
                    health_and_safety
                  </span>
                  <span className="text-sm font-semibold text-white">Salud de la Arquitectura</span>
                </div>
                <span className="text-xl font-bold text-[#00ffcc] drop-shadow-[0_0_10px_rgba(0,255,204,0.5)]">
                  88%
                </span>
              </div>
              <p className="text-xs text-[#a098b0]">Apego a convenciones estándar de la industria</p>
              <div className="w-full bg-[#1b1a2e] rounded-full h-2 mt-1.5 overflow-hidden border border-[#2e2d46]">
                <div
                  className="bg-gradient-to-r from-[#00ffcc] to-[#00f0ff] h-2 rounded-full shadow-[0_0_10px_#00ffcc]"
                  style={{ width: "88%" }}
                />
              </div>
            </div>

            {/* Academic Diagnostic Box for Professor */}
            <div className="mt-4 p-4 rounded-xl bg-[#141424] border border-[#28273e] flex flex-col gap-2 relative overflow-hidden">
              <div className="flex items-center gap-2 text-[#ff2d78]">
                <span className="material-symbols-outlined text-[20px] drop-shadow-[0_0_6px_rgba(255,45,120,0.6)]">
                  school
                </span>
                <span className="text-xs font-bold tracking-wider uppercase">
                  Conclusión Diagnóstica Lista para el Docente
                </span>
              </div>
              <blockquote className="text-sm text-gray-200 italic pl-3 bg-[#0d0e17]/80 border-l-2 border-[#ff2d78] py-1.5 rounded my-1">
                “El estudiante demuestra dominio de separación de responsabilidades y documentación constante de incidencias.”
              </blockquote>
              <div className="flex items-center justify-between pt-1 text-[#a098b0] text-xs">
                <span>Evaluación generada con: Reglas SonarJava + Convenciones Spring Framework 3.x</span>
                <span className="text-[#00ffcc] font-bold tracking-wide drop-shadow-[0_0_6px_rgba(0,255,204,0.4)]">
                  Recomendado: Aprobado Técnico
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Misplaced Files Audit (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-[#121221] border border-[#26243d] rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.35)] flex flex-col h-full">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1d1d32]">
              <div>
                <span className="text-xs text-[#ffe04a] uppercase tracking-widest block font-bold">
                  Acciones Requeridas
                </span>
                <h2 className="text-lg font-bold text-white mt-0.5 font-headline">
                  Auditoría de Convenciones y Estructura
                </h2>
              </div>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#ffe04a]/15 border border-[#ffe04a]/30 text-[#ffe04a] font-bold shadow-[0_0_8px_rgba(255,224,74,0.2)]">
                4 hallazgos
              </span>
            </div>

            <p className="text-xs text-[#a098b0] mb-4 leading-relaxed">
              Se identificaron 4 archivos fuera de su directorio natural. Aplicar estas correcciones elevará el índice de salud a{" "}
              <span className="font-bold text-[#00ffcc] drop-shadow-[0_0_6px_rgba(0,255,204,0.4)]">
                98%
              </span>.
            </p>

            {/* Audit File List */}
            <div className="flex flex-col gap-3 flex-1">
              {misplacedFiles.map((f) => (
                <div
                  key={f.name}
                  className="p-3 rounded-lg bg-[#161628] border border-[#292842] hover:border-[#ffe04a]/60 transition-all flex flex-col gap-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="material-symbols-outlined text-[18px] text-[#ffe04a] shrink-0">
                        {f.icon}
                      </span>
                      <span className="font-mono text-xs text-white font-semibold truncate">
                        {f.name}
                      </span>
                    </div>
                    <span className="text-[11px] bg-[#222138] border border-[#353454] px-2 py-0.5 rounded text-[#ffe04a] shrink-0">
                      {f.currentLocation}
                    </span>
                  </div>
                  <div className="flex items-start gap-2 pl-4 text-xs text-[#a098b0]">
                    <span className="material-symbols-outlined text-[16px] text-[#ff2d78] shrink-0 mt-0.5">
                      subdirectory_arrow_right
                    </span>
                    <div>
                      <span>Recomendación: </span>
                      <span className="font-mono text-xs bg-[#0f0f1b] border border-[#2b2a44] px-1.5 py-0.5 rounded text-[#ff2d78] font-medium">
                        {f.recommended}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Academic Context Note */}
            <div className="mt-4 p-3 rounded-lg bg-[#141424] border border-[#27263d] text-[#a098b0] flex items-center gap-3">
              <span className="material-symbols-outlined text-[20px] text-[#ff2d78] shrink-0 drop-shadow-[0_0_6px_rgba(255,45,120,0.6)]">
                lightbulb
              </span>
              <span className="text-xs leading-relaxed">
                Al reorganizar estos archivos, el proyecto se alineará con los estándares evaluados en rúbricas de Arquitectura de Software.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Academic Checklist & Meta Banner */}
      <div className="bg-[#121221] border border-[#26243d] rounded-xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.35)] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#00ffcc]/15 border border-[#00ffcc]/35 flex items-center justify-center text-[#00ffcc] shrink-0 shadow-[0_0_14px_rgba(0,255,204,0.25)]">
            <span className="material-symbols-outlined text-[26px]">verified_user</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Validación de Entrega Lista</h3>
            <p className="text-xs text-[#a098b0]">
              Hash de verificación criptográfica:{" "}
              <span className="font-mono text-xs text-[#ff2d78] font-semibold drop-shadow-[0_0_6px_rgba(255,45,120,0.4)]">
                #sha256-4f81c9a8
              </span>{" "}
              (Generado automáticamente)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <div className="flex items-center gap-2 text-[#a098b0] text-xs px-3 py-1.5 bg-[#17172a] border border-[#2d2c47] rounded-lg">
            <span className="w-2 h-2 rounded-full bg-[#00ffcc] shadow-[0_0_6px_#00ffcc]" />
            <span>Sin compilación en vivo</span>
          </div>
          <button
            onClick={handleExportPdf}
            className="px-4 py-2 rounded-lg bg-[#1a1a2e] border border-[#31304d] text-white hover:border-[#00ffcc] transition-all text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">print</span>
            <span>Imprimir Resumen</span>
          </button>
        </div>
      </div>
    </div>
  );
}
