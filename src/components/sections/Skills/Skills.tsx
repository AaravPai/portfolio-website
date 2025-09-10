import React from 'react';
import { skills } from '../../../data/skills';
import type { Skill } from '../../../types';
import './Skills.css';

interface SkillsByCategory {
  languages: Skill[];
  backend: Skill[];
  tools: Skill[];
  other: Skill[];
}

const Skills: React.FC = () => {
  // Group skills by category
  const skillsByCategory = skills.reduce<SkillsByCategory>((acc, skill) => {
    acc[skill.category].push(skill);
    return acc;
  }, {
    languages: [],
    backend: [],
    tools: [],
    other: []
  });

  const categoryTitles = {
    languages: 'Programming Languages',
    backend: 'Backend Development', 
    tools: 'Tools & Technologies',
    other: 'Other Skills'
  };

  return (
    <section id="skills" className="skills-section" aria-labelledby="skills-title">
      <div className="skills-container">
        <h2 id="skills-title" className="skills-title">Skills & Technologies</h2>
        <p className="skills-subtitle">
          Here are the technologies and tools I work with
        </p>
        
        <div className="skills-grid">
          {(Object.keys(skillsByCategory) as Array<keyof SkillsByCategory>).map((category) => (
            <div key={category} className="skill-category" data-testid={`skill-category-${category}`}>
              <h3 className="category-title">{categoryTitles[category]}</h3>
              <div className="skills-list">
                {skillsByCategory[category].map((skill) => (
                  <div key={skill.name} className="skill-item">
                    <div className="skill-header">
                      <span className="skill-name">{skill.name}</span>
                      <span className="skill-level">{skill.proficiency}/5</span>
                    </div>
                    <div className="skill-bar">
                      <div 
                        className="skill-progress"
                        style={{ '--skill-width': `${(skill.proficiency / 5) * 100}%` } as React.CSSProperties}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;