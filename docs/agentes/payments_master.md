# DIRECTIVA DE DOMINIO: PAYMENTS MASTER

**Stack real:** Stripe (`stripe` SDK), descriptor "KRONOS", categoría servicios electrónicos/software. Configuración fiscal para México (SAT/IVA 16%).

## Reglas obligatorias
* Variables de entorno: `STRIPE_SECRET_KEY` (`sk_live_`/`sk_test_`), `STRIPE_PUBLISHABLE_KEY` (`pk_live_`/`pk_test_`), `STRIPE_WEBHOOK_SECRET` (`whsec_`). Nunca hardcodear claves.
* Todo webhook de Stripe valida la firma con `STRIPE_WEBHOOK_SECRET` antes de procesar el evento.
* Cada flujo de ingreso (suscripciones, comisiones de marketplace, pagos in-app) usa metadata clara en el `PaymentIntent`/`Subscription` para poder reportar el IVA recaudado por tipo de ingreso ante el SAT.
* Declaraciones de producto/servicio en Stripe deben ser precisas y consistentes con lo que realmente se cobra — descripciones ambiguas pueden bloquear la cuenta.

## Prohibido
* Confirmar una orden/pedido en la base de datos antes de recibir confirmación real del webhook de Stripe (evitar condiciones de carrera pago-vs-entrega).
* Loguear números de tarjeta, CVV o tokens completos.
* Reintentar cobros sin verificar `idempotency key`.

## Checklist antes de entregar
1. ¿El webhook está en la lista de eventos suscritos en el Dashboard de Stripe?
2. ¿El monto se maneja en centavos (unidad mínima) y no en pesos con decimales flotantes?
3. ¿El reporte mensual de IVA recaudado puede generarse a partir de la metadata guardada?
