import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Education } from './Education';

const mockEducation = [
  {
    degree: 'Bachelor of Science in Computer Science',
    school: 'University of Technology',
    year: '2020',
    details: 'Graduated Magna Cum Laude, relevant coursework in web development.',
  },
  {
    degree: 'Master of Science in Software Engineering',
    school: 'Tech Institute',
    year: '2022',
    details: 'Specialized in full-stack development and system architecture.',
  },
];

describe('Education', () => {
  it('renders education items correctly', () => {
    render(<Education education={mockEducation} />);
    
    expect(screen.getByText('Bachelor of Science in Computer Science')).toBeInTheDocument();
    expect(screen.getByText('University of Technology')).toBeInTheDocument();
    expect(screen.getByText('2020')).toBeInTheDocument();
    expect(screen.getByText('Graduated Magna Cum Laude, relevant coursework in web development.')).toBeInTheDocument();
    
    expect(screen.getByText('Master of Science in Software Engineering')).toBeInTheDocument();
    expect(screen.getByText('Tech Institute')).toBeInTheDocument();
    expect(screen.getByText('2022')).toBeInTheDocument();
  });

  it('renders empty when no education provided', () => {
    render(<Education education={[]} />);
    
    const educationSection = document.querySelector('.education-section');
    expect(educationSection).toBeInTheDocument();
    expect(educationSection?.children).toHaveLength(0);
  });

  it('renders multiple education items', () => {
    render(<Education education={mockEducation} />);
    
    const educationItems = document.querySelectorAll('.education-item');
    expect(educationItems).toHaveLength(2);
  });

  it('displays education details with proper structure', () => {
    render(<Education education={mockEducation} />);
    
    const firstItem = document.querySelector('.education-item');
    expect(firstItem?.querySelector('.education-degree')).toBeInTheDocument();
    expect(firstItem?.querySelector('.education-school')).toBeInTheDocument();
    expect(firstItem?.querySelector('.education-year')).toBeInTheDocument();
    expect(firstItem?.querySelector('.education-details')).toBeInTheDocument();
  });
});