/**
 * Image optimization utilities
 */

export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'avif' | 'jpeg' | 'png';
}

/**
 * Generate optimized image URL with query parameters
 */
export const getOptimizedImageUrl = (
  src: string,
  options: ImageOptimizationOptions = {}
): string => {
  const { width, height, quality = 85, format } = options;
  
  // For local development, return original src
  if (src.startsWith('/') || src.startsWith('./')) {
    return src;
  }
  
  // Build query parameters for image optimization services
  const params = new URLSearchParams();
  
  if (width) params.set('w', width.toString());
  if (height) params.set('h', height.toString());
  if (quality) params.set('q', quality.toString());
  if (format) params.set('f', format);
  
  const queryString = params.toString();
  return queryString ? `${src}?${queryString}` : src;
};

/**
 * Generate responsive image srcset
 */
export const generateSrcSet = (
  src: string,
  widths: number[] = [320, 640, 768, 1024, 1280, 1920],
  format?: 'webp' | 'avif' | 'jpeg' | 'png'
): string => {
  return widths
    .map(width => {
      const optimizedUrl = getOptimizedImageUrl(src, { width, format });
      return `${optimizedUrl} ${width}w`;
    })
    .join(', ');
};

/**
 * Preload critical images
 */
export const preloadImage = (src: string, options: ImageOptimizationOptions = {}): void => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = getOptimizedImageUrl(src, options);
  
  // Add responsive preload hints
  if (options.width) {
    link.setAttribute('imagesrcset', generateSrcSet(src, [options.width]));
    link.setAttribute('imagesizes', '100vw');
  }
  
  document.head.appendChild(link);
};

/**
 * Check if browser supports modern image formats
 */
export const checkImageFormatSupport = (): Promise<{
  webp: boolean;
  avif: boolean;
}> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    
    const webpSupport = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    
    // AVIF support check
    const avifImage = new Image();
    avifImage.onload = () => resolve({ webp: webpSupport, avif: true });
    avifImage.onerror = () => resolve({ webp: webpSupport, avif: false });
    avifImage.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';
  });
};

/**
 * Calculate optimal image dimensions based on container and device
 */
export const calculateOptimalDimensions = (
  containerWidth: number,
  containerHeight: number,
  devicePixelRatio: number = window.devicePixelRatio || 1
): { width: number; height: number } => {
  const width = Math.ceil(containerWidth * devicePixelRatio);
  const height = Math.ceil(containerHeight * devicePixelRatio);
  
  // Cap at reasonable maximums to avoid excessive file sizes
  const maxWidth = 2048;
  const maxHeight = 2048;
  
  return {
    width: Math.min(width, maxWidth),
    height: Math.min(height, maxHeight)
  };
};

/**
 * Image compression utility for client-side optimization
 */
export const compressImage = (
  file: File,
  maxWidth: number = 1920,
  maxHeight: number = 1080,
  quality: number = 0.8
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx?.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to compress image'));
          }
        },
        'image/jpeg',
        quality
      );
    };
    
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};