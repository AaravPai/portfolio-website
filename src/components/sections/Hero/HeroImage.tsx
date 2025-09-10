import React, { useState, useCallback } from 'react';

interface HeroImageProps {
  src: string;
  alt: string;
  fallbackName: string;
  className?: string;
}

const HeroImage: React.FC<HeroImageProps> = ({ 
  src, 
  alt, 
  fallbackName, 
  className = '' 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoaded(true);
  }, []);

  const fallbackSrc = `https://ui-avatars.com/api/?name=${encodeURIComponent(fallbackName)}&size=400&background=007bff&color=fff`;

  return (
    <div className={`hero-image-container ${className}`}>
      {!imageLoaded && (
        <div className="hero-image-skeleton" aria-hidden="true">
          <div className="hero-image-skeleton__circle"></div>
        </div>
      )}
      <img
        src={imageError ? fallbackSrc : src}
        alt={alt}
        className={`hero__image ${imageLoaded ? 'hero__image--loaded' : ''}`}
        loading="eager"
        onLoad={handleImageLoad}
        onError={handleImageError}
        style={{ 
          opacity: imageLoaded ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out'
        }}
      />
    </div>
  );
};

export default HeroImage;