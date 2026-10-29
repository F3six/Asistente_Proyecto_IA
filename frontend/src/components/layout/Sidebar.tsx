"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Explorador del Framework",
      path: "/explorador",
      icon: "account_tree",
    },
    {
      label: "Asistente de Nuevos Archivos",
      path: "/asistente",
      icon: "note_add",
    },
    {
      label: "Bitácora de Errores",
      path: "/bitacora",
      icon: "history_edu",
    },
    {
      label: "Reporte de Estado",
      path: "/reporte",
      icon: "fact_check",
    },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 h-full w-72 bg-[#0e0f18] border-r border-[#262438] shadow-[4px_0_24px_rgba(0,0,0,0.6)] z-50 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0`}
    >
      <div className="flex flex-col">
        {/* Brand Logo Header & Botón Cerrar en móvil */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-[#201e30] bg-[#11111f]/60 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-[#ff2d78] to-[#b3004e] flex items-center justify-center text-white font-bold text-sm shadow-[0_0_12px_rgba(255,45,120,0.6)]">
              S
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm text-white leading-tight tracking-wide font-headline">
                DevEdu Shell
              </span>
              <span className="text-[10px] text-[#00ffcc] font-semibold uppercase tracking-widest font-mono">
                SISTEMAS · NEON
              </span>
            </div>
          </div>

          {/* Botón de cierre visible únicamente en pantallas pequeñas */}
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden text-[#a098b0] hover:text-white p-1 rounded-lg transition-colors"
              aria-label="Cerrar menú"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          )}
        </div>

        {/* Section Label */}
        <div className="px-5 pt-5 pb-2">
          <span className="text-[10px] text-[#a098b0]/70 uppercase tracking-widest font-bold font-mono">
            Plataforma Didáctica
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col gap-1.5 px-3">
          {navItems.map((item) => {
            const isActive =
              pathname === item.path ||
              (pathname === "/" && item.path === "/explorador");

            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded transition-all text-xs sm:text-sm font-medium ${
                  isActive
                    ? "bg-[#1e1e30] text-[#ff2d78] font-semibold border-l-2 border-[#ff2d78] shadow-[inset_0_0_16px_rgba(255,45,120,0.18)]"
                    : "text-[#a098b0] hover:bg-[#18182b] hover:text-white group"
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[20px] transition-colors shrink-0 ${
                    isActive
                      ? "text-[#ff2d78] drop-shadow-[0_0_6px_rgba(255,45,120,0.6)]"
                      : "text-[#736e8c] group-hover:text-[#00ffcc]"
                  }`}
                >
                  {item.icon}
                </span>
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Bottom Card: Entorno Guiado */}
      <div className="p-4 m-3 rounded-xl bg-[#141423] border border-[#26243a] flex flex-col gap-1.5 relative overflow-hidden shadow-inner shrink-0">
        <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-[#00ffcc]/10 rounded-full blur-xl pointer-events-none" />
        <div className="flex items-center gap-1.5 text-[#00ffcc] text-xs font-semibold">
          <span className="material-symbols-outlined text-[16px] text-[#00ffcc]">school</span>
          <span className="tracking-wide">Entorno Guiado</span>
        </div>
        <p className="text-xs text-[#a098b0] leading-relaxed">
          Herramienta de análisis estructural sin compilación en vivo.
        </p>
      </div>
    </aside>
  );
}
