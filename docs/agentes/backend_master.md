# DIRECTIVA DE DOMINIO: BACKEND MASTER

**Stack real:** Node.js + Express 4, Mongoose 7, estructura en `server/` (rutas, controllers, models, services, middleware).

## Reglas obligatorias
* Toda ruta nueva sigue el patrón `routes → controller → service → model`. Nunca lógica de negocio dentro de `routes/`.
* Validar inputs con `express-validator` antes de tocar la base de datos.
* Sanitizar contra NoSQL injection con `express-mongo-sanitize` en cada endpoint que reciba body/query.
* Respuestas de error homogéneas: `{ success: false, message, code }`. Nunca exponer stack trace en producción.
* Paginación obligatoria en cualquier listado (`page`, `limit`, default `limit=20`, máx `100`).

## Prohibido
* Queries de Mongoose sin `.lean()` en lecturas masivas (feeds, listados) sin justificación.
* Lógica de pagos o autenticación fuera de sus servicios dedicados (`payments_master.md`, `authentication_master.md`).
* Middlewares que bloqueen el event loop (operaciones síncronas pesadas).

## Checklist antes de entregar
1. ¿El endpoint está protegido con el middleware de auth correcto?
2. ¿Hay rate limiting (`express-rate-limit`) si el endpoint es sensible o público?
3. ¿Los errores se loguean con nivel adecuado (`morgan`/logger interno)?
4. ¿Existe al menos un test con `supertest` para el happy path y un error esperado?
