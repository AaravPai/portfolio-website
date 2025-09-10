import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import BackToTop from './BackToTop';
import * as scrollNavigation from '../../../hooks/useScrollNavigation';

// Mock the scroll navigation hook
vi.mock('../../../hooks/useScrollNavigation', () => ({
  scrollToTop: vi.fn(),
}));

describe('BackToTop', () => {
  const mockScrollToTop = scrollNavigation.scrollToTop as vi.MockedFunction<typeof scrollNavigation.scrollToTop>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render with correct accessibility attributes', () => {
    render(<BackToTop show={true} />);
    
    const button = screen.getByRole('button', { name: /back to top/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('aria-label', 'Back to top');
  });

  it('should apply visible class when show is true', () => {
    render(<BackToTop show={true} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('back-to-top--visible');
  });

  it('should not apply visible class when show is false', () => {
    render(<BackToTop show={false} />);
    
    const button = screen.getByRole('button', { hidden: true });
    expect(button).not.toHaveClass('back-to-top--visible');
  });

  it('should apply custom className', () => {
    const customClass = 'custom-back-to-top';
    render(<BackToTop show={true} className={customClass} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass(customClass);
  });

  it('should call scrollToTop when clicked', () => {
    render(<BackToTop show={true} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(mockScrollToTop).toHaveBeenCalledTimes(1);
  });

  it('should render SVG icon', () => {
    render(<BackToTop show={true} />);
    
    const svg = screen.getByRole('button').querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('back-to-top__icon');
  });

  it('should handle keyboard interaction', () => {
    render(<BackToTop show={true} />);
    
    const button = screen.getByRole('button');
    fireEvent.keyDown(button, { key: 'Enter' });
    fireEvent.click(button);
    
    expect(mockScrollToTop).toHaveBeenCalledTimes(1);
  });
});