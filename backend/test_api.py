"""
Script de verificación directa de los servicios de DevEdu Shell.
Ejecuta pruebas sobre el reconocedor de frameworks, el glosario didáctico y el sugeridor de rutas.
"""

from backend.app.services.analyzer import FrameworkAnalyzer
from backend.app.services.glossary_service import GlossaryService
from backend.app.services.suggestion_service import SuggestionService


def test_analyzer():
    print("--- Test 1: Framework Analyzer ---")
    files = [
        "pom.xml",
        "src/main/java/com/universidad/controllers/EmployeeController.java",
        "src/main/java/com/universidad/models/Employee.java",
        "src/main/java/com/universidad/repositories/EmployeeRepository.java",
        "src/main/java/com/universidad/services/EmployeeService.java",
        "src/main/java/TempQueryHelper.java",  # Archivo desordenado
        "src/main/java/mis_scripts/MisFunciones.java",  # Carpeta desordenada
    ]

    analysis = FrameworkAnalyzer.analyze("Test_University_Project", files)
    print(f"Framework Detectado: {analysis.framework} ({analysis.architecture_type})")
    print(f"Puntaje de Alineación: {analysis.alignment_score}%")
    print(f"Archivos desordenados detectados: {analysis.misplaced_count}")
    for m in analysis.misplaced_files:
        print(f"  - [{m.file_name}]: {m.reason} -> Sugerido: {m.suggested_path}")

    assert analysis.framework == "Spring Boot"
    assert analysis.misplaced_count == 2
    print("Test 1 completado con éxito!\n")


def test_glossary():
    print("--- Test 2: Glossary Service ---")
    exp = GlossaryService.get_explanation("Spring Boot", "models")
    assert exp is not None
    print(f"Carpeta: {exp.folder_name} ({exp.layer_name})")
    print(f"Explicación simple: {exp.description_simple[:80]}...")
    print(f"Convenciones: {len(exp.naming_conventions)} reglas")
    print("Test 2 completado con éxito!\n")


def test_suggestions():
    print("--- Test 3: Suggestion Service ---")
    query = "Una pantalla para listar empleados"
    sug = SuggestionService.suggest_location(query, "Spring Boot")
    print(f"Consulta: '{query}'")
    print(f"Archivo primario: {sug.primary_file} en {sug.primary_path}")
    print(f"Rol: {sug.architectural_responsibility}")
    print(f"Archivos complementarios: {[f.name for f in sug.complementary_files]}")
    assert "Controller" in sug.primary_file
    print("Test 3 completado con éxito!\n")


if __name__ == "__main__":
    test_analyzer()
    test_glossary()
    test_suggestions()
    print("TODAS LAS PRUEBAS UNITARIAS PASARON EXITOSAMENTE!")
