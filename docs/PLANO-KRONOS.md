# 🛰️ PLANO MAESTRO DE KRONOS
### Mapa detallado de todas las funciones, secciones y evaluación de diseño premium
*Generado por Kairos + Claude · 2026-06-10*

---

## 0. ¿Qué ES KRONOS?

No es "otra red social". Es una **super-app** (modelo tipo WeChat) que junta **6 mundos en una sola app**:

> **Social** + **Comercio/Delivery** + **Wallet cripto-fiat (token KRO)** + **IA generativa** + **Realidad Aumentada** + **Gamificación**

Esa combinación es la ventaja competitiva: **nadie en occidente la tiene junta**.

**Inventario real (leído del código):** 23 páginas · 38 rutas de servidor · 43 modelos de datos.

---

## 1. PLANO POR SECCIONES

### 🟦 A. NÚCLEO SOCIAL
| Sección (página) | Rutas de servidor | Qué hace |
|---|---|---|
| **Feed** | `feed`, `posts`, `interactions` | Muro de publicaciones, likes, comentarios |
| **Profile** | `users`, `interactions` | Perfil de usuario, seguir/seguidores |
| **Search** | `search` | Búsqueda universal (usuarios, posts, productos) |
| **Notifications** | `notifications` | Avisos en tiempo real |
| **Communities / CommunityDetail** | `communities` | Grupos temáticos estilo Reddit/Facebook |
| **Stories (efímeras 24h)** | `stories`, `ephemeralStories` | Historias que desaparecen (Instagram/Snapchat) |
| **Mensajería** *(integrada)* | `messages`, `groupChats` | DM y chats grupales |

### 🟪 B. CONTENIDO Y CREACIÓN
| Sección | Rutas | Qué hace |
|---|---|---|
| **Live** | `audio`, `videos`, `sessions` | Salas de audio en vivo (Clubhouse) + video |
| **VideoEditor** | `videos`, `multimedia` | Edición/subida de video (TikTok/YouTube) |
| **Avatar** | `avatar`, `ar` | Avatar 3D del usuario |
| **AR (Realidad Aumentada)** | `ar` | Filtros y objetos AR |

### 🟩 C. COMERCIO Y DELIVERY
| Sección | Rutas | Qué hace |
|---|---|---|
| **Marketplace** | `products`, `listings` | Tienda + venta entre usuarios |
| **Carrito / Checkout** | `cart`, `checkout`, `orders` | Compra y pago |
| **Reservations** | `reservations` | Reservas (restaurantes/servicios + `MenuItem`) |
| **Refunds** | `refunds` | Reembolsos |

### 🟨 D. ECONOMÍA KRO (el corazón diferenciador)
| Sección | Rutas | Qué hace |
|---|---|---|
| **Wallet** | `wallet`, `tokens` | Billetera cripto-fiat, token KRO |
| **Tips (propinas)** | `tips` | Regalar KRO a creadores |
| **Pricing / Subscription** | `subscription` | 3 planes de suscripción independientes |
| **Subscription Success/Cancel** | `subscription`, `checkout` | Resultado del pago Stripe |

### 🟧 E. GAMIFICACIÓN Y SALUD
| Sección | Rutas | Qué hace |
|---|---|---|
| **Gamification** | `gamification` | Puntos, logros, retos |
| **Health** | *(modelo `HealthLog`)* | Registro de actividad → base de "move-to-earn" |

### 🟥 F. IA
| Sección | Rutas | Qué hace |
|---|---|---|
| **IA generativa** | `ai`, `translation` | Asistente, traducción (DeepL), generación |

### ⬜ G. CUENTA, CONFIG Y LEGAL
| Sección | Rutas | Qué hace |
|---|---|---|
| **Welcome (landing)** | — | Pantalla de entrada |
| **Auth** | `auth`, `twofactor` | Login, registro, OAuth, 2FA, recuperar contraseña |
| **Settings** | `users` | Ajustes de cuenta |
| **Privacy / Terms** | — | Legales |
| **Admin** | `admin`, `analytics`, `reporting` | Panel de administración + métricas |

---

## 2. MAPA DE DATOS (43 modelos) — agrupados

- **Social:** Post, Story, StoryNode, StoryProgress, EphemeralStory, Community, Message, GroupConversation, GroupMessage, Notification, UserInteraction, UserBlock, ContentReport
- **Usuario:** User, Web3User, AdminUser, UserAvatar, AvatarItem, ActiveSession, TwoFactorAuth
- **Comercio:** Product, Listing, Cart, Order, MenuItem, Reservation, Refund
- **Economía KRO:** KronosToken, UserWallet, CashWallet, VirtualCard, Transaction, Tip, RewardPool, Stake, Subscription
- **Engagement:** Gamification, HealthLog, Event, Emoji, Video, AttentionMetrics
- **Mensajería IA/sistema:** EmailQueue

---

## 3. 🚀 LO QUE TE HARÍA ÚNICO (veredicto de Kairos)

Tienes **11/12 funciones base** de las grandes redes. Tu diferenciador NO es copiar más funciones, es **unir lo social con la economía KRO**. Prioridad:

1. **SocialFi** — ganar KRO por buen contenido + "stakear" para impulsar posts. *(Base: RewardPool, Stake, KronosToken)*
2. **Historias interactivas "elige tu aventura"** — narrativa ramificada. *(Base: StoryNode, StoryProgress)*
3. **Marketplace con escrow** — pago retenido hasta confirmar. *(Base: Listing, Refund, CashWallet)*
4. Estudio de creación con IA · 5. AR + economía · 6. Move-to-earn · 7. Propinas en vivo.

**Detalles comunes que quizá falten:** encuestas en posts · reacciones múltiples · guardar/colecciones · duetos de video.

---

## 4. 🎨 EVALUACIÓN DE DISEÑO PREMIUM

### Tu diseño actual: "KRONOSPACE" — negro intenso + plata metálica
- **Fondo:** negro casi puro `#040405`
- **Texto/acento:** plata `#c9ced4`
- **Botones:** gradiente cónico metálico (efecto platino pulido)
- **Tipografía:** Outfit / Manrope / Space Grotesk
- **Estilo:** glassmorphism oscuro, bordes sutiles, sombras profundas

### Veredicto honesto
✅ **Es genuinamente premium.** Negro + metal = lenguaje visual de lujo (Apple, Tesla, fintech de alta gama). Está **bien ejecutado y coherente**.

⚠️ **Pero tiene un punto débil para una red social:** es **monocromático**. El gris/plata puro puede sentirse **frío, sobrio y con poca energía**. Una red social — sobre todo para creadores jóvenes — necesita sentirse **viva, vibrante y "compartible"**, y necesita un **color de marca** que la gente reconozca al instante.

### Recomendación
**NO tirar el negro+metal** (es tu base premium y encaja con el ADN cripto/fintech).
**SÍ agregarle UN color de acento de marca**, usado con moderación, para: botones de acción, el token KRO, estados activos, notificaciones y "energía".

Esto es la fórmula "**premium con firma**" que usan las mejores apps:
> Spotify (verde sobre negro) · Binance (dorado sobre negro) · Revolut · Linear (violeta) · Twitch (morado)

Un acento bien elegido es lo que hace que la app **llame la atención y se recuerde**, sin perder lo premium.

*(Las 3 paletas premium candidatas se presentan aparte para que elijas.)*
