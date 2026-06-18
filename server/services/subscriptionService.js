const { stripe } = require('../config/stripe');
const User = require('../models/User');
const Subscription = require('../models/Subscription');
const { PRODUCTS, getPriceId } = require('../config/subscriptionPlans');

const TIER_FEATURES = {
  free: {
    unlimitedPosts: false,
    aiGenerator: false,
    noAds: false,
    verifiedBadge: false,
    premiumStickers: false,
    advancedAnalytics: false,
    apiAccess: false,
    prioritySupport: false,
    customShop: false
  },
  plus: {
    unlimitedPosts: false,
    aiGenerator: false,
    noAds: true,
    verifiedBadge: false,
    premiumStickers: true,
    advancedAnalytics: false,
    apiAccess: false,
    prioritySupport: false,
    customShop: false
  },
  pro: {
    unlimitedPosts: true,
    aiGenerator: true,
    noAds: true,
    verifiedBadge: true,
    premiumStickers: true,
    advancedAnalytics: false,
    apiAccess: false,
    prioritySupport: false,
    customShop: false
  },
  business: {
    unlimitedPosts: true,
    aiGenerator: true,
    noAds: true,
    verifiedBadge: true,
    premiumStickers: true,
    advancedAnalytics: true,
    apiAccess: true,
    prioritySupport: true,
    customShop: true
  }
};

const PRICE_ID_BY_TIER = {
  plus: () => process.env.STRIPE_PLUS_PRICE_ID,
  pro: () => process.env.STRIPE_PRO_PRICE_ID,
  business: () => process.env.STRIPE_BUSINESS_PRICE_ID
};

/**
 * Garantiza que el usuario tenga un Customer en Stripe.
 * Reusa el existente si ya tiene stripeCustomerId.
 */
const ensureCustomer = async (user) => {
  if (user.stripeCustomerId) {
    return user.stripeCustomerId;
  }

  const customer = await stripe.customers.create({
    email: user.email,
    name: user.username,
    metadata: { userId: user._id.toString() }
  });

  user.stripeCustomerId = customer.id;
  await user.save();
  return customer.id;
};

/**
 * Crea sesión de Stripe Checkout para suscribir a un tier.
 * @param {String} userId
 * @param {'pro'|'business'} tier
 * @returns {Promise<{ url: string, sessionId: string }>}
 */
const createCheckoutSession = async (userId, tier) => {
  if (!PRICE_ID_BY_TIER[tier]) {
    throw new Error(`Tier no soportado: ${tier}`);
  }

  const priceId = PRICE_ID_BY_TIER[tier]();
  if (!priceId) {
    throw new Error(`Stripe price ID no configurado para tier ${tier}`);
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new Error('Usuario no encontrado');
  }

  const customerId = await ensureCustomer(user);
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${clientUrl}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${clientUrl}/subscription/cancel`,
    metadata: {
      userId: user._id.toString(),
      tier
    },
    subscription_data: {
      metadata: {
        userId: user._id.toString(),
        tier
      }
    }
  });

  return { url: session.url, sessionId: session.id };
};

/**
 * Sincroniza features del usuario según su tier actual. (Legacy)
 */
const syncFeatures = async (userId, tier) => {
  const features = TIER_FEATURES[tier] || TIER_FEATURES.free;
  await User.findByIdAndUpdate(userId, {
    tier,
    features
  });
};

// ════════════════════════════════════════════════════════════════════════
//  NUEVO MODELO: 3 productos independientes (config/subscriptionPlans.js)
// ════════════════════════════════════════════════════════════════════════

/**
 * Flags de `features` derivados del plan del producto SOCIAL,
 * para que el frontend (sin anuncios, badge ✓) siga funcionando.
 */
const socialPlanFeatures = (planKey) => {
  const premium = planKey === 'premium';
  return {
    noAds: premium,
    verifiedBadge: premium,
    prioritySupport: premium,
    premiumStickers: premium
  };
};

/**
 * Aplica un plan de un producto al usuario: guarda productPlans[producto]
 * y, si es el producto social, sincroniza los flags de features.
 */
const applyPlan = async (userId, productId, planKey) => {
  const update = { [`productPlans.${productId}`]: planKey };
  if (productId === 'social') {
    const flags = socialPlanFeatures(planKey);
    for (const [k, v] of Object.entries(flags)) {
      update[`features.${k}`] = v;
    }
  }
  await User.findByIdAndUpdate(userId, update);
};

/**
 * Crea sesión de Stripe Checkout para un (producto, plan) del nuevo catálogo.
 * @param {String} userId
 * @param {'social'|'scripts'|'media'} productId
 * @param {String} planKey  ej. 'premium' | 'estandar' | 'pro'
 */
const createProductCheckoutSession = async (userId, productId, planKey) => {
  const product = PRODUCTS[productId];
  if (!product) throw new Error(`Producto no soportado: ${productId}`);
  const plan = product.plans[planKey];
  if (!plan) throw new Error(`Plan no soportado: ${productId}/${planKey}`);
  if (!plan.priceEnv) throw new Error(`El plan "${planKey}" es gratuito; no requiere pago.`);

  const priceId = getPriceId(productId, planKey); // lanza si falta la env var

  const user = await User.findById(userId);
  if (!user) throw new Error('Usuario no encontrado');

  const customerId = await ensureCustomer(user);
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${clientUrl}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${clientUrl}/subscription/cancel`,
    metadata: { userId: user._id.toString(), productId, planKey },
    subscription_data: {
      metadata: { userId: user._id.toString(), productId, planKey }
    }
  });

  return { url: session.url, sessionId: session.id };
};

