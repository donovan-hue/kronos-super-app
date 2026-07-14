# ESPECIFICACIÓN: AGENTE ANALISTA DE DATOS (KDA-02)

## SECCIÓN 1: Identificación y Metadatos de Identidad
* **Nombre:** Kronos Data Analyst.
* **ID:** `KDA-02`
* **Rol dentro de Kronos:** Analista especializado en lectura de MongoDB, generación de reportes y procesamiento de ficheros planos (CSV/XLSX).
* **Misión principal:** Ejecutar agregaciones y lecturas analíticas de forma aislada y segura, garantizando la privacidad de datos personales (PII).
* **Límites de actuación:** Prohibido realizar `insertMany`, `updateMany`, `deleteMany` o cualquier escritura en colecciones de negocio de producción. Solo lectura.

## SECCIÓN 2: Interfaz, I/O y Mensajería
* **Entradas:**
  * Evento interno `task:assigned` (destino `KDA-02`).
  * Archivos temporales CSV/XLSX subidos vía `multer`.
* **Salidas:**
  * Evento `task:step-completed` o `task:step-failed`.
  * Socket.io evento `analysis:progress` (ej. "45% procesado").

## SECCIÓN 3: Arquitectura Interna y Ciclo de Vida
* **Arquitectura:** Servicio Node.js aislado que usa streams nativos (`fs.createReadStream`) para no cargar archivos completos en RAM.
* **Ciclo de vida:** Conexión a réplica de solo lectura de MongoDB si existe (`MONGO_READONLY_URI`); si no, usa la conexión principal con rol restringido. Limpieza de buffers y cierre de archivos abiertos al finalizar.

## SECCIÓN 4: IA, Modelos y Prompts
* **Modelos recomendados:** `gpt-4o-mini` (estructuración de queries y mapeo de campos), Claude (interpretación analítica de reportes numéricos).
* **Prompt del Sistema:** Debe bloquear la generación de sentencias mutadoras y forzar anonimización activa de campos PII (email, teléfono, dirección).

## SECCIÓN 5: Estado, Memoria y Persistencia
* **Persistencia:** Reportes en Markdown + metadatos estadísticos en colección `analysis_reports` (MongoDB).
* **Caché:** `cacheService.js` para agregaciones costosas (TTL 300s).

## SECCIÓN 6: Seguridad, Permisos y Cumplimiento
* **Seguridad:** Credenciales con rol `KRONOS_READONLY_ROLE`. Sanitización de operadores peligrosos de MongoDB (`$where`, `$accumulator`) antes de ejecutar cualquier query dinámica.

## SECCIÓN 7: Control de Recursos, Resiliencia y Errores
* **Recursos:** Límite de memoria de 512 MB por proceso. Si el dataset supera 5,000 filas, cambia automáticamente a modo streaming secuencial.

## SECCIÓN 8: Monitoreo, Logs y Trazabilidad
* **Logs:** Nivel INFO para inicio/fin de análisis, WARN si se detecta PII sin anonimizar, ERROR en fallos de lectura. Correlación por `planId` recibido del KTO-01.
