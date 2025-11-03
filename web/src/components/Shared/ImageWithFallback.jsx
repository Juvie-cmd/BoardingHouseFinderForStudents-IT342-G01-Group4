import React, { useState } from 'react';

export function ImageWithFallback({ src, alt, className }) {
  const [error, setError] = useState(false);

  // Creates a placeholder image URL based on the alt text
  const fallbackImage = `https://via.placeholder.com/400x300.png?text=${alt.replace(/\s/g, '+')}`;

  const handleError = () => {
    setError(true);
  };

  return (
    <img
      src={error ? fallbackImage : src}
      alt={alt}
      className={className}
      onError={handleError}
    />
  );
}