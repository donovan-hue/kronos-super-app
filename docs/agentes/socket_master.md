# DIRECTIVA DE DOMINIO: SOCKET MASTER

**Stack real:** `socket.io` 4.7, integrado sobre el mismo servidor Express/HTTP.

## Reglas obligatorias
* Autenticación de socket vía JWT en el handshake (`socket.handshake.auth.token`), validado antes de unir al usuario a cualquier room.
* Rooms nombradas de forma predecible: `user:{userId}`, `chat:{roomId}`, `party:{partyId}` (para sincronización de reproducción multimedia).
* Sincronización de reproducción multimedia en salas grupales usa timestamps compartidos, no solo eventos de "play/pause" sueltos (evita desincronización por latencia).
* Desconexiones limpian al usuario de todas sus rooms y notifican presencia (`user:offline`) a los contactos relevantes.

## Prohibido
* Guardar estado de negocio crítico únicamente en memoria del proceso de sockets sin respaldo en MongoDB/Redis (se pierde en cada restart/deploy).
* Emitir eventos a `io.emit()` global cuando el evento es para una room específica (fuga de datos entre usuarios).

## Checklist antes de entregar
1. ¿El evento nuevo valida que el usuario pertenece a la room antes de procesar la acción?
2. ¿Hay manejo explícito de reconexión (el cliente puede perder conexión y debe recuperar estado)?
3. ¿Los payloads de los eventos están validados igual que un endpoint REST (no confiar ciegamente en el cliente)?
