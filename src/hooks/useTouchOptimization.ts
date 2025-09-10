import { useEffect, useCallback } from 'react';

interface TouchOptimizationOptions {
  preventPinchZoom?: boolean;
  preventDoubleTapZoom?: boolean;
  optimizeScrolling?: boolean;
}

export const useTouchOptimization = (options: TouchOptimizationOptions = {}) => {
  const {
    preventPinchZoom = false,
    preventDoubleTapZoom = false,
    optimizeScrolling = true,
  } = options;

  const handleTouchStart = useCallback((event: TouchEvent) => {
    // Prevent pinch zoom
    if (preventPinchZoom && event.touches.length > 1) {
      event.preventDefault();
    }
  }, [preventPinchZoom]);

  const handleTouchMove = useCallback((event: TouchEvent) => {
    // Prevent pinch zoom during move
    if (preventPinchZoom && event.touches.length > 1) {
      event.preventDefault();
    }
  }, [preventPinchZoom]);

  const handleTouchEnd = useCallback((event: TouchEvent) => {
    // Prevent double-tap zoom
    if (preventDoubleTapZoom) {
      event.preventDefault();
    }
  }, [preventDoubleTapZoom]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Add touch event listeners
    if (preventPinchZoom) {
      document.addEventListener('touchstart', handleTouchStart, { passive: false });
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
    }

    if (preventDoubleTapZoom) {
      document.addEventListener('touchend', handleTouchEnd, { passive: false });
    }

    // Optimize scrolling performance
    if (optimizeScrolling) {
      // Add CSS for smooth scrolling on touch devices
      document.documentElement.style.setProperty('-webkit-overflow-scrolling', 'touch');
      document.documentElement.style.setProperty('scroll-behavior', 'smooth');
    }

    return () => {
      if (preventPinchZoom) {
        document.removeEventListener('touchstart', handleTouchStart);
        document.removeEventListener('touchmove', handleTouchMove);
      }

      if (preventDoubleTapZoom) {
        document.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, preventPinchZoom, preventDoubleTapZoom, optimizeScrolling]);

  // Utility function to check if device supports touch
  const isTouchDevice = useCallback(() => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }, []);

  // Utility function to get touch-friendly button size
  const getTouchButtonSize = useCallback(() => {
    return isTouchDevice() ? '44px' : '40px';
  }, [isTouchDevice]);

  return {
    isTouchDevice,
    getTouchButtonSize,
  };
};