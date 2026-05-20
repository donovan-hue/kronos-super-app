import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function EmptyState({
  icon = '🌌',
  title = 'Nada por aquí',
  subtitle = '',
  ctaLabel = '',
  ctaHref = '',
  onCta = null,
}) {
  const navigate = useNavigate();

  const handleCta = () => {
    if (onCta) return onCta();
    if (ctaHref) navigate(ctaHref);
  };

  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="text-6xl mb-4 select-none">{icon}</div>
      <h3 className="text-xl font-semibold text-white/80 mb-2">{title}</h3>
      {subtitle && <p className="text-white/40 text-sm mb-6 max-w-xs">{subtitle}</p>}
      {ctaLabel && (
        <button
          onClick={handleCta}
          className="px-6 py-2 rounded-full text-sm font-medium bg-purple-600 hover:bg-purple-500 text-white transition-colors"
        >
          {ctaLabel}
        </button>
      )}
    </div>
  );
}
