# 🚀 Migración del backend KRONOS · Render → Koyeb

Guía paso a paso para mover `kronos-api` (Express + Socket.io) de Render a **Koyeb**
(gratis, sin tarjeta, sin que se duerma). El frontend sigue en Vercel.

> El repo ya incluye `server/Dockerfile` y `server/.dockerignore` listos para Koyeb.

---

## ⚠️ PASO 0 — Rescata tus secretos de Render (antes de borrar nada)

Tus claves reales (Mongo, Stripe, Cloudinary, email…) están SOLO en el panel de Render,
no en Git. **Cópialas antes de tocar nada:**

1. Entra a Render → tu servicio `kronos-api` → pestaña **Environment**.
2. Copia el valor de cada variable a un bloc de notas seguro. Son estas:

**Secretos que debes copiar (tienen valor real en Render):**
```
MONGODB_URI            JWT_SECRET             CLIENT_URL            SERVER_URL
SEED_SECRET            STRIPE_SECRET_KEY      STRIPE_WEBHOOK_SECRET
STRIPE_SOCIAL_PREMIUM_PRICE_ID    STRIPE_SCRIPTS_ESTANDAR_PRICE_ID
STRIPE_SCRIPTS_PREMIUM_PRICE_ID   STRIPE_SCRIPTS_PRO_PRICE_ID
STRIPE_MEDIA_ESTANDAR_PRICE_ID    STRIPE_MEDIA_PREMIUM_PRICE_ID
STRIPE_MEDIA_PRO_PRICE_ID         STRIPE_PLUS_PRICE_ID
STRIPE_PRO_PRICE_ID               STRIPE_BUSINESS_PRICE_ID
CLOUDINARY_CLOUD_NAME  CLOUDINARY_API_KEY     CLOUDINARY_API_SECRET
EMAIL_USER             EMAIL_PASSWORD         EMAIL_FROM
VAPID_PUBLIC_KEY       VAPID_PRIVATE_KEY      VAPID_SUBJECT
OPENAI_API_KEY         DEEPL_API_KEY          REDIS_URL (si lo usas)
GOOGLE_CLIENT_ID       GOOGLE_CLIENT_SECRET
FACEBOOK_APP_ID        FACEBOOK_APP_SECRET
INFURA_API_KEY         SEPOLIA_RPC_URL        PRIVATE_KEY    KRONOS_TOKEN_ADDRESS
```

**Variables con valor fijo (puedes ponerlas directo, no son secretas):**
```
NODE_ENV=production     LOG_LEVEL=info      JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com   EMAIL_PORT=587   EMAIL_SECURE=false
```

> ❗ **NO copies `PORT`.** Koyeb asigna el puerto solo; el código ya lo lee con `process.env.PORT`.

---

## PASO 1 — Crear el servicio en Koyeb

1. Ve a **https://www.koyeb.com** y crea una cuenta (puedes entrar con GitHub, no pide tarjeta).
2. **Create Web Service** → **GitHub** → autoriza y elige el repo `donovan-hue/kronos-super-app`, rama `main`.
3. **Builder:** selecciona **Dockerfile**.
   - **Work directory / build context:** `server`
   - **Dockerfile path:** `server/Dockerfile` (o `Dockerfile` si el contexto ya es `server`)
4. **Instance:** elige el tipo **Free** (Nano).
5. **Region:** la más cercana a tus usuarios (ej. Washington, DC o Frankfurt).
6. **Port:** `8000` (el que expone el Dockerfile y usa Koyeb por defecto).
7. **Health check:** tipo **TCP** al puerto `8000` (más fiable en el arranque que HTTP,
   porque `/api/health` responde 503 hasta que Mongo conecta).

---

## PASO 2 — Variables de entorno en Koyeb

En la sección **Environment variables** del servicio, agrega TODAS las del Paso 0
(las secretas con su valor real + las fijas). Pega cada nombre y su valor.

> Cuando ya tengas la URL pública de Koyeb (Paso 3), vuelve y ajusta:
> - `SERVER_URL` = la URL de Koyeb (ej. `https://kronos-api-tuorg.koyeb.app`)
> - `CLIENT_URL` = tu dominio de Vercel (para que el CORS deje pasar al frontend)

---

## PASO 3 — Desplegar y obtener la URL

1. Pulsa **Deploy**. Koyeb construirá la imagen y arrancará (tarda ~2-4 min).
2. Te dará una URL pública tipo: `https://kronos-api-tuorg.koyeb.app`
3. Pruébala en el navegador: `https://kronos-api-tuorg.koyeb.app/api/health`
   - Debe responder estado del servidor (200 si Mongo conectó).

---

## PASO 4 — Apuntar el frontend (Vercel) al nuevo backend

1. Vercel → tu proyecto → **Settings → Environment Variables**.
2. Cambia (o crea):
   ```
   REACT_APP_API_URL = https://kronos-api-tuorg.koyeb.app/api
   ```
   > El cliente deriva la URL de Socket.io de esta misma variable (le quita `/api`),
   > así que con esto basta para API **y** websockets.
3. **Redeploy** el frontend en Vercel para que tome el nuevo valor.

---

## PASO 5 — Stripe (si cobras pagos)

El webhook de Stripe apuntaba a Render. Cámbialo:
1. Dashboard de Stripe → **Developers → Webhooks** → tu endpoint.
2. Actualiza la URL al nuevo backend: `https://kronos-api-tuorg.koyeb.app/api/<ruta-del-webhook>`.
3. Si Stripe genera un nuevo *signing secret*, actualiza `STRIPE_WEBHOOK_SECRET` en Koyeb.

---

## PASO 6 — Verificar y apagar Render

1. Prueba en tu sitio: login, feed, chat/Live (websockets), wallet.
2. Cuando TODO funcione contra Koyeb, recién entonces **suspende o borra** el servicio en Render.

---

## Notas
- **Autodeploy:** Koyeb redepliega solo en cada push a `main` (igual que hacía Render).
- **render.yaml** puede quedarse en el repo como referencia; ya no se usa.
- Si el build falla, revisa los **Logs** del deploy en Koyeb — casi siempre es una variable
  faltante o un valor mal pegado.
