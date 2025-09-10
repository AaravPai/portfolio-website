import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import Footer from './Footer';
import { ThemeProvider } from '../../../contexts/ThemeContext';

// Mock window.open and window.scrollTo
const mockOpen = vi.fn();
const mockScrollTo = vi.fn();
const mockScrollIntoView = vi.fn();

Object.defineProperty(window, 'open', {
  value: mockOpen,
  writable: true,
});

Object.defineProperty(window, 'scrollTo', {
  value: mockScrollTo,
  writable: true,
});

// Mock getElementById and scrollIntoView
Object.defineProperty(document, 'getElementById', {
  value: vi.fn((id) => ({
    scrollIntoView: mockScrollIntoView,
  })),
  writable: true,
});

// Helper function to render Footer with ThemeProvider
const renderFooter = (props = {}) => {
  return render(
    <ThemeProvider>
      <Footer {...props} />
    </ThemeProvider>
  );
};

describe('Footer Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders footer with proper structure', () => {
    renderFooter();
    
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveClass('footer');
  });

  it('displays current year in copyright', () => {
    renderFooter();
    
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(new RegExp(`© ${currentYear}`))).toBeInTheDocument();
  });

  describe('Social Links', () => {
    it('renders social links section', () => {
      renderFooter();
      
      expect(screen.getByText('Connect with me')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /visit github profile/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /visit linkedin profile/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /send email/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /visit twitter profile/i })).toBeInTheDocument();
    });

    it('opens external links in new tab', () => {
      renderFooter();
      
      const githubLink = screen.getByRole('button', { name: /visit github profile/i });
      fireEvent.click(githubLink);
      
      expect(mockOpen).toHaveBeenCalledWith(
        'https://github.com',
        '_blank',
        'noopener,noreferrer'
      );
    });

    it('handles email link correctly', () => {
      renderFooter();
      
      // Mock window.location.href
      delete (window as any).location;
      (window as any).location = { href: '' };
      
      const emailLink = screen.getByRole('button', { name: /send email/i });
      fireEvent.click(emailLink);
      
      expect(window.location.href).toBe('mailto:contact@example.com');
    });

    it('has proper accessibility attributes', () => {
      renderFooter();
      
      const socialLinks = screen.getAllByRole('button', { name: /visit|send/i });
      socialLinks.forEach(link => {
        expect(link).toHaveAttribute('aria-label');
        expect(link).toHaveAttribute('title');
      });
    });
  });

  describe('Quick Links', () => {
    it('renders quick links section', () => {
      renderFooter();
      
      expect(screen.getByText('Quick Links')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'About' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Projects' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Contact' })).toBeInTheDocument();
    });

    it('handles navigation clicks', () => {
      renderFooter();
      
      const aboutLink = screen.getByRole('button', { name: 'About' });
      fireEvent.click(aboutLink);
      
      expect(document.getElementById).toHaveBeenCalledWith('about');
      expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
    });

    it('handles projects navigation', () => {
      renderFooter();
      
      const projectsLink = screen.getByRole('button', { name: 'Projects' });
      fireEvent.click(projectsLink);
      
      expect(document.getElementById).toHaveBeenCalledWith('projects');
      expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
    });

    it('handles contact navigation', () => {
      renderFooter();
      
      const contactLink = screen.getByRole('button', { name: 'Contact' });
      fireEvent.click(contactLink);
      
      expect(document.getElementById).toHaveBeenCalledWith('contact');
      expect(mockScrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
    });
  });

  describe('Back to Top', () => {
    it('renders back to top button', () => {
      renderFooter();
      
      const backToTopBtn = screen.getByRole('button', { name: /back to top/i });
      expect(backToTopBtn).toBeInTheDocument();
      expect(screen.getByText('Back to Top')).toBeInTheDocument();
    });

    it('scrolls to top when clicked', () => {
      renderFooter();
      
      const backToTopBtn = screen.getByRole('button', { name: /back to top/i });
      fireEvent.click(backToTopBtn);
      
      expect(mockScrollTo).toHaveBeenCalledWith({
        top: 0,
        behavior: 'smooth'
      });
    });

    it('has proper accessibility attributes', () => {
      renderFooter();
      
      const backToTopBtn = screen.getByRole('button', { name: /back to top/i });
      expect(backToTopBtn).toHaveAttribute('aria-label', 'Back to top');
      expect(backToTopBtn).toHaveAttribute('title', 'Back to top');
    });
  });

  describe('Copyright Section', () => {
    it('displays copyright information', () => {
      renderFooter();
      
      const currentYear = new Date().getFullYear();
      expect(screen.getByText(new RegExp(`© ${currentYear} Portfolio Website`))).toBeInTheDocument();
      expect(screen.getByText(/Built with React & TypeScript/)).toBeInTheDocument();
    });

    it('displays attribution', () => {
      renderFooter();
      
      expect(screen.getByText(/Designed and developed with ❤️/)).toBeInTheDocument();
    });
  });

  describe('Custom Props', () => {
    it('applies custom className', () => {
      renderFooter({ className: 'custom-footer' });
      
      const footer = screen.getByRole('contentinfo');
      expect(footer).toHaveClass('custom-footer');
    });
  });

  describe('Accessibility', () => {
    it('uses proper semantic footer element', () => {
      renderFooter();
      
      const footer = screen.getByRole('contentinfo');
      expect(footer.tagName).toBe('FOOTER');
    });

    it('has proper heading structure', () => {
      renderFooter();
      
      const headings = screen.getAllByRole('heading', { level: 3 });
      expect(headings).toHaveLength(2);
      expect(headings[0]).toHaveTextContent('Connect with me');
      expect(headings[1]).toHaveTextContent('Quick Links');
    });

    it('has proper list structure', () => {
      renderFooter();
      
      const lists = screen.getAllByRole('list');
      expect(lists.length).toBeGreaterThan(0);
    });
  });
});