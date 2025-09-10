import React from 'react';
import { FaEnvelope, FaLinkedin, FaGithub, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import './SocialLinks.css';

// Social media and contact information interface
export interface ContactInfo {
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
}

interface SocialLinksProps {
  contactInfo: ContactInfo;
  className?: string;
  showLabels?: boolean;
  size?: 'small' | 'medium' | 'large';
  layout?: 'horizontal' | 'vertical';
}

const SocialLinks: React.FC<SocialLinksProps> = ({
  contactInfo,
  className = '',
  showLabels = true,
  size = 'medium',
  layout = 'vertical',
}) => {
  const contactMethods = [
    {
      key: 'email',
      value: contactInfo.email,
      href: contactInfo.email ? `mailto:${contactInfo.email}` : undefined,
      icon: FaEnvelope,
      label: 'Email',
      ariaLabel: `Send email to ${contactInfo.email}`,
      external: false,
    },
    {
      key: 'phone',
      value: contactInfo.phone,
      href: contactInfo.phone ? `tel:${contactInfo.phone}` : undefined,
      icon: FaPhone,
      label: 'Phone',
      ariaLabel: `Call ${contactInfo.phone}`,
      external: false,
    },
    {
      key: 'location',
      value: contactInfo.location,
      href: contactInfo.location ? `https://maps.google.com/?q=${encodeURIComponent(contactInfo.location)}` : undefined,
      icon: FaMapMarkerAlt,
      label: 'Location',
      ariaLabel: `View ${contactInfo.location} on map`,
      external: true,
    },
    {
      key: 'linkedin',
      value: contactInfo.linkedin,
      href: contactInfo.linkedin,
      icon: FaLinkedin,
      label: 'LinkedIn',
      ariaLabel: 'Connect on LinkedIn',
      external: true,
    },
    {
      key: 'github',
      value: contactInfo.github,
      href: contactInfo.github,
      icon: FaGithub,
      label: 'GitHub',
      ariaLabel: 'View GitHub profile',
      external: true,
    },

  ];

  // Filter out methods that don't have values
  const availableMethods = contactMethods.filter(method => method.value && method.href);

  if (availableMethods.length === 0) {
    return null;
  }

  return (
    <div className={`social-links ${layout} ${size} ${className}`}>
      {availableMethods.map(({ key, href, icon: Icon, label, ariaLabel, external, value }) => (
        <a
          key={key}
          href={href}
          className={`social-link ${key}`}
          aria-label={ariaLabel}
          target={external ? '_blank' : undefined}
          rel={external ? 'noopener noreferrer' : undefined}
        >
          <Icon className="social-icon" aria-hidden="true" />
          {showLabels && (
            <span className="social-label">
              {key === 'email' || key === 'phone' || key === 'location' ? value : label}
            </span>
          )}
        </a>
      ))}
    </div>
  );
};

export default SocialLinks;