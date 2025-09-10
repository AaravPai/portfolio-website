import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Resume } from './Resume';

// Mock the child components
vi.mock('./ExperienceTimeline', () => ({
  ExperienceTimeline: ({ experiences }: { experiences: any[] }) => (
    <div data-testid="experience-timeline">
      Timeline with {experiences.length} experiences
    </div>
  ),
}));

vi.mock('./Education', () => ({
  Education: ({ education }: { education: any[] }) => (
    <div data-testid="education">
      Education with {education.length} items
    </div>
  ),
}));

vi.mock('./ResumeDownload', () => ({
  ResumeDownload: () => <div data-testid="resume-download">Download Component</div>,
}));

// Mock the data imports
vi.mock('../../../data/resume', () => ({
  experiences: [
    {
      company: 'Test Company',
      position: 'Developer',
      startDate: '2022-01',
      endDate: 'Present',
      description: ['Test description'],
      technologies: ['React'],
    },
  ],
  education: [
    {
      degree: 'Test Degree',
      school: 'Test School',
      year: '2020',
      details: 'Test details',
    },
  ],
  personalInfo: {
    name: 'Test Name',
    title: 'Test Title',
  },
}));

describe('Resume', () => {
  it('renders resume section with correct structure', () => {
    render(<Resume />);
    
    expect(screen.getByText('Resume')).toBeInTheDocument();
    expect(screen.getByText('Professional Experience')).toBeInTheDocument();
    expect(screen.getByText('Education')).toBeInTheDocument();
  });

  it('renders all child components', () => {
    render(<Resume />);
    
    expect(screen.getByTestId('experience-timeline')).toBeInTheDocument();
    expect(screen.getByTestId('education')).toBeInTheDocument();
    expect(screen.getByTestId('resume-download')).toBeInTheDocument();
  });

  it('has correct section id for navigation', () => {
    render(<Resume />);
    
    const section = document.querySelector('#resume');
    expect(section).toBeInTheDocument();
    expect(section).toHaveClass('resume-section');
  });

  it('passes experiences data to timeline component', () => {
    render(<Resume />);
    
    expect(screen.getByText('Timeline with 1 experiences')).toBeInTheDocument();
  });

  it('passes education data to education component', () => {
    render(<Resume />);
    
    expect(screen.getByText('Education with 1 items')).toBeInTheDocument();
  });

  it('has proper container structure', () => {
    render(<Resume />);
    
    const container = document.querySelector('.container');
    const resumeContent = document.querySelector('.resume-content');
    
    expect(container).toBeInTheDocument();
    expect(resumeContent).toBeInTheDocument();
  });
});