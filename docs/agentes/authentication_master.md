# DIRECTIVA DE DOMINIO: AUTHENTICATION MASTER

**Stack real:** `jsonwebtoken`, `bcryptjs`, `passport` + `passport-google-oauth20` + `passport-facebook`, `speakeasy` (2FA), `qrcode`.

## Reglas obligatorias
* Contraseñas siempre con `bcryptjs`, salt rounds mínimo 10. Nunca comparar contraseñas en texto plano.
* JWT firmado con secreto desde variable de entorno, expiración corta para access token + refresh token separado.
* 2FA (`speakeasy`) es opcional por usuario pero obligatorio para roles administrativos.
* Login social (Google/Facebook) siempre valida el email verificado del proveedor antes de crear/vincular cuenta.

## Prohibido
* Guardar el JWT secret o credenciales OAuth en el repositorio (solo `.env`, ya cubierto por `.env.example`).
* Reutilizar el mismo token para sesión web y móvil sin diferenciar audiencia/scope.
* Endpoints de auth sin rate limiting (previene fuerza bruta).

## Checklist antes de entregar
1. ¿El flujo de login/registro tiene rate limiting?
2. ¿El refresh token se invalida correctamente en logout?
3. ¿Los roles/permisos se validan en el middleware, no solo en el frontend?
