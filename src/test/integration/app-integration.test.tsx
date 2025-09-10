import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ThemeProvider } from '../../contexts/ThemeContext';
import App from '../../App';

// Mock EmailJS
vi.mock('@emailjs/browser', () => ({
  send: vi.fn().mockResolvedValue({ status: 200, text: 'OK' }),
  init: vi.fn(),
}));

// Mock intersection observer for lazy loading
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null
});
window.IntersectionObserver = mockIntersectionObserver;

// Mock scroll behavior
Object.defineProperty(window, 'scrollTo', {
  value: vi.fn(),
  writable: true
});

const renderApp = () => {
  return render(
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
};

describe('App Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Core Application Flow', () => {
    it('should render the main application structure', () => {
      renderApp();

      // Check that main sections are present
      expect(screen.getByRole('banner')).toBeInTheDocument(); // Header
      expect(screen.getByRole('main')).toBeInTheDocument(); // Main content
      expect(screen.getByRole('contentinfo')).toBeInTheDocument(); // Footer

      // Check hero section
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getByText(/hello, i'm/i)).toBeInTheDocument();
    });

    it('should have proper navigation structure', () => {
      renderApp();

      // Check navigation exists
      const navigation = screen.getByRole('navigation', { name: /main navigation/i });
      expect(navigation).toBeInTheDocument();

      // Check navigation links
      expect(screen.getByRole('button', { name: /navigate to about/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /navigate to projects/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /navigate to skills/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /navigate to resume/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /navigate to contact/i })).toBeInTheDocument();
    });

    it('should have hero call-to-action buttons', () => {
      renderApp();

      // Check hero CTA buttons
      expect(screen.getByRole('button', { name: /view my work/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /get in touch/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /download resume/i })).toBeInTheDocument();
    });

    it('should support theme switching', async () => {
      const user = userEvent.setup();
      renderApp();

      // Find theme toggle button
      const themeToggle = screen.getByRole('button', { name: /switch to dark mode/i });
      expect(themeToggle).toBeInTheDocument();

      // Click theme toggle
      await user.click(themeToggle);

      // Theme should change (button text should update)
      expect(screen.getByRole('button', { name: /switch to light mode/i })).toBeInTheDocument();
    });

    it('should have accessibility features', () => {
      renderApp();

      // Check skip links
      const skipLinks = screen.getAllByText(/skip to/i);
      expect(skipLinks.length).toBeGreaterThan(0);

      // Check ARIA landmarks
      expect(screen.getByRole('banner')).toBeInTheDocument();
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('contentinfo')).toBeInTheDocument();
      expect(screen.getByRole('navigation')).toBeInTheDocument();
    });

    it('should handle mobile menu toggle', async () => {
      const user = userEvent.setup();
      renderApp();

      // Find mobile menu toggle
      const mobileToggle = screen.getByRole('button', { name: /toggle mobile menu/i });
      expect(mobileToggle).toBeInTheDocument();

      // Check initial state
      expect(mobileToggle).toHaveAttribute('aria-expanded', 'false');

      // Click to open mobile menu
      await user.click(mobileToggle);

      // Menu should be expanded
      expect(mobileToggle).toHaveAttribute('aria-expanded', 'true');
    });

    it('should have proper document structure', () => {
      renderApp();

      // Check that sections exist with proper IDs
      expect(document.getElementById('hero')).toBeInTheDocument();
      expect(document.getElementById('about')).toBeInTheDocument();
      expect(document.getElementById('projects')).toBeInTheDocument();
      expect(document.getElementById('skills')).toBeInTheDocument();
      expect(document.getElementById('resume')).toBeInTheDocument();
      expect(document.getElementById('contact')).toBeInTheDocument();
    });

    it('should handle navigation clicks without errors', async () => {
      const user = userEvent.setup();
      renderApp();

      // Test navigation button clicks
      const aboutButton = screen.getByRole('button', { name: /navigate to about/i });
      const projectsButton = screen.getByRole('button', { name: /navigate to projects/i });
      const skillsButton = screen.getByRole('button', { name: /navigate to skills/i });

      // These should not throw errors
      await user.click(aboutButton);
      await user.click(projectsButton);
      await user.click(skillsButton);

      // Buttons should still be present
      expect(aboutButton).toBeInTheDocument();
      expect(projectsButton).toBeInTheDocument();
      expect(skillsButton).toBeInTheDocument();
    });

    it('should have proper meta information', () => {
      renderApp();

      // Check that the app has proper structure for SEO
      const mainHeading = screen.getByRole('heading', { level: 1 });
      expect(mainHeading).toBeInTheDocument();
      expect(mainHeading).toHaveTextContent(/hello, i'm/i);

      // Check that sections have proper headings
      const sectionHeadings = screen.getAllByRole('heading');
      expect(sectionHeadings.length).toBeGreaterThan(1);
    });

    it('should load without JavaScript errors', () => {
      // This test ensures the app renders without throwing
      expect(() => renderApp()).not.toThrow();
    });
  });

  describe('Performance and Loading', () => {
    it('should have lazy loading components structure', () => {
      renderApp();

      // Check that lazy loading sections exist
      expect(document.getElementById('projects')).toBeInTheDocument();
      expect(document.getElementById('skills')).toBeInTheDocument();
      expect(document.getElementById('resume')).toBeInTheDocument();
      expect(document.getElementById('contact')).toBeInTheDocument();
    });

    it('should have proper loading states', () => {
      renderApp();

      // Check for loading indicators or fallbacks
      // The lazy components should have proper structure even if not loaded
      const sections = ['projects', 'skills', 'resume', 'contact'];
      sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        expect(section).toBeInTheDocument();
      });
    });
  });
});