ng# 🚀 KRONOS SUPER APP - GUÍA DE DEPLOYMENT PASO A PASO
# Esta guía está en ESPAÑOL y es MUY FÁCIL de seguir
# 🚀 KRONOS SUPER APP - GUÍA DE DEPLOYMENT DEFINITIVA

Guía unificada para desplegar la aplicación en un entorno de producción moderno y gratuito.

---

## 📋 RESUMEN RÁPIDO

Tu app tiene 2 partes:
- **BACKEND** (Node.js) → Deploy en **RENDER**
- **FRONTEND** (React) → Deploy en **VERCEL**
La aplicación se divide en dos partes que se despliegan por separado:
- **Frontend (Client):** En **Vercel**. Ideal para aplicaciones React, con deploys automáticos y CDN global.
- **Backend (Server):** En **Koyeb**. Potente y gratuito, soporta Docker de forma nativa, lo que garantiza consistencia del entorno.

**Tiempo total: 30-45 minutos**
**Tiempo total estimado: 25-35 minutos**

---

## ✅ PRE-REQUISITOS

Tienes que tener estas 5 cosas ANTES de empezar:
Antes de empezar, asegúrate de tener cuentas en los siguientes servicios (todos tienen un plan gratuito generoso):

- ✅ Cuenta en **GitHub** (ya tienes)
- ✅ Cuenta en **MongoDB Atlas** (ya tienes)
- ✅ Cuenta en **Cloudinary** (ya tienes)
- ✅ Cuenta en **Stripe** (ya tienes)
- ⭕ Cuenta en **RENDER** (crearemos ahora)
- ⭕ Cuenta en **VERCEL** (crearemos ahora)
- **GitHub:** Para alojar tu código.
- **Vercel:** Para el frontend. (Regístrate con tu cuenta de GitHub).
- **Koyeb:** Para el backend. (Regístrate con tu cuenta de GitHub).
- **MongoDB Atlas:** Para la base de datos.
- **Cloudinary:** Para el almacenamiento de imágenes y videos.
- **Stripe:** Para procesar pagos.

---

# 🎯 FASE 1: CREAR CUENTAS (5 minutos)
## 🌐 FASE 1: DEPLOY DEL BACKEND EN KOYEB (15 minutos)

## Paso 1: Crear Cuenta en RENDER
El repositorio ya incluye un `Dockerfile` en la carpeta `server/`, que le dice a Koyeb cómo construir y ejecutar tu backend.

1. Ve a https://render.com
2. Click en "Sign Up"
3. Selecciona "Continue with GitHub"
4. Autoriza el acceso
5. ✅ LISTO - Ya tienes cuenta en Render
### Paso 1: Crear el Servicio Web en Koyeb

## Paso 2: Crear Cuenta en VERCEL
1.  Entra a tu Dashboard de Koyeb.
2.  Haz clic en **Create Web Service**.
3.  Elige **GitHub** como método de despliegue.
4.  Selecciona tu repositorio `kronos-super-app`.
5.  En la sección **Builder**, elige **Dockerfile**.
    -   Asegúrate que el `Dockerfile path` apunte a `server/Dockerfile`.
6.  **Puerto (Port):** `8000`.
7.  **Variables de Entorno:** En la sección `Environment variables`, haz clic en `Import from .env.example` y sube el archivo `server/.env.example` que he creado. Luego, rellena los valores secretos que obtuviste de MongoDB, Stripe, Cloudinary, etc.
8.  Haz clic en **Deploy**.

1. Ve a https://vercel.com
2. Click en "Sign Up"
3. Selecciona "Continue with GitHub"
4. Autoriza el acceso
5. ✅ LISTO - Ya tienes cuenta en Vercel
### Paso 2: Obtener la URL del Backend

---
Una vez que el despliegue termine, Koyeb te dará una URL pública, algo como: `https://kronos-api-tu-organizacion.koyeb.app`.

# 🌐 FASE 2: DEPLOY DEL BACKEND EN RENDER (15 minutos)
**Copia esta URL.** La necesitarás para el frontend y para actualizar la variable `SERVER_URL` en Koyeb.

## Paso 1: Ir a Render y Crear Web Service
---

