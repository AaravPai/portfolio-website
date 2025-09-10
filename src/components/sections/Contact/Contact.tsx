import React, { useState } from 'react';
import ContactForm from './ContactForm';
import SocialLinks, { type ContactInfo } from './SocialLinks';
import { sendContactEmail, type EmailServiceResponse } from '../../../services/emailService';
import { personalInfo } from '../../../data/resume';
import type { ContactForm as ContactFormType } from '../../../types';
import './Contact.css';

// Message status types
type MessageStatus = 'idle' | 'sending' | 'success' | 'error';

interface ContactProps {
  className?: string;
  contactInfo?: ContactInfo;
}

const Contact: React.FC<ContactProps> = ({ 
  className = '', 
  contactInfo = {
    email: personalInfo.email,
    phone: personalInfo.phone,
    location: personalInfo.location,
    linkedin: personalInfo.linkedin,
    github: personalInfo.github,
  }
}) => {
  const [messageStatus, setMessageStatus] = useState<MessageStatus>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFormSubmit = async (formData: ContactFormType): Promise<void> => {
    setIsSubmitting(true);
    setMessageStatus('sending');
    setStatusMessage('');

    try {
      const response: EmailServiceResponse = await sendContactEmail(formData);
      
      if (response.success) {
        setMessageStatus('success');
        setStatusMessage(response.message);
      } else {
        setMessageStatus('error');
        setStatusMessage(response.message);
      }
    } catch (error) {
      console.error('Contact form submission error:', error);
      setMessageStatus('error');
      setStatusMessage('An unexpected error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetStatus = () => {
    setMessageStatus('idle');
    setStatusMessage('');
  };

  return (
    <section className={`contact-section ${className}`} id="contact">
      <div className="contact-container">
        <div className="contact-header">
          <h2 className="contact-title">Get In Touch</h2>
          <p className="contact-description">
            I'm always interested in new opportunities and collaborations. 
            Whether you have a project in mind or just want to say hello, 
            I'd love to hear from you!
          </p>
        </div>

        <div className="contact-content">
          <div className="contact-form-section">
            <ContactForm 
              onSubmit={handleFormSubmit} 
              isSubmitting={isSubmitting}
            />
            
            {/* Status Messages */}
            {messageStatus !== 'idle' && (
              <div className={`status-message ${messageStatus}`} role="alert">
                <div className="status-content">
                  {messageStatus === 'success' && (
                    <div className="success-icon" aria-hidden="true">✓</div>
                  )}
                  {messageStatus === 'error' && (
                    <div className="error-icon" aria-hidden="true">⚠</div>
                  )}
                  {messageStatus === 'sending' && (
                    <div className="loading-icon" aria-hidden="true">
                      <div className="spinner"></div>
                    </div>
                  )}
                  <p className="status-text">{statusMessage}</p>
                  {messageStatus !== 'sending' && (
                    <button 
                      className="status-dismiss" 
                      onClick={resetStatus}
                      aria-label="Dismiss message"
                    >
                      ×
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Contact Information and Social Links */}
          <div className="contact-info-section">
            <h3 className="contact-info-title">Let's Connect</h3>
            <p className="contact-info-description">
              Feel free to reach out through any of these channels. I'm always open to 
              discussing new opportunities, collaborations, or just having a chat.
            </p>
            
            <SocialLinks 
              contactInfo={contactInfo}
              showLabels={true}
              size="medium"
              layout="vertical"
              className="contact-social-links"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;