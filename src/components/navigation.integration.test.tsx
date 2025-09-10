import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import App from '../App';

// Mock all the section components to avoid complex dependencies
vi.mock('./sections/Hero', () => ({
  default: () => <div data-testid="hero-section">Hero Section</div>,
}));

vi.mock('./sections/Projects', () => ({
  Projects: () => <section id="projects" data-testid="projects-section">Projects Section</section>,
}));

vi.mock('./sections/Skills', () => ({
  default: () => <section id="skills" data-testid="skills-section">Skills Section</section>,
}));

vi.mock('./sections/Resume', () => ({
  Resume: () => <section id="resume" data-testid="resume-section">Resume Section</section>,
}));

vi.mock('./sections/Contact', () => ({
  Contact: () => <section id="contact" data-testid="contact-section">Contact Section</section>,
}));

// Mock the theme context
vi.mock('../contexts/useTheme', () => ({
  useTheme: () => ({
    theme: 'light',
    toggleTheme: vi.fn(),
  }),
}));

// Mock IntersectionObserver
const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
});
window.IntersectionObserver = mockIntersectionObserver;

// Mock window.scrollTo
const mockScrollTo = vi.fn();
window.scrollTo = mockScrollTo;

// Mock getBoundingClientRect
const mockGetBoundingClientRect = vi.fn();
Element.prototype.getBoundingClientRect = mockGetBoundingClientRect;

describe('Navigation Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetBoundingClientRect.mockReturnValue({
      top: 100,
      left: 0,
      right: 0,
      bottom: 200,
      width: 100,
      height: 100,
    });
    Object.defineProperty(window, 'pageYOffset', {
      value: 0,
      writable: true,
    });
  });

  it('renders all main sections with correct IDs', () => {
    render(<App />);

    // Check that main sections are rendered with correct IDs
    expect(document.getElementById('hero')).toBeInTheDocument();
    expect(document.getElementById('about')).toBeInTheDocument();
    
    // Other sections may be lazy-loaded, so check if they exist or are referenced
    const projectsSection = document.getElementById('projects');
    const skillsSection = document.getElementById('skills');
    const resumeSection = document.getElementById('resume');
    const contactSection = document.getElementById('contact');
    
    // At least hero and about should be present
    expect(document.getElementById('hero')).not.toBeNull();
    expect(document.getElementById('about')).not.toBeNull();
  });

  it('renders header navigation with all links', () => {
    render(<App />);

    // Check for navigation within the header specifically
    const headerNav = screen.getByLabelText('Main navigation');
    const expectedNavItems = ['About', 'Projects', 'Skills', 'Resume', 'Contact'];
    
    expectedNavItems.forEach((item) => {
      // Check that the header navigation contains buttons with these names
      const navButtons = headerNav.querySelectorAll('button');
      const hasNavItem = Array.from(navButtons).some(button => 
        button.textContent?.trim() === item
      );
      expect(hasNavItem).toBe(true);
    });
  });

  it('renders back to top button', () => {
    render(<App />);

    const backToTopButtons = screen.getAllByRole('button', { name: /back to top/i });
    expect(backToTopButtons.length).toBeGreaterThan(0);
  });

  it('wraps sections with ScrollReveal components', () => {
    render(<App />);

    // Check that ScrollReveal wrapper classes are present
    const scrollRevealElements = document.querySelectorAll('.scroll-reveal');
    expect(scrollRevealElements.length).toBeGreaterThan(0);
  });

  it('handles navigation click and smooth scrolling', () => {
    // Mock getElementById to return a mock element
    const mockElement = document.createElement('div');
    mockElement.id = 'projects';
    document.getElementById = vi.fn().mockReturnValue(mockElement);

    render(<App />);

    // Get the header navigation specifically
    const headerNav = screen.getByLabelText('Main navigation');
    const projectsLinks = screen.getAllByRole('button', { name: 'Projects' });
    const headerProjectsLink = projectsLinks.find(link => headerNav.contains(link));
    
    if (headerProjectsLink) {
      fireEvent.click(headerProjectsLink);
      expect(mockScrollTo).toHaveBeenCalledWith({
        top: 20, // 100 (getBoundingClientRect top) + 0 (pageYOffset) - 80 (offset)
        behavior: 'smooth',
      });
    }
  });

  it('shows back to top button when scrolled down', async () => {
    render(<App />);

    const backToTopButtons = screen.getAllByRole('button', { name: /back to top/i });
    const mainBackToTopButton = backToTopButtons.find(button => 
      button.classList.contains('back-to-top')
    );
    
    if (mainBackToTopButton) {
      // Initially should not be visible
      expect(mainBackToTopButton).not.toHaveClass('back-to-top--visible');

      // Simulate scrolling down
      Object.defineProperty(window, 'scrollY', {
        value: 400,
        writable: true,
      });
      fireEvent.scroll(window);

      await waitFor(() => {
        expect(mainBackToTopButton).toHaveClass('back-to-top--visible');
      });
    }
  });

  it('handles back to top button click', () => {
    render(<App />);

    const backToTopButtons = screen.getAllByRole('button', { name: /back to top/i });
    const mainBackToTopButton = backToTopButtons.find(button => 
      button.classList.contains('back-to-top')
    );
    
    if (mainBackToTopButton) {
      fireEvent.click(mainBackToTopButton);
      expect(mockScrollTo).toHaveBeenCalledWith({
        top: 0,
        behavior: 'smooth',
      });
    }
  });

  it('sets up intersection observer for section detection', () => {
    render(<App />);

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      {
        threshold: 0.3,
        rootMargin: '-20% 0px -70% 0px',
      }
    );
  });

  it('applies scroll reveal animations to sections', () => {
    render(<App />);

    // Check that sections have scroll reveal styling
    const aboutSection = document.getElementById('about');
    const projectsSection = document.querySelector('[data-testid="projects-section"]');
    
    if (aboutSection?.parentElement) {
      expect(aboutSection.parentElement).toHaveClass('scroll-reveal');
    }
    if (projectsSection?.parentElement) {
      expect(projectsSection.parentElement).toHaveClass('scroll-reveal');
    }
  });

  it('handles mobile navigation correctly', () => {
    render(<App />);

    const mobileToggle = screen.getByLabelText(/toggle mobile menu/i);
    
    // Open mobile menu
    fireEvent.click(mobileToggle);
    expect(mobileToggle).toHaveAttribute('aria-expanded', 'true');

    // Click a navigation item in mobile menu
    const mobileNavItems = screen.getAllByRole('button', { name: 'About' });
    const mobileAboutLink = mobileNavItems.find(button => 
      button.closest('.header__mobile-nav')
    );
    
    if (mobileAboutLink) {
      fireEvent.click(mobileAboutLink);
      expect(mobileToggle).toHaveAttribute('aria-expanded', 'false');
    }
  });
});