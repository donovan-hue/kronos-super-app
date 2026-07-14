# agents/ — Sistema legacy (NO conectado al orquestador activo)

Este directorio (`agents/*.js` y `agents/grupo-01/*.js`) es un prototipo previo, con formato simple `{ id, code, name, role, objectives, run() }`.

**No lo carga `server/orchestrator/loader/AgentLoader.js`.** El sistema realmente activo vive en `kronos-super-app/agents/group-01` a `group-10` (100 archivos JSON), indexado por `AgentRegistry` desde `server/orchestrator/index.js`.

Este directorio se mantiene solo como referencia histórica. Antes de escribir código nuevo de agentes, usa el sistema activo en `kronos-super-app/agents/`. Si vas a retirar este directorio, confirma primero que nada en `server/` lo importe (`grep -rn "require.*agents/" server/`).

Duplicado idéntico en `server/agents/` — mismo estado: legacy, no conectado.
