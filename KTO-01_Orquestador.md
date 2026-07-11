import os
import zipfile

# Definición del contenido para cada agente
kto_content = """# ESPECIFICACIÓN: AGENTE ORQUESTADOR DE TAREAS (KTO-01)

## SECCIÓN 1: Identificación y Metadatos de Identidad
* **Nombre:** Kronos Task Orchestrator.
* **ID:** `KTO-01`
* **Rol dentro de Kronos:** Distribuidor jerárquico y supervisor del ciclo de vida de los sub-agentes del sistema.
* **Misión principal:** Traducir peticiones complejas de usuario en un Grafo Dirigido Acíclico (DAG) de tareas, asignarlas a los agentes especialistas idóneos y garantizar la consistencia transaccional del sistema ante fallos.
* **Decisiones autónomas:** Reasignación de tareas por caída de agentes especialistas, control de cuotas por usuario (Rate Limiting dinámico), y selección del modelo de IA óptimo (costo vs. rendimiento) para la planificación.
* **Límites de actuación:** No modifica datos transaccionales de dominio de otros agentes de manera directa; no autoriza transacciones financieras sin confirmación humana; no expone credenciales de infraestructura.

## SECCIÓN 2: Interfaz, I/O y Mensajería
* **Entradas:**
  * REST `POST /api/v1/orchestrator/plans` (Payload con instrucciones de usuario).
    * Socket.io evento `task:submit` (Instrucciones interactivas).
      * Redis Pub/Sub canal `agent:status:heartbeat` (Telemetría de agentes).
      * **Salidas:**
        * Respuesta HTTP del plan de ejecución con ID único (`planId`).
          * Socket.io evento `task:progress` (Actualización en tiempo real del progreso).
            * Redis Pub/Sub canal `task:assigned` (Cargas de trabajo hacia los especialistas).

            ## SECCIÓN 3: Arquitectura Interna y Ciclo de Vida
            * **Arquitectura:** Clean Architecture estructurada en un módulo NestJS. Capas de Dominio (Entidades de DAG y Pasos), Casos de Uso (Crear Plan, Monitorear, Reversión Saga) e Infraestructura (Mongoose, BullMQ, ioredis).
            * **Máquina de Estados:** Idle -> Analizando -> Ejecutando DAG -> Esperando Respuestas -> Fin / Error / Recuperación.
            * **Ciclo de vida:** Manejo controlado de arranque (`OnModuleInit`) y apagado (`OnModuleDestroy`) aplicando Graceful Shutdown para terminar los procesos activos por un máximo de 10 segundos.

            ## SECCIÓN 4: IA, Modelos y Prompts
            * **Modelos recomendados:** `gpt-4o` (Planificación de planes complejos), `gpt-4o-mini` (Sub-tareas sencillas y validaciones).
            * **Prompt del Sistema:** Diseñado para estructurar el resultado estrictamente en un esquema JSON válido que describe nodos de tareas y dependencias.

            ## SECCIÓN 5: Estado, Memoria y Persistencia
            * **Persistencia:** Almacenamiento en MongoDB para la persistencia a largo plazo de los planes de ejecución y auditoría de estados. Uso de Redis para el caché de estados rápidos (TTL 60s) y listados de colas de mensajes mediante BullMQ.

            ## SECCIÓN 6: Seguridad, Permisos y Cumplimiento
            * **Seguridad:** Requiere validación de tokens JWT con roles autorizados de `ADMIN` o `SYSTEM_ORCHESTRATOR`. Encriptación AES-256-GCM para almacenar secretos temporales de usuario.

            ## SECCIÓN 7: Control de Recursos, Resiliencia y Errores
            * **Resiliencia:** Patrón Saga implementado para coordinar acciones compensatorias automáticas cuando un paso crítico del DAG falla de manera definitiva. Control de concurrencia y bloqueos utilizando Redlock sobre Redis.

            ## SECCIÓN 8: Monitoreo, Logs y Trazabilidad
            * **Logs:** Logs JSON estructurados mediante Winston. Inyección obligatoria de `x-correlation-id` en cada mensaje Pub/Sub y llamada REST para garantizar la trazabilidad entre servicios.
            """

            kda_content = """# ESPECIFICACIÓN: AGENTE ANALISTA DE DATOS (KDA-02)

            ## SECCIÓN 1: Identificación y Metadatos de Identidad
            * **Nombre:** Kronos Data Analyst.
            * **ID:** `KDA-02`
            * **Rol dentro de Kronos:** Analista especializado en la lectura de bases de datos, generación de reportes y procesamiento de ficheros planos.
            * **Misión principal:** Ejecutar agregaciones y lecturas analíticas de datos de manera aislada y segura, asegurando la privacidad de los datos personales (PII) mediante una arquitectura de solo lectura.
            * **Límites de actuación:** Tiene estrictamente prohibido realizar operaciones de escritura (INSERT, UPDATE, DELETE) en las colecciones de negocio principales de la base de datos de producción.

            ## SECCIÓN 2: Interfaz, I/O y Mensajería
            * **Entradas:**
              * Redis Pub/Sub canal `task:assigned` (con ID de destino `KDA-02`).
                * Volumen de disco temporal para archivos CSV/XLSX cargados de forma local.
                * **Salidas:**
                  * Redis Pub/Sub canal `task:step-completed` o `task:step-failed`.
                    * Socket.io evento `analysis:progress` para notificar tasas de procesamiento (ej. "45% procesado").

                    ## SECCIÓN 3: Arquitectura Interna y Ciclo de Vida
                    * **Arquitectura:** Clean Architecture adaptada en un microservicio de NestJS. Implementa procesamiento basado en streams nativos de Node.js para mitigar el uso de memoria RAM del servidor.
                    * **Ciclo de vida:** Inicialización de conexión a réplicas de solo lectura de MongoDB. En apagado, limpieza de buffers y liberación de recursos de archivos abiertos.

                    ## SECCIÓN 4: IA, Modelos y Prompts
                    * **Modelos recomendados:** `gpt-4o-mini` (Estructuración de queries y mapeo de campos), `claude-3-5-sonnet` (Interpretación analítica de reportes numéricos).
                    * **Prompt de Sistema:** Diseñado para evitar la generación de sentencias mutadoras de bases de datos y forzar la anonimización activa de campos PII.

                    ## SECCIÓN 5: Estado, Memoria y Persistencia
                    * **Persistencia:** Almacena reportes generados en formato Markdown y metadatos estadísticos en una colección de salida específica en MongoDB. Uso de Redis para caché de agregaciones costosas (TTL de 300s).

                    ## SECCIÓN 6: Seguridad, Permisos y Cumplimiento
                    * **Seguridad:** Uso estricto de credenciales de base de datos con permisos restringidos de solo lectura (`KRONOS_READONLY_ROLE`). Sanitización de operadores de MongoDB (como `$where` o `$accumulator`) para evitar inyecciones.

                    ## SECCIÓN 7: Control de Recursos, Resiliencia y Errores
                    * **Recursos:** Límite estricto de memoria establecido en 512 MB. El procesamiento cambia de manera automática a flujo de datos secuencial (*streaming*) si el set de datos supera las 5,000 filas.
                    """

                    kca_content = """# ESPECIFICACIÓN: AGENTE ARQUITECTO DE CÓDIGO (KCA-03)

                    ## SECCIÓN 1: Identificación y Metadatos de Identidad
                    * **Nombre:** Kronos Code Architect.
                    * **ID:** `KCA-03`
                    * **Rol dentro de Kronos:** Analista sintáctico, generador de código, refactorizador y administrador de testing del sistema.
                    * **Misión principal:** Generar código limpio, aplicar refactorizaciones lógicas y ejecutar pruebas unitarias en entornos totalmente seguros y aislados (Sandbox) antes de validar entregas.
                    * **Límites de actuación:** No realiza commits directos a ramas principales (`main`/`master`) sin supervisión de un Pull Request. No ejecuta código de validación fuera de contenedores controlados.

                    ## SECCIÓN 2: Interfaz, I/O y Mensajería
                    * **Entradas:**
                      * Redis Pub/Sub canal `task:assigned` (con ID de destino `KCA-03`).
                        * Archivos de código fuente desde un volumen de disco temporal compartido.
                        * **Salidas:**
                          * Redis Pub/Sub canal `task:step-completed` con el código final y suites de pruebas unitarias.
                            * Socket.io evento `code:test-results` para notificar errores de compilación o linter.

                            ## SECCIÓN 3: Arquitectura Interna y Ciclo de Vida
                            * **Arquitectura:** NestJS modular implementando el patrón Strategy para los motores de Sandbox. Gestión del ciclo de vida de contenedores efímeros mediante la biblioteca `dockerode`.
                            * **Ciclo de vida:** Limpieza mandatoria de contenedores e imágenes temporales huérfanas al destruirse el módulo de NestJS.

                            ## SECCIÓN 4: IA, Modelos y Prompts
                            * **Modelos recomendados:** `claude-3-5-sonnet` (Generación de código lógica y consistente), `gpt-4o` (Análisis de vulnerabilidades de seguridad en código legado).
                            * **Prompt del Sistema:** Enfoque en código bajo principios SOLID, generación obligatoria de pruebas Jest unitarias y tipado estático estricto.

                            ## SECCIÓN 5: Estado, Memoria y Persistencia
                            * **Persistencia:** Repositorio en MongoDB para registrar fragmentos de código evaluados y su correspondiente historial de estados de testing (`testStatus`).

                            ## SECCIÓN 6: Seguridad, Permisos y Cumplimiento
                            * **Seguridad:** Restricción de acceso al socket de Docker (`/var/run/docker.sock`) mediante configuraciones restringidas de red y permisos del host. Bloqueo de llamadas a funciones nativas peligrosas como `child_process.exec` o `eval()`.

                            ## SECCIÓN 7: Control de Recursos, Resiliencia y Errores
                            * **Recursos:** Contenedores de Sandbox limitados por configuración a `0.25 vCPU` y `128 MB` de RAM, con políticas de timeout de ejecución forzado a los 5 segundos de inactividad para evitar bucles infinitos.
                            """

                            readme_content = """# SISTEMA DE AGENTES KRONOS - MANUAL GENERAL

                            Este archivo comprimido contiene las especificaciones de ingeniería completas para el desarrollo del ecosistema de agentes inteligentes de **Kronos**, bajo el estándar de arquitectura NestJS y Clean Architecture.

                            ### Archivos incluidos:
                            1. `KTO-01_Orquestador.md`: Agente Orquestador de Tareas.
                            2. `KDA-02_Analista.md`: Agente Analista de Datos.
                            3. `KCA-03_Arquitecto.md`: Agente Arquitecto de Código.

                            Todos los agentes están diseñados para integrarse asíncronamente mediante el uso de colas persistentes en Redis (BullMQ), mensajería ágil (Redis Pub/Sub) e interfaces REST y Socket.io.
                            """

                            # Mapeo de archivos y contenidos
                            files_to_create = {
                                "README.md": readme_content,
                                    "KTO-01_Orquestador.md": kto_content,
                                        "KDA-02_Analista.md": kda_content,
                                            "KCA-03_Arquitecto.md": kca_content
                                            }

                                            zip_filename = "kronos_especificaciones.zip"

                                            try:
                                                print("Iniciando creación de archivos individuales...")
                                                    # Crear los archivos markdown individuales
                                                        for filename, content in files_to_create.items():
                                                                with open(filename, "w", encoding="utf-8") as f:
                                                                            f.write(content)
                                                                                    print(f" -> Archivo creado: {filename}")

                                                                                        print("\nComprimiendo archivos en zip...")
                                                                                            # Comprimir los archivos creados en el ZIP
                                                                                                with zipfile.ZipFile(zip_filename, 'w', zipfile.ZIP_DEFLATED) as zip_file:
                                                                                                        for filename in files_to_create.keys():
                                                                                                                    zip_file.write(filename)
                                                                                                                                print(f" -> {filename} agregado al zip.")

                                                                                                                                    print("\nLimpiando archivos temporales...")
                                                                                                                                        # Eliminar los archivos temporales de disco
                                                                                                                                            for filename in files_to_create.keys():
                                                                                                                                                    if os.path.exists(filename):
                                                                                                                                                                os.remove(filename)
                                                                                                                                                                            print(f" -> Archivo temporal eliminado: {filename}")

                                                                                                                                                                                print(f"\n¡Proceso terminado exitosamente! El archivo '{zip_filename}' ha sido creado.")

                                                                                                                                                                                except Exception as e:
                                                                                                                                                                                    print(f"\nOcurrió un error inesperado durante el proceso: {str(e)}")