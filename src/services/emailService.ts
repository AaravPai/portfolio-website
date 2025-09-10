import emailjs from '@emailjs/browser';
import type { ContactForm } from '../types';

// EmailJS configuration interface
interface EmailJSConfig {
  serviceId: string;
  templateId: string;
  publicKey: string;
}

// Email service response interface
export interface EmailServiceResponse {
  success: boolean;
  message: string;
  error?: string;
}

// Default configuration (should be overridden with environment variables)
const defaultConfig: EmailJSConfig = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || 'your_service_id',
  templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'your_template_id',
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'your_public_key',
};

// Initialize EmailJS
let isInitialized = false;

const initializeEmailJS = (config: EmailJSConfig = defaultConfig): void => {
  if (!isInitialized) {
    try {
      emailjs.init(config.publicKey);
      isInitialized = true;
    } catch (error) {
      throw new Error(`EmailJS initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
};

// Reset initialization state (for testing)
export const resetEmailService = (): void => {
  isInitialized = false;
};

// Send email using EmailJS
export const sendContactEmail = async (
  formData: ContactForm,
  config: EmailJSConfig = defaultConfig
): Promise<EmailServiceResponse> => {
  try {
    // Initialize EmailJS if not already done
    initializeEmailJS(config);

    // Validate configuration
    if (!config.serviceId || !config.templateId || !config.publicKey) {
      throw new Error('EmailJS configuration is incomplete');
    }

    // Prepare template parameters
    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      message: formData.message,
      to_name: 'Portfolio Owner', // This can be customized
      reply_to: formData.email,
    };

    // Send email
    const response = await emailjs.send(
      config.serviceId,
      config.templateId,
      templateParams
    );

    if (response.status === 200) {
      return {
        success: true,
        message: 'Message sent successfully! I\'ll get back to you soon.',
      };
    } else {
      throw new Error(`EmailJS returned status: ${response.status}`);
    }
  } catch (error) {
    console.error('Email service error:', error);
    
    let errorMessage = 'Failed to send message. Please try again later.';
    
    if (error instanceof Error) {
      if (error.message.includes('configuration')) {
        errorMessage = 'Email service is not properly configured.';
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      }
    }

    return {
      success: false,
      message: errorMessage,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

// Validate email service configuration
export const validateEmailConfig = (config: EmailJSConfig = defaultConfig): boolean => {
  return !!(config.serviceId && config.templateId && config.publicKey);
};

// Test email service connection
export const testEmailService = async (config: EmailJSConfig = defaultConfig): Promise<boolean> => {
  try {
    initializeEmailJS(config);
    
    // Send a test email with minimal data
    const testData: ContactForm = {
      name: 'Test User',
      email: 'test@example.com',
      message: 'This is a test message to verify email service configuration.',
    };

    const response = await sendContactEmail(testData, config);
    return response.success;
  } catch (error) {
    console.error('Email service test failed:', error);
    return false;
  }
};

// Fallback contact information
export const getFallbackContactInfo = () => ({
  email: 'your.email@example.com', // This should be replaced with actual email
  linkedin: 'https://linkedin.com/in/yourprofile',
  github: 'https://github.com/yourusername',
  message: 'If the contact form isn\'t working, please reach out directly via email or social media.',
});