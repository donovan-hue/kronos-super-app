const User = require('../models/User');
const { PRODUCTS } = require('../config/subscriptionPlans');

/**
 * Middleware de CUOTA para los productos de IA (scripts / media).
 *
 * Cada "kind" sabe de qué producto sale su límite (en el catálogo) y en qué
 * contador del usuario se acumula el consumo (user.usage.*). El contador se
 * reinicia automáticamente cada mes calendario (UTC).
 *
 * Uso:
 *   router.post('/story', auth, requireQuota('scripts'), handler);
 *   router.post('/image', auth, requireQuota('images'),  handler);
 */
const QUOTAS = {
  scripts: { product: 'scripts', limitField: 'quota',  usageField: 'scriptsCount' },
  images:  { product: 'media',   limitField: 'images', usageField: 'mediaImagesCount' },
  videos:  { product: 'media',   limitField: 'videos', usageField: 'mediaVideosCount' }
};

const isSameUtcMonth = (a, b) =>
  !!a && !!b &&
  a.getUTCFullYear() === b.getUTCFullYear() &&
  a.getUTCMonth() === b.getUTCMonth();

const requireQuota = (kind) => {
  const cfg = QUOTAS[kind];
  if (!cfg) throw new Error(`requireQuota: kind inválido "${kind}"`);

  return async (req, res, next) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Not authorized' });

      const planKey = req.user.productPlans?.[cfg.product] || 'free';
      const plan = PRODUCTS[cfg.product]?.plans[planKey];
      const limit = plan?.[cfg.limitField] ?? 0; // -1 = ilimitado

      const now = new Date();
      const freshMonth = !isSameUtcMonth(req.user.usage?.periodStart, now);
      const used = freshMonth ? 0 : (req.user.usage?.[cfg.usageField] || 0);

      // Plan sin acceso a esta herramienta
      if (limit === 0) {
        return res.status(402).json({
          error: `Tu plan "${planKey}" no incluye ${kind}. Suscríbete a ${PRODUCTS[cfg.product].name}.`,
          product: cfg.product, plan: planKey, upgrade: true, upgrade_url: '/pricing'
        });
      }

      // Cuota mensual agotada
      if (limit !== -1 && used >= limit) {
        return res.status(429).json({
          error: `Alcanzaste tu cuota mensual de ${kind} (${limit}). Mejora tu plan para más.`,
          product: cfg.product, plan: planKey, limit, used, upgrade: true, upgrade_url: '/pricing'
        });
      }

      // Incrementar el contador SOLO si la respuesta fue 2xx
      const originalJson = res.json.bind(res);
      res.json = (body) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          const update = freshMonth
            ? {
                'usage.periodStart': now,
                'usage.scriptsCount': 0,
                'usage.mediaImagesCount': 0,
                'usage.mediaVideosCount': 0,
                [`usage.${cfg.usageField}`]: 1
              }
            : { $inc: { [`usage.${cfg.usageField}`]: 1 } };

          User.findByIdAndUpdate(req.user._id, update).catch((err) =>
            console.error('requireQuota increment failed:', err)
          );
        }
        return originalJson(body);
      };

      return next();
    } catch (err) {
      console.error('requireQuota error:', err);
      return next(err);
    }
  };
};

module.exports = { requireQuota, QUOTAS };
