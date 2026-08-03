import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useSubscription from '../hooks/useSubscription';
import Icon from '../components/kronos/Icon';

export default function SubscriptionSuccess() {
  const { tier, refresh } = useSubscription();

  // El webhook procesa la activación; refrescamos un par de veces para
  // captar la actualización en cuanto llegue.
  useEffect(() => {
    const t1 = setTimeout(() => refresh(), 1500);
    const t2 = setTimeout(() => refresh(), 4000);
    const t3 = setTimeout(() => refresh(), 8000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [refresh]);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(130% 110% at 50% 0%, #141517 0%, #0a0a0b 46%, #040405 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        color: '#fff'
      }}
    >
      <div
        style={{
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(14px)',
          border: '1px solid rgba(168,85,247,0.35)',
          borderRadius: 18,
          padding: '40px 32px',
          maxWidth: 460,
          textAlign: 'center'
        }}
      >
        <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'center' }}><Icon name="sparkle" size={52} stroke="#a855f7" /></div>
        <h1
          style={{
            fontSize: 28,
            margin: '0 0 8px',
            background: 'linear-gradient(180deg,#2c2f32 0%,#1a1c1e 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 800
          }}
        >
          ¡Bienvenido a Kronos {tier === 'business' ? 'Business' : 'Pro'}!
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, marginBottom: 24 }}>
          Tu suscripción se está activando. Algunas funciones pueden tardar unos segundos
          en aparecer mientras Stripe confirma el pago.
        </p>
        <Link
          to="/feed"
          style={{
            display: 'inline-block',
            padding: '12px 28px',
            borderRadius: 12,
            background: 'linear-gradient(180deg,#2c2f32 0%,#1a1c1e 100%)',
            color: '#fff',
            textDecoration: 'none',
            fontWeight: 700,
            letterSpacing: 0.5
          }}
        >
          Ir al feed
        </Link>
      </div>
    </div>
  );
}
