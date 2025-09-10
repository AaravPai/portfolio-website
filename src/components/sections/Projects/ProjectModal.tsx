import React, { useEffect, useRef } from 'react';
import type { Project } from '../../../types';
import { useSwipeGesture } from '../../../hooks/useSwipeGesture';
import { useTouchOptimization } from '../../../hooks/useTouchOptimization';
import './ProjectModal.css';

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ 
  project, 
  isOpen, 
  onClose, 
  onNext, 
  onPrevious 
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const { isTouchDevice } = useTouchOptimization();

  // Swipe gesture support for navigation
  const swipeRef = useSwipeGesture({
    onSwipeLeft: onNext,
    onSwipeRight: onPrevious,
    onSwipeDown: onClose,
    threshold: 50,
    preventDefaultTouchmove: false,
  });

  useEffect(() => {
    if (isOpen) {
      // Focus the close button when modal opens
      closeButtonRef.current?.focus();
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Restore body scroll
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Tab') {
      // Trap focus within modal
      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements && focusableElements.length > 0) {
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
        
        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }
  };

  if (!isOpen || !project) {
    return null;
  }

  return (
    <div 
      className="project-modal-backdrop"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <div 
        className="project-modal"
        ref={(el) => {
          modalRef.current = el;
          swipeRef(el);
        }}
        onKeyDown={handleKeyDown}
      >
        <div className="project-modal__header">
          <h2 id="modal-title" className="project-modal__title">
            {project.title}
          </h2>
          <div className="project-modal__controls">
            {isTouchDevice() && (
              <div className="project-modal__touch-hint">
                Swipe to navigate • Swipe down to close
              </div>
            )}
            <button
              ref={closeButtonRef}
              className="project-modal__close"
              onClick={onClose}
              aria-label="Close project details"
              type="button"
            >
              ×
            </button>
          </div>
        </div>

        <div className="project-modal__content">
          <div className="project-modal__image-container">
            <img
              src={project.imageUrl}
              alt={`Screenshot of ${project.title}`}
              className="project-modal__image"
            />
          </div>

          <div className="project-modal__details">
            <div className="project-modal__description">
              <h3>About This Project</h3>
              <p id="modal-description">{project.longDescription}</p>
            </div>

            <div className="project-modal__technologies">
              <h3>Technologies Used</h3>
              <div className="project-modal__tech-list">
                {project.technologies.map((tech) => (
                  <span key={tech} className="project-modal__tech-tag">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="project-modal__actions">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-modal__link project-modal__link--live"
                  aria-label={`View live demo of ${project.title} (opens in new tab)`}
                >
                  <span className="project-modal__link-icon">🚀</span>
                  View Live Demo
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-modal__link project-modal__link--github"
                  aria-label={`View source code for ${project.title} (opens in new tab)`}
                >
                  <span className="project-modal__link-icon">📁</span>
                  View Source Code
                </a>
              )}
            </div>

            {/* Navigation controls for desktop */}
            {(onNext || onPrevious) && !isTouchDevice() && (
              <div className="project-modal__navigation">
                {onPrevious && (
                  <button
                    className="project-modal__nav-btn project-modal__nav-btn--prev"
                    onClick={onPrevious}
                    aria-label="Previous project"
                    type="button"
                  >
                    ← Previous
                  </button>
                )}
                {onNext && (
                  <button
                    className="project-modal__nav-btn project-modal__nav-btn--next"
                    onClick={onNext}
                    aria-label="Next project"
                    type="button"
                  >
                    Next →
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;