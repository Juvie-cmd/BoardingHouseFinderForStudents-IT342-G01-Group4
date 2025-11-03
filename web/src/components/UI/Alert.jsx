import React from 'react';

export function Alert({ children, variant = 'info', className = '' }) {
  const variantClass = `alert-${variant}`;

  return (
    <div className={`alert ${variantClass} ${className}`}>
      {children}
    </div>
  );
}
