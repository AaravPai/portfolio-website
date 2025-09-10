import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import type { ContactForm } from '../../../types';
import './ContactForm.css';

// Yup validation schema
const contactValidationSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .required('Name is required'),
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  message: Yup.string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must be less than 1000 characters')
    .required('Message is required'),
});

interface ContactFormProps {
  onSubmit: (values: ContactForm) => Promise<void>;
  isSubmitting?: boolean;
}

const ContactForm: React.FC<ContactFormProps> = ({ onSubmit, isSubmitting = false }) => {
  const initialValues: ContactForm = {
    name: '',
    email: '',
    message: '',
  };

  const handleSubmit = async (
    values: ContactForm,
    { setSubmitting, resetForm }: { setSubmitting: (isSubmitting: boolean) => void; resetForm: () => void }
  ) => {
    try {
      await onSubmit(values);
      resetForm();
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact-form-container">
      <Formik
        initialValues={initialValues}
        validationSchema={contactValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting: formikSubmitting, errors, touched }) => (
          <Form className="contact-form">
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Name *
              </label>
              <Field
                type="text"
                id="name"
                name="name"
                className={`form-input ${errors.name && touched.name ? 'error' : ''}`}
                placeholder="Your full name"
                aria-describedby="name-error"
              />
              <ErrorMessage name="name" component="div" className="error-message" id="name-error" role="alert" />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email *
              </label>
              <Field
                type="email"
                id="email"
                name="email"
                className={`form-input ${errors.email && touched.email ? 'error' : ''}`}
                placeholder="your.email@example.com"
                aria-describedby="email-error"
              />
              <ErrorMessage name="email" component="div" className="error-message" id="email-error" role="alert" />
            </div>

            <div className="form-group">
              <label htmlFor="message" className="form-label">
                Message *
              </label>
              <Field
                as="textarea"
                id="message"
                name="message"
                rows={5}
                className={`form-input form-textarea ${errors.message && touched.message ? 'error' : ''}`}
                placeholder="Tell me about your project or opportunity..."
                aria-describedby="message-error"
              />
              <ErrorMessage name="message" component="div" className="error-message" id="message-error" role="alert" />
            </div>

            <button
              type="submit"
              disabled={formikSubmitting || isSubmitting}
              className={`submit-button ${formikSubmitting || isSubmitting ? 'submitting' : ''}`}
              aria-describedby="submit-status"
            >
              {formikSubmitting || isSubmitting ? (
                <>
                  <span className="loading-spinner" aria-hidden="true"></span>
                  Sending...
                </>
              ) : (
                'Send Message'
              )}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ContactForm;