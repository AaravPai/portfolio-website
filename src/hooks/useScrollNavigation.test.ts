import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useScrollNavigation, smoothScrollTo, scrollToTop } from './useScrollNavigation';

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
});
window.IntersectionObserver = mockIntersectionObserver;

// Mock window.scrollTo
const mockScrollTo = vi.fn();
window.scrollTo = mockScrollTo;

// Mock getBoundingClientRect
const mockGetBoundingClientRect = vi.fn();
Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;

describe('useScrollNavigation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetBoundingClientRect.mockReturnValue({
      top: 100,
      left: 0,
      right: 0,
      bottom: 200,
      width: 100,
      height: 100,
    });
    Object.defineProperty(window, 'pageYOffset', {
      value: 0,
      writable: true,
    });
  });

  afterEach(() => {
    // Clean up event listeners
    window.removeEventListener('scroll', vi.fn());
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => 
      useScrollNavigation(['section1', 'section2'])
    );

    expect(result.current.activeSection).toBe('');
    expect(result.current.isScrolled).toBe(false);
    expect(result.current.showBackToTop).toBe(false);
  });

  it('should set up intersection observer for provided sections', () => {
    const sectionIds = ['section1', 'section2'];
    
    // Mock getElementById to return elements
    const mockElement1 = document.createElement('div');
    const mockElement2 = document.createElement('div');
    mockElement1.id = 'section1';
    mockElement2.id = 'section2';
    
    vi.spyOn(document, 'getElementById')
      .mockImplementation((id) => {
        if (id === 'section1') return mockElement1;
        if (id === 'section2') return mockElement2;
        return null;
      });

    renderHook(() => useScrollNavigation(sectionIds));

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      {
        threshold: 0.3,
        rootMargin: '-20% 0px -70% 0px',
      }
    );
  });

  it('should update scroll state when scrolling', () => {
    const { result } = renderHook(() => 
      useScrollNavigation(['section1'])
    );

    // Simulate scroll event
    act(() => {
      Object.defineProperty(window, 'scrollY', {
        value: 100,
        writable: true,
      });
      window.dispatchEvent(new Event('scroll'));
    });

    expect(result.current.isScrolled).toBe(true);
    expect(result.current.showBackToTop).toBe(false);

    // Simulate more scrolling for back to top
    act(() => {
      Object.defineProperty(window, 'scrollY', {
        value: 400,
        writable: true,
      });
      window.dispatchEvent(new Event('scroll'));
    });

    expect(result.current.showBackToTop).toBe(true);
  });

  it('should accept custom options', () => {
    const customOptions = {
      threshold: 0.5,
      rootMargin: '0px',
    };

    renderHook(() => 
      useScrollNavigation(['section1'], customOptions)
    );

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      {
        threshold: 0.5,
        rootMargin: '0px',
      }
    );
  });
});

describe('smoothScrollTo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetBoundingClientRect.mockReturnValue({
      top: 100,
      left: 0,
      right: 0,
      bottom: 200,
      width: 100,
      height: 100,
    });
    Object.defineProperty(window, 'pageYOffset', {
      value: 0,
      writable: true,
    });
  });

  it('should scroll to element with smooth behavior', () => {
    const mockElement = document.createElement('div');
    mockElement.id = 'test-section';
    
    vi.spyOn(document, 'getElementById').mockReturnValue(mockElement);

    smoothScrollTo('test-section');

    expect(mockScrollTo).toHaveBeenCalledWith({
      top: 100, // getBoundingClientRect().top + pageYOffset - offset(0)
      behavior: 'smooth',
    });
  });

  it('should scroll to element with custom offset', () => {
    const mockElement = document.createElement('div');
    mockElement.id = 'test-section';
    
    vi.spyOn(document, 'getElementById').mockReturnValue(mockElement);

    smoothScrollTo('test-section', 80);

    expect(mockScrollTo).toHaveBeenCalledWith({
      top: 20, // getBoundingClientRect().top + pageYOffset - offset(80)
      behavior: 'smooth',
    });
  });

  it('should handle non-existent elements gracefully', () => {
    vi.spyOn(document, 'getElementById').mockReturnValue(null);

    smoothScrollTo('non-existent');

    expect(mockScrollTo).not.toHaveBeenCalled();
  });
});

describe('scrollToTop', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should scroll to top with smooth behavior', () => {
    scrollToTop();

    expect(mockScrollTo).toHaveBeenCalledWith({
      top: 0,
      behavior: 'smooth',
    });
  });
});