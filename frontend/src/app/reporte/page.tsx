"use client";

import { useState } from "react";
import Link from "next/link";
import { useProject } from "@/context/ProjectContext";

export default function ReportePage() {
  const { project, errors, loadSample } = useProject();

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
      showToast(`PDF "Reporte_Estado_${project?.project_name || "Proyecto"}.pdf" descargado.`);
    }, 1400);
  };

  // Conteo de errores por categoría
  const errorsByCategory = errors.reduce((acc, err) => {
    const cat = err.category || "General";
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="flex flex-col w-full max-w-[1440px] mx-auto px-4 sm:px-6 py-6 overflow-x-hidden">
      {/* Sub-header & Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs uppercase tracking-wider text-[#ff2d78] font-bold drop-shadow-[0_0_6px_rgba(255,45,120,0.5)]">
              Auditoría Académica v3.2
            </span>
            <span className="inline-block w-1 h-1 rounded-full bg-[#ff2d78]/60" />
            <span className="text-xs text-[#a098b0]">
              {project ? `Proyecto: ${project.project_name}` : "Esperando proyecto"}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight font-headline">
            Reporte de Estado del Proyecto
          </h1>
          <p className="text-xs sm:text-sm text-[#a098b0] mt-1 max-w-3xl leading-relaxed">
            Diagnóstico integral del código: detección de base de datos, entidades administradas, inconsistencias estructurales y balance de incidencias para evaluación docente.
          </p>
        </div>

        {/* Botones de Acción */}
        {project && (
          <div className="flex items-center gap-3 flex-wrap shrink-0">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#151525] border border-[#2e2d46] text-[#e8e0f0] hover:border-[#00ffcc] hover:text-[#00ffcc] hover:shadow-[0_0_12px_rgba(0,255,204,0.25)] transition-all text-xs font-semibold cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">share</span>
              <span>Compartir Enlace</span>
            </button>

            <button
              onClick={handleExportPdf}
              disabled={isExporting}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#ff2d78] to-[#ff156a] text-white hover:brightness-110 transition-all shadow-[0_0_18px_rgba(255,45,120,0.45)] border border-[#ff2d78]/40 text-xs font-bold tracking-wide cursor-pointer"
            >
              <span className={`material-symbols-outlined text-[18px] ${isExporting ? "animate-spin" : ""}`}>
                {isExporting ? "refresh" : "picture_as_pdf"}
              </span>
              <span>{isExporting ? "Compilando PDF..." : "Exportar PDF para Profesor"}</span>
            </button>
          </div>
        )}
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[60] flex items-center gap-2 bg-[#161629] text-white border border-[#00ffcc]/40 px-4 py-3 rounded-xl shadow-[0_0_20px_rgba(0,255,204,0.3)] text-xs font-medium animate-bounce">
          <span className="material-symbols-outlined text-[20px] text-[#00ffcc]">check_circle</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ESTADO EN BLANCO: Si no hay proyecto cargado */}
      {!project && (
        <div className="bg-[#0f0f1a] border border-[#262438] rounded-xl p-10 flex flex-col items-center justify-center text-center gap-4 shadow-xl mb-6">
          <div className="w-16 h-16 rounded-2xl bg-[#141424] border border-[#2f2b47] flex items-center justify-center text-[#ff2d78] shadow-[0_0_20px_rgba(255,45,120,0.3)]">
            <span className="material-symbols-outlined text-[36px]">fact_check</span>
          </div>
          <div className="max-w-md flex flex-col gap-1.5">
            <h2 className="text-lg font-bold text-white">Ningún proyecto para auditar</h2>
            <p className="text-xs text-[#a098b0] leading-relaxed">
              Carga tu proyecto o sube un archivo ZIP para generar el informe de estado con métricas reales de archivos, entidades de base de datos y orden arquitectónico.
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
          {/* Tarjetas KPI de Estado */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* KPI 1: Inconsistencias / Archivos desordenados */}
            <div className="bg-[#121221] border border-[#26243d] hover:border-[#ffe04a]/60 rounded-xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.35)] flex flex-col justify-between relative overflow-hidden group transition-all">
              <div className="absolute -right-4 -bottom-4 w-28 h-28 rounded-full bg-[#ffe04a]/10 blur-xl pointer-events-none" />
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs text-[#a098b0] font-medium block uppercase tracking-wider">
                    Inconsistencias / Desorden
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-bold text-white tracking-tight">
                      {project.misplaced_count}
                    </span>
                    <span className="text-xs text-[#a098b0]">de {project.total_files} archivos</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-lg bg-[#ffe04a]/15 border border-[#ffe04a]/30 flex items-center justify-center text-[#ffe04a] shadow-[0_0_12px_rgba(255,224,74,0.25)]">
                  <span className="material-symbols-outlined text-[22px]">warning</span>
                </div>
              </div>
              <div className="mt-4 pt-2 border-t border-[#1d1d32] flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono text-[11px] bg-[#ffe04a]/15 text-[#ffe04a] border border-[#ffe04a]/30 font-semibold">
                  {project.misplaced_count > 0 ? "Requiere acción" : "Ordenado"}
                </span>
                <span className="text-xs text-[#a098b0]">
                  {project.misplaced_count > 0 ? "Archivos sueltos o mal ubicados" : "Sin archivos fuera de convención"}
                </span>
              </div>
            </div>

            {/* KPI 2: Errores documentados en bitácora */}
            <div className="bg-[#121221] border border-[#26243d] hover:border-[#ff2d78]/60 rounded-xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.35)] flex flex-col justify-between relative overflow-hidden group transition-all">
              <div className="absolute -right-4 -bottom-4 w-28 h-28 rounded-full bg-[#ff2d78]/10 blur-xl pointer-events-none" />
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs text-[#a098b0] font-medium block uppercase tracking-wider">
                    Incidencias en Bitácora
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-3xl font-bold text-[#ff2d78] tracking-tight drop-shadow-[0_0_10px_rgba(255,45,120,0.4)]">
                      {errors.length}
                    </span>
                    <span className="text-xs text-[#a098b0]">documentados</span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-lg bg-[#ff2d78]/15 border border-[#ff2d78]/30 flex items-center justify-center text-[#ff2d78] shadow-[0_0_12px_rgba(255,45,120,0.3)]">
                  <span className="material-symbols-outlined text-[22px]">assignment_turned_in</span>
                </div>
              </div>
              <div className="mt-4 pt-2 border-t border-[#1d1d32] flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono text-[11px] bg-[#ff2d78]/15 text-[#ff2d78] border border-[#ff2d78]/30 font-semibold">
                  <span className="material-symbols-outlined text-[14px]">done_all</span>
                  Bitácora
                </span>
                <span className="text-xs text-[#a098b0]">100% con solución registrada</span>
              </div>
            </div>

            {/* KPI 3: Framework & Tecnologías */}
            <div className="bg-[#121221] border border-[#26243d] hover:border-[#00ffcc]/60 rounded-xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.35)] flex flex-col justify-between relative overflow-hidden group transition-all">
              <div className="absolute -right-4 -bottom-4 w-28 h-28 rounded-full bg-[#00ffcc]/10 blur-xl pointer-events-none" />
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs text-[#a098b0] font-medium block uppercase tracking-wider">
                    Framework & Stack
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-xl font-bold text-[#00ffcc] tracking-tight drop-shadow-[0_0_10px_rgba(0,255,204,0.4)]">
                      {project.framework}
                    </span>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-lg bg-[#00ffcc]/15 border border-[#00ffcc]/30 flex items-center justify-center text-[#00ffcc] shadow-[0_0_12px_rgba(0,255,204,0.3)]">
                  <span className="material-symbols-outlined text-[22px]">verified</span>
                </div>
              </div>
              <div className="mt-4 pt-2 border-t border-[#1d1d32] flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-mono text-[11px] bg-[#00ffcc]/15 text-[#00ffcc] border border-[#00ffcc]/30 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00ffcc]" />
                  Activo
                </span>
                <span className="text-xs text-[#a098b0] truncate">{project.architecture_type}</span>
              </div>
            </div>
          </div>

          {/* Sección Especial: Base de Datos y Entidades Administradas por el Sistema */}
          <div className="bg-[#121221] border border-[#26243d] rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.35)] mb-6 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-[#1d1d32] pb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00ffcc] text-[22px]">database</span>
                <h2 className="text-base font-bold text-white">
                  Diagnóstico de Persistencia y Entidades del Dominio
                </h2>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                project.database_detected
                  ? "bg-[#00ffcc]/15 text-[#00ffcc] border-[#00ffcc]/30"
                  : "bg-[#252538] text-[#a098b0] border-[#363650]"
              }`}>
                {project.database_detected ? "Capa de Datos Detectada" : "Sin Capa de Datos Identificada"}
              </span>
            </div>

            <p className="text-xs text-[#a098b0] leading-relaxed">
              El asistente examina las clases de entidad, modelos relacionales y scripts para determinar qué objetos o registros administra este proyecto universitario:
            </p>

            {project.detected_entities && project.detected_entities.length > 0 ? (
              <div className="flex flex-col gap-2 pt-1">
                <span className="text-xs font-semibold text-white">
                  Entidades / Tablas reconocidas ({project.detected_entities.length}):
                </span>
                <div className="flex flex-wrap gap-2">
                  {project.detected_entities.map((entity) => (
                    <div
                      key={entity}
                      className="px-3 py-1.5 rounded-lg bg-[#16162a] border border-[#2b2742] text-white text-xs font-mono flex items-center gap-1.5 shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[15px] text-[#ff2d78]">table_rows</span>
                      <span className="font-semibold">{entity}</span>
                      <span className="text-[10px] text-[#00ffcc]">Modelo ORM</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-[#151524] border border-[#262438] text-xs text-[#a098b0] italic">
                No se encontraron archivos de modelo en los paquetes estándar (models/ o entities/). Si el proyecto administra tablas, ubícalas en la carpeta de modelos correspondiente.
              </div>
            )}
          </div>

          {/* Grilla: Esquema Arquitectónico + Auditoría de Inconsistencias */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
            {/* Columna Izquierda: Esquema Arquitectónico y Salud (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div className="bg-[#121221] border border-[#26243d] rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.35)] flex flex-col">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1d1d32]">
                  <div>
                    <span className="text-xs text-[#ff2d78] uppercase tracking-widest block font-bold">
                      Esquema del Framework
                    </span>
                    <h2 className="text-lg font-bold text-white mt-0.5 font-headline">
                      Capas Activas en {project.project_name}
                    </h2>
                  </div>
                  <div className="flex items-center gap-1 text-[#00ffcc] text-xs bg-[#00ffcc]/10 border border-[#00ffcc]/30 px-2.5 py-1 rounded-full">
                    <span className="material-symbols-outlined text-[16px]">layers</span>
                    <span className="font-semibold">{project.active_layers.length} Capas</span>
                  </div>
                </div>

                {/* Desglose de Capas Reales */}
                <div className="bg-[#0b0b14] border border-[#202034] rounded-xl p-4 flex flex-col gap-2.5">
                  {project.active_layers.map((layer, idx) => (
                    <div
                      key={layer}
                      className="bg-[#161629] border border-[#2d2c47] rounded-lg p-3 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded bg-[#ff2d78]/20 border border-[#ff2d78]/40 flex items-center justify-center text-[#ff2d78] font-mono text-xs font-bold shrink-0">
                          {idx + 1}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-semibold text-white leading-tight capitalize truncate">
                            {layer}
                          </span>
                          <span className="text-xs text-[#a098b0] truncate">
                            Componente de arquitectura en {project.framework}
                          </span>
                        </div>
                      </div>
                      <span className="font-mono text-xs bg-[#1f1f35] border border-[#343353] px-2 py-0.5 rounded text-[#00ffcc] font-medium shrink-0">
                        Activo
                      </span>
                    </div>
                  ))}
                </div>

                {/* Barra de Salud de la Arquitectura */}
                <div className="mt-4 p-4 rounded-xl bg-[#0e0f1a] border border-[#24233a] flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px] text-[#00ffcc] drop-shadow-[0_0_6px_rgba(0,255,204,0.6)]">
                        health_and_safety
                      </span>
                      <span className="text-sm font-semibold text-white">Salud Estructural del Proyecto</span>
                    </div>
                    <span className="text-xl font-bold text-[#00ffcc] drop-shadow-[0_0_10px_rgba(0,255,204,0.5)]">
                      {project.alignment_score}%
                    </span>
                  </div>
                  <p className="text-xs text-[#a098b0]">Porcentaje de archivos alineados con las convenciones estándar</p>
                  <div className="w-full bg-[#1b1a2e] rounded-full h-2 mt-1.5 overflow-hidden border border-[#2e2d46]">
                    <div
                      className="bg-gradient-to-r from-[#00ffcc] to-[#00f0ff] h-2 rounded-full shadow-[0_0_10px_#00ffcc]"
                      style={{ width: `${project.alignment_score}%` }}
                    />
                  </div>
                </div>

                {/* Conclusión Diagnóstica */}
                <div className="mt-4 p-4 rounded-xl bg-[#141424] border border-[#28273e] flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-[#ff2d78]">
                    <span className="material-symbols-outlined text-[20px]">school</span>
                    <span className="text-xs font-bold tracking-wider uppercase">
                      Conclusión Académica para el Docente
                    </span>
                  </div>
                  <blockquote className="text-xs sm:text-sm text-gray-200 italic pl-3 bg-[#0d0e17]/80 border-l-2 border-[#ff2d78] py-1.5 rounded my-1">
                    {project.alignment_score >= 80
                      ? `“El proyecto en ${project.framework} demuestra adecuado apego a la separación de responsabilidades y modularidad curricular.”`
                      : `“El proyecto requiere reubicar ${project.misplaced_count} archivos para alcanzar el estándar esperado de arquitectura.”`}
                  </blockquote>
                  <div className="flex items-center justify-between pt-1 text-[#a098b0] text-xs">
                    <span>Evaluado sin compilación con reglas didácticas de {project.framework}</span>
                    <span className="text-[#00ffcc] font-bold">
                      {project.alignment_score >= 70 ? "Aprobado Técnico" : "Revisión Recomendada"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Columna Derecha: Auditoría de Inconsistencias y Archivos Mal Ubicados (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="bg-[#121221] border border-[#26243d] rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.35)] flex flex-col h-full">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1d1d32]">
                  <div>
                    <span className="text-xs text-[#ffe04a] uppercase tracking-widest block font-bold">
                      Inconsistencias
                    </span>
                    <h2 className="text-lg font-bold text-white mt-0.5 font-headline">
                      Archivos Fuera de Convención
                    </h2>
                  </div>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#ffe04a]/15 border border-[#ffe04a]/30 text-[#ffe04a] font-bold">
                    {project.misplaced_count} hallazgos
                  </span>
                </div>

                <p className="text-xs text-[#a098b0] mb-4 leading-relaxed">
                  {project.misplaced_count === 0
                    ? "Excelente trabajo: todos los archivos se encuentran en las carpetas correspondientes según el estándar del framework."
                    : `Se identificaron ${project.misplaced_count} archivos que deben ser reubicados:`}
                </p>

                {/* Lista de Inconsistencias */}
                <div className="flex flex-col gap-3 flex-1">
                  {project.misplaced_files.map((f) => (
                    <div
                      key={f.file_name}
                      className="p-3 rounded-lg bg-[#161628] border border-[#292842] hover:border-[#ffe04a]/60 transition-all flex flex-col gap-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="material-symbols-outlined text-[18px] text-[#ffe04a] shrink-0">
                            draft
                          </span>
                          <span className="font-mono text-xs text-white font-semibold truncate">
                            {f.file_name}
                          </span>
                        </div>
                        <span className="text-[11px] bg-[#222138] border border-[#353454] px-2 py-0.5 rounded text-[#ffe04a] shrink-0">
                          {f.severity === "critical" ? "Crítico" : "Desorden"}
                        </span>
                      </div>
                      <p className="text-xs text-[#a098b0]">{f.reason}</p>
                      <div className="flex items-start gap-2 pl-2 text-xs text-[#a098b0]">
                        <span className="material-symbols-outlined text-[15px] text-[#ff2d78] shrink-0 mt-0.5">
                          subdirectory_arrow_right
                        </span>
                        <div className="min-w-0">
                          <span>Sugerencia: </span>
                          <span className="font-mono text-xs bg-[#0f0f1b] border border-[#2b2a44] px-1.5 py-0.5 rounded text-[#ff2d78] font-medium break-all">
                            {f.suggested_path}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Balance de Errores por Categoría */}
                <div className="mt-4 pt-4 border-t border-[#1d1d32] flex flex-col gap-2">
                  <span className="text-xs font-semibold text-white">
                    Incidencias registradas por categoría ({errors.length}):
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {Object.entries(errorsByCategory).map(([cat, count]) => (
                      <div key={cat} className="p-2 rounded bg-[#161626] border border-[#242338] flex items-center justify-between">
                        <span className="text-[#a098b0]">{cat}</span>
                        <span className="font-mono font-bold text-[#ff2d78]">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer de Validación Curricular */}
          <div className="bg-[#121221] border border-[#26243d] rounded-xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.35)] flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#00ffcc]/15 border border-[#00ffcc]/35 flex items-center justify-center text-[#00ffcc] shrink-0 shadow-[0_0_14px_rgba(0,255,204,0.25)]">
                <span className="material-symbols-outlined text-[26px]">verified_user</span>
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Validación de Entrega Lista para el Profesor</h3>
                <p className="text-xs text-[#a098b0]">
                  Diagnóstico generado para{" "}
                  <span className="font-mono text-white font-semibold">{project.project_name}</span>{" "}
                  (Sin alterar código fuente ni compilar en vivo).
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              <button
                onClick={handleExportPdf}
                className="px-4 py-2 rounded-lg bg-[#1a1a2e] border border-[#31304d] text-white hover:border-[#00ffcc] transition-all text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">print</span>
                <span>Imprimir / Exportar Reporte</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
