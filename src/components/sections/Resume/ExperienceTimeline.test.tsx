import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ExperienceTimeline } from './ExperienceTimeline';
import type { Experience } from '../../../types';

const mockExperiences: Experience[] = [
  {
    company: 'Test Company',
    position: 'Senior Developer',
    startDate: '2022-01',
    endDate: 'Present',
    description: ['Led development of web applications', 'Mentored junior developers'],
    technologies: ['React', 'TypeScript'],
  },
  {
    company: 'Previous Company',
    position: 'Developer',
    startDate: '2020-06',
    endDate: '2021-12',
    description: ['Built full-stack applications'],
    technologies: ['Node.js', 'MongoDB'],
  },
];

describe('ExperienceTimeline', () => {
  it('renders timeline with experiences', () => {
    render(<ExperienceTimeline experiences={mockExperiences} />);
    
    expect(screen.getByText('Test Company')).toBeInTheDocument();
    expect(screen.getByText('Senior Developer')).toBeInTheDocument();
    expect(screen.getByText('Previous Company')).toBeInTheDocument();
    expect(screen.getByText('Developer')).toBeInTheDocument();
  });

  it('renders timeline line and markers', () => {
    render(<ExperienceTimeline experiences={mockExperiences} />);
    
    const timeline = document.querySelector('.experience-timeline');
    const timelineLine = document.querySelector('.timeline-line');
    const markers = document.querySelectorAll('.timeline-marker');
    
    expect(timeline).toBeInTheDocument();
    expect(timelineLine).toBeInTheDocument();
    expect(markers).toHaveLength(2);
  });

  it('renders empty timeline when no experiences provided', () => {
    render(<ExperienceTimeline experiences={[]} />);
    
    const timeline = document.querySelector('.experience-timeline');
    const markers = document.querySelectorAll('.timeline-marker');
    
    expect(timeline).toBeInTheDocument();
    expect(markers).toHaveLength(0);
  });

  it('marks last experience card correctly', () => {
    render(<ExperienceTimeline experiences={mockExperiences} />);
    
    const experienceCards = document.querySelectorAll('.experience-card');
    const lastCard = experienceCards[experienceCards.length - 1];
    
    expect(lastCard).toHaveClass('last');
  });
});