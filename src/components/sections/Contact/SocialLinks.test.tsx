import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import SocialLinks, { type ContactInfo } from './SocialLinks';

// Mock CSS import
vi.mock('./SocialLinks.css', () => ({}));

// Mock react-icons
vi.mock('react-icons/fa', () => ({
  FaEnvelope: ({ className, 'aria-hidden': ariaHidden }: any) => (
    <span className={className} aria-hidden={ariaHidden} data-testid="email-icon">📧</span>
  ),
  FaLinkedin: ({ className, 'aria-hidden': ariaHidden }: any) => (
    <span className={className} aria-hidden={ariaHidden} data-testid="linkedin-icon">💼</span>
  ),
  FaGithub: ({ className, 'aria-hidden': ariaHidden }: any) => (
    <span className={className} aria-hidden={ariaHidden} data-testid="github-icon">🔗</span>
  ),

  FaPhone: ({ className, 'aria-hidden': ariaHidden }: any) => (
    <span className={className} aria-hidden={ariaHidden} data-testid="phone-icon">📞</span>
  ),
  FaMapMarkerAlt: ({ className, 'aria-hidden': ariaHidden }: any) => (
    <span className={className} aria-hidden={ariaHidden} data-testid="location-icon">📍</span>
  ),
}));

describe('SocialLinks', () => {
  const mockContactInfo: ContactInfo = {
    email: 'test@example.com',
    phone: '+1-234-567-8900',
    location: 'San Francisco, CA',
    linkedin: 'https://linkedin.com/in/testuser',
    github: 'https://github.com/testuser',
  };

  describe('Component Rendering', () => {
    it('renders all contact methods when provided', () => {
      render(<SocialLinks contactInfo={mockContactInfo} />);
      
      expect(screen.getByRole('link', { name: /send email to test@example.com/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /call \+1-234-567-8900/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /view san francisco, ca on map/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /connect on linkedin/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /view github profile/i })).toBeInTheDocument();
    });

    it('renders only available contact methods', () => {
      const partialContactInfo: ContactInfo = {
        email: 'test@example.com',
        github: 'https://github.com/testuser',
      };

      render(<SocialLinks contactInfo={partialContactInfo} />);
      
      expect(screen.getByRole('link', { name: /send email/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /view github profile/i })).toBeInTheDocument();
      expect(screen.queryByRole('link', { name: /linkedin/i })).not.toBeInTheDocument();
    });

    it('renders nothing when no contact info is provided', () => {
      const { container } = render(<SocialLinks contactInfo={{}} />);
      expect(container.firstChild).toBeNull();
    });

    it('applies custom className when provided', () => {
      const { container } = render(
        <SocialLinks contactInfo={mockContactInfo} className="custom-class" />
      );
      
      expect(container.firstChild).toHaveClass('social-links', 'custom-class');
    });
  });

  describe('Link Attributes', () => {
    it('sets correct href for email link', () => {
      render(<SocialLinks contactInfo={{ email: 'test@example.com' }} />);
      
      const emailLink = screen.getByRole('link', { name: /send email/i });
      expect(emailLink).toHaveAttribute('href', 'mailto:test@example.com');
    });

    it('sets correct href for phone link', () => {
      render(<SocialLinks contactInfo={{ phone: '+1-234-567-8900' }} />);
      
      const phoneLink = screen.getByRole('link', { name: /call/i });
      expect(phoneLink).toHaveAttribute('href', 'tel:+1-234-567-8900');
    });

    it('sets correct href for location link with encoding', () => {
      render(<SocialLinks contactInfo={{ location: 'San Francisco, CA' }} />);
      
      const locationLink = screen.getByRole('link', { name: /view.*on map/i });
      expect(locationLink).toHaveAttribute('href', 'https://maps.google.com/?q=San%20Francisco%2C%20CA');
    });

    it('sets external link attributes for social media links', () => {
      render(<SocialLinks contactInfo={mockContactInfo} />);
      
      const linkedinLink = screen.getByRole('link', { name: /linkedin/i });
      const githubLink = screen.getByRole('link', { name: /github/i });
      
      [linkedinLink, githubLink].forEach(link => {
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      });
    });

    it('does not set external attributes for direct contact methods', () => {
      render(<SocialLinks contactInfo={mockContactInfo} />);
      
      const emailLink = screen.getByRole('link', { name: /email/i });
      const phoneLink = screen.getByRole('link', { name: /call/i });
      
      expect(emailLink).not.toHaveAttribute('target');
      expect(emailLink).not.toHaveAttribute('rel');
      expect(phoneLink).not.toHaveAttribute('target');
      expect(phoneLink).not.toHaveAttribute('rel');
    });
  });

  describe('Icons and Labels', () => {
    it('renders icons for all contact methods', () => {
      render(<SocialLinks contactInfo={mockContactInfo} />);
      
      expect(screen.getByTestId('email-icon')).toBeInTheDocument();
      expect(screen.getByTestId('phone-icon')).toBeInTheDocument();
      expect(screen.getByTestId('location-icon')).toBeInTheDocument();
      expect(screen.getByTestId('linkedin-icon')).toBeInTheDocument();
      expect(screen.getByTestId('github-icon')).toBeInTheDocument();
    });

    it('renders labels when showLabels is true', () => {
      render(<SocialLinks contactInfo={mockContactInfo} showLabels={true} />);
      
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
      expect(screen.getByText('+1-234-567-8900')).toBeInTheDocument();
      expect(screen.getByText('San Francisco, CA')).toBeInTheDocument();
      expect(screen.getByText('LinkedIn')).toBeInTheDocument();
      expect(screen.getByText('GitHub')).toBeInTheDocument();
    });

    it('does not render labels when showLabels is false', () => {
      render(<SocialLinks contactInfo={mockContactInfo} showLabels={false} />);
      
      expect(screen.queryByText('test@example.com')).not.toBeInTheDocument();
      expect(screen.queryByText('LinkedIn')).not.toBeInTheDocument();
      expect(screen.queryByText('GitHub')).not.toBeInTheDocument();
    });

    it('sets aria-hidden on icons', () => {
      render(<SocialLinks contactInfo={{ email: 'test@example.com' }} />);
      
      const icon = screen.getByTestId('email-icon');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Layout and Size Variants', () => {
    it('applies vertical layout class by default', () => {
      const { container } = render(<SocialLinks contactInfo={mockContactInfo} />);
      
      expect(container.firstChild).toHaveClass('vertical');
    });

    it('applies horizontal layout class when specified', () => {
      const { container } = render(
        <SocialLinks contactInfo={mockContactInfo} layout="horizontal" />
      );
      
      expect(container.firstChild).toHaveClass('horizontal');
    });

    it('applies medium size class by default', () => {
      const { container } = render(<SocialLinks contactInfo={mockContactInfo} />);
      
      expect(container.firstChild).toHaveClass('medium');
    });

    it('applies size classes correctly', () => {
      const { container: smallContainer } = render(
        <SocialLinks contactInfo={mockContactInfo} size="small" />
      );
      const { container: largeContainer } = render(
        <SocialLinks contactInfo={mockContactInfo} size="large" />
      );
      
      expect(smallContainer.firstChild).toHaveClass('small');
      expect(largeContainer.firstChild).toHaveClass('large');
    });
  });

  describe('CSS Classes', () => {
    it('applies platform-specific classes to links', () => {
      render(<SocialLinks contactInfo={mockContactInfo} />);
      
      const emailLink = screen.getByRole('link', { name: /email/i });
      const linkedinLink = screen.getByRole('link', { name: /linkedin/i });
      const githubLink = screen.getByRole('link', { name: /github/i });
      
      expect(emailLink).toHaveClass('social-link', 'email');
      expect(linkedinLink).toHaveClass('social-link', 'linkedin');
      expect(githubLink).toHaveClass('social-link', 'github');
    });

    it('applies social-icon class to icons', () => {
      render(<SocialLinks contactInfo={{ email: 'test@example.com' }} />);
      
      const icon = screen.getByTestId('email-icon');
      expect(icon).toHaveClass('social-icon');
    });

    it('applies social-label class to labels', () => {
      render(<SocialLinks contactInfo={{ email: 'test@example.com' }} showLabels={true} />);
      
      const label = screen.getByText('test@example.com');
      expect(label).toHaveClass('social-label');
    });
  });

  describe('Accessibility', () => {
    it('provides descriptive aria-labels for all links', () => {
      render(<SocialLinks contactInfo={mockContactInfo} />);
      
      expect(screen.getByRole('link', { name: /send email to test@example.com/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /call \+1-234-567-8900/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /view san francisco, ca on map/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /connect on linkedin/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /view github profile/i })).toBeInTheDocument();
    });

    it('maintains accessibility when labels are hidden', () => {
      render(<SocialLinks contactInfo={mockContactInfo} showLabels={false} />);
      
      // Links should still have descriptive aria-labels even without visible text
      expect(screen.getByRole('link', { name: /send email/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /linkedin/i })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: /github/i })).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty strings in contact info', () => {
      const contactInfoWithEmptyStrings: ContactInfo = {
        email: '',
        linkedin: 'https://linkedin.com/in/testuser',
        github: '',
      };

      render(<SocialLinks contactInfo={contactInfoWithEmptyStrings} />);
      
      expect(screen.getByRole('link', { name: /linkedin/i })).toBeInTheDocument();
      expect(screen.queryByRole('link', { name: /email/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('link', { name: /github/i })).not.toBeInTheDocument();
    });

    it('handles special characters in location', () => {
      render(<SocialLinks contactInfo={{ location: 'São Paulo, Brazil & More' }} />);
      
      const locationLink = screen.getByRole('link', { name: /view.*on map/i });
      expect(locationLink).toHaveAttribute('href', 'https://maps.google.com/?q=S%C3%A3o%20Paulo%2C%20Brazil%20%26%20More');
    });

    it('handles undefined contact info gracefully', () => {
      const contactInfoWithUndefined: ContactInfo = {
        email: undefined,
        linkedin: 'https://linkedin.com/in/testuser',
        github: undefined,
      };

      render(<SocialLinks contactInfo={contactInfoWithUndefined} />);
      
      expect(screen.getByRole('link', { name: /linkedin/i })).toBeInTheDocument();
      expect(screen.queryByRole('link', { name: /email/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('link', { name: /github/i })).not.toBeInTheDocument();
    });
  });
});