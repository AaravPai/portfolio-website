import React, { useState } from 'react';
import { experiences, education, personalInfo } from '../../../data/resume';
import { ExperienceTimeline } from './ExperienceTimeline';
import { Education } from './Education';
import { ResumeDownload } from './ResumeDownload';
import './Resume.css';

export const Resume: React.FC = () => {
  return (
    <section id="resume" className="resume-section">
      <div className="container">
        <h2 className="section-title">Resume</h2>
        
        <div className="resume-content">
          <div className="resume-header">
            <h3>Professional Experience</h3>
          </div>
          
          <ExperienceTimeline experiences={experiences} />
          
          <div className="resume-education">
            <h3>Education</h3>
            <Education education={education} />
          </div>
          
          <div className="resume-download-section">
            <ResumeDownload />
          </div>
        </div>
      </div>
    </section>
  );
};