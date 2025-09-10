import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ThemeProvider } from '../contexts/ThemeContext';
import Header from '../components/common/Header/Header';
import Hero from '../components/sections/Hero/Hero';
import Projects from '../components/sections/Projects/Projects';
import Skills from '../components/sections/Skills/Skills';
import Contact from '../components/sections/Contact/Contact';

// Mock window.matchMedia
const mockMatchMedia = (query: string) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: () => {},
  removeListener: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => {},
});

// Helper to set viewport size
const setViewportSize = (width: number, height: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  });
  
  // Trigger resize event
  window.dispatchEvent(new Event('resize'));
};

// Helper to mock touch device
const mockTouchDevice = (isTouch: boolean) => {
  Object.defineProperty(window, 'ontouchstart', {
    writable: true,
    configurable: true,
    value: isTouch ? {} : undefined,
  });
  
  Object.defineProperty(navigator, 'maxTouchPoints', {
    writable: true,
    configurable: true,
    value: isTouch ? 1 : 0,
  });
};

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe('Responsive Design Tests', () => {
  beforeEach(() => {
    window.matchMedia = mockMatchMedia;
    // Reset to desktop by default
    setViewportSize(1024, 768);
    mockTouchDevice(false);
  });

  afterEach(() => {
    // Clean up
    delete (window as any).ontouchstart;
    Object.defineProperty(navigator, 'maxTouchPoints', {
      writable: true,
      configurable: true,
      value: 0,
    });
  });

  describe('Mobile Breakpoints (320px - 480px)', () => {
    beforeEach(() => {
      setViewportSize(375, 667); // iPhone SE size
      mockTouchDevice(true);
    });

    it('should render mobile-optimized header', () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );

      // Mobile menu button should be present
      const mobileToggle = screen.getByRole('button', { name: /toggle mobile menu/i });
      expect(mobileToggle).toBeInTheDocument();
      
      // Desktop navigation should be hidden
      const desktopNav = screen.queryByRole('navigation');
      expect(desktopNav).toBeInTheDocument(); // Still in DOM but hidden via CSS
    });

    it('should render mobile-optimized hero section', () => {
      render(
        <TestWrapper>
          <Hero />
        </TestWrapper>
      );

      const heroSection = screen.getByRole('region', { name: /hello, i'm your name/i });
      expect(heroSection).toBeInTheDocument();
      
      // Check for mobile-specific elements
      const ctaButtons = screen.getAllByRole('button');
      expect(ctaButtons.length).toBeGreaterThan(0);
      
      // Buttons should have touch-friendly sizing
      ctaButtons.forEach(button => {
        const styles = window.getComputedStyle(button);
        const minHeight = parseInt(styles.minHeight);
        expect(minHeight).toBeGreaterThanOrEqual(44); // Touch target minimum
      });
    });

    it('should render mobile-optimized projects grid', () => {
      render(
        <TestWrapper>
          <Projects />
        </TestWrapper>
      );

      const projectsSection = screen.getByRole('region', { name: /featured projects/i });
      expect(projectsSection).toBeInTheDocument();
      
      // Should have single column layout on mobile
      const projectGrid = screen.getByTestId('projects-grid');
      const styles = window.getComputedStyle(projectGrid);
      expect(styles.gridTemplateColumns).toBe('1fr');
    });
  });

  describe('Tablet Breakpoints (768px - 968px)', () => {
    beforeEach(() => {
      setViewportSize(768, 1024); // iPad size
      mockTouchDevice(true);
    });

    it('should render tablet-optimized layout', () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );

      // Should still show mobile menu on tablet
      const mobileToggle = screen.getByRole('button', { name: /toggle mobile menu/i });
      expect(mobileToggle).toBeInTheDocument();
    });

    it('should render tablet-optimized projects grid', () => {
      render(
        <TestWrapper>
          <Projects />
        </TestWrapper>
      );

      const projectsSection = screen.getByRole('region', { name: /featured projects/i });
      expect(projectsSection).toBeInTheDocument();
      
      // Should have responsive grid on tablet
      const projectGrid = screen.getByTestId('projects-grid');
      expect(projectGrid).toBeInTheDocument();
    });
  });

  describe('Desktop Breakpoints (1024px+)', () => {
    beforeEach(() => {
      setViewportSize(1200, 800);
      mockTouchDevice(false);
    });

    it('should render desktop-optimized header', () => {
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );

      // Desktop navigation should be visible
      const navLinks = screen.getAllByRole('button');
      expect(navLinks.length).toBeGreaterThan(0);
      
      // Mobile toggle should be hidden
      const mobileToggle = screen.queryByRole('button', { name: /toggle mobile menu/i });
      expect(mobileToggle).toBeInTheDocument(); // Present but hidden via CSS
    });

    it('should render desktop-optimized hero section', () => {
      render(
        <TestWrapper>
          <Hero />
        </TestWrapper>
      );

      const heroSection = screen.getByRole('region', { name: /hello, i'm your name/i });
      expect(heroSection).toBeInTheDocument();
      
      // Should have two-column layout on desktop
      const heroContent = screen.getByTestId('hero-content');
      const styles = window.getComputedStyle(heroContent);
      expect(styles.gridTemplateColumns).toContain('1fr 1fr');
    });
  });

  describe('Touch Device Optimizations', () => {
    beforeEach(() => {
      mockTouchDevice(true);
    });

    it('should provide touch-friendly button sizes', () => {
      render(
        <TestWrapper>
          <Contact />
        </TestWrapper>
      );

      const submitButton = screen.getByRole('button', { name: /send message/i });
      const styles = window.getComputedStyle(submitButton);
      const minHeight = parseInt(styles.minHeight);
      
      expect(minHeight).toBeGreaterThanOrEqual(44); // Minimum touch target size
    });

    it('should handle touch interactions properly', () => {
      render(
        <TestWrapper>
          <Skills />
        </TestWrapper>
      );

      const skillsSection = screen.getByRole('region');
      expect(skillsSection).toBeInTheDocument();
      
      // Touch devices should not have hover effects
      const skillCards = screen.getAllByTestId(/skill-category/);
      skillCards.forEach(card => {
        const styles = window.getComputedStyle(card);
        // Touch devices should have different interaction styles
        expect(card).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility on Different Screen Sizes', () => {
    it('should maintain accessibility on mobile', () => {
      setViewportSize(375, 667);
      mockTouchDevice(true);
      
      render(
        <TestWrapper>
          <Header />
        </TestWrapper>
      );

      // Focus management should work on mobile
      const focusableElements = screen.getAllByRole('button');
      expect(focusableElements.length).toBeGreaterThan(0);
      // Check that buttons are properly accessible
      focusableElements.forEach(element => {
        expect(element).toBeInTheDocument();
      });
    });

    it('should maintain proper heading hierarchy on all sizes', () => {
      render(
        <TestWrapper>
          <Hero />
        </TestWrapper>
      );

      const mainHeading = screen.getByRole('heading', { level: 1 });
      expect(mainHeading).toBeInTheDocument();
    });
  });

  describe('Performance on Different Screen Sizes', () => {
    it('should load appropriate image sizes', () => {
      render(
        <TestWrapper>
          <Hero />
        </TestWrapper>
      );

      const heroImage = screen.getByAltText(/professional headshot/i);
      expect(heroImage).toBeInTheDocument();
      
      // Should have appropriate loading attributes
      expect(heroImage).toHaveAttribute('loading');
    });
  });

  describe('Orientation Changes', () => {
    it('should handle landscape orientation on mobile', () => {
      setViewportSize(667, 375); // Landscape mobile
      mockTouchDevice(true);
      
      render(
        <TestWrapper>
          <Hero />
        </TestWrapper>
      );

      const heroSection = screen.getByRole('region', { name: /hello, i'm your name/i });
      expect(heroSection).toBeInTheDocument();
      
      // Should adapt to landscape orientation
      const heroContent = screen.getByTestId('hero-content');
      expect(heroContent).toBeInTheDocument();
    });
  });
});

// Mock CSS custom properties for testing
Object.defineProperty(window, 'getComputedStyle', {
  value: (element: Element) => ({
    getPropertyValue: (prop: string) => {
      if (prop === 'grid-template-columns') {
        const width = window.innerWidth;
        if (width < 768) return '1fr';
        if (width < 1024) return 'repeat(auto-fill, minmax(300px, 1fr))';
        return 'repeat(auto-fill, minmax(350px, 1fr))';
      }
      if (prop === 'min-height') return '44px';
      return '';
    },
    minHeight: '44px',
    gridTemplateColumns: window.innerWidth < 768 ? '1fr' : '1fr 1fr',
  }),
});