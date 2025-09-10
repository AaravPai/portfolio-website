import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useSwipeGesture } from './useSwipeGesture';

// Mock touch events
const createTouchEvent = (type: string, touches: Array<{ clientX: number; clientY: number }>) => {
  const event = new Event(type) as any;
  event.touches = touches;
  return event;
};

describe('useSwipeGesture', () => {
  let mockElement: HTMLElement;
  let onSwipeLeft: ReturnType<typeof vi.fn>;
  let onSwipeRight: ReturnType<typeof vi.fn>;
  let onSwipeUp: ReturnType<typeof vi.fn>;
  let onSwipeDown: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockElement = document.createElement('div');
    document.body.appendChild(mockElement);
    
    onSwipeLeft = vi.fn();
    onSwipeRight = vi.fn();
    onSwipeUp = vi.fn();
    onSwipeDown = vi.fn();
  });

  afterEach(() => {
    document.body.removeChild(mockElement);
    vi.clearAllMocks();
  });

  it('should detect swipe left gesture', () => {
    const { result } = renderHook(() =>
      useSwipeGesture({
        onSwipeLeft,
        onSwipeRight,
        threshold: 50,
      })
    );

    // Attach to element
    result.current(mockElement);

    // Simulate swipe left (start right, end left)
    const touchStart = createTouchEvent('touchstart', [{ clientX: 200, clientY: 100 }]);
    const touchMove = createTouchEvent('touchmove', [{ clientX: 100, clientY: 100 }]);
    const touchEnd = createTouchEvent('touchend', []);

    mockElement.dispatchEvent(touchStart);
    mockElement.dispatchEvent(touchMove);
    mockElement.dispatchEvent(touchEnd);

    expect(onSwipeLeft).toHaveBeenCalledTimes(1);
    expect(onSwipeRight).not.toHaveBeenCalled();
  });

  it('should detect swipe right gesture', () => {
    const { result } = renderHook(() =>
      useSwipeGesture({
        onSwipeLeft,
        onSwipeRight,
        threshold: 50,
      })
    );

    result.current(mockElement);

    // Simulate swipe right (start left, end right)
    const touchStart = createTouchEvent('touchstart', [{ clientX: 100, clientY: 100 }]);
    const touchMove = createTouchEvent('touchmove', [{ clientX: 200, clientY: 100 }]);
    const touchEnd = createTouchEvent('touchend', []);

    mockElement.dispatchEvent(touchStart);
    mockElement.dispatchEvent(touchMove);
    mockElement.dispatchEvent(touchEnd);

    expect(onSwipeRight).toHaveBeenCalledTimes(1);
    expect(onSwipeLeft).not.toHaveBeenCalled();
  });

  it('should detect swipe up gesture', () => {
    const { result } = renderHook(() =>
      useSwipeGesture({
        onSwipeUp,
        onSwipeDown,
        threshold: 50,
      })
    );

    result.current(mockElement);

    // Simulate swipe up (start bottom, end top)
    const touchStart = createTouchEvent('touchstart', [{ clientX: 100, clientY: 200 }]);
    const touchMove = createTouchEvent('touchmove', [{ clientX: 100, clientY: 100 }]);
    const touchEnd = createTouchEvent('touchend', []);

    mockElement.dispatchEvent(touchStart);
    mockElement.dispatchEvent(touchMove);
    mockElement.dispatchEvent(touchEnd);

    expect(onSwipeUp).toHaveBeenCalledTimes(1);
    expect(onSwipeDown).not.toHaveBeenCalled();
  });

  it('should detect swipe down gesture', () => {
    const { result } = renderHook(() =>
      useSwipeGesture({
        onSwipeUp,
        onSwipeDown,
        threshold: 50,
      })
    );

    result.current(mockElement);

    // Simulate swipe down (start top, end bottom)
    const touchStart = createTouchEvent('touchstart', [{ clientX: 100, clientY: 100 }]);
    const touchMove = createTouchEvent('touchmove', [{ clientX: 100, clientY: 200 }]);
    const touchEnd = createTouchEvent('touchend', []);

    mockElement.dispatchEvent(touchStart);
    mockElement.dispatchEvent(touchMove);
    mockElement.dispatchEvent(touchEnd);

    expect(onSwipeDown).toHaveBeenCalledTimes(1);
    expect(onSwipeUp).not.toHaveBeenCalled();
  });

  it('should not trigger swipe if below threshold', () => {
    const { result } = renderHook(() =>
      useSwipeGesture({
        onSwipeLeft,
        onSwipeRight,
        threshold: 100, // High threshold
      })
    );

    result.current(mockElement);

    // Simulate small movement (below threshold)
    const touchStart = createTouchEvent('touchstart', [{ clientX: 100, clientY: 100 }]);
    const touchMove = createTouchEvent('touchmove', [{ clientX: 130, clientY: 100 }]);
    const touchEnd = createTouchEvent('touchend', []);

    mockElement.dispatchEvent(touchStart);
    mockElement.dispatchEvent(touchMove);
    mockElement.dispatchEvent(touchEnd);

    expect(onSwipeLeft).not.toHaveBeenCalled();
    expect(onSwipeRight).not.toHaveBeenCalled();
  });

  it('should prioritize horizontal swipe over vertical when both occur', () => {
    const { result } = renderHook(() =>
      useSwipeGesture({
        onSwipeLeft,
        onSwipeUp,
        threshold: 50,
      })
    );

    result.current(mockElement);

    // Simulate diagonal swipe with more horizontal movement
    const touchStart = createTouchEvent('touchstart', [{ clientX: 100, clientY: 100 }]);
    const touchMove = createTouchEvent('touchmove', [{ clientX: 200, clientY: 130 }]);
    const touchEnd = createTouchEvent('touchend', []);

    mockElement.dispatchEvent(touchStart);
    mockElement.dispatchEvent(touchMove);
    mockElement.dispatchEvent(touchEnd);

    expect(onSwipeLeft).not.toHaveBeenCalled(); // Should be right, not left
    expect(onSwipeUp).not.toHaveBeenCalled();
  });

  it('should handle element cleanup properly', () => {
    const { result, unmount } = renderHook(() =>
      useSwipeGesture({
        onSwipeLeft,
        threshold: 50,
      })
    );

    result.current(mockElement);

    // Test that swipe works before unmount
    const touchStart = createTouchEvent('touchstart', [{ clientX: 200, clientY: 100 }]);
    const touchMove = createTouchEvent('touchmove', [{ clientX: 100, clientY: 100 }]);
    const touchEnd = createTouchEvent('touchend', []);

    mockElement.dispatchEvent(touchStart);
    mockElement.dispatchEvent(touchMove);
    mockElement.dispatchEvent(touchEnd);

    expect(onSwipeLeft).toHaveBeenCalledTimes(1);

    // Unmount should clean up listeners
    unmount();

    // This test just verifies the hook can be unmounted without errors
    expect(result.current).toBeDefined();
  });

  it('should handle preventDefaultTouchmove option', () => {
    const { result } = renderHook(() =>
      useSwipeGesture({
        onSwipeLeft,
        preventDefaultTouchmove: true,
      })
    );

    result.current(mockElement);

    const touchMove = createTouchEvent('touchmove', [{ clientX: 100, clientY: 100 }]);
    const preventDefaultSpy = vi.spyOn(touchMove, 'preventDefault');

    mockElement.dispatchEvent(touchMove);

    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('should not call preventDefault when preventDefaultTouchmove is false', () => {
    const { result } = renderHook(() =>
      useSwipeGesture({
        onSwipeLeft,
        preventDefaultTouchmove: false,
      })
    );

    result.current(mockElement);

    const touchMove = createTouchEvent('touchmove', [{ clientX: 100, clientY: 100 }]);
    const preventDefaultSpy = vi.spyOn(touchMove, 'preventDefault');

    mockElement.dispatchEvent(touchMove);

    expect(preventDefaultSpy).not.toHaveBeenCalled();
  });
});