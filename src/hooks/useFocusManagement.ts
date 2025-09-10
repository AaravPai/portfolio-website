import { useEffect, useRef, useCallback } from 'react';
import { trapFocus, manageFocus } from '../utils/accessibility';

interface UseFocusManagementOptions {
  trapFocus?: boolean;
  restoreFocus?: boolean;
  autoFocus?: boolean;
}

export const useFocusManagement = (
  isActive: boolean,
  options: UseFocusManagementOptions = {}
) => {
  const { trapFocus: shouldTrapFocus = false, restoreFocus = true, autoFocus = true } = options;
  const containerRef = useRef<HTMLElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const trapCleanupRef = useRef<(() => void) | null>(null);

  // Store the previously focused element when becoming active
  useEffect(() => {
    if (isActive && restoreFocus) {
      previousFocusRef.current = manageFocus.storeFocus();
    }
  }, [isActive, restoreFocus]);

  // Set up focus trapping when active
  useEffect(() => {
    if (isActive && shouldTrapFocus && containerRef.current) {
      trapCleanupRef.current = trapFocus(containerRef.current);
      
      // Auto-focus the first focusable element
      if (autoFocus) {
        const firstFocusable = containerRef.current.querySelector(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) as HTMLElement;
        
        if (firstFocusable) {
          // Use setTimeout to ensure the element is rendered
          setTimeout(() => firstFocusable.focus(), 0);
        }
      }
    }

    return () => {
      if (trapCleanupRef.current) {
        trapCleanupRef.current();
        trapCleanupRef.current = null;
      }
    };
  }, [isActive, shouldTrapFocus, autoFocus]);

  // Restore focus when becoming inactive
  useEffect(() => {
    if (!isActive && restoreFocus && previousFocusRef.current) {
      manageFocus.restoreFocus(previousFocusRef.current);
      previousFocusRef.current = null;
    }
  }, [isActive, restoreFocus]);

  const focusFirstElement = useCallback(() => {
    if (containerRef.current) {
      const firstFocusable = containerRef.current.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement;
      
      if (firstFocusable) {
        firstFocusable.focus();
      }
    }
  }, []);

  const focusLastElement = useCallback(() => {
    if (containerRef.current) {
      const focusableElements = containerRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;
      
      if (lastFocusable) {
        lastFocusable.focus();
      }
    }
  }, []);

  return {
    containerRef,
    focusFirstElement,
    focusLastElement,
  };
};

// Hook for managing focus on route changes or section navigation
export const useRouteAnnouncement = () => {
  const announceRouteChange = useCallback((routeName: string) => {
    // Create or update the route announcement
    let announcer = document.getElementById('route-announcer');
    if (!announcer) {
      announcer = document.createElement('div');
      announcer.id = 'route-announcer';
      announcer.setAttribute('aria-live', 'assertive');
      announcer.setAttribute('aria-atomic', 'true');
      announcer.className = 'sr-only';
      document.body.appendChild(announcer);
    }
    
    // Clear and then set the announcement
    announcer.textContent = '';
    setTimeout(() => {
      announcer!.textContent = `Navigated to ${routeName}`;
    }, 100);
  }, []);

  return { announceRouteChange };
};

// Hook for keyboard navigation within components
export const useKeyboardNavigation = (
  items: HTMLElement[],
  options: {
    loop?: boolean;
    orientation?: 'horizontal' | 'vertical';
    activateOnFocus?: boolean;
  } = {}
) => {
  const { loop = true, orientation = 'horizontal', activateOnFocus = false } = options;
  const currentIndexRef = useRef(0);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const { key } = event;
    let newIndex = currentIndexRef.current;

    switch (key) {
      case 'ArrowRight':
      case 'ArrowDown':
        if (orientation === 'horizontal' && key === 'ArrowDown') break;
        if (orientation === 'vertical' && key === 'ArrowRight') break;
        
        event.preventDefault();
        newIndex = currentIndexRef.current + 1;
        if (newIndex >= items.length) {
          newIndex = loop ? 0 : items.length - 1;
        }
        break;

      case 'ArrowLeft':
      case 'ArrowUp':
        if (orientation === 'horizontal' && key === 'ArrowUp') break;
        if (orientation === 'vertical' && key === 'ArrowLeft') break;
        
        event.preventDefault();
        newIndex = currentIndexRef.current - 1;
        if (newIndex < 0) {
          newIndex = loop ? items.length - 1 : 0;
        }
        break;

      case 'Home':
        event.preventDefault();
        newIndex = 0;
        break;

      case 'End':
        event.preventDefault();
        newIndex = items.length - 1;
        break;

      default:
        return;
    }

    if (newIndex !== currentIndexRef.current && items[newIndex]) {
      currentIndexRef.current = newIndex;
      items[newIndex].focus();
      
      if (activateOnFocus) {
        items[newIndex].click();
      }
    }
  }, [items, loop, orientation, activateOnFocus]);

  const setCurrentIndex = useCallback((index: number) => {
    if (index >= 0 && index < items.length) {
      currentIndexRef.current = index;
    }
  }, [items.length]);

  return {
    handleKeyDown,
    setCurrentIndex,
    currentIndex: currentIndexRef.current,
  };
};