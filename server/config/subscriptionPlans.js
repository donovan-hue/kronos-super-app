/**
 * CATÁLOGO DE SUSCRIPCIONES — fuente única de verdad.
 *
 * Son 3 PRODUCTOS INDEPENDIENTES. El usuario puede pagar uno, otro o todos;
 * nunca van amarrados. Cada producto tiene sus planes (el plan 'free' NO se
 * cobra ni se registra en Stripe: es la cuenta por defecto / "regalito").
 *
 * Para activar un plan de pago:
 *   1. Crea el Product + Price (recurrente mensual) en el dashboard de Stripe.
 *   2. Copia el Price ID (price_xxx) a la variable de entorno indicada en `priceEnv`.
 *
 * `quota` = unidades incluidas por mes (-1 = ilimitado, 0 = no disponible).
 * `cost`  = costo de cómputo estimado de esa cuota (referencia de margen).
 */

const SOCIAL = {
  id: 'social',
  name: 'Red Social Kronos',
  // Toda la red social es GRATIS. Solo "Premium" agrega extras que no usan cómputo.
  plans: {
    free: {
      name: 'Gratuito',
      price: 0,
      priceEnv: null,
      features: {
        post: true, react: true, comment: true,
        uploadMedia: true, bigFiles: true, basicVideoCall: true,
        noAds: false, verifiedBadge: false, prioritySupport: false, premiumVideoCall: false
      }
    },
    premium: {
      name: 'Premium',
      price: 4.99,
      priceEnv: 'STRIPE_SOCIAL_PREMIUM_PRICE_ID',
      features: {
        post: true, react: true, comment: true,
        uploadMedia: true, bigFiles: true, basicVideoCall: true,
        noAds: true, verifiedBadge: true, prioritySupport: true, premiumVideoCall: true
      }
    }
  }
};

const SCRIPTS = {
  id: 'scripts',
  name: 'Generador de Scripts (IA)',
  // gpt-4o-mini ~$0.002 por guión → margen altísimo.
  unit: 'guiones',
  plans: {
    free:     { name: 'Gratuito', price: 0,     priceEnv: null,                          quota: 5,    cost: 0.01 },
    estandar: { name: 'Estándar', price: 4.99,  priceEnv: 'STRIPE_SCRIPTS_ESTANDAR_PRICE_ID', quota: 100,  cost: 0.20 },
    premium:  { name: 'Premium',  price: 9.99,  priceEnv: 'STRIPE_SCRIPTS_PREMIUM_PRICE_ID',  quota: 300,  cost: 0.60 },
    pro:      { name: 'Pro',      price: 19.99, priceEnv: 'STRIPE_SCRIPTS_PRO_PRICE_ID',      quota: 1000, cost: 2.00 }
  }
};

const MEDIA = {
  id: 'media',
  name: 'Generador de Videos e Imágenes (IA)',
  // Imágenes FLUX.1 [schnell] ~$0.003 · Video LTX/Wan ~$0.05 (vía fal.ai/Replicate).
  units: { images: 'imágenes', videos: 'videos' },
  plans: {
    free:     { name: 'Gratuito', price: 0,     priceEnv: null,                        images: 5,   videos: 0,  cost: 0.02 },
    estandar: { name: 'Estándar', price: 9.99,  priceEnv: 'STRIPE_MEDIA_ESTANDAR_PRICE_ID', images: 100, videos: 5,  cost: 0.55 },
    premium:  { name: 'Premium',  price: 19.99, priceEnv: 'STRIPE_MEDIA_PREMIUM_PRICE_ID',  images: 300, videos: 20, cost: 1.90 },
    pro:      { name: 'Pro',      price: 39.99, priceEnv: 'STRIPE_MEDIA_PRO_PRICE_ID',       images: 800, videos: 60, cost: 5.40 }
  }
};

const PRODUCTS = { social: SOCIAL, scripts: SCRIPTS, media: MEDIA };

/** Devuelve el Price ID de Stripe para (producto, plan), leyendo la env var. */
const getPriceId = (productId, planKey) => {
  const plan = PRODUCTS[productId]?.plans[planKey];
  if (!plan) throw new Error(`Plan inválido: ${productId}/${planKey}`);
  if (!plan.priceEnv) return null; // plan gratuito
  const id = process.env[plan.priceEnv];
  if (!id) throw new Error(`Falta configurar ${plan.priceEnv} en .env`);
  return id;
};

/** Valida que (producto, plan) exista y sea de pago. */
const isPaidPlan = (productId, planKey) =>
  Boolean(PRODUCTS[productId]?.plans[planKey]?.priceEnv);

module.exports = { PRODUCTS, SOCIAL, SCRIPTS, MEDIA, getPriceId, isPaidPlan };
