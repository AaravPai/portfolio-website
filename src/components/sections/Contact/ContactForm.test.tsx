import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import ContactForm from './ContactForm';
import type { ContactForm as ContactFormType } from '../../../types';

// Mock CSS import
vi.mock('./ContactForm.css', () => ({}));

describe('ContactForm', () => {
  const mockOnSubmit = vi.fn();
  
  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  const renderContactForm = (props = {}) => {
    const defaultProps = {
      onSubmit: mockOnSubmit,
      isSubmitting: false,
    };
    return render(<ContactForm {...defaultProps} {...props} />);
  };

  describe('Form Rendering', () => {
    it('renders all form fields with proper labels', () => {
      renderContactForm();
      
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
    });

    it('renders form fields with proper placeholders', () => {
      renderContactForm();
      
      expect(screen.getByPlaceholderText(/your full name/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/your.email@example.com/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/tell me about your project/i)).toBeInTheDocument();
    });

    it('renders form fields with proper accessibility attributes', () => {
      renderContactForm();
      
      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const messageInput = screen.getByLabelText(/message/i);
      
      expect(nameInput).toHaveAttribute('aria-describedby', 'name-error');
      expect(emailInput).toHaveAttribute('aria-describedby', 'email-error');
      expect(messageInput).toHaveAttribute('aria-describedby', 'message-error');
    });
  });

  describe('Form Validation', () => {
    it('shows validation errors for empty required fields', async () => {
      const user = userEvent.setup();
      renderContactForm();
      
      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(screen.getByText(/name is required/i)).toBeInTheDocument();
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
        expect(screen.getByText(/message is required/i)).toBeInTheDocument();
      });
      
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('validates name field length', async () => {
      const user = userEvent.setup();
      renderContactForm();
      
      const nameInput = screen.getByLabelText(/name/i);
      
      // Test minimum length
      await user.type(nameInput, 'A');
      await user.tab(); // Trigger blur to show validation
      
      await waitFor(() => {
        expect(screen.getByText(/name must be at least 2 characters/i)).toBeInTheDocument();
      });
      
      // Test maximum length
      await user.clear(nameInput);
      await user.type(nameInput, 'A'.repeat(51));
      await user.tab();
      
      await waitFor(() => {
        expect(screen.getByText(/name must be less than 50 characters/i)).toBeInTheDocument();
      });
    });

    it('validates email format', async () => {
      const user = userEvent.setup();
      renderContactForm();
      
      const emailInput = screen.getByLabelText(/email/i);
      
      // Test invalid email format
      await user.type(emailInput, 'invalid-email');
      await user.tab();
      
      await waitFor(() => {
        expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
      });
      
      // Test valid email format
      await user.clear(emailInput);
      await user.type(emailInput, 'test@example.com');
      await user.tab();
      
      await waitFor(() => {
        expect(screen.queryByText(/please enter a valid email address/i)).not.toBeInTheDocument();
      });
    });

    it('validates message field length', async () => {
      const user = userEvent.setup();
      renderContactForm();
      
      const messageInput = screen.getByLabelText(/message/i);
      
      // Test minimum length
      await user.type(messageInput, 'Short');
      await user.tab();
      
      await waitFor(() => {
        expect(screen.getByText(/message must be at least 10 characters/i)).toBeInTheDocument();
      });
      
      // Test maximum length
      await user.clear(messageInput);
      const longMessage = 'A'.repeat(1001);
      await user.type(messageInput, longMessage);
      await user.tab();
      
      await waitFor(() => {
        expect(screen.getByText(/message must be less than 1000 characters/i)).toBeInTheDocument();
      });
    });

    it('applies error styling to invalid fields', async () => {
      const user = userEvent.setup();
      renderContactForm();
      
      const nameInput = screen.getByLabelText(/name/i);
      const submitButton = screen.getByRole('button', { name: /send message/i });
      
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(nameInput).toHaveClass('error');
      });
    });
  });

  describe('Form Submission', () => {
    it('submits form with valid data', async () => {
      const user = userEvent.setup();
      mockOnSubmit.mockResolvedValue(undefined);
      renderContactForm();
      
      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const messageInput = screen.getByLabelText(/message/i);
      const submitButton = screen.getByRole('button', { name: /send message/i });
      
      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');
      await user.type(messageInput, 'This is a test message with enough characters.');
      
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          name: 'John Doe',
          email: 'john@example.com',
          message: 'This is a test message with enough characters.',
        });
      });
    });

    it('resets form after successful submission', async () => {
      const user = userEvent.setup();
      mockOnSubmit.mockResolvedValue(undefined);
      renderContactForm();
      
      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const messageInput = screen.getByLabelText(/message/i);
      const submitButton = screen.getByRole('button', { name: /send message/i });
      
      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');
      await user.type(messageInput, 'This is a test message with enough characters.');
      
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(nameInput).toHaveValue('');
        expect(emailInput).toHaveValue('');
        expect(messageInput).toHaveValue('');
      });
    });

    it('shows loading state during submission', async () => {
      const user = userEvent.setup();
      let resolveSubmit: () => void;
      const submitPromise = new Promise<void>((resolve) => {
        resolveSubmit = resolve;
      });
      mockOnSubmit.mockReturnValue(submitPromise);
      
      renderContactForm();
      
      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const messageInput = screen.getByLabelText(/message/i);
      const submitButton = screen.getByRole('button', { name: /send message/i });
      
      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');
      await user.type(messageInput, 'This is a test message with enough characters.');
      
      await user.click(submitButton);
      
      // Check loading state
      expect(screen.getByText(/sending.../i)).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeDisabled();
      expect(screen.getByRole('button')).toHaveClass('submitting');
      
      // Resolve the promise
      resolveSubmit!();
      
      await waitFor(() => {
        expect(screen.getByText(/send message/i)).toBeInTheDocument();
        expect(screen.getByRole('button')).not.toBeDisabled();
      });
    });

    it('handles submission errors gracefully', async () => {
      const user = userEvent.setup();
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockOnSubmit.mockRejectedValue(new Error('Submission failed'));
      
      renderContactForm();
      
      const nameInput = screen.getByLabelText(/name/i);
      const emailInput = screen.getByLabelText(/email/i);
      const messageInput = screen.getByLabelText(/message/i);
      const submitButton = screen.getByRole('button', { name: /send message/i });
      
      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');
      await user.type(messageInput, 'This is a test message with enough characters.');
      
      await user.click(submitButton);
      
      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith('Form submission error:', expect.any(Error));
        expect(screen.getByText(/send message/i)).toBeInTheDocument();
        expect(screen.getByRole('button')).not.toBeDisabled();
      });
      
      consoleErrorSpy.mockRestore();
    });
  });

  describe('External Loading State', () => {
    it('shows loading state when isSubmitting prop is true', () => {
      renderContactForm({ isSubmitting: true });
      
      expect(screen.getByText(/sending.../i)).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeDisabled();
      expect(screen.getByRole('button')).toHaveClass('submitting');
    });

    it('disables form when isSubmitting prop is true', async () => {
      const user = userEvent.setup();
      renderContactForm({ isSubmitting: true });
      
      const submitButton = screen.getByRole('button');
      
      await user.click(submitButton);
      
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('associates error messages with form fields', async () => {
      const user = userEvent.setup();
      renderContactForm();
      
      const submitButton = screen.getByRole('button', { name: /send message/i });
      await user.click(submitButton);
      
      await waitFor(() => {
        const nameInput = screen.getByLabelText(/name/i);
        const nameError = screen.getByText(/name is required/i);
        
        expect(nameInput).toHaveAttribute('aria-describedby', 'name-error');
        expect(nameError).toHaveAttribute('id', 'name-error');
      });
    });

    it('provides proper button states for screen readers', () => {
      renderContactForm({ isSubmitting: true });
      
      const submitButton = screen.getByRole('button');
      expect(submitButton).toHaveAttribute('disabled');
      expect(submitButton).toHaveAttribute('aria-describedby', 'submit-status');
    });
  });
});