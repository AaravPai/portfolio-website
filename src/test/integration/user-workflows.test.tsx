import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ThemeProvider } from '../../contexts/ThemeContext';
import App from '../../App';

// Mock EmailJS
vi.mock('@emailjs/browser', () => ({
  send: vi.fn().mockResolvedValue({ status: 200, text: 'OK' }),
  init: vi.fn(),
}));

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
window.IntersectionObserver = mockIntersectionObserver;

const renderApp = () => {
  return render(
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );
};

describe('User Workflow Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Complete Portfolio Browsing Workflow', () => {
    it('should allow user to browse through entire portfolio', async () => {
      const user = userEvent.setup();
      renderApp();

      // 1. User lands on homepage and sees hero section
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
      expect(screen.getByText(/full stack developer/i)).toBeInTheDocument();

      // 2. User navigates to About section
      const aboutButton = screen.getByRole('button', { name: /navigate to about/i });
      await user.click(aboutButton);
      
      // Should scroll to about section (mocked)
      expect(screen.getByText(/about/i)).toBeInTheDocument();

      // 3. User navigates to Projects section
      const projectsButton = screen.getByRole('button', { name: /navigate to projects/i });
      await user.click(projectsButton);
      
      // Should see project cards
      expect(screen.getByText(/featured projects/i)).toBeInTheDocument();

      // 4. User opens a project modal
      const projectCards = screen.getAllByTestId('project-card');
      if (projectCards.length > 0) {
        await user.click(projectCards[0]);
        
        // Should open project modal
        await waitFor(() => {
          expect(screen.getByTestId('project-modal')).toBeInTheDocument();
        });

        // Should see project details
        expect(screen.getByText(/live demo/i)).toBeInTheDocument();
        expect(screen.getByText(/source code/i)).toBeInTheDocument();

        // Close modal
        const closeButton = screen.getByLabelText(/close modal/i);
        await user.click(closeButton);
        
        await waitFor(() => {
          expect(screen.queryByTestId('project-modal')).not.toBeInTheDocument();
        });
      }

      // 5. User navigates to Skills section
      const skillsButton = screen.getByRole('button', { name: /navigate to skills/i });
      await user.click(skillsButton);
      
      // Should see skills
      expect(screen.getByText(/skills/i)).toBeInTheDocument();

      // 6. User navigates to Resume section
      const resumeButton = screen.getByRole('button', { name: /navigate to resume/i });
      await user.click(resumeButton);
      
      // Should see resume content
      expect(screen.getByText(/experience/i)).toBeInTheDocument();

      // 7. User downloads resume
      const downloadButton = screen.getByLabelText(/download resume/i);
      await user.click(downloadButton);
      
      // Should trigger download (mocked)
      expect(downloadButton).toBeInTheDocument();
    });
  });

  describe('Contact Form Submission Workflow', () => {
    it('should complete full contact form submission workflow', async () => {
      const user = userEvent.setup();
      renderApp();

      // Navigate to contact section using hero CTA button
      const contactButton = screen.getByRole('button', { name: /get in touch/i });
      await user.click(contactButton);

      // Fill out contact form
      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const messageInput = screen.getByLabelText(/message/i);

      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john.doe@example.com');
      await user.type(messageInput, 'This is a test message for the contact form. It should be long enough to pass validation requirements.');

      // Submit form
      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);

      // Should show loading state
      await waitFor(() => {
        expect(screen.getByText(/sending/i)).toBeInTheDocument();
      });

      // Should show success message
      await waitFor(() => {
        expect(screen.getByText(/message sent successfully/i)).toBeInTheDocument();
      }, { timeout: 5000 });

      // Form should be reset
      expect(nameInput).toHaveValue('');
      expect(emailInput).toHaveValue('');
      expect(messageInput).toHaveValue('');
    });

    it('should handle form validation workflow', async () => {
      const user = userEvent.setup();
      renderApp();

      // Navigate to contact section using hero CTA button
      const contactButton = screen.getByRole('button', { name: /get in touch/i });
      await user.click(contactButton);

      // Wait for lazy-loaded contact form to appear
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
      }, { timeout: 3000 });

      // Try to submit empty form
      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);

      // Should show validation errors
      await waitFor(() => {
        expect(screen.getByText(/name is required/i)).toBeInTheDocument();
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
        expect(screen.getByText(/message is required/i)).toBeInTheDocument();
      });

      // Fill form with invalid email
      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const messageInput = screen.getByLabelText(/message/i);

      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'invalid-email');
      await user.type(messageInput, 'Short'); // Too short

      await user.click(submitButton);

      // Should show specific validation errors
      await waitFor(() => {
        expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
        expect(screen.getByText(/message must be at least 10 characters/i)).toBeInTheDocument();
      });

      // Fix validation errors
      await user.clear(emailInput);
      await user.type(emailInput, 'john.doe@example.com');
      
      await user.clear(messageInput);
      await user.type(messageInput, 'This is a valid message that meets the minimum length requirement.');

      await user.click(submitButton);

      // Should submit successfully
      await waitFor(() => {
        expect(screen.getByText(/message sent successfully/i)).toBeInTheDocument();
      }, { timeout: 5000 });
    });
  });

  describe('Theme Switching Workflow', () => {
    it('should complete theme switching workflow', async () => {
      const user = userEvent.setup();
      renderApp();

      // Should start with light theme
      expect(document.documentElement).toHaveAttribute('data-theme', 'light');

      // Switch to dark theme
      const themeToggle = screen.getByLabelText(/switch to dark mode/i);
      await user.click(themeToggle);

      // Should switch to dark theme
      await waitFor(() => {
        expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
      });

      // Button text should update
      expect(screen.getByLabelText(/switch to light mode/i)).toBeInTheDocument();

      // Switch back to light theme
      const lightThemeToggle = screen.getByLabelText(/switch to light mode/i);
      await user.click(lightThemeToggle);

      // Should switch back to light theme
      await waitFor(() => {
        expect(document.documentElement).toHaveAttribute('data-theme', 'light');
      });

      expect(screen.getByLabelText(/switch to dark mode/i)).toBeInTheDocument();
    });

    it('should persist theme preference', async () => {
      const user = userEvent.setup();
      
      // Mock localStorage
      const localStorageMock = {
        getItem: vi.fn(),
        setItem: vi.fn(),
        removeItem: vi.fn(),
      };
      Object.defineProperty(window, 'localStorage', {
        value: localStorageMock,
      });

      renderApp();

      // Switch to dark theme
      const themeToggle = screen.getByLabelText(/switch to dark mode/i);
      await user.click(themeToggle);

      // Should save to localStorage
      expect(localStorageMock.setItem).toHaveBeenCalledWith('theme', 'dark');
    });
  });

  describe('Mobile Navigation Workflow', () => {
    it('should handle mobile navigation workflow', async () => {
      const user = userEvent.setup();
      
      // Mock mobile viewport
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 375,
      });

      renderApp();

      // Should show mobile menu toggle
      const mobileToggle = screen.getByLabelText(/toggle mobile menu/i);
      expect(mobileToggle).toBeInTheDocument();

      // Open mobile menu
      await user.click(mobileToggle);

      // Should show mobile navigation
      await waitFor(() => {
        expect(screen.getByLabelText(/mobile navigation/i)).toBeVisible();
      });

      // Should be able to navigate using mobile menu
      const mobileAboutLink = screen.getAllByRole('menuitem', { name: /about/i })[1]; // Get mobile menu item
      await user.click(mobileAboutLink);

      // Mobile menu should close after navigation
      await waitFor(() => {
        expect(screen.getByLabelText(/mobile navigation/i)).not.toBeVisible();
      });
    });
  });

  describe('Accessibility Workflow', () => {
    it('should support keyboard navigation workflow', async () => {
      const user = userEvent.setup();
      renderApp();

      // Should be able to tab through focusable elements
      const focusableElements = screen.getAllByRole('button');
      expect(focusableElements.length).toBeGreaterThan(0);

      // Test skip links
      const skipLinks = screen.getAllByText(/skip to/i);
      expect(skipLinks.length).toBeGreaterThan(0);

      // Test form accessibility - navigate to contact section first
      const contactButton = screen.getByRole('button', { name: /get in touch/i });
      await user.click(contactButton);

      // Wait for lazy-loaded contact form
      await waitFor(() => {
        expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      }, { timeout: 3000 });

      await waitFor(() => {
        const nameInput = screen.getByLabelText(/name/i);
        const emailInput = screen.getByLabelText(/email/i);
        const messageInput = screen.getByLabelText(/message/i);

        expect(nameInput).toHaveAttribute('aria-describedby');
        expect(emailInput).toHaveAttribute('aria-describedby');
        expect(messageInput).toHaveAttribute('aria-describedby');
      });
    });

    it('should announce dynamic content changes', async () => {
      const user = userEvent.setup();
      renderApp();

      // Navigate to contact section first
      const contactButton = screen.getByRole('button', { name: /get in touch/i });
      await user.click(contactButton);

      // Wait for lazy-loaded contact form
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
      }, { timeout: 3000 });

      // Submit empty form to trigger validation
      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);

      // Should have ARIA live regions for announcements
      await waitFor(() => {
        const alerts = screen.getAllByRole('alert');
        expect(alerts.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Performance Workflow', () => {
    it('should handle lazy loading workflow', async () => {
      renderApp();

      // Images should have lazy loading attributes
      const images = screen.getAllByRole('img');
      images.forEach(img => {
        expect(img).toHaveAttribute('loading');
      });

      // Sections should load progressively
      expect(screen.getByText(/hello, i'm/i)).toBeInTheDocument();
    });
  });
});