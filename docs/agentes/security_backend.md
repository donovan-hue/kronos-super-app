# DIRECTIVA DE DOMINIO: SECURITY BACKEND MASTER

**Stack real:** `helmet`, `express-mongo-sanitize`, `xss-clean`, `express-rate-limit`, `cors`.

## Reglas obligatorias
* `helmet` montado globalmente en la app Express (cabeceras de seguridad por defecto).
* Todo input de usuario pasa por `express-mongo-sanitize` y `xss-clean` antes de tocar la base de datos o renderizarse.
* Rate limiting obligatorio en: login, registro, recuperación de contraseña, webhooks públicos, endpoints de pagos.
* Secretos y claves solo en variables de entorno (`.env`, nunca en el repo). `.env.example` documenta las claves necesarias sin valores reales.
* CORS con whitelist explícita de dominios permitidos (frontend en Vercel, backend en Render).

## Prohibido
* Exponer mensajes de error internos (stack traces, rutas de archivo, versión de librerías) al cliente en producción.
* Endpoints administrativos sin doble verificación de rol además del JWT.
* Subida de archivos (`multer`) sin validar tipo MIME y tamaño máximo.

## Checklist antes de entregar
1. ¿El endpoint nuevo está cubierto por `helmet`, sanitización y rate limiting según corresponda?
2. ¿Los uploads validan tipo y tamaño antes de subir a Cloudinary?
3. ¿Se revisó que no haya secretos o tokens en logs?
