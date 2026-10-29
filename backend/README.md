# 🚀 DevEdu Shell - Backend API (FastAPI)

API REST didáctica para el análisis de estructuras arquitectónicas de frameworks (Spring Boot, Laravel, Django), gestión de bitácora de errores de estudiantes y recomendaciones de ubicación de archivos.

---

## 🛠️ Requisitos Previos

- Python 3.10+
- Gestor de paquetes `pip`

---

## 📦 Instalación y Configuración

1. **Crear entorno virtual (recomendado):**
   ```bash
   python -m venv venv
   # En Windows:
   .\venv\Scripts\activate
   # En Linux/Mac:
   source venv/bin/activate
   ```

2. **Instalar dependencias:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Iniciar el servidor en modo desarrollo:**
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

---

## 📖 Documentación Interactiva (Swagger / OpenAPI)

Una vez iniciado el servidor, visita en tu navegador:
- **Swagger UI:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc:** [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

## 🎯 Endpoints Principales

| Método | Endpoint | Descripción |
|---|---|---|
| `POST` | `/api/projects/analyze` | Analiza el árbol del proyecto, detecta el framework y marca archivos desordenados. |
| `GET` | `/api/errors/` | Listar bitácora de errores con filtros de categoría (`Database`, `Routing`, `Views`, `Security`). |
| `POST` | `/api/errors/` | Registrar una nueva incidencia en la bitácora con síntoma, causa y solución. |
| `GET` | `/api/glossary/{framework}/{folder}` | Explica en palabras simples para qué sirve una carpeta y qué esperar dentro. |
| `POST` | `/api/suggestions/location` | Sugiere dónde ubicar un archivo y su nomenclatura antes de crearlo. |
| `GET` | `/api/reports/{project_id}` | Genera el informe consolidado con salud arquitectónica y balance para el docente. |
