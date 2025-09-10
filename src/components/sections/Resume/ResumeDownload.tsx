import React, { useState } from 'react';
import './ResumeDownload.css';

export const ResumeDownload: React.FC = () => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    
    try {
      // Simulate download delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a link element and trigger download
      const link = document.createElement('a');
      link.href = '/resume.pdf'; // This should point to your actual resume PDF
      link.download = 'resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
      // You could show an error message here
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="resume-download">
      <h4 className="download-title">Download Resume</h4>
      <p className="download-description">
        Get a PDF copy of my complete resume with detailed work experience and skills.
      </p>
      
      <button 
        className={`download-button ${isDownloading ? 'downloading' : ''}`}
        onClick={handleDownload}
        disabled={isDownloading}
        aria-label="Download resume PDF"
      >
        <div className="button-content">
          {isDownloading ? (
            <>
              <div className="loading-spinner" />
              <span>Downloading...</span>
            </>
          ) : (
            <>
              <svg 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="currentColor"
                className="download-icon"
              >
                <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                <path d="M12,11L16,15H13V19H11V15H8L12,11Z" />
              </svg>
              <span>Download PDF</span>
            </>
          )}
        </div>
      </button>
      
      <div className="download-info">
        <small>PDF • Updated {new Date().toLocaleDateString()}</small>
      </div>
    </div>
  );
};