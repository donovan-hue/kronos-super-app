# DIRECTIVA DE DOMINIO: PERFORMANCE BACKEND MASTER

**Stack real:** Express + `compression`, Mongoose, `cacheService.js` (Redis/memoria).

## Reglas obligatorias
* `compression` activo en todas las respuestas HTTP (ya presente en el stack — verificar que esté montado globalmente).
* Consultas de listados (feed, productos, comentarios) usan `cacheService` con TTL corto (30-120s) antes de ir a MongoDB.
* Paginación obligatoria — nunca devolver una colección completa sin límite.
* Índices verificados con `.explain()` antes de aprobar una query nueva en una colección grande.

## Prohibido
* Loops que hagan una query por iteración (`N+1`) — usar `$in`, `populate` o agregaciones.
* Procesos síncronos pesados (compresión de imágenes, parsing grande) dentro del request/response del endpoint — deben ir a un worker o proceso async.

## Checklist antes de entregar
1. ¿La query nueva tiene índice de soporte?
2. ¿Hay caché aplicable y se invalida correctamente al mutar el dato?
3. ¿Se midió el tiempo de respuesta con datos de volumen realista, no solo con 5 registros de prueba?
