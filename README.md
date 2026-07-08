# 🚀 KRONOS - Full Stack MERN

Una plataforma revolucionaria que combina **red social**, **e-commerce** y **delivery de comida** en una sola aplicación con diseño glassmorphism ultra-moderno.

---

## 🎯 ¿ERES NUEVO? EMPIEZA AQUÍ

### Punto de Entrada Único
👉 **[DEPLOYMENT.md](DEPLOYMENT.md)** ← Guía de despliegue definitiva

---

## 📚 DOCUMENTACIÓN COMPLETA

La documentación principal del proyecto se ha consolidado en los siguientes archivos:

- **[DEPLOYMENT.md](DEPLOYMENT.md):** Guía única y definitiva para desplegar el frontend en Vercel y el backend en Koyeb.
- **[FEATURES.md](FEATURES.md):** Lista completa de las características del proyecto.
- **[docs/PLANO-KRONOS.md](docs/PLANO-KRONOS.md):** Plano maestro con el mapa de funciones y arquitectura.

---

## ✨ Características Principales

### 🌐 Red Social Completa
- ✅ Posts con imagen, video y música (Cloudinary)
- ✅ Likes y comentarios en tiempo real
- ✅ Sistema de seguidores
- ✅ Chat privado con Socket.io
- ✅ Privacidad: Público / Seguidores / Privado
- ✅ Feed híbrido (posts + productos)
- ✅ Búsqueda universal
- ✅ Trending 30 días

### 🛍️ E-commerce de Ropa
- ✅ Catálogo con filtros (categoría, precio)
- ✅ Carrito persistente
- ✅ Checkout seguro con Stripe
- ✅ Reviews y calificaciones
- ✅ Variantes (tallas, colores)
- ✅ Historial de compras

### 🍕 Delivery de Comida
- ✅ Restaurantes con menú personalizado
- ✅ Carrito de comida
- ✅ Rastreo en tiempo real de órdenes
- ✅ Estados: Pending → Confirmed → Preparing → On The Way → Delivered
- ✅ Historial de entregas
- ✅ Socket.io actualizaciones en vivo

### 🎨 Diseño Glassmorphism Ultra-Moderno
- ✅ Colores tornasol (rosa, cyan, purple)
- ✅ Blur effects (backdrop-filter)
- ✅ Bordes iridiscentes
- ✅ Animaciones fluidas (Framer Motion)
- ✅ Completamente responsivo
- ✅ Accesible (contraste, ARIA labels)

---

## 📦 Stack Tecnológico

### Backend (Node.js)
```
Express.js          - API REST
MongoDB + Mongoose  - Base de datos
Socket.io           - Tiempo real
JWT                 - Autenticación
Stripe              - Pagos
Cloudinary          - Multimedia
Multer              - Upload files
bcryptjs            - Password hashing
```

### Frontend (React)
```
React 18            - UI library
React Router v6     - Navegación SPA
Axios               - HTTP client
Socket.io-client    - WebSockets
Tailwind CSS        - Utilidad CSS
Framer Motion       - Animaciones
Styled Components   - CSS-in-JS
React Icons         - Iconación
```

### Servicios Externos
```
MongoDB Atlas       - Database cloud
Stripe              - Payment processor
Cloudinary          - Image/video storage
Vercel              - Frontend hosting
Render              - Backend hosting
```

---

## 🏗️ Estructura del Proyecto

```
super-app/
├── server/
│   ├── models/              # Esquemas Mongoose
│   │   ├── User.js
│   │   ├── Post.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   └── Message.js
│   ├── controllers/         # Lógica de negocio
│   │   ├── authController.js
│   │   ├── postController.js
│   │   ├── productController.js
│   │   ├── orderController.js
│   │   └── messageController.js
│   ├── routes/              # Endpoints API
│   ├── middleware/          # Autenticación, etc
│   ├── config/              # Configuración BD
│   ├── server.js            # Punto de entrada
│   ├── package.json
│   └── .env.example
│
└── client/
    ├── src/
    │   ├── social/          # Módulo de red social
    │   │   ├── SocialModule.jsx
    │   │   ├── Feed.jsx
    │   │   ├── Profile.jsx
    │   │   └── Chat.jsx
    │   ├── shop/            # Módulo de ropa
    │   │   ├── ShopModule.jsx
    │   │   ├── ProductList.jsx
    │   │   ├── ProductDetail.jsx
    │   │   ├── Cart.jsx
    │   │   └── Checkout.jsx
    │   ├── food/            # Módulo de delivery
    │   │   ├── FoodModule.jsx
    │   │   ├── RestaurantList.jsx
    │   │   ├── RestaurantMenu.jsx
    │   │   ├── FoodCart.jsx
    │   │   └── OrderTracking.jsx
    │   ├── components/      # Componentes globales
    │   ├── context/         # Context API
    │   ├── App.jsx
    │   ├── index.jsx
    │   └── index.css
    ├── public/
    └── package.json
```

