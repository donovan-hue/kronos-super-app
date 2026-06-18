const { PRODUCTS } = require('../config/subscriptionPlans');

/**
 * Middleware para validar la existencia de un producto en el catálogo de suscripciones.
 * Protege los flujos de pago y cancelación contra IDs de productos inexistentes o mal formados.
 */
exports.validateProductId = (req, res, next) => {
  const { productId, planKey } = req.body;

  // Si no se proporciona productId, se permite pasar (para compatibilidad con tiers legacy)
  if (!productId) {
    return next();
  }

  const product = PRODUCTS[productId];
  if (!product) {
    const available = Object.keys(PRODUCTS).join(', ');
    return res.status(400).json({
      success: false,
      message: `El ID de producto '${productId}' no es válido. Opciones: ${available}`
    });
  }

  // Validación adicional: si se envía un planKey, verificar que pertenezca al producto
  if (planKey && !product.plans[planKey]) {
    return res.status(400).json({
      success: false,
      message: `El plan '${planKey}' no existe para el producto '${productId}'.`
    });
  }

  next();
};