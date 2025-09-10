import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import Header from './Header';

// Mock the useTheme hook
const mockToggleTheme = vi.fn();
vi.mock('../../../contexts/useTheme', () => ({
  useTheme: () => ({
    theme: 'light',
    toggleTheme: mockToggleTheme,
  }),
}));

// Mock the useScrollNavigation hook
// Mock functions need to be declared before the vi.mock call
const mockSmoothScrollTo = vi.fn();

// Create a mock that can be updated
let mockScrollState = {
  activeSection: 'about',
  isScrolled: false,
  showBackToTop: false,
};

vi.mock('../../../hooks/useScrollNavigation', () => ({
  useScrollNavigation: () => mockScrollState,
  smoothScrollTo: () => mockSmoothScrollTo,
}));

vi.mock('../../../hooks/useTouchOptimization', () => ({
  useTouchOptimization: () => ({
    isTouchDevice: false,
  }),
}));

// Mock scrollIntoView
const mockScrollIntoView = vi.fn();
Object.defineProperty(Element.prototype, 'scrollIntoView', {
  value: mockScrollIntoView,
  writable: true,
});

// Helper function to render Header
const renderHeader = (props = {}) => {
  return render(<Header {...props} />);
};

describe('Header Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock getElementById
    document.getElementById = vi.fn((_id: string) => ({
      scrollIntoView: mockScrollIntoView,
    })) as any;
  });

  afterEach(() => {
    // Reset body overflow
    document.body.style.overflow = 'unset';
  });

  it('renders header with brand logo', () => {
    renderHeader();
    expect(screen.getByRole('button', { name: /go to top/i })).toBeInTheDocument();
    expect(screen.getByText('Portfolio')).toBeInTheDocument();
  });

  it('renders all navigation items', () => {
    renderHeader();
    const expectedNavItems = ['About', 'Projects', 'Skills', 'Resume', 'Contact'];
    
    expectedNavItems.forEach((item) => {
      expect(screen.getByRole('button', { name: item })).toBeInTheDocument();
    });
  });

  it('highlights active navigation item', () => {
    renderHeader();
    const aboutLink = screen.getByRole('button', { name: 'About' });
    
    expect(aboutLink).toHaveClass('header__nav-link--active');
  });

  it('renders theme toggle button', () => {
    renderHeader();
    expect(screen.getByRole('button', { name: /switch to dark mode/i })).toBeInTheDocument();
  });

  it('calls toggleTheme when theme toggle is clicked', () => {
    renderHeader();
    const themeToggle = screen.getByRole('button', { name: /switch to dark mode/i });
    
    fireEvent.click(themeToggle);
    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  it('handles navigation link clicks', () => {
    renderHeader();
    const aboutLink = screen.getByRole('button', { name: 'About' });
    
    fireEvent.click(aboutLink);
    expect(mockSmoothScrollTo).toHaveBeenCalledWith('about', 80);
  });

  it('handles logo click to scroll to hero section', () => {
    renderHeader();
    const logo = screen.getByRole('button', { name: /go to top/i });
    
    fireEvent.click(logo);
    expect(mockSmoothScrollTo).toHaveBeenCalledWith('hero', 80);
  });

  describe('Mobile Menu', () => {
    it('renders mobile menu toggle button', () => {
      renderHeader();
      expect(screen.getByRole('button', { name: 'Toggle mobile menu' })).toBeInTheDocument();
    });

    it('opens mobile menu when toggle is clicked', () => {
      renderHeader();
      const mobileToggle = screen.getByRole('button', { name: 'Toggle mobile menu' });
      
      fireEvent.click(mobileToggle);
      
      expect(mobileToggle).toHaveAttribute('aria-expanded', 'true');
      expect(document.body.style.overflow).toBe('hidden');
    });

    it('closes mobile menu when navigation item is clicked', () => {
      renderHeader();
      const mobileToggle = screen.getByRole('button', { name: 'Toggle mobile menu' });
      
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
        expect(document.body.style.overflow).toBe('unset');
      }
    });

    it('closes mobile menu when overlay is clicked', () => {
      renderHeader();
      const mobileToggle = screen.getByRole('button', { name: 'Toggle mobile menu' });
      
      // Open mobile menu
      fireEvent.click(mobileToggle);
      expect(mobileToggle).toHaveAttribute('aria-expanded', 'true');
      
      // Click overlay
      const overlay = document.querySelector('.header__overlay');
      if (overlay) {
        fireEvent.click(overlay);
        expect(mobileToggle).toHaveAttribute('aria-expanded', 'false');
      }
    });
  });

  describe('Scroll Effects', () => {
    it('adds scrolled class when scrolled', async () => {
      const { rerender } = renderHeader();
      const header = document.querySelector('.header');
      
      // Update mock state to simulate scrolling
      mockScrollState.isScrolled = true;
      
      // Re-render to apply the new state
      rerender(<Header />);
      
      await waitFor(() => {
        expect(header).toHaveClass('header--scrolled');
      });
    });

    it('removes scrolled class when at top', async () => {
      const { rerender } = renderHeader();
      const header = document.querySelector('.header');
      
      // First set scrolled state
      mockScrollState.isScrolled = true;
      rerender(<Header />);
      
      await waitFor(() => {
        expect(header).toHaveClass('header--scrolled');
      });
      
      // Then reset to top
      mockScrollState.isScrolled = false;
      rerender(<Header />);
      
      await waitFor(() => {
        expect(header).not.toHaveClass('header--scrolled');
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA labels', () => {
      renderHeader();
      
      expect(screen.getByRole('button', { name: /go to top/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Toggle mobile menu' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /switch to dark mode/i })).toBeInTheDocument();
      expect(screen.getByLabelText('Main navigation')).toBeInTheDocument();
      expect(screen.getByLabelText('Mobile navigation')).toBeInTheDocument();
    });

    it('manages focus properly', () => {
      renderHeader();
      const themeToggle = screen.getByRole('button', { name: /switch to dark mode/i });
      
      themeToggle.focus();
      expect(document.activeElement).toBe(themeToggle);
    });
  });

  describe('Custom Props', () => {
    it('applies custom className', () => {
      renderHeader({ className: 'custom-header' });
      const header = document.querySelector('.header');
      
      expect(header).toHaveClass('custom-header');
    });
  });
});