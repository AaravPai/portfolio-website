import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import Contact from './Contact';
import * as emailService from '../../../services/emailService';

// Mock CSS imports
vi.mock('./Contact.css', () => ({}));
vi.mock('./ContactForm.css', () => ({}));
vi.mock('./SocialLinks.css', () => ({}));

// Mock SocialLinks component
vi.mock('./SocialLinks', () => ({
  default: ({ contactInfo, showLabels, size, layout, className }: any) => (
    <div className={`social-links-mock ${className}`} data-testid="social-links">
      {contactInfo.email && (
        <a href={`mailto:${contactInfo.email}`} aria-label={`Send email to ${contactInfo.email}`}>
          {contactInfo.email}
        </a>
      )}
      {contactInfo.linkedin && (
        <a href={contactInfo.linkedin} target="_blank" rel="noopener noreferrer" aria-label="Connect on LinkedIn">
          LinkedIn
        </a>
      )}
      {contactInfo.github && (
        <a href={contactInfo.github} target="_blank" rel="noopener noreferrer" aria-label="View GitHub profile">
          GitHub
        </a>
      )}

    </div>
  ),
}));

// Mock email service
vi.mock('../../../services/emailService', () => ({
  sendContactEmail: vi.fn(),
}));

const mockSendContactEmail = vi.mocked(emailService.sendContactEmail);

