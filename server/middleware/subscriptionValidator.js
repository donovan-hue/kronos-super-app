const Joi = require('joi');
const { PRODUCTS } = require('../config/subscriptionPlans');

const validProducts = Object.keys(PRODUCTS);

/**
 * Middleware genérico para validación de esquemas Joi en el cuerpo de la petición.
 */
const validateSchema = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body || {}, { abortEarly: false });
    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join(', ');
      return res.status(400).json({
        success: false,
        message: `Error de validación: ${errorMessage}`
      });
    }
    next();
  };
};

/**
 * Esquema para el inicio de checkout. 
 * Soporta el nuevo modelo (productId + planKey) o el modelo legacy (tier).
 */
const checkoutSchema = Joi.object({
  productId: Joi.string().valid(...validProducts).optional(),
  planKey: Joi.string().when('productId', { is: Joi.exist(), then: Joi.required() }),
  tier: Joi.string().valid('plus', 'pro', 'business').optional()
}).xor('productId', 'tier'); // Debe venir uno o el otro, no ambos ni ninguno.

/**
 * Esquema para la cancelación de suscripción.
 */
const cancelSchema = Joi.object({
  productId: Joi.string().valid(...validProducts).optional()
});

module.exports = {
  validateCheckout: validateSchema(checkoutSchema),
  validateCancel: validateSchema(cancelSchema)
};