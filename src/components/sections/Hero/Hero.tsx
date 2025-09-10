import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { personalInfo } from '../../../data/resume';
import HeroImage from './HeroImage';
import './Hero.css';

interface HeroProps {
  className?: string;
}

const Hero: React.FC<HeroProps> = ({ className = '' }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  const animatedTexts = useMemo(() => [
    'Full Stack Developer',
    'React Specialist',
    'Problem Solver',
    'Tech Enthusiast'
  ], []);

  useEffect(() => {
    // Trigger loading animation after component mounts
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Cycle through animated texts
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % animatedTexts.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [animatedTexts.length]);

  const handleScrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, []);

  const handleResumeDownload = useCallback(() => {
    // This would typically download a PDF resume
    // For now, we'll just scroll to the resume section
    handleScrollToSection('resume');
  }, [handleScrollToSection]);

  return (
    <section 
      id="hero" 
      className={`hero ${className} ${isLoaded ? 'hero--loaded' : ''}`}
      aria-labelledby="hero-heading"
    >
      <div className="hero__container">
        <div className="hero__content" data-testid="hero-content">
          <div className="hero__text">
            <h1 id="hero-heading" className="hero__name">
              <span className="hero__greeting">Hello, I'm</span>
              <span className="hero__name-text">{personalInfo.name}</span>
            </h1>
            
            <div className="hero__title-container">
              <span className="hero__title-prefix">I'm a </span>
              <span 
                className="hero__title-animated"
                key={currentTextIndex}
                aria-live="polite"
                aria-label={`Current role: ${animatedTexts[currentTextIndex]}`}
              >
                {animatedTexts[currentTextIndex]}
              </span>
            </div>

            <p className="hero__description">
              Passionate about creating exceptional digital experiences through 
              clean code, innovative solutions, and user-centered design. 
              I specialize in modern web technologies and love turning ideas into reality.
            </p>

            <div className="hero__actions">
              <button
                className="hero__cta hero__cta--primary"
                onClick={() => handleScrollToSection('projects')}
                aria-label="View my projects"
              >
                View My Work
              </button>
              <button
                className="hero__cta hero__cta--secondary"
                onClick={() => handleScrollToSection('contact')}
                aria-label="Get in touch"
              >
                Get In Touch
              </button>
              <button
                className="hero__cta hero__cta--outline"
                onClick={handleResumeDownload}
                aria-label="Download resume"
              >
                Download Resume
              </button>
            </div>
          </div>

          <div className="hero__image-container">
            <div className="hero__image-wrapper">
              <HeroImage
                src="/images/profile-photo.jpg"
                alt={`${personalInfo.name} - Professional headshot`}
                fallbackName={personalInfo.name}
                className="hero__image-optimized"
              />
              <div className="hero__image-decoration" aria-hidden="true"></div>
            </div>
          </div>
        </div>

        <div className="hero__scroll-indicator">
          <button
            className="hero__scroll-button"
            onClick={() => handleScrollToSection('about')}
            aria-label="Scroll to next section"
          >
            <span className="hero__scroll-text">Scroll Down</span>
            <div className="hero__scroll-arrow">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path 
                  d="M7 10L12 15L17 10" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;