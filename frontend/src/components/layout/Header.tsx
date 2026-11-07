"use client";

import { useState } from "react";
import { useProject } from "@/context/ProjectContext";

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { project, clearProject } = useProject();

  return (
    <header className="fixed top-0 left-0 lg:left-72 right-0 h-16 bg-[#0c0c16]/90 backdrop-blur-xl border-b border-[#232135] z-30 flex items-center justify-between px-4 sm:px-6 shadow-md transition-all">
      {/* Lado Izquierdo: Botón Hamburguesa móvil + Selector de Proyecto + Badge Framework */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-1.5 rounded-lg bg-[#151524] border border-[#2b2940] text-[#a098b0] hover:text-white transition-colors"
            aria-label="Abrir menú de navegación"
          >
            <span className="material-symbols-outlined text-[22px]">menu</span>
          </button>
        )}

        <div className="flex items-center gap-1.5 sm:gap-2 bg-[#151524] border border-[#2b2940] px-2.5 sm:px-3 py-1.5 rounded-md hover:border-[#ff2d78]/50 transition-colors shrink-0">
          <span className="material-symbols-outlined text-[#ff2d78] text-[18px]">folder</span>
          <span className="font-mono text-xs text-[#e8e0f0] font-semibold tracking-tight max-w-[130px] sm:max-w-[180px] md:max-w-none truncate">
            {project ? project.project_name : "Sin Proyecto Activo"}
          </span>
          {project && (
            <button
              onClick={clearProject}
              title="Descargar / Cambiar proyecto"
              className="text-[#a098b0] hover:text-[#ff2d78] transition-colors p-0.5"
            >
              <span className="material-symbols-outlined text-[15px]">close</span>
            </button>
          )}
        </div>

        {project ? (
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#00ffcc]/10 border border-[#00ffcc]/30 text-[#00ffcc] text-xs shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#00ffcc] shadow-[0_0_6px_#00ffcc] animate-pulse" />
            <span className="font-semibold tracking-wide">{project.framework}</span>
          </div>
        ) : (
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#202034] border border-[#32324e] text-[#a098b0] text-xs shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#a098b0]" />
            <span className="font-medium tracking-wide">En Blanco</span>
          </div>
        )}
      </div>

      {/* Lado Derecho: Buscador Flexible + Modo Didáctico */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-2.5 sm:left-3 text-[#a098b0] text-[16px] sm:text-[18px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-32 sm:w-56 md:w-64 lg:w-80 pl-8 sm:pl-9 pr-10 py-1.5 bg-[#141423] border border-[#29263d] rounded-md text-xs text-[#e8e0f0] placeholder:text-[#a098b0]/70 focus:outline-none focus:border-[#ff2d78] focus:ring-1 focus:ring-[#ff2d78] transition-all"
            placeholder="Buscar en el glosario o proyecto..."
          />
          <span className="hidden md:block absolute right-2.5 font-mono text-[10px] text-[#a098b0] bg-[#1f1e33] px-1.5 py-0.5 rounded border border-[#32304d]">
            ⌘K
          </span>
        </div>

        <div className="flex items-center gap-2 pl-2 border-l border-[#262438]">
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#141423] border border-[#2b2940] text-xs">
            <span className="material-symbols-outlined text-[16px] text-[#00ffcc]">terminal</span>
            <span className="font-mono text-[11px] text-[#e8e0f0]">Modo Didáctico</span>
          </div>
        </div>
      </div>
    </header>
  );
}
