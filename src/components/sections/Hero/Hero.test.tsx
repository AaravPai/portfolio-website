import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import Hero from './Hero';

// Mock the resume data
vi.mock('../../../data/resume', () => ({
  personalInfo: {
    name: 'John Doe',
    title: 'Full Stack Developer',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    location: 'City, State',
    website: 'https://johndoe.com',
    linkedin: 'https://linkedin.com/in/johndoe',
    github: 'https://github.com/johndoe',
  },
}));

// Mock smooth scrolling
const mockScrollIntoView = vi.fn();
Object.defineProperty(Element.prototype, 'scrollIntoView', {
  value: mockScrollIntoView,
  writable: true,
});

describe('Hero Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock getElementById to return a mock element
    vi.spyOn(document, 'getElementById').mockImplementation((_id: string) => ({
      scrollIntoView: mockScrollIntoView,
    } as any));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders hero section with correct content', () => {
    render(<Hero />);

    // Check if main elements are present
    expect(screen.getByRole('region')).toBeInTheDocument();
    expect(screen.getByText('Hello, I\'m')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText(/I'm a/)).toBeInTheDocument();
  });

  it('displays animated title text', async () => {
    render(<Hero />);

    // Check if one of the animated texts is displayed
    await waitFor(() => {
      const animatedTexts = ['Full Stack Developer', 'React Specialist', 'Problem Solver', 'Tech Enthusiast'];
      const hasAnimatedText = animatedTexts.some(text => 
        screen.queryByText(text) !== null
      );
      expect(hasAnimatedText).toBe(true);
    });
  });

  it('renders call-to-action buttons', () => {
    render(<Hero />);

    expect(screen.getByRole('button', { name: /view my projects/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /get in touch/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /download resume/i })).toBeInTheDocument();
  });

  it('renders professional image with correct attributes', () => {
    render(<Hero />);

    const image = screen.getByRole('img', { name: /john doe - professional headshot/i });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/images/profile-photo.jpg');
    expect(image).toHaveAttribute('loading', 'eager');
  });

  it('shows loading skeleton before image loads', () => {
    render(<Hero />);

    const skeleton = document.querySelector('.hero-image-skeleton');
    expect(skeleton).toBeInTheDocument();
  });

  it('handles smooth scrolling when CTA buttons are clicked', () => {
    render(<Hero />);

    // Test "View My Work" button
    const viewWorkButton = screen.getByRole('button', { name: /view my projects/i });
    fireEvent.click(viewWorkButton);
    expect(document.getElementById).toHaveBeenCalledWith('projects');
    expect(mockScrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start'
    });

    // Test "Get In Touch" button
    const contactButton = screen.getByRole('button', { name: /get in touch/i });
    fireEvent.click(contactButton);
    expect(document.getElementById).toHaveBeenCalledWith('contact');

    // Test "Download Resume" button (should scroll to resume section)
    const resumeButton = screen.getByRole('button', { name: /download resume/i });
    fireEvent.click(resumeButton);
    expect(document.getElementById).toHaveBeenCalledWith('resume');
  });

  it('handles scroll indicator button click', () => {
    render(<Hero />);

    const scrollButton = screen.getByRole('button', { name: /scroll to next section/i });
    fireEvent.click(scrollButton);
    expect(document.getElementById).toHaveBeenCalledWith('about');
    expect(mockScrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start'
    });
  });

  it('applies loading class after component mounts', async () => {
    render(<Hero />);

    const heroSection = screen.getByRole('region');
    
    await waitFor(() => {
      expect(heroSection).toHaveClass('hero--loaded');
    }, { timeout: 200 });
  });

  it('handles image loading error with fallback', () => {
    render(<Hero />);

    const image = screen.getByRole('img', { name: /john doe - professional headshot/i });
    
    // Simulate image error
    fireEvent.error(image);
    
    expect(image).toHaveAttribute('src', expect.stringContaining('ui-avatars.com'));
    expect(image.getAttribute('src')).toContain('name=John%20Doe');
  });

  it('cycles through animated texts', async () => {
    vi.useFakeTimers();
    
    try {
      render(<Hero />);

      const animatedTexts = ['Full Stack Developer', 'React Specialist', 'Problem Solver', 'Tech Enthusiast'];
      
      // Check initial text
      expect(screen.getByText(animatedTexts[0])).toBeInTheDocument();

      // Fast-forward time to trigger text change
      act(() => {
        vi.advanceTimersByTime(3000);
      });
      
      // Check that the text has changed
      expect(screen.getByText(animatedTexts[1])).toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it('renders with custom className', () => {
    render(<Hero className="custom-hero" />);

    const heroSection = screen.getByRole('region');
    expect(heroSection).toHaveClass('custom-hero');
  });

  it('has proper accessibility attributes', () => {
    render(<Hero />);

    // Check ARIA labels
    expect(screen.getByRole('region')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /view my projects/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /get in touch/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /download resume/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /scroll to next section/i })).toBeInTheDocument();

    // Check image alt text
    expect(screen.getByRole('img', { name: /john doe - professional headshot/i })).toBeInTheDocument();
  });

  it('handles missing DOM elements gracefully', () => {
    // Mock getElementById to return null
    vi.spyOn(document, 'getElementById').mockReturnValue(null);

    render(<Hero />);

    const viewWorkButton = screen.getByRole('button', { name: /view my projects/i });
    
    // Should not throw error when element is not found
    expect(() => {
      fireEvent.click(viewWorkButton);
    }).not.toThrow();

    expect(mockScrollIntoView).not.toHaveBeenCalled();
  });

  it('renders description text correctly', () => {
    render(<Hero />);

    const description = screen.getByText(/passionate about creating exceptional digital experiences/i);
    expect(description).toBeInTheDocument();
    expect(description).toHaveClass('hero__description');
  });

  it('renders scroll indicator with proper structure', () => {
    render(<Hero />);

    expect(screen.getByText('Scroll Down')).toBeInTheDocument();
    
    // Check for SVG arrow
    const svg = screen.getByRole('button', { name: /scroll to next section/i }).querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('width', '24');
    expect(svg).toHaveAttribute('height', '24');
  });
});