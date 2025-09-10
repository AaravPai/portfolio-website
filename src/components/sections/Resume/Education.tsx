import React from 'react';
import './Education.css';

interface EducationItem {
  degree: string;
  school: string;
  year: string;
  details: string;
}

interface EducationProps {
  education: EducationItem[];
}

export const Education: React.FC<EducationProps> = ({ education }) => {
  return (
    <div className="education-section">
      {education.map((item, index) => (
        <div key={index} className="education-item">
          <div className="education-header">
            <h4 className="education-degree">{item.degree}</h4>
            <span className="education-year">{item.year}</span>
          </div>
          <h5 className="education-school">{item.school}</h5>
          <p className="education-details">{item.details}</p>
        </div>
      ))}
    </div>
  );
};