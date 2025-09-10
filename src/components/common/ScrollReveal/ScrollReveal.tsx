import React, { ReactNode } from 'react';
import { useScrollAnimation, animationVariants } from '../../../hooks/useScrollAnimation';
import './ScrollReveal.css';

interface ScrollRevealProps {
  children: ReactNode;
  animation?: keyof typeof animationVariants;
  delay?: number;
  duration?: number;
  className?: string;
  threshold?: number;
  triggerOnce?: boolean;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  animation = 'slideUp',
  delay = 0,
  duration = 0.6,
  className = '',
  threshold = 0.1,
  triggerOnce = true,
}) => {
  const { elementRef, isVisible } = useScrollAnimation({
    threshold,
    triggerOnce,
  });

  const variant = animationVariants[animation];
  const style = {
    ...(!isVisible ? variant.initial : variant.animate),
    transition: `all ${duration}s ease ${delay}s`,
  };

  return (
    <div
      ref={elementRef}
      className={`scroll-reveal ${isVisible ? 'scroll-reveal--visible' : ''} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;