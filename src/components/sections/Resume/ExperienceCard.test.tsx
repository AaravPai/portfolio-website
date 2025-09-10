import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ExperienceCard } from './ExperienceCard';
import type { Experience } from '../../../types';

const mockExperience: Experience = {
  company: 'Test Company Inc.',
  position: 'Senior Frontend Developer',
  startDate: '2022-01',
  endDate: 'Present',
  description: [
    'Led development of responsive web applications',
    'Mentored junior developers and conducted code reviews',
  ],
  technologies: ['React', 'TypeScript', 'Node.js'],
};

describe('ExperienceCard', () => {
  it('renders experience information correctly', () => {
    render(<ExperienceCard experience={mockExperience} />);
    
    expect(screen.getByText('Senior Frontend Developer')).toBeInTheDocument();
    expect(screen.getByText('Test Company Inc.')).toBeInTheDocument();
    expect(screen.getByText(/Dec 2021 - Present/)).toBeInTheDocument();
  });

  it('starts with collapsed details', () => {
    render(<ExperienceCard experience={mockExperience} />);
    
    const details = document.querySelector('.experience-details');
    expect(details).not.toHaveClass('expanded');
    
    // Details section should not have expanded class initially
    expect(details).toHaveStyle({ maxHeight: '0' });
  });

  it('expands and collapses details when clicked', () => {
    render(<ExperienceCard experience={mockExperience} />);
    
    const header = document.querySelector('.experience-header');
    const details = document.querySelector('.experience-details');
    const expandButton = document.querySelector('.expand-button');
    
    // Initially collapsed
    expect(details).not.toHaveClass('expanded');
    expect(expandButton).not.toHaveClass('expanded');
    
    // Click to expand
    fireEvent.click(header!);
    expect(details).toHaveClass('expanded');
    expect(expandButton).toHaveClass('expanded');
    
    // Click to collapse
    fireEvent.click(header!);
    expect(details).not.toHaveClass('expanded');
    expect(expandButton).not.toHaveClass('expanded');
  });

  it('displays description items when expanded', () => {
    render(<ExperienceCard experience={mockExperience} />);
    
    const header = document.querySelector('.experience-header');
    fireEvent.click(header!);
    
    expect(screen.getByText('Led development of responsive web applications')).toBeInTheDocument();
    expect(screen.getByText('Mentored junior developers and conducted code reviews')).toBeInTheDocument();
  });

  it('displays technology tags when expanded', () => {
    render(<ExperienceCard experience={mockExperience} />);
    
    const header = document.querySelector('.experience-header');
    fireEvent.click(header!);
    
    expect(screen.getByText('Technologies Used:')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Node.js')).toBeInTheDocument();
  });

  it('formats dates correctly', () => {
    const experienceWithEndDate: Experience = {
      ...mockExperience,
      startDate: '2020-06',
      endDate: '2021-12',
    };
    
    render(<ExperienceCard experience={experienceWithEndDate} />);
    
    expect(screen.getByText(/May 2020 - Nov 2021/)).toBeInTheDocument();
  });

  it('applies last class when isLast prop is true', () => {
    render(<ExperienceCard experience={mockExperience} isLast={true} />);
    
    const card = document.querySelector('.experience-card');
    expect(card).toHaveClass('last');
  });

  it('expand button has proper accessibility attributes', () => {
    render(<ExperienceCard experience={mockExperience} />);
    
    const expandButton = screen.getByLabelText('Expand details');
    expect(expandButton).toBeInTheDocument();
    
    // Click to expand
    fireEvent.click(expandButton);
    
    const collapseButton = screen.getByLabelText('Collapse details');
    expect(collapseButton).toBeInTheDocument();
  });

  it('handles experience with no technologies', () => {
    const experienceNoTech: Experience = {
      ...mockExperience,
      technologies: [],
    };
    
    render(<ExperienceCard experience={experienceNoTech} />);
    
    const header = document.querySelector('.experience-header');
    fireEvent.click(header!);
    
    expect(screen.queryByText('Technologies Used:')).not.toBeInTheDocument();
  });
});