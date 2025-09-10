import React, { useState } from 'react';
import LazyImage from '../LazyImage';
import './OptimizedImage.css';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  priority = false
}) => {
  const [imageFormat, setImageFormat] = useState<'webp' | 'avif' | 'original'>('original');

  // Generate different format URLs
  const getOptimizedSrc = (format: 'webp' | 'avif' | 'original') => {
    if (format === 'original') return src;
    
    const extension = src.split('.').pop();
    const basePath = src.replace(`.${extension}`, '');
    return `${basePath}.${format}`;
  };

  // Check if browser supports modern formats
  const supportsWebP = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  };

  const supportsAVIF = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
  };

  // Determine best format to use
  React.useEffect(() => {
    if (supportsAVIF()) {
      setImageFormat('avif');
    } else if (supportsWebP()) {
      setImageFormat('webp');
    } else {
      setImageFormat('original');
    }
  }, []);

  if (priority) {
    // For priority images, use native img with srcset
    return (
      <picture className={`optimized-image ${className}`}>
        <source
          srcSet={`${getOptimizedSrc('avif')} 1x, ${getOptimizedSrc('avif')} 2x`}
          type="image/avif"
        />
        <source
          srcSet={`${getOptimizedSrc('webp')} 1x, ${getOptimizedSrc('webp')} 2x`}
          type="image/webp"
        />
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          className="optimized-image-element"
          loading="eager"
        />
      </picture>
    );
  }

  // For non-priority images, use lazy loading
  return (
    <picture className={`optimized-image ${className}`}>
      <source
        srcSet={`${getOptimizedSrc('avif')} 1x, ${getOptimizedSrc('avif')} 2x`}
        type="image/avif"
      />
      <source
        srcSet={`${getOptimizedSrc('webp')} 1x, ${getOptimizedSrc('webp')} 2x`}
        type="image/webp"
      />
      <LazyImage
        src={getOptimizedSrc(imageFormat)}
        alt={alt}
        width={width}
        height={height}
        className="optimized-image-element"
      />
    </picture>
  );
};

export default OptimizedImage;