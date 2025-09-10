import React, { useState } from 'react';
import type { Experience } from '../../../types';
import './ExperienceCard.css';

interface ExperienceCardProps {
  experience: Experience;
  isLast?: boolean;
}

export const ExperienceCard: React.FC<ExperienceCardProps> = ({ experience, isLast = false }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (dateString: string) => {
    if (dateString === 'Present') return 'Present';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    });
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`experience-card ${isLast ? 'last' : ''}`}>
      <div className="experience-header" onClick={toggleExpanded}>
        <div className="experience-main-info">
          <h4 className="experience-position">{experience.position}</h4>
          <h5 className="experience-company">{experience.company}</h5>
          <div className="experience-dates">
            {formatDate(experience.startDate)} - {formatDate(experience.endDate)}
          </div>
        </div>
        <button 
          className={`expand-button ${isExpanded ? 'expanded' : ''}`}
          aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
        >
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 16 16" 
            fill="currentColor"
          >
            <path d="M8 4l-4 4h8l-4-4z"/>
          </svg>
        </button>
      </div>
      
      <div className={`experience-details ${isExpanded ? 'expanded' : ''}`}>
        <div className="experience-description">
          <ul>
            {experience.description.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
        
        {experience.technologies.length > 0 && (
          <div className="experience-technologies">
            <h6>Technologies Used:</h6>
            <div className="tech-tags">
              {experience.technologies.map((tech) => (
                <span key={tech} className="tech-tag">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};