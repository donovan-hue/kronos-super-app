# ESPECIFICACIÓN: AGENTE ORQUESTADOR DE TAREAS (KTO-01)

> Nota de corrección: este archivo contenía un script Python sin ejecutar (generaba este mismo documento en tiempo de build). Se reemplaza por la especificación final, adaptada al stack real del proyecto (Express + Mongoose + Socket.io, no NestJS/BullMQ).

## SECCIÓN 1: Identificación y Metadatos de Identidad
* **Nombre:** Kronos Task Orchestrator.
* **ID:** `KTO-01`
* **Rol dentro de Kronos:** Distribuidor jerárquico y supervisor del ciclo de vida de los 100 agentes especialistas (`kronos-super-app/agents/group-01` a `group-10`).
* **Misión principal:** Traducir peticiones complejas en un plan de tareas (DAG), asignarlas al agente idóneo vía `AgentRegistry` y garantizar consistencia ante fallos.
* **Decisiones autónomas:** Reasignación de tareas por caída de un agente, control de cuotas por usuario, selección de modelo de IA (costo vs. rendimiento).
* **Límites de actuación:** No modifica datos de dominio de otros servicios directamente; no autoriza transacciones financieras sin confirmación humana; no expone credenciales de infraestructura.

## SECCIÓN 2: Interfaz, I/O y Mensajería
* **Entradas:**
  * REST `POST /api/orchestrator/plans` (instrucciones de usuario).
  * Socket.io evento `task:submit` (instrucciones interactivas).
  * Canal interno `agent:status:heartbeat` (telemetría de agentes vía `cacheService`).
* **Salidas:**
  * Respuesta HTTP del plan de ejecución con `planId`.
  * Socket.io evento `task:progress` (avance en tiempo real).
  * Evento interno `task:assigned` (carga de trabajo hacia el especialista).

## SECCIÓN 3: Arquitectura Interna y Ciclo de Vida
* **Arquitectura:** Módulo Node.js/Express montado sobre `server/orchestrator/` (`ExecutionEngine`, `GoalPlanner`, `TaskQueue`, `WorkflowEngine`, `AgentRegistry`, `AgentLoader`).
* **Carga de agentes:** `AgentLoader` lee `kronos-super-app/agents/group-0X/agent_0XX.json` (100 archivos) y los indexa en `AgentRegistry` por `id` y `group`.
* **Máquina de estados:** Idle → Analizando → Ejecutando Plan → Esperando Respuestas → Fin / Error / Recuperación.
* **Ciclo de vida:** Inicialización al arrancar `server/index.js`; apagado controlado liberando conexiones activas (máx. 10s).

## SECCIÓN 4: IA, Modelos y Prompts
* **Modelos recomendados:** `gpt-4o` (planes complejos), `gpt-4o-mini` (sub-tareas simples y validaciones), integrados vía el paquete `openai` ya presente en `server/package.json`.
* **Prompt del Sistema:** Debe forzar salida JSON estricta describiendo pasos y dependencias del plan.

## SECCIÓN 5: Estado, Memoria y Persistencia
* **Persistencia:** MongoDB (Mongoose) para planes de ejecución y auditoría de estados.
* **Caché:** `cacheService.js` — Redis si `REDIS_URL` existe, con fallback automático a `Map` en memoria (TTL 60s para estados rápidos).

## SECCIÓN 6: Seguridad, Permisos y Cumplimiento
* **Seguridad:** Validación de JWT (`jsonwebtoken`) con rol `ADMIN` o `SYSTEM_ORCHESTRATOR`. Secretos temporales cifrados con AES-256-GCM antes de persistir.

## SECCIÓN 7: Control de Recursos, Resiliencia y Errores
* **Resiliencia:** Acciones compensatorias automáticas si un paso crítico del plan falla de forma definitiva (patrón Saga simplificado, sin dependencia de BullMQ). Reintentos con backoff exponencial.

## SECCIÓN 8: Monitoreo, Logs y Trazabilidad
* **Logs:** Estructurados en JSON. Inyección obligatoria de `x-correlation-id` en cada llamada REST y evento Socket.io para trazabilidad entre servicios.
