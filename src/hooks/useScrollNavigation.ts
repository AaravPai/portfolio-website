import { useState, useEffect, useCallback } from 'react';

interface UseScrollNavigationOptions {
  threshold?: number;
  rootMargin?: string;
}

interface ScrollNavigationState {
  activeSection: string;
  isScrolled: boolean;
  showBackToTop: boolean;
}

export const useScrollNavigation = (
  sectionIds: string[],
  options: UseScrollNavigationOptions = {}
): ScrollNavigationState => {
  const { threshold = 0.3, rootMargin = '-20% 0px -70% 0px' } = options;
  
  const [activeSection, setActiveSection] = useState<string>('');
  const [isScrolled, setIsScrolled] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Handle scroll position for header styling and back-to-top button
  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    setIsScrolled(scrollY > 50);
    setShowBackToTop(scrollY > 300);
  }, []);

  // Set up intersection observer for active section detection
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    // Observe all sections
    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [sectionIds, threshold, rootMargin]);

  // Set up scroll listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Call once to set initial state

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return {
    activeSection,
    isScrolled,
    showBackToTop,
  };
};

// Smooth scroll utility function
export const smoothScrollTo = (elementId: string, offset: number = 0): void => {
  const element = document.getElementById(elementId);
  if (element) {
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
  }
};

// Scroll to top utility function
export const scrollToTop = (): void => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};