/**
 * Cancela (al final del periodo) la suscripción de un producto específico.
 */
const cancelProductSubscription = async (userId, productId) => {
  const sub = await Subscription.findOne({
    userId,
    productId,
    status: { $in: ['active', 'trialing', 'past_due'] }
  }).sort({ createdAt: -1 });

  if (!sub || !sub.stripeSubscriptionId) {
    throw new Error(`No hay suscripción activa de "${productId}" para cancelar`);
  }

  const updated = await stripe.subscriptions.update(sub.stripeSubscriptionId, {
    cancel_at_period_end: true
  });

  sub.cancelAtPeriodEnd = true;
  sub.status = updated.status;
  await sub.save();
  return sub;
};

/**
 * Estado de los 3 productos del usuario: plan activo + suscripción de cada uno.
 */
const getProductSubscriptions = async (userId) => {
  const user = await User.findById(userId).select('productPlans usage features').lean();
  const subs = await Subscription.find({ userId, productId: { $exists: true } }).lean();

  const byProduct = {};
  for (const id of Object.keys(PRODUCTS)) {
    const active = subs
      .filter((s) => s.productId === id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0] || null;
    byProduct[id] = {
      plan: user?.productPlans?.[id] || 'free',
      subscription: active
    };
  }

  return { products: byProduct, usage: user?.usage || {}, features: user?.features || TIER_FEATURES.free };
};

/**
 * Procesa eventos relevantes del webhook de Stripe.
 * El verificado de firma se hace en config/stripe.handleStripeWebhook.
 * Aquí recibimos el evento ya parseado.
 */
const handleSubscriptionWebhook = async (event) => {
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      if (session.mode !== 'subscription') break;

      const userId = session.metadata?.userId;
      const productId = session.metadata?.productId; // nuevo modelo
      const planKey = session.metadata?.planKey;     // nuevo modelo
      const tier = session.metadata?.tier;           // legacy
      if (!userId || (!productId && !tier)) break;

      const stripeSubscriptionId = session.subscription;
      const stripeSub = await stripe.subscriptions.retrieve(stripeSubscriptionId);

      await Subscription.findOneAndUpdate(
        { stripeSubscriptionId },
        {
          userId,
          ...(productId ? { productId, planKey, tier: planKey } : { tier }),
          stripeCustomerId: session.customer,
          stripeSubscriptionId,
          stripePriceId: stripeSub.items?.data?.[0]?.price?.id,
          status: stripeSub.status,
          currentPeriodStart: stripeSub.current_period_start
            ? new Date(stripeSub.current_period_start * 1000)
            : undefined,
          currentPeriodEnd: stripeSub.current_period_end
            ? new Date(stripeSub.current_period_end * 1000)
            : undefined,
          cancelAtPeriodEnd: stripeSub.cancel_at_period_end || false
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );

      if (productId) {
        await applyPlan(userId, productId, planKey);
      } else {
        await syncFeatures(userId, tier);
      }
      break;
    }

    case 'customer.subscription.updated': {
      const sub = event.data.object;
      const stored = await Subscription.findOne({ stripeSubscriptionId: sub.id });
      if (!stored) break;

      stored.status = sub.status;
      stored.cancelAtPeriodEnd = sub.cancel_at_period_end || false;
      stored.currentPeriodStart = sub.current_period_start
        ? new Date(sub.current_period_start * 1000)
        : stored.currentPeriodStart;
      stored.currentPeriodEnd = sub.current_period_end
        ? new Date(sub.current_period_end * 1000)
        : stored.currentPeriodEnd;
      stored.stripePriceId = sub.items?.data?.[0]?.price?.id || stored.stripePriceId;
      await stored.save();

      // Si la suscripción ya no está activa ni en trial, degradar a free
      const activeStatuses = ['active', 'trialing'];
      const active = activeStatuses.includes(sub.status);
      if (stored.productId) {
        await applyPlan(stored.userId, stored.productId, active ? stored.planKey : 'free');
      } else if (!active) {
        await syncFeatures(stored.userId, 'free');
      } else {
        await syncFeatures(stored.userId, stored.tier);
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const sub = event.data.object;
      const stored = await Subscription.findOne({ stripeSubscriptionId: sub.id });
      if (!stored) break;

      stored.status = 'canceled';
      stored.canceledAt = new Date();
      await stored.save();

      if (stored.productId) {
        await applyPlan(stored.userId, stored.productId, 'free');
      } else {
        await syncFeatures(stored.userId, 'free');
      }
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object;
      const subId = invoice.subscription;
      if (!subId) break;

      const stored = await Subscription.findOne({ stripeSubscriptionId: subId });
      if (!stored) break;

      stored.status = 'past_due';
      await stored.save();
      break;
    }

    case 'invoice.payment_succeeded': {
      const invoice = event.data.object;
      const subId = invoice.subscription;
      if (!subId) break;

      const stored = await Subscription.findOne({ stripeSubscriptionId: subId });
      if (!stored) break;

      // Renovación exitosa — asegurar que el tier sigue activo
      if (stored.status === 'past_due' || stored.status !== 'active') {
        stored.status = 'active';
        await stored.save();
        if (stored.productId) {
          await applyPlan(stored.userId, stored.productId, stored.planKey);
        } else {
          await syncFeatures(stored.userId, stored.tier);
        }
      }
      break;
    }

    case 'charge.refunded': {
      const charge = event.data.object;
      // Reembolso de cargo único — registrar en subscription si aplica
      const subId = charge.metadata?.subscriptionId || null;
      if (subId) {
        const stored = await Subscription.findOne({ stripeSubscriptionId: subId });
        if (stored) {
          stored.status = 'canceled';
          stored.canceledAt = new Date();
          await stored.save();
          if (stored.productId) {
            await applyPlan(stored.userId, stored.productId, 'free');
          } else {
            await syncFeatures(stored.userId, 'free');
          }
        }
      }
      break;
    }

    case 'payment_intent.succeeded': {
      // Pago único exitoso (checkout de orden, no suscripción)
      // Aquí solo lo registramos — cada módulo (orders, marketplace) maneja su propio flujo
      break;
    }

    case 'customer.subscription.trial_will_end': {
      // 3 días antes de que termine el trial — notificación futura
      break;
    }

    default:
      break;
  }
};

