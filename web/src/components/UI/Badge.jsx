import React from 'react';

export function Badge({ children, variant = 'primary', className = '' }) {
  const variantClass = `badge-${variant}`;

  return (
    <span className={`badge ${variantClass} ${className}`}>
      {children}
    </span>
  );
}
