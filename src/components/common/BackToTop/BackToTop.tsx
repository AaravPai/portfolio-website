import React from 'react';
import { scrollToTop } from '../../../hooks/useScrollNavigation';
import './BackToTop.css';

interface BackToTopProps {
  show: boolean;
  className?: string;
}

const BackToTop: React.FC<BackToTopProps> = ({ show, className = '' }) => {
  const handleClick = () => {
    scrollToTop();
  };

  return (
    <button
      className={`back-to-top ${show ? 'back-to-top--visible' : ''} ${className}`}
      onClick={handleClick}
      aria-label="Back to top"
      type="button"
    >
      <svg
        className="back-to-top__icon"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 19V5M5 12L12 5L19 12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
};

export default BackToTop;