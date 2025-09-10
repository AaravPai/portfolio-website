import { renderHook } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { useScrollAnimation, animationVariants } from './useScrollAnimation';

// Mock IntersectionObserver
const mockObserve = vi.fn();
const mockUnobserve = vi.fn();
const mockDisconnect = vi.fn();

const mockIntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: mockObserve,
  unobserve: mockUnobserve,
  disconnect: mockDisconnect,
}));

window.IntersectionObserver = mockIntersectionObserver;

describe('useScrollAnimation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with isVisible false', () => {
    const { result } = renderHook(() => useScrollAnimation());

    expect(result.current.isVisible).toBe(false);
    expect(result.current.elementRef.current).toBe(null);
  });

  it('should provide elementRef for DOM element attachment', () => {
    const { result } = renderHook(() => useScrollAnimation());

    expect(result.current.elementRef).toBeDefined();
    expect(typeof result.current.elementRef).toBe('object');
  });

  it('should accept custom options', () => {
    const options = {
      threshold: 0.5,
      rootMargin: '10px',
      triggerOnce: false,
    };

    const { result } = renderHook(() => useScrollAnimation(options));

    // Should still initialize properly with custom options
    expect(result.current.isVisible).toBe(false);
    expect(result.current.elementRef).toBeDefined();
  });
});

describe('animationVariants', () => {
  it('should have correct animation variants', () => {
    expect(animationVariants.fadeIn).toEqual({
      initial: { opacity: 0 },
      animate: { opacity: 1 },
    });

    expect(animationVariants.slideUp).toEqual({
      initial: { opacity: 0, transform: 'translateY(30px)' },
      animate: { opacity: 1, transform: 'translateY(0)' },
    });

    expect(animationVariants.slideDown).toEqual({
      initial: { opacity: 0, transform: 'translateY(-30px)' },
      animate: { opacity: 1, transform: 'translateY(0)' },
    });

    expect(animationVariants.slideLeft).toEqual({
      initial: { opacity: 0, transform: 'translateX(30px)' },
      animate: { opacity: 1, transform: 'translateX(0)' },
    });

    expect(animationVariants.slideRight).toEqual({
      initial: { opacity: 0, transform: 'translateX(-30px)' },
      animate: { opacity: 1, transform: 'translateX(0)' },
    });

    expect(animationVariants.scale).toEqual({
      initial: { opacity: 0, transform: 'scale(0.9)' },
      animate: { opacity: 1, transform: 'scale(1)' },
    });
  });
});