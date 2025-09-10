import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useTouchOptimization } from './useTouchOptimization';

// Mock navigator.maxTouchPoints
const mockTouchPoints = (points: number) => {
  Object.defineProperty(navigator, 'maxTouchPoints', {
    writable: true,
    configurable: true,
    value: points,
  });
};

// Mock ontouchstart
const mockTouchStart = (exists: boolean) => {
  if (exists) {
    (window as any).ontouchstart = {};
  } else {
    delete (window as any).ontouchstart;
  }
};

describe('useTouchOptimization', () => {
  beforeEach(() => {
    // Reset to non-touch device by default
    mockTouchPoints(0);
    mockTouchStart(false);
    
    // Mock document methods
    vi.spyOn(document, 'addEventListener');
    vi.spyOn(document, 'removeEventListener');
  });

  afterEach(() => {
    vi.restoreAllMocks();
    // Clean up touch properties
    delete (window as any).ontouchstart;
    mockTouchPoints(0);
  });

  describe('Touch Device Detection', () => {
    it('should detect touch device via ontouchstart', () => {
      mockTouchStart(true);
      mockTouchPoints(0);

      const { result } = renderHook(() => useTouchOptimization());

      expect(result.current.isTouchDevice()).toBe(true);
    });

    it('should detect touch device via maxTouchPoints', () => {
      mockTouchStart(false);
      mockTouchPoints(1);

      const { result } = renderHook(() => useTouchOptimization());

      expect(result.current.isTouchDevice()).toBe(true);
    });

    it('should detect non-touch device', () => {
      mockTouchStart(false);
      mockTouchPoints(0);

      const { result } = renderHook(() => useTouchOptimization());

      expect(result.current.isTouchDevice()).toBe(false);
    });
  });

  describe('Touch Button Sizing', () => {
    it('should return larger button size for touch devices', () => {
      mockTouchStart(true);

      const { result } = renderHook(() => useTouchOptimization());

      expect(result.current.getTouchButtonSize()).toBe('44px');
    });

    it('should return smaller button size for non-touch devices', () => {
      mockTouchStart(false);
      mockTouchPoints(0);

      const { result } = renderHook(() => useTouchOptimization());

      expect(result.current.getTouchButtonSize()).toBe('40px');
    });
  });

  describe('Pinch Zoom Prevention', () => {
    it('should add touch event listeners when preventPinchZoom is true', () => {
      renderHook(() => 
        useTouchOptimization({ preventPinchZoom: true })
      );

      expect(document.addEventListener).toHaveBeenCalledWith(
        'touchstart',
        expect.any(Function),
        { passive: false }
      );
      expect(document.addEventListener).toHaveBeenCalledWith(
        'touchmove',
        expect.any(Function),
        { passive: false }
      );
    });

    it('should not add touch event listeners when preventPinchZoom is false', () => {
      renderHook(() => 
        useTouchOptimization({ preventPinchZoom: false })
      );

      expect(document.addEventListener).not.toHaveBeenCalledWith(
        'touchstart',
        expect.any(Function),
        { passive: false }
      );
    });

    it('should remove event listeners on unmount', () => {
      const { unmount } = renderHook(() => 
        useTouchOptimization({ preventPinchZoom: true })
      );

      unmount();

      expect(document.removeEventListener).toHaveBeenCalledWith(
        'touchstart',
        expect.any(Function)
      );
      expect(document.removeEventListener).toHaveBeenCalledWith(
        'touchmove',
        expect.any(Function)
      );
    });
  });

  describe('Double Tap Zoom Prevention', () => {
    it('should add touchend listener when preventDoubleTapZoom is true', () => {
      renderHook(() => 
        useTouchOptimization({ preventDoubleTapZoom: true })
      );

      expect(document.addEventListener).toHaveBeenCalledWith(
        'touchend',
        expect.any(Function),
        { passive: false }
      );
    });

    it('should not add touchend listener when preventDoubleTapZoom is false', () => {
      renderHook(() => 
        useTouchOptimization({ preventDoubleTapZoom: false })
      );

      expect(document.addEventListener).not.toHaveBeenCalledWith(
        'touchend',
        expect.any(Function),
        { passive: false }
      );
    });
  });

  describe('Scroll Optimization', () => {
    it('should set CSS properties for scroll optimization', () => {
      const setPropertySpy = vi.spyOn(document.documentElement.style, 'setProperty');

      renderHook(() => 
        useTouchOptimization({ optimizeScrolling: true })
      );

      expect(setPropertySpy).toHaveBeenCalledWith('-webkit-overflow-scrolling', 'touch');
      expect(setPropertySpy).toHaveBeenCalledWith('scroll-behavior', 'smooth');
    });

    it('should not set CSS properties when optimizeScrolling is false', () => {
      const setPropertySpy = vi.spyOn(document.documentElement.style, 'setProperty');

      renderHook(() => 
        useTouchOptimization({ optimizeScrolling: false })
      );

      expect(setPropertySpy).not.toHaveBeenCalledWith('-webkit-overflow-scrolling', 'touch');
      expect(setPropertySpy).not.toHaveBeenCalledWith('scroll-behavior', 'smooth');
    });
  });

  describe('Event Handling', () => {
    it('should prevent default on multi-touch when preventPinchZoom is enabled', () => {
      let touchStartHandler: (event: TouchEvent) => void;
      
      vi.spyOn(document, 'addEventListener').mockImplementation((event, handler) => {
        if (event === 'touchstart') {
          touchStartHandler = handler as (event: TouchEvent) => void;
        }
      });

      renderHook(() => 
        useTouchOptimization({ preventPinchZoom: true })
      );

      // Create mock touch event with multiple touches
      const mockEvent = {
        touches: [{ clientX: 100, clientY: 100 }, { clientX: 200, clientY: 200 }],
        preventDefault: vi.fn(),
      } as any;

      touchStartHandler!(mockEvent);

      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });

    it('should not prevent default on single touch', () => {
      let touchStartHandler: (event: TouchEvent) => void;
      
      vi.spyOn(document, 'addEventListener').mockImplementation((event, handler) => {
        if (event === 'touchstart') {
          touchStartHandler = handler as (event: TouchEvent) => void;
        }
      });

      renderHook(() => 
        useTouchOptimization({ preventPinchZoom: true })
      );

      // Create mock touch event with single touch
      const mockEvent = {
        touches: [{ clientX: 100, clientY: 100 }],
        preventDefault: vi.fn(),
      } as any;

      touchStartHandler!(mockEvent);

      expect(mockEvent.preventDefault).not.toHaveBeenCalled();
    });

    it('should prevent default on touchend when preventDoubleTapZoom is enabled', () => {
      let touchEndHandler: (event: TouchEvent) => void;
      
      vi.spyOn(document, 'addEventListener').mockImplementation((event, handler) => {
        if (event === 'touchend') {
          touchEndHandler = handler as (event: TouchEvent) => void;
        }
      });

      renderHook(() => 
        useTouchOptimization({ preventDoubleTapZoom: true })
      );

      const mockEvent = {
        preventDefault: vi.fn(),
      } as any;

      touchEndHandler!(mockEvent);

      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });
  });

  describe('Default Options', () => {
    it('should use default options when none provided', () => {
      const setPropertySpy = vi.spyOn(document.documentElement.style, 'setProperty');

      renderHook(() => useTouchOptimization());

      // Should enable scroll optimization by default
      expect(setPropertySpy).toHaveBeenCalledWith('-webkit-overflow-scrolling', 'touch');
      expect(setPropertySpy).toHaveBeenCalledWith('scroll-behavior', 'smooth');

      // Should not add pinch zoom or double tap prevention by default
      expect(document.addEventListener).not.toHaveBeenCalledWith(
        'touchstart',
        expect.any(Function),
        { passive: false }
      );
      expect(document.addEventListener).not.toHaveBeenCalledWith(
        'touchend',
        expect.any(Function),
        { passive: false }
      );
    });
  });
});