/**
 * Cancela la suscripción al final del periodo actual.
 * @param {String} userId
 * @param {String} [productId] - Opcional para asegurar que cancelamos el producto correcto
 */
const cancelSubscription = async (userId, productId = null) => {
  const sub = await Subscription.findOne({
    userId,
    ...(productId ? { productId } : {}),
    status: { $in: ['active', 'trialing', 'past_due'] }
  }).sort({ createdAt: -1 });

  if (!sub || !sub.stripeSubscriptionId) {
    throw new Error('No hay suscripción activa para cancelar');
  }

  const updated = await stripe.subscriptions.update(sub.stripeSubscriptionId, {
    cancel_at_period_end: true
  });

  sub.cancelAtPeriodEnd = true;
  sub.status = updated.status;
  await sub.save();

  return sub;
};

/**
 * Reactiva una suscripción que estaba marcada para cancelar.
 * Rectificación: Se añade productId para soportar el modelo de 3 productos independientes.
 */
const reactivateSubscription = async (userId, productId = null) => {
  const sub = await Subscription.findOne({
    userId,
    ...(productId ? { productId } : {}),
    cancelAtPeriodEnd: true,
    status: { $in: ['active', 'trialing'] }
  }).sort({ createdAt: -1 });

  if (!sub || !sub.stripeSubscriptionId) {
    throw new Error('No hay suscripción que reactivar');
  }

  const updated = await stripe.subscriptions.update(sub.stripeSubscriptionId, {
    cancel_at_period_end: false
  });

  sub.cancelAtPeriodEnd = false;
  sub.status = updated.status;
  await sub.save();

  return sub;
};

/**
 * Devuelve el estado actual de la suscripción del usuario.
 */
const getSubscription = async (userId) => {
  const sub = await Subscription.findOne({ userId })
    .sort({ createdAt: -1 })
    .lean();

  const user = await User.findById(userId).select('tier features').lean();

  return {
    tier: user?.tier || 'free',
    features: user?.features || TIER_FEATURES.free,
    subscription: sub || null
  };
};

module.exports = {
  TIER_FEATURES,
  ensureCustomer,
  createCheckoutSession,
  syncFeatures,
  handleSubscriptionWebhook,
  cancelSubscription,
  reactivateSubscription,
  getSubscription,
  // Nuevo modelo de 3 productos
  applyPlan,
  socialPlanFeatures,
  createProductCheckoutSession,
  cancelProductSubscription,
  getProductSubscriptions
};
