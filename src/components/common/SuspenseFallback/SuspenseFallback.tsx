import React from 'react';
import './SuspenseFallback.css';

interface SuspenseFallbackProps {
  height?: string;
  message?: string;
}

const SuspenseFallback: React.FC<SuspenseFallbackProps> = ({
  height = '200px',
  message = 'Loading...'
}) => {
  return (
    <div className="suspense-fallback" style={{ minHeight: height }}>
      <div className="suspense-fallback-content">
        <div className="suspense-fallback-spinner"></div>
        <span className="suspense-fallback-message">{message}</span>
      </div>
    </div>
  );
};

export default SuspenseFallback;