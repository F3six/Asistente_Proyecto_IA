"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { AnalysisResponse, ErrorLog } from "@/lib/types";
import { api } from "@/lib/api";

interface ProjectContextType {
  project: AnalysisResponse | null;
  errors: ErrorLog[];
  isLoading: boolean;
  notification: string | null;
  showToast: (msg: string) => void;
  loadProject: (analysis: AnalysisResponse) => void;
  uploadFolder: (files: FileList) => Promise<void>;
  uploadZip: (file: File) => Promise<void>;
  loadSample: () => Promise<void>;
  clearProject: () => void;
  addError: (errorData: Partial<ErrorLog>) => Promise<ErrorLog>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [project, setProject] = useState<AnalysisResponse | null>(null);
  const [errors, setErrors] = useState<ErrorLog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  // Inicialización: cargar desde localStorage si existe
  useEffect(() => {
    const saved = localStorage.getItem("devedu_active_project");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setProject(parsed);
      } catch {
        // En blanco por defecto
      }
    }

    const savedErrors = localStorage.getItem("devedu_project_errors");
    if (savedErrors) {
      try {
        setErrors(JSON.parse(savedErrors));
      } catch {
        // En blanco
      }
    } else {
      // Cargar errores iniciales del backend
      api.getErrors().then((data) => {
        setErrors(data);
        localStorage.setItem("devedu_project_errors", JSON.stringify(data));
      }).catch(() => {});
    }
  }, []);

  const loadProject = (analysis: AnalysisResponse) => {
    setProject(analysis);
    localStorage.setItem("devedu_active_project", JSON.stringify(analysis));
    window.dispatchEvent(new Event("projectChanged"));
  };

  const clearProject = () => {
    setProject(null);
    localStorage.removeItem("devedu_active_project");
    window.dispatchEvent(new Event("projectChanged"));
    showToast("Proyecto descargado. Sistema en blanco.");
  };

  const uploadFolder = async (files: FileList) => {
    if (!files || files.length === 0) return;
    setIsLoading(true);
    try {
      const firstRelativePath = files[0].webkitRelativePath || files[0].name;
      const rootFolderName = firstRelativePath.split("/")[0] || "Proyecto_Local";

      const ignoredDirs = [
        "node_modules",
        ".git",
        ".next",
        "target",
        ".gradle",
        "build",
        "dist",
        ".idea",
        ".vscode",
        "__pycache__",
        "venv",
        ".venv",
        ".bin",
      ];

      const relativePaths: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const relPath = files[i].webkitRelativePath;
        if (!relPath) continue;

        const parts = relPath.split("/");
        if (parts.some((p) => ignoredDirs.includes(p))) {
          continue;
        }

        const pathWithoutRoot = parts.slice(1).join("/");
        if (pathWithoutRoot) {
          relativePaths.push(pathWithoutRoot);
        }
      }

      const result = await api.analyzeProject(rootFolderName, undefined, relativePaths);
      loadProject(result);
      showToast(`Proyecto "${rootFolderName}" cargado (${result.framework}).`);
    } catch (err) {
      console.error(err);
      showToast("Error al analizar la carpeta seleccionada.");
    } finally {
      setIsLoading(false);
    }
  };

  const uploadZip = async (file: File) => {
    setIsLoading(true);
    try {
      const result = await api.uploadProjectZip(file);
      loadProject(result);
      showToast(`Archivo ZIP "${file.name}" analizado con éxito.`);
    } catch (err) {
      console.error(err);
      showToast("Error al procesar el archivo ZIP.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadSample = async () => {
    setIsLoading(true);
    try {
      const sample = await api.analyzeProject("Proyecto_Universidad_Final");
      loadProject(sample);
      showToast("Proyecto didáctico Spring Boot cargado con éxito.");
    } catch (err) {
      console.error(err);
      showToast("Error al cargar proyecto de ejemplo.");
    } finally {
      setIsLoading(false);
    }
  };

  const addError = async (errorData: Partial<ErrorLog>): Promise<ErrorLog> => {
    try {
      const created = await api.createError({
        ...errorData,
        project_id: project?.project_id || 1,
      });
      const updated = [created, ...errors];
      setErrors(updated);
      localStorage.setItem("devedu_project_errors", JSON.stringify(updated));
      showToast("Error documentado en la bitácora.");
      return created;
    } catch {
      // Fallback local
      const localNew: ErrorLog = {
        id: Date.now(),
        project_id: project?.project_id || 1,
        title: errorData.title || "Nuevo Error",
        category: errorData.category || "General",
        layer: errorData.layer || "General",
        related_file: errorData.related_file || null,
        symptom: errorData.symptom || "",
        root_cause: errorData.root_cause || "",
        solution: errorData.solution || "",
        status: "verified",
        resolved_by: errorData.resolved_by || "Estudiante Ing.",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      const updated = [localNew, ...errors];
      setErrors(updated);
      localStorage.setItem("devedu_project_errors", JSON.stringify(updated));
      showToast("Error guardado localmente en la bitácora.");
      return localNew;
    }
  };

  return (
    <ProjectContext.Provider
      value={{
        project,
        errors,
        isLoading,
        notification,
        showToast,
        loadProject,
        uploadFolder,
        uploadZip,
        loadSample,
        clearProject,
        addError,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProject debe usarse dentro de un ProjectProvider");
  }
  return context;
}
