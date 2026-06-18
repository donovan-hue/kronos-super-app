import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, Elements, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';
import { GlassCard, HoloText } from '../components/kronos';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const HOLO = 'linear-gradient(135deg, #c9ced4 0%, #e9ecf0 40%, #e9ecf0 70%, #c9ced4 100%)';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '15px',
      fontFamily: "'Outfit', 'Inter', sans-serif",
      color: '#0a0b0d',
      '::placeholder': { color: 'rgba(10,11,13,0.4)' },
    },
    invalid: { color: '#ef4444' },
  },
};

function CheckoutForm({ cart }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.post(`${API_URL}/products/checkout/session`, {
        items: cart
      });

      const result = await stripe.redirectToCheckout({ sessionId: data.sessionId });

      if (result.error) setError(result.error.message);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{
        padding: '14px 16px', borderRadius: 14,
        border: '1.5px solid rgba(201,206,212,0.25)',
        background: 'rgba(255,255,255,0.95)',
        boxShadow: '0 2px 8px rgba(201,206,212,0.08)',
      }}>
        <CardElement options={CARD_ELEMENT_OPTIONS} />
      </div>

      {error && (
        <p style={{ color: '#ef4444', fontSize: 13, margin: 0, padding: '8px 12px', background: 'rgba(239,68,68,0.08)', borderRadius: 10 }}>
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        style={{
          width: '100%', padding: '14px 0', borderRadius: 14, border: 'none',
          background: (!stripe || loading) ? 'rgba(201,206,212,0.3)' : HOLO,
          color: '#fff', fontWeight: 700, fontSize: 16,
          cursor: (!stripe || loading) ? 'not-allowed' : 'pointer',
          boxShadow: '0 4px 16px rgba(201,206,212,0.35)',
          transition: 'all 0.2s ease',
          letterSpacing: 0.3
        }}
      >
        {loading ? 'Procesando...' : 'Pagar ahora'}
      </button>
    </form>
  );
}

function Checkout({ cart }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 16px' }}>
      <HoloText size={32} style={{ display: 'block', marginBottom: 28, fontWeight: 800 }}>
        Checkout
      </HoloText>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 24
      }}>
        {/* Resumen de orden */}
        <GlassCard padding={24}>
          <p style={{ fontWeight: 700, fontSize: 18, color: '#0a0b0d', margin: '0 0 20px' }}>
            Resumen del pedido
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {cart.map((item) => (
              <div
                key={item.productId}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  paddingBottom: 12, borderBottom: '1px solid rgba(201,206,212,0.15)'
                }}
              >
                <div>
                  <p style={{ fontWeight: 600, fontSize: 14, color: '#0a0b0d', margin: 0 }}>{item.name}</p>
                  <p style={{ fontSize: 12, color: 'rgba(10,11,13,0.5)', margin: '2px 0 0' }}>
                    x{item.quantity}
                  </p>
                </div>
                <p style={{ fontWeight: 700, fontSize: 14, color: '#0a0b0d', margin: 0 }}>
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginTop: 20, paddingTop: 16, borderTop: '1.5px solid rgba(201,206,212,0.2)'
          }}>
            <span style={{ fontWeight: 700, fontSize: 16, color: '#0a0b0d' }}>Total</span>
            <span style={{
              fontWeight: 800, fontSize: 20,
              background: HOLO, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
            }}>
              ${(total * 1.1).toFixed(2)}
            </span>
          </div>
        </GlassCard>

        {/* Método de pago */}
        <GlassCard padding={24}>
          <p style={{ fontWeight: 700, fontSize: 18, color: '#0a0b0d', margin: '0 0 20px' }}>
            Método de pago
          </p>

          <Elements stripe={stripePromise}>
            <CheckoutForm cart={cart} />
          </Elements>
        </GlassCard>
      </div>
    </div>
  );
}

export default Checkout;
