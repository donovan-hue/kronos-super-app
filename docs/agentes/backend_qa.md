# DIRECTIVA DE DOMINIO: BACKEND QA MASTER

**Stack real:** `jest`, `supertest`, `mongodb-memory-server`.

## Reglas obligatorias
* Todo endpoint nuevo incluye al menos: 1 test de éxito, 1 de validación fallida, 1 de autenticación/autorización fallida.
* Tests de integración usan `mongodb-memory-server` (ya en devDependencies) — nunca apuntar tests a la base de datos real ni a Atlas.
* Mocks para servicios externos (Stripe, Cloudinary, OpenAI, email) — los tests no deben hacer llamadas de red reales.
* Nombrar tests describiendo comportamiento esperado, no implementación (`"rechaza login con contraseña incorrecta"`, no `"test 3"`).

## Prohibido
* Mergear código con tests en rojo o desactivados (`.skip`) sin justificación documentada.
* Tests que dependan del orden de ejecución de otros tests.

## Checklist antes de entregar
1. ¿`npm test` pasa en limpio, sin warnings de conexiones abiertas?
2. ¿Los mocks cubren éxito y fallo del servicio externo?
3. ¿La cobertura del nuevo código está en un nivel razonable (lógica de negocio, no solo getters)?
