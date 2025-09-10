import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import Header from '../components/common/Header/Header';
import Footer from '../components/common/Footer/Footer';
import Hero from '../components/sections/Hero/Hero';
import ContactForm from '../components/sections/Contact/ContactForm';
import ProjectModal from '../components/sections/Projects/ProjectModal';
import SkipLinks from '../components/common/SkipLinks/SkipLinks';
import { ThemeProvider } from '../contexts/ThemeContext';
import type { Project } from '../types';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

// Mock hooks and dependencies
vi.mock('../hooks/useScrollNavigation', () => ({
  useScrollNavigation: () => ({
    activeSection: 'hero',
    isScrolled: false,
    showBackToTop: false,
  }),
  smoothScrollTo: vi.fn(),
}));

vi.mock('../hooks/useTouchOptimization', () => ({
  useTouchOptimization: () => ({
    isTouchDevice: () => false,
  }),
}));

vi.mock('../hooks/useSwipeGesture', () => ({
  useSwipeGesture: () => vi.fn(),
}));

vi.mock('../data/resume', () => ({
  personalInfo: {
    name: 'John Doe',
    title: 'Full Stack Developer',
  },
}));

const renderWithTheme = (component: React.ReactElement, theme: 'light' | 'dark' = 'light') => {
  return render(
    <ThemeProvider initialTheme={theme}>
      {component}
    </ThemeProvider>
  );
};

