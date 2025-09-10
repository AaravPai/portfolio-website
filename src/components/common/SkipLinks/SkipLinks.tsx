import React from 'react';
import './SkipLinks.css';

interface SkipLink {
  href: string;
  text: string;
}

interface SkipLinksProps {
  links?: SkipLink[];
}

const defaultLinks: SkipLink[] = [
  { href: '#main-content', text: 'Skip to main content' },
  { href: '#navigation', text: 'Skip to navigation' },
  { href: '#contact', text: 'Skip to contact form' },
];

const SkipLinks: React.FC<SkipLinksProps> = ({ links = defaultLinks }) => {
  const handleSkipClick = (event: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    event.preventDefault();
    const target = document.querySelector(targetId);
    if (target) {
      // Make target focusable if it isn't already
      if (!target.hasAttribute('tabindex')) {
        target.setAttribute('tabindex', '-1');
      }
      (target as HTMLElement).focus();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className="skip-links" aria-label="Skip navigation links">
      <ul className="skip-links__list">
        {links.map((link, index) => (
          <li key={index} className="skip-links__item">
            <a
              href={link.href}
              className="skip-links__link"
              onClick={(e) => handleSkipClick(e, link.href)}
            >
              {link.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default SkipLinks;