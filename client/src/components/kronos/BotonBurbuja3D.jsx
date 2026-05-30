import React from 'react';
import './BotonBurbuja3D.css';

/**
 * BotonBurbuja3D — Esfera 3D negra con filo plateado metálico
 *
 * Props:
 *   icon     — emoji o elemento React para el icono (ej: '👤')
 *   label    — texto plateado debajo de la esfera
 *   size     — 'sm' | 'md' | 'lg'  (default: 'md')
 *   variant  — 'sphere' | 'pill' | 'icon-only'  (default: 'sphere')
 *   disabled — boolean
 *   onClick  — function
 *   as       — tag HTML  (default: 'button')
 *   children — alternativa a icon+label (se pone dentro de la esfera)
 */
function BotonBurbuja3D({
  children,
  icon,
  label,
  size = 'md',
  variant = 'sphere',
  disabled = false,
  onClick,
  as: Tag = 'button',
  className = '',
  style = {},
  type,
  ...props
}) {
  const classes = [
    'btn-burbuja-3d',
    `size-${size}`,
    variant === 'pill'      ? 'pill'      : '',
    variant === 'icon-only' ? 'icon-only' : '',
    className,
  ].filter(Boolean).join(' ');

  const isBtn = Tag === 'button';

  return (
    <Tag
      className={classes}
      onClick={disabled ? undefined : onClick}
      disabled={isBtn ? disabled : undefined}
      aria-disabled={disabled}
      style={style}
      type={isBtn ? (type || 'button') : undefined}
      {...props}
    >
      {/* Esfera con icono */}
      <div className="sphere">
        <div className="sphere-icon">
          {icon || children}
        </div>
      </div>

      {/* Label plateado (solo en variante sphere o pill) */}
      {label && variant !== 'icon-only' && (
        <span className="sphere-label">{label}</span>
      )}
    </Tag>
  );
}

export default BotonBurbuja3D;