## ⚡ Instalación y Setup

El flujo de trabajo ha sido estandarizado para seguir las mejores prácticas de la industria.

### 1. Instalar dependencias

Este comando instalará las dependencias tanto para el `server` como para el `client`.

```bash
npm run install-all
```

### 2. Configurar variables de entorno

Copia el archivo `.env.example` a un nuevo archivo `.env` en la raíz del proyecto y rellena tus credenciales para los servicios externos (MongoDB, Stripe, Cloudinary, etc.).

```bash
cp .env.example .env
```

### 3. Iniciar el proyecto

Este comando unificado levantará el backend y el frontend simultáneamente.

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`.
No se usan scripts de arranque alternativos; el flujo estándar es este comando único.

## 🔑 Flujos Principales

### Autenticación
1. Usuario se registra con email y contraseña
2. Backend hashea password con bcryptjs
3. JWT token se genera y se guarda en localStorage
4. Token se envía en headers de autorización

### Post en Red Social
1. Usuario crea post con contenido
2. Socket.io notifica a seguidores en tiempo real
3. Otros usuarios pueden like, comentar, compartir
4. Historial completo guardado en MongoDB

### Compra de Ropa
1. Seleccionar productos → Carrito (localStorage)
2. Checkout con Stripe
3. Stripe maneja pago de forma segura
4. Backend registra venta en BD

### Orden de Comida
1. Seleccionar restaurante
2. Agregar items al carrito
3. Ingresar dirección de entrega
4. Socket.io actualiza estado en tiempo real
5. Repartidor rastreado en mapa

## 🔌 Socket.io Events

```javascript
// Chat
'user_online'              // Usuario conectado
'send_private_message'     // Enviar mensaje
'receive_private_message'  // Recibir mensaje
'typing'                   // Usuario escribiendo
'user_typing'              // Notificación de escritura

// Feed
'subscribe_to_feed'        // Subscribirse al feed
'post_created'             // Nuevo post
'post_liked'               // Like a post

// Órdenes
'track_order'              // Trackear orden
'order_status_updated'     // Actualizar estado
'order_status_change'      // Cambio de estado
```

## 🧪 Testing

```bash
# Backend
cd server
npm test

# Frontend
cd client
npm test
```

## 📚 Endpoints API

### Auth
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Obtener perfil
- `POST /api/auth/follow/:userId` - Seguir usuario
- `POST /api/auth/unfollow/:userId` - Dejar de seguir

### Posts
- `GET /api/posts/feed` - Obtener feed
- `POST /api/posts` - Crear post
- `POST /api/posts/:postId/like` - Like a post
- `POST /api/posts/:postId/comment` - Comentar

### Productos
- `GET /api/products` - Listar productos
- `GET /api/products/:id` - Obtener producto
- `POST /api/products` - Crear producto (seller)
- `POST /api/products/:id/review` - Agregar review

### Órdenes
- `POST /api/orders` - Crear orden
- `GET /api/orders/my-orders` - Mis órdenes
- `GET /api/orders/:orderId/track` - Trackear orden
- `POST /api/orders/:orderId/rate` - Calificar orden

### Mensajes
- `POST /api/messages/send` - Enviar mensaje
- `GET /api/messages/conversation/:userId` - Obtener conversación

## 🚀 Deploy

El despliegue se realiza en **Koyeb (backend)** y **Vercel (frontend)**.
Sigue las instrucciones detalladas en **[DEPLOYMENT.md](DEPLOYMENT.md)**.

## 📝 Notas Importantes

- Las imágenes se almacenan en Cloudinary
- Los pagos se procesan con Stripe (modo test)
- Socket.io requiere el mismo origen para funcionar
- MongoDB puede ser local o Atlas (recomendado)
- JWT tokens expiran en 7 días

## 🤝 Contribuciones

Este es un proyecto de demostración. Siéntete libre de mejorar cualquier parte.

## 📄 Licencia

MIT License
#   K R O N O S - S U P E R - A P P 
 
 