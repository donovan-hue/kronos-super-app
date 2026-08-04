const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');

exports.createPaymentIntent = async (req, res, next) => {
  try {
    const { orderId, amount, currency = 'mxn' } = req.body;
    const userId = req.user.id;

    // Crear la intención de pago en Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe procesa montos en centavos
      currency: currency.toLowerCase(),
      metadata: { orderId, userId }
    });

    // Guardar el client_secret temporal en la orden local
    if (orderId) {
      await Order.findByIdAndUpdate(orderId, {
        paymentIntentId: paymentIntent.id,
        status: 'pending_payment'
      });
    }

    return res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    next(error);
  }
};

exports.handleStripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body, // Debe ser el buffer o raw body
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Procesar eventos de pago de Stripe
  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object;
      const { orderId } = paymentIntent.metadata;

      if (orderId) {
        await Order.findByIdAndUpdate(orderId, {
          status: 'paid',
          paidAt: new Date(),
          transactionId: paymentIntent.id
        });
      }
      break;
    }
    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object;
      const { orderId } = paymentIntent.metadata;

      if (orderId) {
        await Order.findByIdAndUpdate(orderId, {
          status: 'failed',
          failureReason: paymentIntent.last_payment_error?.message || 'Payment failed'
        });
      }
      break;
    }
    default:
      console.log(`Evento de Stripe no manejado: ${event.type}`);
  }

  res.status(200).json({ received: true });
};

