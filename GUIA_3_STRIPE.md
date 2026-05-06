# 💳 PASO 3: CREAR CUENTA EN STRIPE
## (Procesar pagos de tu tienda)

---

## ℹ️ INFORMACIÓN

Stripe es para procesar pagos de tu tienda (e-commerce).

**Tienes cuenta?** Perfecto! Necesitamos obtener tus claves de MODO TEST.

⚠️ **IMPORTANTE:** Siempre usa MODO TEST (no dinero real)

---

## 🎯 PASO 1: Acceder a Stripe

**URL:** https://dashboard.stripe.com

1. Abre ese link
2. Click en **"Sign In"** 
3. Entra con tu usuario y contraseña

---

## 🎯 PASO 2: Ir a las Claves API

Una vez dentro del dashboard:

1. Busca en la esquina superior izquierda: **"Developers"** o **"API Keys"**
2. Click en **"API Keys"**

También puedes ir directo aquí:
https://dashboard.stripe.com/apikeys

---

## 🎯 PASO 3: Asegúrate de Estar en MODO TEST

Arriba a la izquierda, verás un toggle:

```
⚪ Test Mode    (SELECCIONA ESTO)
● Live Mode
```

Haz click para que esté en **Test Mode** (blanco/desactivado).

---

## 🎯 PASO 4: Obtener tus Claves de TEST

Con el modo TEST activado, verás 2 claves:

```
Publishable key (pk_test_...)     ← COPIA ESTA
Secret key (sk_test_...)          ← COPIA ESTA
```

Si no ves los valores completos, haz click en **"Reveal"**

---

## 🎯 PASO 5: Copiar y Guardar

Abre el **Bloc de Notas** y guarda:

```
STRIPE_PUBLIC_KEY=pk_test_...completa...
STRIPE_SECRET_KEY=sk_test_...completa...
```

---

## 🧪 PASO 6: Obtener Tarjeta de Prueba (Opcional)

Para probar pagos, Stripe te da tarjetas falsas de prueba.

Busca en el dashboard: **"Testing"** → **"Test Card Numbers"**

Las tarjetas de prueba son:
```
Número:     4242 4242 4242 4242
Mes:        12
Año:        25
CVC:        123
```

**Estas tarjetas NO cobran dinero real!**

---

## ✅ LISTO!

Ya tienes:
✅ Stripe configurado en modo TEST
✅ Claves copiadas

**Siguiente paso:** Guía de Render

