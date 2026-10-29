"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/explorador");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-2 border-[#ff2d78] border-t-transparent animate-spin" />
        <span className="text-xs text-[#a098b0] tracking-wider uppercase font-semibold">
          Cargando entorno didáctico DevEdu Shell...
        </span>
      </div>
    </div>
  );
}
