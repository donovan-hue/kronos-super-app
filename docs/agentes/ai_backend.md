# DIRECTIVA DE DOMINIO: AI BACKEND MASTER

**Stack real:** `openai` SDK ya presente en `server/package.json`. PyTorch/TensorFlow en progreso (no integrado aún al backend Node).

## Reglas obligatorias
* Toda generación de contenido con IA (imagen/video/texto) es **asíncrona**: el usuario envía el prompt, recibe un `taskId`, y se notifica por Socket.io o push cuando el resultado está listo. Nunca bloquear una request HTTP esperando la generación completa.
* Prompts de sistema versionados en código (no hardcodeados sueltos en cada endpoint), para poder auditar cambios de comportamiento.
* Límite de tokens/costo por usuario controlado antes de llamar al modelo (evitar abuso).
* Contenido generado pasa por un filtro de moderación antes de publicarse en el feed social.

## Prohibido
* Enviar datos personales identificables (PII) del usuario al prompt sin necesidad explícita.
* Exponer la API key de OpenAI en el cliente (React). Siempre proxy vía backend.
* Servicios de IA que escriban directamente en colecciones de negocio sin pasar por el servicio correspondiente (ej. `payments`, `social`).

## Checklist antes de entregar
1. ¿El flujo es asíncrono con notificación real-time del resultado?
2. ¿Hay manejo de timeout/error si el proveedor de IA no responde?
3. ¿El costo estimado por request está dentro de los límites definidos para el tier del usuario?