describe('Contact', () => {
  beforeEach(() => {
    mockSendContactEmail.mockClear();
  });

  const fillAndSubmitForm = async (user: ReturnType<typeof userEvent.setup>) => {
    const nameInput = screen.getByRole('textbox', { name: /name/i });
    const emailInput = screen.getByRole('textbox', { name: /email/i });
    const messageInput = screen.getByRole('textbox', { name: /message/i });
    const submitButton = screen.getByRole('button', { name: /send message/i });

    await user.type(nameInput, 'John Doe');
    await user.type(emailInput, 'john@example.com');
    await user.type(messageInput, 'This is a test message with enough characters.');
    await user.click(submitButton);
  };

  describe('Component Rendering', () => {
    it('renders contact section with proper structure', () => {
      render(<Contact />);
      
      expect(screen.getByRole('heading', { name: /get in touch/i })).toBeInTheDocument();
      expect(screen.getByText(/i'm always interested in new opportunities/i)).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: /let's connect/i })).toBeInTheDocument();
    });

    it('renders contact form', () => {
      render(<Contact />);
      
      expect(screen.getByRole('textbox', { name: /name/i })).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument();
      expect(screen.getByRole('textbox', { name: /message/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
    });

    it('renders contact information and social links', () => {
      render(<Contact />);
      
      expect(screen.getByText('your.email@example.com')).toBeInTheDocument();
      expect(screen.getByText('LinkedIn')).toBeInTheDocument();
      expect(screen.getByText('GitHub')).toBeInTheDocument();
      expect(screen.getByText(/feel free to reach out/i)).toBeInTheDocument();
    });

    it('applies custom className when provided', () => {
      const { container } = render(<Contact className="custom-class" />);
      
      expect(container.firstChild).toHaveClass('contact-section', 'custom-class');
    });
  });

  describe('Form Submission Success', () => {
    it('shows success message on successful submission', async () => {
      const user = userEvent.setup();
      mockSendContactEmail.mockResolvedValue({
        success: true,
        message: 'Message sent successfully!',
      });

      render(<Contact />);
      await fillAndSubmitForm(user);

      await waitFor(() => {
        expect(screen.getByText('Message sent successfully!')).toBeInTheDocument();
        expect(screen.getByRole('alert')).toHaveClass('success');
      });
    });

    it('calls email service with correct form data', async () => {
      const user = userEvent.setup();
      mockSendContactEmail.mockResolvedValue({
        success: true,
        message: 'Success',
      });

      render(<Contact />);
      await fillAndSubmitForm(user);

      await waitFor(() => {
        expect(mockSendContactEmail).toHaveBeenCalledWith({
          name: 'John Doe',
          email: 'john@example.com',
          message: 'This is a test message with enough characters.',
        });
      });
    });

    it('shows loading state during submission', async () => {
      const user = userEvent.setup();
      let resolveSubmit: (value: any) => void;
      const submitPromise = new Promise((resolve) => {
        resolveSubmit = resolve;
      });
      mockSendContactEmail.mockReturnValue(submitPromise);

      render(<Contact />);
      await fillAndSubmitForm(user);

      // Check loading state
      expect(screen.getByRole('alert')).toHaveClass('sending');
      expect(screen.getByText(/sending/i)).toBeInTheDocument();

      // Resolve the promise
      resolveSubmit!({ success: true, message: 'Success' });

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveClass('success');
      });
    });

    it('allows dismissing success message', async () => {
      const user = userEvent.setup();
      mockSendContactEmail.mockResolvedValue({
        success: true,
        message: 'Message sent successfully!',
      });

      render(<Contact />);
      await fillAndSubmitForm(user);

      await waitFor(() => {
        expect(screen.getByText('Message sent successfully!')).toBeInTheDocument();
      });

      const dismissButton = screen.getByRole('button', { name: /dismiss message/i });
      await user.click(dismissButton);

      expect(screen.queryByText('Message sent successfully!')).not.toBeInTheDocument();
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  describe('Form Submission Error', () => {
    it('shows error message on submission failure', async () => {
      const user = userEvent.setup();
      mockSendContactEmail.mockResolvedValue({
        success: false,
        message: 'Failed to send message',
        error: 'Network error',
      });

      render(<Contact />);
      await fillAndSubmitForm(user);

      await waitFor(() => {
        expect(screen.getByText('Failed to send message')).toBeInTheDocument();
        expect(screen.getByRole('alert')).toHaveClass('error');
      });
    });

    it('handles email service exceptions', async () => {
      const user = userEvent.setup();
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockSendContactEmail.mockRejectedValue(new Error('Service unavailable'));

      render(<Contact />);
      await fillAndSubmitForm(user);

      await waitFor(() => {
        expect(screen.getByText(/an unexpected error occurred/i)).toBeInTheDocument();
        expect(screen.getByRole('alert')).toHaveClass('error');
      });

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Contact form submission error:',
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });

    it('allows dismissing error message', async () => {
      const user = userEvent.setup();
      mockSendContactEmail.mockResolvedValue({
        success: false,
        message: 'Failed to send message',
      });

      render(<Contact />);
      await fillAndSubmitForm(user);

      await waitFor(() => {
        expect(screen.getByText('Failed to send message')).toBeInTheDocument();
      });

      const dismissButton = screen.getByRole('button', { name: /dismiss message/i });
      await user.click(dismissButton);

      expect(screen.queryByText('Failed to send message')).not.toBeInTheDocument();
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
  });

  describe('Contact Information and Social Links', () => {
    it('renders email link with correct href', () => {
      render(<Contact />);
      
      const emailLink = screen.getByRole('link', { name: /send email to your.email@example.com/i });
      expect(emailLink).toHaveAttribute('href', 'mailto:your.email@example.com');
    });

    it('renders LinkedIn link with correct attributes', () => {
      render(<Contact />);
      
      const linkedinLink = screen.getByRole('link', { name: /connect on linkedin/i });
      expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com/in/yourprofile');
      expect(linkedinLink).toHaveAttribute('target', '_blank');
      expect(linkedinLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('renders GitHub link with correct attributes', () => {
      render(<Contact />);
      
      const githubLink = screen.getByRole('link', { name: /view github profile/i });
      expect(githubLink).toHaveAttribute('href', 'https://github.com/yourusername');
      expect(githubLink).toHaveAttribute('target', '_blank');
      expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('accepts custom contact info', () => {
      const customContactInfo = {
        email: 'custom@example.com',
        linkedin: 'https://linkedin.com/in/custom',
        github: 'https://github.com/custom',
      };

      render(<Contact contactInfo={customContactInfo} />);
      
      expect(screen.getByRole('link', { name: /send email to custom@example.com/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /connect on linkedin/i })).toHaveAttribute('href', 'https://linkedin.com/in/custom');
      expect(screen.getByRole('link', { name: /view github profile/i })).toHaveAttribute('href', 'https://github.com/custom');
    });
  });

  describe('Accessibility', () => {
    it('provides proper ARIA labels for status messages', async () => {
      const user = userEvent.setup();
      mockSendContactEmail.mockResolvedValue({
        success: true,
        message: 'Success message',
      });

      render(<Contact />);
      await fillAndSubmitForm(user);

      await waitFor(() => {
        const alert = screen.getByRole('alert');
        expect(alert).toBeInTheDocument();
      });
    });

    it('provides proper ARIA labels for contact links', () => {
      render(<Contact />);
      
      expect(screen.getByRole('link', { name: /send email to your.email@example.com/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /connect on linkedin/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /view github profile/i })).toBeInTheDocument();
    });

    it('provides proper ARIA label for dismiss button', async () => {
      const user = userEvent.setup();
      mockSendContactEmail.mockResolvedValue({
        success: true,
        message: 'Success message',
      });

      render(<Contact />);
      await fillAndSubmitForm(user);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /dismiss message/i })).toBeInTheDocument();
      });
    });
  });

  describe('Integration with ContactForm', () => {
    it('disables form during submission', async () => {
      const user = userEvent.setup();
      let resolveSubmit: (value: any) => void;
      const submitPromise = new Promise((resolve) => {
        resolveSubmit = resolve;
      });
      mockSendContactEmail.mockReturnValue(submitPromise);

      render(<Contact />);
      await fillAndSubmitForm(user);

      // Check that submit button is disabled
      const submitButton = screen.getByRole('button', { name: /sending/i });
      expect(submitButton).toBeDisabled();

      // Resolve the promise
      resolveSubmit!({ success: true, message: 'Success' });

      await waitFor(() => {
        const newSubmitButton = screen.getByRole('button', { name: /send message/i });
        expect(newSubmitButton).not.toBeDisabled();
      });
    });

    it('resets form after successful submission', async () => {
      const user = userEvent.setup();
      mockSendContactEmail.mockResolvedValue({
        success: true,
        message: 'Success',
      });

      render(<Contact />);
      await fillAndSubmitForm(user);

      await waitFor(() => {
        expect(screen.getByRole('textbox', { name: /name/i })).toHaveValue('');
        expect(screen.getByRole('textbox', { name: /email/i })).toHaveValue('');
        expect(screen.getByRole('textbox', { name: /message/i })).toHaveValue('');
      });
    });
  });
});