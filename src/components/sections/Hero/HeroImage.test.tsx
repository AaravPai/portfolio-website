import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import HeroImage from './HeroImage';

describe('HeroImage Component', () => {
  const defaultProps = {
    src: '/test-image.jpg',
    alt: 'Test image',
    fallbackName: 'John Doe',
  };

  it('renders image with correct attributes', () => {
    render(<HeroImage {...defaultProps} />);

    const image = screen.getByRole('img', { name: /test image/i });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/test-image.jpg');
    expect(image).toHaveAttribute('alt', 'Test image');
    expect(image).toHaveAttribute('loading', 'eager');
  });

  it('shows skeleton loader initially', () => {
    render(<HeroImage {...defaultProps} />);

    const skeleton = document.querySelector('.hero-image-skeleton');
    expect(skeleton).toBeInTheDocument();
  });

  it('hides skeleton after image loads', () => {
    render(<HeroImage {...defaultProps} />);

    const image = screen.getByRole('img', { name: /test image/i });
    const skeleton = document.querySelector('.hero-image-skeleton');

    expect(skeleton).toBeInTheDocument();

    // Simulate image load
    fireEvent.load(image);

    expect(image).toHaveStyle({ opacity: '1' });
  });

  it('switches to fallback image on error', () => {
    render(<HeroImage {...defaultProps} />);

    const image = screen.getByRole('img', { name: /test image/i });
    
    // Simulate image error
    fireEvent.error(image);

    expect(image).toHaveAttribute('src', expect.stringContaining('ui-avatars.com'));
    expect(image.getAttribute('src')).toContain('name=John%20Doe');
  });

  it('applies custom className', () => {
    render(<HeroImage {...defaultProps} className="custom-class" />);

    const container = document.querySelector('.hero-image-container');
    expect(container).toHaveClass('custom-class');
  });

  it('has proper initial opacity', () => {
    render(<HeroImage {...defaultProps} />);

    const image = screen.getByRole('img', { name: /test image/i });
    expect(image).toHaveStyle({ opacity: '0' });
  });
});