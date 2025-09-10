import React from 'react';
import { personalInfo } from '../../../data/resume';
import './Footer.css';

interface SocialLink {
  name: string;
  url: string;
  icon: string;
  ariaLabel: string;
}

interface FooterProps {
  className?: string;
}

const Footer: React.FC<FooterProps> = ({ className = '' }) => {
  const currentYear = new Date().getFullYear();

  const socialLinks: SocialLink[] = [
    {
      name: 'GitHub',
      url: personalInfo.github,
      icon: '🔗',
      ariaLabel: 'Visit GitHub profile'
    },
    {
      name: 'LinkedIn',
      url: personalInfo.linkedin,
      icon: '💼',
      ariaLabel: 'Visit LinkedIn profile'
    },
    {
      name: 'Email',
      url: `mailto:${personalInfo.email}`,
      icon: '📧',
      ariaLabel: 'Send email'
    },
    ...(personalInfo.website ? [{
      name: 'Website',
      url: personalInfo.website,
      icon: '🌐',
      ariaLabel: 'Visit website'
    }] : [])
  ];

  const handleSocialClick = (url: string) => {
    if (url.startsWith('mailto:')) {
      window.location.href = url;
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className={`footer ${className}`}>
      <div className="footer__container">
        {/* Social Links */}
        <div className="footer__social">
          <h3 className="footer__social-title">Connect with me</h3>
          <ul className="footer__social-list">
            {socialLinks.map((link) => (
              <li key={link.name} className="footer__social-item">
                <button
                  className="footer__social-link"
                  onClick={() => handleSocialClick(link.url)}
                  aria-label={link.ariaLabel}
                  title={link.name}
                >
                  <span className="footer__social-icon" aria-hidden="true">
                    {link.icon}
                  </span>
                  <span className="footer__social-name">{link.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Links */}
        <div className="footer__links">
          <h3 className="footer__links-title">Quick Links</h3>
          <ul className="footer__links-list">
            <li className="footer__links-item">
              <button
                className="footer__link"
                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
              >
                About
              </button>
            </li>
            <li className="footer__links-item">
              <button
                className="footer__link"
                onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Projects
              </button>
            </li>
            <li className="footer__links-item">
              <button
                className="footer__link"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Contact
              </button>
            </li>
          </ul>
        </div>

        {/* Back to Top */}
        <div className="footer__back-to-top">
          <button
            className="footer__back-to-top-btn"
            onClick={scrollToTop}
            aria-label="Back to top"
            title="Back to top"
          >
            <span className="footer__back-to-top-icon" aria-hidden="true">↑</span>
            <span className="footer__back-to-top-text">Back to Top</span>
          </button>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer__bottom">
        <div className="footer__container">
          <p className="footer__copyright">
            © {currentYear} {personalInfo.name}. Built with React & TypeScript.
          </p>
          <p className="footer__attribution">
            Designed and developed with ❤️
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;