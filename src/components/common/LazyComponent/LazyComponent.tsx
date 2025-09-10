import React, { useState, useRef, useEffect, ReactNode } from 'react';
import './LazyComponent.css';

interface LazyComponentProps {
  children: ReactNode;
  fallback?: ReactNode;
  threshold?: number;
  rootMargin?: string;
  className?: string;
}

const LazyComponent: React.FC<LazyComponentProps> = ({
  children,
  fallback = <div className="lazy-component-loading">Loading...</div>,
  threshold = 0.1,
  rootMargin = '100px',
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return (
    <div ref={containerRef} className={`lazy-component ${className}`}>
      {isVisible ? children : fallback}
    </div>
  );
};

export default LazyComponent;