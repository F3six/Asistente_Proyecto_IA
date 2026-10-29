"use client";

import { useState } from "react";

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export default function Header({ onToggleSidebar }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");

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

        <div className="flex items-center gap-1.5 sm:gap-2 bg-[#151524] border border-[#2b2940] px-2.5 sm:px-3 py-1.5 rounded-md hover:border-[#ff2d78]/50 transition-colors cursor-pointer shrink-0">
          <span className="material-symbols-outlined text-[#ff2d78] text-[18px]">folder</span>
          <span className="font-mono text-xs text-[#e8e0f0] font-semibold tracking-tight max-w-[130px] sm:max-w-[180px] md:max-w-none truncate">
            Proyecto_Universidad_Final
          </span>
          <span className="material-symbols-outlined text-[#a098b0] text-[16px]">expand_more</span>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#00ffcc]/10 border border-[#00ffcc]/30 text-[#00ffcc] text-xs shrink-0">
          <span className="w-2 h-2 rounded-full bg-[#00ffcc] shadow-[0_0_6px_#00ffcc] animate-pulse" />
          <span className="font-semibold tracking-wide">Spring Boot</span>
        </div>
      </div>

      {/* Lado Derecho: Buscador Flexible + Perfil de Estudiante */}
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
            placeholder="Buscar glosario o anotación..."
          />
          <span className="hidden md:block absolute right-2.5 font-mono text-[10px] text-[#a098b0] bg-[#1f1e33] px-1.5 py-0.5 rounded border border-[#32304d]">
            ⌘K
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 pl-2 border-l border-[#262438]">
          <div className="flex flex-col text-right hidden md:flex">
            <span className="text-xs text-white font-semibold leading-tight">
              Estudiante Ing.
            </span>
            <span className="text-[10px] text-[#00ffcc] font-medium font-mono">
              Sistemas U.
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#ff2d78] to-[#bf0059] flex items-center justify-center text-white ring-2 ring-[#ff2d78]/40 shadow-[0_0_8px_rgba(255,45,120,0.4)] shrink-0">
            <span className="material-symbols-outlined text-[18px]">person</span>
          </div>
        </div>
      </div>
    </header>
  );
}
