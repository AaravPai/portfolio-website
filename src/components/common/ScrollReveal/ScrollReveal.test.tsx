import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import ScrollReveal from './ScrollReveal';
import * as useScrollAnimation from '../../../hooks/useScrollAnimation';

// Mock the useScrollAnimation hook
vi.mock('../../../hooks/useScrollAnimation', () => ({
  useScrollAnimation: vi.fn(),
  animationVariants: {
    slideUp: {
      initial: { opacity: 0, transform: 'translateY(30px)' },
      animate: { opacity: 1, transform: 'translateY(0)' },
    },
    fadeIn: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
    },
  },
}));

describe('ScrollReveal', () => {
  const mockUseScrollAnimation = useScrollAnimation.useScrollAnimation as vi.MockedFunction<
    typeof useScrollAnimation.useScrollAnimation
  >;

  const mockElementRef = { current: null };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseScrollAnimation.mockReturnValue({
      elementRef: mockElementRef,
      isVisible: false,
    });
  });

  it('should render children correctly', () => {
    render(
      <ScrollReveal>
        <div>Test content</div>
      </ScrollReveal>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('should apply default animation styles when not visible', () => {
    mockUseScrollAnimation.mockReturnValue({
      elementRef: mockElementRef,
      isVisible: false,
    });

    render(
      <ScrollReveal>
        <div>Test content</div>
      </ScrollReveal>
    );

    const container = screen.getByText('Test content').parentElement;
    expect(container).toHaveStyle({
      opacity: '0',
      transform: 'translateY(30px)',
      transition: 'all 0.6s ease 0s',
    });
  });

  it('should apply animate styles when visible', () => {
    mockUseScrollAnimation.mockReturnValue({
      elementRef: mockElementRef,
      isVisible: true,
    });

    render(
      <ScrollReveal>
        <div>Test content</div>
      </ScrollReveal>
    );

    const container = screen.getByText('Test content').parentElement;
    expect(container).toHaveStyle({
      opacity: '1',
      transform: 'translateY(0)',
      transition: 'all 0.6s ease 0s',
    });
    expect(container).toHaveClass('scroll-reveal--visible');
  });

  it('should apply custom animation variant', () => {
    mockUseScrollAnimation.mockReturnValue({
      elementRef: mockElementRef,
      isVisible: false,
    });

    render(
      <ScrollReveal animation="fadeIn">
        <div>Test content</div>
      </ScrollReveal>
    );

    const container = screen.getByText('Test content').parentElement;
    expect(container).toHaveStyle({
      opacity: '0',
      transition: 'all 0.6s ease 0s',
    });
  });

  it('should apply custom delay and duration', () => {
    mockUseScrollAnimation.mockReturnValue({
      elementRef: mockElementRef,
      isVisible: false,
    });

    render(
      <ScrollReveal delay={0.5} duration={1.2}>
        <div>Test content</div>
      </ScrollReveal>
    );

    const container = screen.getByText('Test content').parentElement;
    expect(container).toHaveStyle({
      transition: 'all 1.2s ease 0.5s',
    });
  });

  it('should apply custom className', () => {
    const customClass = 'custom-reveal';
    render(
      <ScrollReveal className={customClass}>
        <div>Test content</div>
      </ScrollReveal>
    );

    const container = screen.getByText('Test content').parentElement;
    expect(container).toHaveClass(customClass);
  });

  it('should pass correct options to useScrollAnimation hook', () => {
    render(
      <ScrollReveal threshold={0.5} triggerOnce={false}>
        <div>Test content</div>
      </ScrollReveal>
    );

    expect(mockUseScrollAnimation).toHaveBeenCalledWith({
      threshold: 0.5,
      triggerOnce: false,
    });
  });

  it('should use default options when not provided', () => {
    render(
      <ScrollReveal>
        <div>Test content</div>
      </ScrollReveal>
    );

    expect(mockUseScrollAnimation).toHaveBeenCalledWith({
      threshold: 0.1,
      triggerOnce: true,
    });
  });
});