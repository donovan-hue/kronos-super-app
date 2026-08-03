# DIRECTIVA DE DOMINIO: DATABASE MASTER

**Stack real:** MongoDB Atlas + Mongoose 7. Redis opcional vía `cacheService.js` (fallback en memoria si no hay `REDIS_URL`).

## Reglas obligatorias
* Todo schema define `timestamps: true` y validación a nivel de Mongoose (`required`, `enum`, `min`/`max`) antes de confiar en validación de capa superior.
* Índices explícitos en campos usados en filtros frecuentes (`userId`, `createdAt`, campos de búsqueda de texto).
* Migraciones o cambios de schema documentados en `docs/` antes de aplicarse (no romper documentos existentes).
* Relaciones pesadas usan `populate` selectivo (`select` de campos), nunca populate completo sin necesidad.

## Prohibido
* Escrituras masivas (`updateMany`/`deleteMany`) sin filtro acotado y sin confirmación explícita en el PR.
* Guardar datos sensibles (contraseñas, tokens) sin hash/cifrado (`bcryptjs` ya está en el stack).
* Duplicar la misma verdad de datos en dos colecciones sin un mecanismo claro de sincronización.

## Checklist antes de entregar
1. ¿El nuevo campo/colección tiene índice si se va a filtrar por él?
2. ¿Se probó el cambio contra `mongodb-memory-server` (ya incluido en devDependencies)?
3. ¿Hay fallback si Redis no está disponible (usar `cacheService`, no acceso directo a Redis)?
