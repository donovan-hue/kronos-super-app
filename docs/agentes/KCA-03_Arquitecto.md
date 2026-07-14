# ESPECIFICACIÓN: AGENTE ARQUITECTO DE CÓDIGO (KCA-03)

## SECCIÓN 1: Identificación y Metadatos de Identidad
* **Nombre:** Kronos Code Architect.
* **ID:** `KCA-03`
* **Rol dentro de Kronos:** Analista sintáctico, generador de código, refactorizador y administrador de testing. Opera sobre las herramientas ya presentes en la raíz del repo (`AstParser.js`, `RuleEngine.js`, `ComplexityAnalyzer.js`, `DependencyGraph.js`, `RefactorEngine.js`, etc.).
* **Misión principal:** Generar código limpio, aplicar refactorizaciones y ejecutar pruebas unitarias en un entorno aislado antes de validar cualquier entrega.
* **Límites de actuación:** No hace commit directo a `main`; toda entrega pasa por Pull Request. No ejecuta código fuera de un sandbox controlado.

## SECCIÓN 2: Interfaz, I/O y Mensajería
* **Entradas:**
  * Evento interno `task:assigned` (destino `KCA-03`).
  * Archivos fuente desde el volumen temporal compartido del repo.
* **Salidas:**
  * Evento `task:step-completed` con el código final y su suite de pruebas Jest.
  * Socket.io evento `code:test-results` (errores de compilación o lint).

## SECCIÓN 3: Arquitectura Interna y Ciclo de Vida
* **Arquitectura:** Orquesta el pipeline ya existente: `DirectoryScanner` → `AstParser` → `RuleEngine`/`ArchitectureEngine` → `RefactorEngine` → `TransformationPipeline` → `ExecutionReport`.
* **Sandbox:** Contenedores efímeros vía Docker (`dockerode`) para correr `jest` sin tocar el entorno del desarrollador.
* **Ciclo de vida:** Limpieza obligatoria de contenedores e imágenes huérfanas al finalizar cada tarea.

## SECCIÓN 4: IA, Modelos y Prompts
* **Modelos recomendados:** Claude (generación de código consistente bajo SOLID), `gpt-4o` (análisis de vulnerabilidades en código legado).
* **Prompt del Sistema:** Exige principios SOLID, pruebas Jest obligatorias por cada función pública y tipado estricto (Type Hints / JSDoc) según las directivas raíz del proyecto.

## SECCIÓN 5: Estado, Memoria y Persistencia
* **Persistencia:** Colección `code_evaluations` en MongoDB con el historial de `testStatus`, complejidad ciclomática (`ComplexityAnalyzer`) y hallazgos de `DuplicateAnalyzer`/`DeadCodeDetector`.

## SECCIÓN 6: Seguridad, Permisos y Cumplimiento
* **Seguridad:** Acceso al socket de Docker restringido por red y permisos de host. Bloqueo explícito de `child_process.exec` y `eval()` en cualquier código generado o analizado.

## SECCIÓN 7: Control de Recursos, Resiliencia y Errores
* **Recursos:** Sandbox limitado a 0.25 vCPU / 128 MB RAM por ejecución, con timeout forzado a 5s de inactividad para evitar bucles infinitos.

## SECCIÓN 8: Monitoreo, Logs y Trazabilidad
* **Logs:** JSON estructurado por cada corrida de `RefactorEngine`, incluyendo `x-correlation-id` heredado del plan del KTO-01 para poder rastrear qué petición originó el cambio de código.
