import { vi, describe, it, expect, beforeEach } from 'vitest';
import { sendContactEmail, validateEmailConfig, getFallbackContactInfo, resetEmailService } from './emailService';
import type { ContactForm } from '../types';
import emailjs from '@emailjs/browser';

// Mock EmailJS
vi.mock('@emailjs/browser', () => ({
  default: {
    init: vi.fn(),
    send: vi.fn(),
  },
}));

const mockEmailJS = vi.mocked(emailjs);

describe('emailService', () => {
  const mockConfig = {
    serviceId: 'test_service_id',
    templateId: 'test_template_id',
    publicKey: 'test_public_key',
  };

  const mockFormData: ContactForm = {
    name: 'John Doe',
    email: 'john@example.com',
    message: 'This is a test message.',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    resetEmailService(); // Reset initialization state
    // Reset environment variables
    vi.stubEnv('VITE_EMAILJS_SERVICE_ID', '');
    vi.stubEnv('VITE_EMAILJS_TEMPLATE_ID', '');
    vi.stubEnv('VITE_EMAILJS_PUBLIC_KEY', '');
  });

  describe('sendContactEmail', () => {
    it('successfully sends email with valid configuration', async () => {
      mockEmailJS.send.mockResolvedValue({ status: 200 });

      const result = await sendContactEmail(mockFormData, mockConfig);

      expect(mockEmailJS.init).toHaveBeenCalledWith(mockConfig.publicKey);
      expect(mockEmailJS.send).toHaveBeenCalledWith(
        mockConfig.serviceId,
        mockConfig.templateId,
        {
          from_name: mockFormData.name,
          from_email: mockFormData.email,
          message: mockFormData.message,
          to_name: 'Portfolio Owner',
          reply_to: mockFormData.email,
        }
      );
      expect(result).toEqual({
        success: true,
        message: "Message sent successfully! I'll get back to you soon.",
      });
    });

    it('handles EmailJS service errors', async () => {
      mockEmailJS.send.mockResolvedValue({ status: 400 });

      const result = await sendContactEmail(mockFormData, mockConfig);

      expect(result).toEqual({
        success: false,
        message: 'Failed to send message. Please try again later.',
        error: 'EmailJS returned status: 400',
      });
    });

    it('handles network errors', async () => {
      const networkError = new Error('Network error occurred');
      mockEmailJS.send.mockRejectedValue(networkError);

      const result = await sendContactEmail(mockFormData, mockConfig);

      expect(result).toEqual({
        success: false,
        message: 'Failed to send message. Please try again later.',
        error: 'Network error occurred',
      });
    });

    it('handles configuration errors', async () => {
      const incompleteConfig = {
        serviceId: '',
        templateId: 'test_template_id',
        publicKey: 'test_public_key',
      };

      const result = await sendContactEmail(mockFormData, incompleteConfig);

      expect(result).toEqual({
        success: false,
        message: 'Email service is not properly configured.',
        error: 'EmailJS configuration is incomplete',
      });
    });

    it('handles unknown errors gracefully', async () => {
      mockEmailJS.send.mockRejectedValue('Unknown error');

      const result = await sendContactEmail(mockFormData, mockConfig);

      expect(result).toEqual({
        success: false,
        message: 'Failed to send message. Please try again later.',
        error: 'Unknown error',
      });
    });

    it('logs errors to console', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const testError = new Error('Test error');
      mockEmailJS.send.mockRejectedValue(testError);

      await sendContactEmail(mockFormData, mockConfig);

      expect(consoleErrorSpy).toHaveBeenCalledWith('Email service error:', testError);
      consoleErrorSpy.mockRestore();
    });

    it('initializes EmailJS only once', async () => {
      mockEmailJS.send.mockResolvedValue({ status: 200 });

      // Send multiple emails
      await sendContactEmail(mockFormData, mockConfig);
      await sendContactEmail(mockFormData, mockConfig);

      // EmailJS should only be initialized once
      expect(mockEmailJS.init).toHaveBeenCalledTimes(1);
    });

    it('uses environment variables when no config provided', async () => {
      vi.stubEnv('VITE_EMAILJS_SERVICE_ID', 'env_service_id');
      vi.stubEnv('VITE_EMAILJS_TEMPLATE_ID', 'env_template_id');
      vi.stubEnv('VITE_EMAILJS_PUBLIC_KEY', 'env_public_key');

      mockEmailJS.send.mockResolvedValue({ status: 200 });

      await sendContactEmail(mockFormData);

      expect(mockEmailJS.init).toHaveBeenCalledWith('env_public_key');
      expect(mockEmailJS.send).toHaveBeenCalledWith(
        'env_service_id',
        'env_template_id',
        expect.any(Object)
      );
    });

    it('formats template parameters correctly', async () => {
      mockEmailJS.send.mockResolvedValue({ status: 200 });

      await sendContactEmail(mockFormData, mockConfig);

      expect(mockEmailJS.send).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        {
          from_name: 'John Doe',
          from_email: 'john@example.com',
          message: 'This is a test message.',
          to_name: 'Portfolio Owner',
          reply_to: 'john@example.com',
        }
      );
    });
  });

  describe('validateEmailConfig', () => {
    it('returns true for valid configuration', () => {
      const result = validateEmailConfig(mockConfig);
      expect(result).toBe(true);
    });

    it('returns false for incomplete configuration', () => {
      const incompleteConfig = {
        serviceId: '',
        templateId: 'test_template_id',
        publicKey: 'test_public_key',
      };

      const result = validateEmailConfig(incompleteConfig);
      expect(result).toBe(false);
    });

    it('returns false when serviceId is missing', () => {
      const configWithoutServiceId = {
        serviceId: '',
        templateId: 'test_template_id',
        publicKey: 'test_public_key',
      };

      const result = validateEmailConfig(configWithoutServiceId);
      expect(result).toBe(false);
    });

    it('returns false when templateId is missing', () => {
      const configWithoutTemplateId = {
        serviceId: 'test_service_id',
        templateId: '',
        publicKey: 'test_public_key',
      };

      const result = validateEmailConfig(configWithoutTemplateId);
      expect(result).toBe(false);
    });

    it('returns false when publicKey is missing', () => {
      const configWithoutPublicKey = {
        serviceId: 'test_service_id',
        templateId: 'test_template_id',
        publicKey: '',
      };

      const result = validateEmailConfig(configWithoutPublicKey);
      expect(result).toBe(false);
    });

    it('uses default config when no config provided', () => {
      // Mock environment variables for default config
      vi.stubEnv('VITE_EMAILJS_SERVICE_ID', 'default_service');
      vi.stubEnv('VITE_EMAILJS_TEMPLATE_ID', 'default_template');
      vi.stubEnv('VITE_EMAILJS_PUBLIC_KEY', 'default_key');

      const result = validateEmailConfig();
      expect(result).toBe(true);
    });
  });

  describe('getFallbackContactInfo', () => {
    it('returns fallback contact information', () => {
      const result = getFallbackContactInfo();

      expect(result).toEqual({
        email: 'your.email@example.com',
        linkedin: 'https://linkedin.com/in/yourprofile',
        github: 'https://github.com/yourusername',
        message: "If the contact form isn't working, please reach out directly via email or social media.",
      });
    });

    it('returns consistent data on multiple calls', () => {
      const result1 = getFallbackContactInfo();
      const result2 = getFallbackContactInfo();

      expect(result1).toEqual(result2);
    });
  });

  describe('Error handling edge cases', () => {
    it('handles EmailJS initialization errors', async () => {
      mockEmailJS.init.mockImplementation(() => {
        throw new Error('Initialization failed');
      });

      const result = await sendContactEmail(mockFormData, mockConfig);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Initialization failed');
    });

    it('handles malformed response from EmailJS', async () => {
      mockEmailJS.send.mockResolvedValue(null);

      const result = await sendContactEmail(mockFormData, mockConfig);

      expect(result.success).toBe(false);
      expect(result.message).toBe('Failed to send message. Please try again later.');
    });

    it('handles EmailJS send method throwing synchronously', async () => {
      mockEmailJS.send.mockImplementation(() => {
        throw new Error('Synchronous error');
      });

      const result = await sendContactEmail(mockFormData, mockConfig);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Synchronous error');
    });
  });
});