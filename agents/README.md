# KRONOS Agent System

Sistema de 3 agentes autónomos que analizan, planifican e implementan mejoras al proyecto de forma continua.

## Agentes

| Agente | Archivo | Rol |
|--------|---------|-----|
| **Task Master** | `task-master.js` | Analiza el proyecto, detecta gaps y genera cola de tareas priorizada en `tasks.json` |
| **Builder Alpha** | `builder-alpha.js` | Implementa features y mejoras de UX/API pendientes |
| **Pelos** | `pelos.js` | Implementa seguridad, tests y auto-detecta problemas comunes |

## Uso

```powershell
# Ciclo completo (recomendado)
node agents/orchestrator.js

# Ver estado actual de la cola
node agents/orchestrator.js --status

# Solo generar tareas
node agents/orchestrator.js --plan

# Solo correr Builder Alpha
node agents/orchestrator.js --build

# Solo correr Pelos
node agents/orchestrator.js --fix

# Correr hasta vaciar la cola
node agents/orchestrator.js --all

# Dry run (no escribe archivos)
node agents/orchestrator.js --dry
```

## Cola de tareas (`tasks.json`)

El Task Master genera tareas con estos estados:

- `pending` — esperando ser ejecutada
- `in_progress` — siendo implementada ahora
- `done` — completada
- `error` — falló, revisar `notes`
- `needs_human` — requiere implementación manual

## Tipos de tareas

| Tipo | Agente | Descripción |
|------|--------|-------------|
| `security` | Pelos | Rate limiting, helmet, validaciones |
| `test` | Pelos | Smoke tests, unit tests |
| `feature` | Builder Alpha | Nuevas funcionalidades |
| `improvement` | Builder Alpha | Mejoras de UX, performance, API |

## Logs

- `agents/logs/orchestrator.log`
- `agents/logs/builder-alpha.log`
- `agents/logs/pelos.log`
- `agents/logs/completed.json` — historial de tareas completadas

## Agregar tareas custom

Edita `task-master.js` → array `TASK_CATALOG` y agrega tu tarea:

```js
{
  id: 'feat-mi-feature',          // único, kebab-case
  type: 'feature',                // feature | improvement | security | test
  priority: 3,                    // 1=urgente, 10=backlog
  title: 'Nombre descriptivo',
  description: 'Qué hace y por qué',
  files: ['client/src/...'],      // archivos involucrados
  acceptance: ['criterio 1'],     // cómo saber que está listo
}
```

Para que Builder Alpha lo implemente automáticamente, agrega también una entrada en `IMPLEMENTATIONS` de `builder-alpha.js`:

```js
'feat-mi-feature': () => {
  writeFile('client/src/...', `código aquí`);
}
```

## Próximas tareas en cola

Corre `node agents/orchestrator.js --status` para ver el estado actual.