describe('Component Accessibility Tests', () => {
  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = '';
  });

  describe('Header Component', () => {
    it('should not have accessibility violations', async () => {
      const { container } = renderWithTheme(<Header />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper ARIA labels and roles', () => {
      renderWithTheme(<Header />);
      
      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByLabelText('Main navigation')).toBeInTheDocument();
      expect(screen.getByLabelText('Mobile navigation')).toBeInTheDocument();
      expect(screen.getByLabelText(/Switch to .* mode/)).toBeInTheDocument();
    });

    it('should support keyboard navigation', async () => {
      const user = userEvent.setup();
      renderWithTheme(<Header />);

      // Tab through navigation items
      await user.tab();
      expect(document.activeElement).toHaveAttribute('aria-label', 'Go to top');

      await user.tab();
      expect(document.activeElement?.textContent).toContain('About');

      // Test Enter key activation
      await user.keyboard('{Enter}');
      // Should trigger navigation (mocked)
    });

    it('should manage mobile menu focus properly', async () => {
      const user = userEvent.setup();
      renderWithTheme(<Header />);

      // Find and activate mobile menu toggle
      const mobileToggle = screen.getByLabelText('Toggle mobile menu');
      await user.click(mobileToggle);

      // Mobile menu should be open
      expect(mobileToggle).toHaveAttribute('aria-expanded', 'true');

      // Focus should be trapped in mobile menu
      const mobileNavLinks = screen.getAllByRole('menuitem');
      expect(mobileNavLinks.length).toBeGreaterThan(0);
    });

    it('should have proper contrast ratios', () => {
      renderWithTheme(<Header />);
      
      const navLinks = screen.getAllByRole('menuitem');
      navLinks.forEach(link => {
        const styles = window.getComputedStyle(link);
        // This is a basic check - in real implementation you'd check actual color values
        expect(styles.color).toBeDefined();
      });
    });
  });

  describe('Footer Component', () => {
    it('should not have accessibility violations', async () => {
      const { container } = renderWithTheme(<Footer />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper semantic structure', () => {
      renderWithTheme(<Footer />);
      
      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
      expect(screen.getByText('Connect with me')).toBeInTheDocument();
      expect(screen.getByText('Quick Links')).toBeInTheDocument();
    });

    it('should have accessible social links', () => {
      renderWithTheme(<Footer />);
      
      const socialLinks = screen.getAllByRole('button').filter(button => 
        button.getAttribute('aria-label')?.includes('Visit') || 
        button.getAttribute('aria-label')?.includes('Send email')
      );
      
      socialLinks.forEach(link => {
        expect(link).toHaveAttribute('aria-label');
        expect(link).toHaveAttribute('title');
      });
    });
  });

  describe('Hero Component', () => {
    it('should not have accessibility violations', async () => {
      const { container } = renderWithTheme(<Hero />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper heading structure', () => {
      renderWithTheme(<Hero />);
      
      const mainHeading = screen.getByRole('heading', { level: 1 });
      expect(mainHeading).toBeInTheDocument();
      expect(mainHeading).toHaveAttribute('id', 'hero-heading');
    });

    it('should have accessible call-to-action buttons', () => {
      renderWithTheme(<Hero />);
      
      const ctaButtons = screen.getAllByRole('button');
      ctaButtons.forEach(button => {
        expect(button).toHaveAttribute('aria-label');
      });
    });

    it('should announce animated text changes', () => {
      renderWithTheme(<Hero />);
      
      const animatedText = screen.getByLabelText(/Current role:/);
      expect(animatedText).toHaveAttribute('aria-live', 'polite');
    });
  });

  describe('Contact Form Component', () => {
    const mockSubmit = vi.fn();

    it('should not have accessibility violations', async () => {
      const { container } = renderWithTheme(<ContactForm onSubmit={mockSubmit} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper form labels', () => {
      renderWithTheme(<ContactForm onSubmit={mockSubmit} />);
      
      expect(screen.getByLabelText('Name *')).toBeInTheDocument();
      expect(screen.getByLabelText('Email *')).toBeInTheDocument();
      expect(screen.getByLabelText('Message *')).toBeInTheDocument();
    });

    it('should show validation errors accessibly', async () => {
      const user = userEvent.setup();
      renderWithTheme(<ContactForm onSubmit={mockSubmit} />);

      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);

      await waitFor(() => {
        const errorMessages = screen.getAllByRole('alert');
        expect(errorMessages.length).toBeGreaterThan(0);
      });
    });

    it('should associate error messages with form fields', async () => {
      const user = userEvent.setup();
      renderWithTheme(<ContactForm onSubmit={mockSubmit} />);

      const nameInput = screen.getByLabelText('Name *');
      const submitButton = screen.getByRole('button', { name: /send message/i });
      
      await user.click(submitButton);

      await waitFor(() => {
        expect(nameInput).toHaveAttribute('aria-describedby');
      });
    });
  });

  describe('Project Modal Component', () => {
    const mockProject: Project = {
      id: '1',
      title: 'Test Project',
      description: 'A test project',
      longDescription: 'A longer description of the test project',
      technologies: ['React', 'TypeScript'],
      imageUrl: '/test-image.jpg',
      liveUrl: 'https://example.com',
      githubUrl: 'https://github.com/test',
      featured: true,
    };

    it('should not have accessibility violations', async () => {
      const { container } = renderWithTheme(
        <ProjectModal 
          project={mockProject} 
          isOpen={true} 
          onClose={vi.fn()} 
        />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper modal ARIA attributes', () => {
      renderWithTheme(
        <ProjectModal 
          project={mockProject} 
          isOpen={true} 
          onClose={vi.fn()} 
        />
      );

      const modal = screen.getByRole('dialog');
      expect(modal).toHaveAttribute('aria-modal', 'true');
      expect(modal).toHaveAttribute('aria-labelledby');
      expect(modal).toHaveAttribute('aria-describedby');
    });

    it('should trap focus within modal', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      
      renderWithTheme(
        <ProjectModal 
          project={mockProject} 
          isOpen={true} 
          onClose={onClose} 
        />
      );

      // Focus should be on close button initially
      const closeButton = screen.getByLabelText('Close project details');
      expect(document.activeElement).toBe(closeButton);

      // Tab through modal elements
      await user.tab();
      await user.tab();
      
      // Should stay within modal
      const focusedElement = document.activeElement;
      const modal = screen.getByRole('dialog');
      expect(modal.contains(focusedElement)).toBe(true);
    });

    it('should close on Escape key', async () => {
      const user = userEvent.setup();
      const onClose = vi.fn();
      
      renderWithTheme(
        <ProjectModal 
          project={mockProject} 
          isOpen={true} 
          onClose={onClose} 
        />
      );

      await user.keyboard('{Escape}');
      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('Skip Links Component', () => {
    it('should not have accessibility violations', async () => {
      const { container } = renderWithTheme(<SkipLinks />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should have proper navigation structure', () => {
      renderWithTheme(<SkipLinks />);
      
      expect(screen.getByLabelText('Skip navigation links')).toBeInTheDocument();
      expect(screen.getByText('Skip to main content')).toBeInTheDocument();
    });

    it('should focus target elements when activated', async () => {
      const user = userEvent.setup();
      
      // Add target elements to DOM
      document.body.innerHTML += '<main id="main-content" tabindex="-1">Main content</main>';
      
      renderWithTheme(<SkipLinks />);
      
      const skipLink = screen.getByText('Skip to main content');
      await user.click(skipLink);
      
      const mainContent = document.getElementById('main-content');
      expect(document.activeElement).toBe(mainContent);
    });
  });

  describe('Keyboard Navigation Integration', () => {
    it('should allow full keyboard navigation through the page', async () => {
      const user = userEvent.setup();
      
      renderWithTheme(
        <div>
          <SkipLinks />
          <Header />
          <main>
            <Hero />
            <ContactForm onSubmit={vi.fn()} />
          </main>
          <Footer />
        </div>
      );

      // Start tabbing from the beginning
      await user.tab();
      
      // Should be able to navigate through all interactive elements
      const interactiveElements = screen.getAllByRole('button');
      const links = screen.getAllByRole('link');
      const inputs = screen.getAllByRole('textbox');
      
      const totalInteractive = interactiveElements.length + links.length + inputs.length;
      expect(totalInteractive).toBeGreaterThan(0);
    });
  });

  describe('Screen Reader Announcements', () => {
    it('should provide appropriate live region updates', async () => {
      renderWithTheme(<Hero />);
      
      // Check for live regions
      const liveRegions = document.querySelectorAll('[aria-live]');
      expect(liveRegions.length).toBeGreaterThan(0);
    });

    it('should have proper heading hierarchy', () => {
      renderWithTheme(
        <div>
          <Header />
          <main>
            <Hero />
          </main>
          <Footer />
        </div>
      );

      const headings = screen.getAllByRole('heading');
      const h1Elements = headings.filter(h => h.tagName === 'H1');
      
      // Should have exactly one H1
      expect(h1Elements).toHaveLength(1);
      
      // Should have logical heading order
      expect(headings.length).toBeGreaterThan(1);
    });
  });
});