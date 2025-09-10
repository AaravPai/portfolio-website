import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Skills from './Skills';
import { skills } from '../../../data/skills';

// Mock the skills data for consistent testing
vi.mock('../../../data/skills', () => ({
  skills: [
    { name: 'React', category: 'frontend', proficiency: 5 },
    { name: 'TypeScript', category: 'frontend', proficiency: 4 },
    { name: 'Node.js', category: 'backend', proficiency: 4 },
    { name: 'MongoDB', category: 'backend', proficiency: 3 },
    { name: 'Git', category: 'tools', proficiency: 5 },
    { name: 'Docker', category: 'tools', proficiency: 3 },
    { name: 'Agile/Scrum', category: 'other', proficiency: 4 },
    { name: 'REST APIs', category: 'other', proficiency: 5 },
  ]
}));

describe('Skills Component', () => {
  it('renders the skills section with correct structure', () => {
    render(<Skills />);
    
    // Check main section by ID
    const skillsSection = document.getElementById('skills');
    expect(skillsSection).toBeInTheDocument();
    expect(skillsSection).toHaveClass('skills-section');
    
    // Check title and subtitle
    expect(screen.getByText('Skills & Technologies')).toBeInTheDocument();
    expect(screen.getByText('Here are the technologies and tools I work with')).toBeInTheDocument();
  });

  it('displays all skill categories with correct titles', () => {
    render(<Skills />);
    
    expect(screen.getByText('Frontend Development')).toBeInTheDocument();
    expect(screen.getByText('Backend Development')).toBeInTheDocument();
    expect(screen.getByText('Tools & Technologies')).toBeInTheDocument();
    expect(screen.getByText('Other Skills')).toBeInTheDocument();
  });

  it('renders all skills with names and proficiency levels', () => {
    render(<Skills />);
    
    // Check that all skills are rendered
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Node.js')).toBeInTheDocument();
    expect(screen.getByText('MongoDB')).toBeInTheDocument();
    expect(screen.getByText('Git')).toBeInTheDocument();
    expect(screen.getByText('Docker')).toBeInTheDocument();
    expect(screen.getByText('Agile/Scrum')).toBeInTheDocument();
    expect(screen.getByText('REST APIs')).toBeInTheDocument();
    
    // Check proficiency levels (using getAllByText for multiple occurrences)
    expect(screen.getAllByText('5/5')).toHaveLength(3); // React, Git, REST APIs
    expect(screen.getAllByText('4/5')).toHaveLength(3); // TypeScript, Node.js, Agile/Scrum
    expect(screen.getAllByText('3/5')).toHaveLength(2); // MongoDB, Docker
  });

  it('groups skills correctly by category', () => {
    render(<Skills />);
    
    // Get all category sections
    const frontendSection = screen.getByText('Frontend Development').closest('.skill-category');
    const backendSection = screen.getByText('Backend Development').closest('.skill-category');
    const toolsSection = screen.getByText('Tools & Technologies').closest('.skill-category');
    const otherSection = screen.getByText('Other Skills').closest('.skill-category');
    
    // Check frontend skills are in frontend section
    expect(frontendSection).toHaveTextContent('React');
    expect(frontendSection).toHaveTextContent('TypeScript');
    expect(frontendSection).not.toHaveTextContent('Node.js');
    
    // Check backend skills are in backend section
    expect(backendSection).toHaveTextContent('Node.js');
    expect(backendSection).toHaveTextContent('MongoDB');
    expect(backendSection).not.toHaveTextContent('React');
    
    // Check tools skills are in tools section
    expect(toolsSection).toHaveTextContent('Git');
    expect(toolsSection).toHaveTextContent('Docker');
    expect(toolsSection).not.toHaveTextContent('React');
    
    // Check other skills are in other section
    expect(otherSection).toHaveTextContent('Agile/Scrum');
    expect(otherSection).toHaveTextContent('REST APIs');
    expect(otherSection).not.toHaveTextContent('React');
  });

  it('renders skill progress bars with correct width styles', () => {
    render(<Skills />);
    
    const progressBars = document.querySelectorAll('.skill-progress');
    expect(progressBars).toHaveLength(8); // 8 skills in mock data
    
    // Check that progress bars have the correct CSS custom property
    const reactProgressBar = progressBars[0]; // React with proficiency 5
    const computedStyle = window.getComputedStyle(reactProgressBar);
    expect(reactProgressBar).toHaveStyle('--skill-width: 100%');
    
    // Find TypeScript progress bar (proficiency 4)
    const typescriptProgressBar = Array.from(progressBars).find((bar, index) => {
      const skillItem = bar.closest('.skill-item');
      return skillItem?.textContent?.includes('TypeScript');
    });
    expect(typescriptProgressBar).toHaveStyle('--skill-width: 80%');
  });

  it('has proper accessibility attributes', () => {
    render(<Skills />);
    
    // Check section has proper ID for navigation
    const skillsSection = document.getElementById('skills');
    expect(skillsSection).toBeInTheDocument();
    
    // Check heading hierarchy
    const mainHeading = screen.getByRole('heading', { level: 2 });
    expect(mainHeading).toHaveTextContent('Skills & Technologies');
    
    const categoryHeadings = screen.getAllByRole('heading', { level: 3 });
    expect(categoryHeadings).toHaveLength(4);
    expect(categoryHeadings[0]).toHaveTextContent('Frontend Development');
  });

  it('applies correct CSS classes for styling and animations', () => {
    render(<Skills />);
    
    // Check main container classes
    expect(document.querySelector('.skills-section')).toBeInTheDocument();
    expect(document.querySelector('.skills-container')).toBeInTheDocument();
    expect(document.querySelector('.skills-grid')).toBeInTheDocument();
    
    // Check skill category classes
    const categories = document.querySelectorAll('.skill-category');
    expect(categories).toHaveLength(4);
    
    // Check skill item classes
    const skillItems = document.querySelectorAll('.skill-item');
    expect(skillItems.length).toBeGreaterThan(0);
    
    // Check progress bar classes
    expect(document.querySelectorAll('.skill-bar')).toHaveLength(8);
    expect(document.querySelectorAll('.skill-progress')).toHaveLength(8);
  });

  it('handles empty categories gracefully', () => {
    // Mock skills with missing category
    vi.mocked(skills).splice(0, skills.length, 
      { name: 'React', category: 'frontend', proficiency: 5 }
    );
    
    render(<Skills />);
    
    // Should still render all category sections
    expect(screen.getByText('Frontend Development')).toBeInTheDocument();
    expect(screen.getByText('Backend Development')).toBeInTheDocument();
    expect(screen.getByText('Tools & Technologies')).toBeInTheDocument();
    expect(screen.getByText('Other Skills')).toBeInTheDocument();
    
    // Frontend should have the skill, others should be empty
    const frontendSection = screen.getByText('Frontend Development').closest('.skill-category');
    expect(frontendSection).toHaveTextContent('React');
    
    const backendSection = screen.getByText('Backend Development').closest('.skill-category');
    expect(backendSection?.querySelectorAll('.skill-item')).toHaveLength(0);
  });

  it('renders with responsive design classes', () => {
    render(<Skills />);
    
    // Check that responsive classes are applied
    const skillsGrid = document.querySelector('.skills-grid');
    expect(skillsGrid).toHaveClass('skills-grid');
    
    // Check that skill categories have responsive structure
    const categories = document.querySelectorAll('.skill-category');
    categories.forEach(category => {
      expect(category).toHaveClass('skill-category');
    });
  });
});