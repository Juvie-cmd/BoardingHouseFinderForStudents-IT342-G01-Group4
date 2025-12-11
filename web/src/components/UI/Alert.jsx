import React from 'react';

export function Alert({ children, variant = 'info', className = '', ...props }) {
  const variantClass = `alert-${variant}`;

  return (
    <div className={`alert ${variantClass} ${className}`} {...props}>
      {children}
    </div>
  );
}
