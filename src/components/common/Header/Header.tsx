import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../contexts/useTheme';
import { useScrollNavigation, smoothScrollTo } from '../../../hooks/useScrollNavigation';
import { useTouchOptimization } from '../../../hooks/useTouchOptimization';
import './Header.css';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isTouchDevice } = useTouchOptimization();
  
  const navigationItems = [
    { id: 'hero', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'resume', label: 'Resume' },
    { id: 'contact', label: 'Contact' },
  ];

  const sectionIds = navigationItems.map(item => item.id);
  const { activeSection, isScrolled } = useScrollNavigation(sectionIds);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isMenuOpen && !target.closest('.header')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const handleNavClick = (sectionId: string) => {
    smoothScrollTo(sectionId, 80); // 80px offset for fixed header
    setIsMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className={`header ${isScrolled ? 'header--scrolled' : ''} ${className}`}>
      <div className="header__container">
        <div className="header__brand">
          <button
            className="header__logo"
            onClick={() => handleNavClick('hero')}
            aria-label="Go to top"
          >
            Portfolio
          </button>
        </div>

        {/* Desktop Navigation */}
        <nav id="navigation" className="header__nav" aria-label="Main navigation">
          <ul className="header__nav-list" role="menubar">
            {navigationItems.slice(1).map((item) => ( // Skip 'Home' for desktop nav
              <li key={item.id} className="header__nav-item" role="none">
                <button
                  className={`header__nav-link ${
                    activeSection === item.id ? 'header__nav-link--active' : ''
                  }`}
                  onClick={() => handleNavClick(item.id)}
                  role="menuitem"
                  aria-current={activeSection === item.id ? 'page' : undefined}
                  aria-label={`Navigate to ${item.label} section`}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Theme Toggle */}
        <button
          className="header__theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          <span className="header__theme-icon">
            {theme === 'light' ? '🌙' : '☀️'}
          </span>
        </button>

        {/* Mobile Menu Button */}
        <button
          className={`header__mobile-toggle ${isMenuOpen ? 'header__mobile-toggle--active' : ''}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
          aria-expanded={isMenuOpen}
        >
          <span className="header__hamburger-line"></span>
          <span className="header__hamburger-line"></span>
          <span className="header__hamburger-line"></span>
        </button>
      </div>

      {/* Mobile Navigation */}
      <nav
        className={`header__mobile-nav ${isMenuOpen ? 'header__mobile-nav--open' : ''}`}
        aria-label="Mobile navigation"
        aria-hidden={!isMenuOpen}
      >
        <ul className="header__mobile-nav-list" role="menu">
          {navigationItems.map((item) => (
            <li key={item.id} className="header__mobile-nav-item" role="none">
              <button
                className={`header__mobile-nav-link ${
                  activeSection === item.id ? 'header__mobile-nav-link--active' : ''
                }`}
                onClick={() => handleNavClick(item.id)}
                role="menuitem"
                aria-current={activeSection === item.id ? 'page' : undefined}
                tabIndex={isMenuOpen ? 0 : -1}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && <div className="header__overlay" onClick={() => setIsMenuOpen(false)} />}
    </header>
  );
};

export default Header;