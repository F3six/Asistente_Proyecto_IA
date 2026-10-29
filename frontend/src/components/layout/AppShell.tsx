"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Cerrar el drawer en móviles al navegar
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-[#0a0a12] text-[#e8e0f0] flex flex-col relative overflow-x-hidden">
      {/* Backdrop oscuro para móvil cuando el menú está abierto */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Barra Lateral Navegación */}
      <Sidebar
        isOpen={mobileSidebarOpen}
        onClose={() => setMobileSidebarOpen(false)}
      />

      {/* Encabezado Superior Contextual */}
      <Header onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} />

      {/* Contenido Principal con desplazamiento seguro para sidebar y header */}
      <div className="lg:pl-72 w-full flex-1 flex flex-col">
        <main className="w-full pt-16 flex-1 bg-[#0a0a12]">
          {children}
        </main>
      </div>
    </div>
  );
}
