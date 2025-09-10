import React, { useState } from 'react';
import type { Experience } from '../../../types';
import { ExperienceCard } from './ExperienceCard';
import './ExperienceTimeline.css';

interface ExperienceTimelineProps {
  experiences: Experience[];
}

export const ExperienceTimeline: React.FC<ExperienceTimelineProps> = ({ experiences }) => {
  return (
    <div className="experience-timeline">
      <div className="timeline-line" />
      {experiences.map((experience, index) => (
        <div key={`${experience.company}-${experience.startDate}`} className="timeline-item">
          <div className="timeline-marker" />
          <ExperienceCard 
            experience={experience} 
            isLast={index === experiences.length - 1}
          />
        </div>
      ))}
    </div>
  );
};