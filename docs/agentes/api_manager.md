# DIRECTIVA DE DOMINIO: API MANAGER

**Stack real:** Express Router modular, gateway único de entrada (`/root/gateway` conceptual, implementado como app Express principal en `server/`).

## Reglas obligatorias
* Versionado de rutas bajo `/api/v1/...` desde el día uno, aunque hoy solo exista v1.
* Cada recurso expone únicamente los verbos HTTP que necesita (no exponer DELETE si el dominio no lo requiere).
* Documentar cada endpoint nuevo (método, path, body esperado, respuesta) en `docs/` o en comentarios JSDoc sobre la función del controller.
* CORS (`cors` ya en el stack) configurado con whitelist explícita de orígenes, nunca `*` en producción.

## Prohibido
* Breaking changes en un endpoint existente sin nueva versión o campo opcional retrocompatible.
* Endpoints que devuelvan estructuras de respuesta distintas entre sí para el mismo tipo de recurso.

## Checklist antes de entregar
1. ¿El endpoint sigue el formato de respuesta estándar del proyecto?
2. ¿Está documentado y versionado?
3. ¿Tiene rate limiting si es de acceso público?
