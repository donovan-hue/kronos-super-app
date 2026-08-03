const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { stripe } = require('../config/stripe');
const subscriptionService = require('../services/subscriptionService');

/**
 * POST /api/subscription/checkout
 * Nuevo modelo (3 productos):  Body: { productId: 'social'|'scripts'|'media', planKey: 'premium'|'estandar'|'pro' }
 * Legacy (compat):             Body: { tier: 'plus'|'pro'|'business' }
 */
router.post('/checkout', protect, async (req, res) => {
  try {
    const { productId, planKey, tier } = req.body;

    if (productId) {
      const { url, sessionId } = await subscriptionService.createProductCheckoutSession(
        req.user._id,
        productId,
        planKey
      );
      return res.json({ success: true, url, sessionId });
    }

    // ── Legacy ──
    if (!['plus', 'pro', 'business'].includes(tier)) {
      return res.status(400).json({
        error: 'Falta productId/planKey (o un tier legacy válido: plus, pro, business).'
      });
    }
    const { url, sessionId } = await subscriptionService.createCheckoutSession(req.user._id, tier);
    return res.json({ success: true, url, sessionId });
  } catch (err) {
    console.error('subscription/checkout error:', err);
    return res.status(400).json({ error: err.message });
  }
});

/**
 * GET /api/subscription/products
 * Estado de los 3 productos independientes (plan + suscripción + uso de cuotas).
 */
router.get('/products', protect, async (req, res) => {
  try {
    const data = await subscriptionService.getProductSubscriptions(req.user._id);
    return res.json({ success: true, ...data });
  } catch (err) {
    console.error('subscription/products error:', err);
    return res.status(500).json({ error: err.message });
  }
});

/**
 * GET /api/subscription/status
 * Devuelve tier, features y datos de la suscripción actual. (Legacy)
 */
router.get('/status', protect, async (req, res) => {
  try {
    const data = await subscriptionService.getSubscription(req.user._id);
    return res.json({ success: true, ...data });
  } catch (err) {
    console.error('subscription/status error:', err);
    return res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/subscription/cancel
 * Cancela al final del periodo actual.
 */
router.post('/cancel', protect, async (req, res) => {
  try {
    const { productId } = req.body || {};
    const sub = productId
      ? await subscriptionService.cancelProductSubscription(req.user._id, productId)
      : await subscriptionService.cancelSubscription(req.user._id);
    return res.json({ success: true, subscription: sub });
  } catch (err) {
    console.error('subscription/cancel error:', err);
    return res.status(400).json({ error: err.message });
  }
});

/**
 * POST /api/subscription/reactivate
 * Reactiva una suscripción que estaba marcada para cancelar.
 */
router.post('/reactivate', protect, async (req, res) => {
  try {
    const sub = await subscriptionService.reactivateSubscription(req.user._id);
    return res.json({ success: true, subscription: sub });
  } catch (err) {
    console.error('subscription/reactivate error:', err);
    return res.status(400).json({ error: err.message });
  }
});

/**
 * Handler del webhook de Stripe.
 * IMPORTANTE: este handler espera req.body como Buffer (raw),
 * por eso se monta directamente en server.js con express.raw()
 * ANTES del middleware global express.json().
 */
const webhookHandler = async (req, res) => {
  const signature = req.headers['stripe-signature'];
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secret) {
    console.error('subscription webhook: STRIPE_WEBHOOK_SECRET no configurado');
    return res.status(500).json({ error: 'Webhook secret missing' });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, signature, secret);
  } catch (err) {
    console.error('subscription webhook signature error:', err.message);
    return res.status(400).json({ error: `Webhook signature: ${err.message}` });
  }

  try {
    await subscriptionService.handleSubscriptionWebhook(event);
    return res.json({ received: true, type: event.type });
  } catch (err) {
    console.error('subscription webhook handler error:', err);
    return res.status(500).json({ error: err.message });
  }
};

module.exports = router;
module.exports.webhookHandler = webhookHandler;