1. Entra en https://render.com/dashboard
2. Click en **"New +"** → **"Web Service"**
3. Selecciona tu repositorio **"KRONOS-SUPER-APP"**
4. Click "Connect"
## 🎨 FASE 2: DEPLOY DEL FRONTEND EN VERCEL (10 minutos)

## Paso 2: Configurar el Servicio
### Paso 1: Importar el Proyecto en Vercel

Rellena los campos así:
1.  Entra a tu Dashboard de Vercel.
2.  Haz clic en **Add New...** → **Project**.
3.  Selecciona tu repositorio `kronos-super-app` y haz clic en **Import**.

```
Name: kronos-backend
Environment: Node
Region: Ohio (o la más cercana a ti)
Branch: main (o la que uses)
Root Directory: server
Build Command: npm install
Start Command: npm start
```
### Paso 2: Configurar el Proyecto

## Paso 3: Agregar Variables de Entorno
Vercel detectará que es una aplicación React. Solo asegúrate de lo siguiente:
-   **Root Directory:** Cambia la ruta a `client`.

En la sección **"Environment Variables"**, agrega TODAS estas:
### Paso 3: Agregar Variables de Entorno

```
MONGODB_URI = tu_url_de_mongodb_atlas
JWT_SECRET = una_clave_muy_larga_y_aleatoria
CLIENT_URL = https://tu-app.vercel.app
CLOUDINARY_NAME = tu_nombre_cloudinary
CLOUDINARY_API_KEY = tu_api_key
CLOUDINARY_API_SECRET = tu_api_secret
STRIPE_PUBLIC_KEY = pk_test_...
STRIPE_SECRET_KEY = sk_test_...
```
En la sección **Environment Variables**, agrega las siguientes (usa el archivo `client/.env.example` como guía):

⚠️ **IMPORTANTE:** NO dejes espacios antes/después de los valores
```ini
# Pega la URL que te dio Koyeb, seguida de /api
REACT_APP_API_URL = https://kronos-api-tu-organizacion.koyeb.app/api

## Paso 4: Deploy

1. Click en **"Create Web Service"**
2. Espera a que salga la URL (3-5 minutos)
3. Verás algo como: `https://kronos-backend.onrender.com`
4. **Copia esta URL** (la necesitarás para Vercel)

✅ **Tu backend está en vivo!**

---

# 🎨 FASE 3: DEPLOY DEL FRONTEND EN VERCEL (10 minutos)

## Paso 1: Ir a Vercel e Importar Proyecto

1. Ve a https://vercel.com/dashboard
2. Click en **"Add New"** → **"Project"**
3. Click **"Import an Existing Project"**
4. Selecciona **"KRONOS-SUPER-APP"**
5. Click "Import"

## Paso 2: Configurar el Proyecto

```
Framework Preset: Create React App
Root Directory: client
```

## Paso 3: Agregar Variables de Entorno

Click en **"Environment Variables"** y agrega:

```
REACT_APP_API_URL = https://kronos-backend.onrender.com/api
REACT_APP_SOCKET_URL = https://kronos-backend.onrender.com
# La clave pública de Stripe (la que empieza con pk_test_...)
REACT_APP_STRIPE_PUBLIC_KEY = pk_test_...
```

⚠️ Reemplaza `kronos-backend.onrender.com` con tu URL real de Render
### Paso 4: Desplegar

## Paso 4: Deploy
1.  Haz clic en **Deploy**.
2.  Vercel construirá y desplegará tu frontend. Al finalizar, te dará la URL pública de tu aplicación, como: `https://kronos-super-app.vercel.app`.

1. Click **"Deploy"**
2. Espera a que se compile (2-3 minutos)
3. Verás algo como: `https://kronos-app.vercel.app`
---

✅ **¡Tu app está EN VIVO!**

---

# 🧪 FASE 4: PROBAR QUE TODO FUNCIONA (5 minutos)
## 🔗 FASE 3: CONEXIÓN FINAL (5 minutos)

## Test 1: Verificar Frontend
1.  **Actualizar CORS en el Backend:**
    -   Vuelve a la configuración de tu servicio en Koyeb.
    -   En las variables de entorno, busca `CLIENT_URL` y pon la URL de tu app en Vercel (ej: `https://kronos-super-app.vercel.app`).
    -   Guarda los cambios. Koyeb se redesplegará automáticamente.

1. Abre https://kronos-app.vercel.app (tu URL de Vercel)
2. Deberías ver tu app cargada
3. ✅ Si la ves = FUNCIONA
2.  **Probar la Aplicación:**
    -   Abre la URL de Vercel en tu navegador.
    -   Intenta registrar un usuario nuevo.
    -   Si el registro funciona, ¡la conexión entre frontend, backend y base de datos es correcta!

## Test 2: Verificar Backend
✅ **¡Felicidades! Tu Super-App está en vivo y funcionando.**

1. Abre en el navegador: `https://kronos-backend.onrender.com/api/health`
2. Deberías ver una respuesta JSON
3. ✅ Si ves JSON = FUNCIONA

## Test 3: Verificar Conexión BD

1. Intenta registrarte en la app
2. Si funciona el registro = BD está conectada
3. ✅ LISTO

---

# 🆘 SOLUCIONAR PROBLEMAS

## ❌ Error: "Cannot find module"

**Solución:**
```bash
cd server
npm install
cd ../client
npm install
```

Luego push a GitHub nuevamente:
```bash
git add .
git commit -m "fix: install dependencies"
git push
```

Render/Vercel se redeploy automáticamente.

## ❌ Error: "CORS error" o "Cannot connect to API"

**Solución:**
1. Verifica que `CLIENT_URL` en Render sea tu URL de Vercel
2. Verifica que `REACT_APP_API_URL` en Vercel sea tu URL de Render
3. Espera 2 minutos y recarga
1.  Asegúrate de que la variable `CLIENT_URL` en Koyeb sea exactamente la URL de tu app en Vercel, sin ` /` al final.
2.  Verifica que `REACT_APP_API_URL` en Vercel apunte a tu backend de Koyeb y termine en `/api`.
3.  Espera a que los servicios se redesplieguen después de cambiar las variables.

## ❌ Error: "MongoDB connection failed"

**Solución:**
1. Verifica que `MONGODB_URI` es correcta
2. En MongoDB Atlas, ve a Network Access
3. Agrega IP address: `0.0.0.0/0` (permite todas)
1.  Verifica que la variable `MONGODB_URI` en Koyeb sea la correcta.
2.  En MongoDB Atlas, ve a `Network Access` y asegúrate de haber añadido la IP `0.0.0.0/0` para permitir conexiones desde cualquier lugar (incluido Koyeb).

## ❌ Error: "Stripe payment failed"

**Solución:**
1. Verifica que estés en MODO TEST
2. Usa tarjeta de prueba: `4242 4242 4242 4242`
3. Verifica que `STRIPE_PUBLIC_KEY` y `STRIPE_SECRET_KEY` son correctas

---

# 📊 MONITOREO Y LOGS

## Ver logs de Render (Backend)

1. Ve a https://render.com/dashboard
2. Selecciona tu web service
3. Click en **"Logs"**
4. Ves todo lo que pasa en tu backend

## Ver logs de Vercel (Frontend)

1. Ve a https://vercel.com/dashboard
2. Selecciona tu proyecto
3. Click en **"Deployments"**
4. Selecciona el deployment
5. Click en **"Runtime Logs"**

---

# 🔄 HACER CAMBIOS Y REDEPLOY

Cada vez que hagas cambios en tu código:

```bash
git add .
git commit -m "descripcion del cambio"
git push
```

**Automáticamente:**
- Render detecta el push y redeploy del backend
- Vercel detecta el push y redeploy del frontend

No tienes que hacer nada más! ✨

---

# 🎉 ¡LISTO!

Tu app KRONOS ya está en vivo en:

**Frontend:** https://tu-app.vercel.app
**Backend:** https://tu-backend.onrender.com

---

## 💬 Preguntas?

Si algo no funciona:
1. Chequea los logs (ver sección "Monitoreo")
2. Verifica que todas las variables de entorno estén correctas
3. Espera 2-3 minutos (a veces tarda en conectar)

¡Éxito! 🚀
Cada vez que hagas un `git push` a la rama `main`, Vercel y Koyeb detectarán los cambios y redesplegarán automáticamente las partes correspondientes de tu aplicación. ¡No necesitas hacer nada más! ✨
 no te