import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ProjectCard } from './ProjectCard';
import type { Project } from '../../../types';

const mockProject: Project = {
  id: 'test-project',
  title: 'Test Project',
  description: 'This is a test project description',
  longDescription: 'This is a longer description for testing',
  technologies: ['React', 'TypeScript', 'Jest'],
  imageUrl: '/test-image.jpg',
  liveUrl: 'https://test-live.com',
  githubUrl: 'https://github.com/test/project',
  featured: true,
};

const mockProjectWithoutLinks: Project = {
  ...mockProject,
  id: 'test-project-no-links',
  liveUrl: undefined,
  githubUrl: undefined,
};

describe('ProjectCard', () => {
  it('renders project information correctly', () => {
    render(<ProjectCard project={mockProject} />);
    
    expect(screen.getByText('Test Project')).toBeInTheDocument();
    expect(screen.getByText('This is a test project description')).toBeInTheDocument();
    expect(screen.getByAltText('Screenshot of Test Project')).toBeInTheDocument();
  });

  it('renders technology tags', () => {
    render(<ProjectCard project={mockProject} />);
    
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Jest')).toBeInTheDocument();
  });

  it('renders live demo and source code links when provided', () => {
    render(<ProjectCard project={mockProject} />);
    
    const liveLink = screen.getByLabelText('View live demo of Test Project');
    const githubLink = screen.getByLabelText('View source code for Test Project');
    
    expect(liveLink).toBeInTheDocument();
    expect(liveLink).toHaveAttribute('href', 'https://test-live.com');
    expect(liveLink).toHaveAttribute('target', '_blank');
    expect(liveLink).toHaveAttribute('rel', 'noopener noreferrer');
    
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute('href', 'https://github.com/test/project');
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('does not render links when not provided', () => {
    render(<ProjectCard project={mockProjectWithoutLinks} />);
    
    expect(screen.queryByText('Live Demo')).not.toBeInTheDocument();
    expect(screen.queryByText('Source Code')).not.toBeInTheDocument();
  });

  it('calls onClick handler when card is clicked', () => {
    const mockOnClick = vi.fn();
    render(<ProjectCard project={mockProject} onClick={mockOnClick} />);
    
    const card = screen.getByRole('button', { name: 'View details for Test Project' });
    fireEvent.click(card);
    
    expect(mockOnClick).toHaveBeenCalledWith(mockProject);
  });

  it('calls onClick handler when Enter key is pressed', () => {
    const mockOnClick = vi.fn();
    render(<ProjectCard project={mockProject} onClick={mockOnClick} />);
    
    const card = screen.getByRole('button', { name: 'View details for Test Project' });
    fireEvent.keyDown(card, { key: 'Enter' });
    
    expect(mockOnClick).toHaveBeenCalledWith(mockProject);
  });

  it('calls onClick handler when Space key is pressed', () => {
    const mockOnClick = vi.fn();
    render(<ProjectCard project={mockProject} onClick={mockOnClick} />);
    
    const card = screen.getByRole('button', { name: 'View details for Test Project' });
    fireEvent.keyDown(card, { key: ' ' });
    
    expect(mockOnClick).toHaveBeenCalledWith(mockProject);
  });

  it('does not call onClick handler for other keys', () => {
    const mockOnClick = vi.fn();
    render(<ProjectCard project={mockProject} onClick={mockOnClick} />);
    
    const card = screen.getByRole('button', { name: 'View details for Test Project' });
    fireEvent.keyDown(card, { key: 'Tab' });
    
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it('does not call onClick when no handler is provided', () => {
    render(<ProjectCard project={mockProject} />);
    
    const card = screen.getByRole('button', { name: 'View details for Test Project' });
    
    // Should not throw error when clicked without onClick handler
    expect(() => fireEvent.click(card)).not.toThrow();
  });

  it('prevents event propagation when clicking on external links', () => {
    const mockOnClick = vi.fn();
    render(<ProjectCard project={mockProject} onClick={mockOnClick} />);
    
    const liveLink = screen.getByLabelText('View live demo of Test Project');
    const clickEvent = new MouseEvent('click', { bubbles: true });
    const stopPropagationSpy = vi.spyOn(clickEvent, 'stopPropagation');
    
    fireEvent(liveLink, clickEvent);
    
    expect(stopPropagationSpy).toHaveBeenCalled();
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it('has proper accessibility attributes', () => {
    render(<ProjectCard project={mockProject} />);
    
    const card = screen.getByRole('button', { name: 'View details for Test Project' });
    const image = screen.getByAltText('Screenshot of Test Project');
    
    expect(card).toHaveAttribute('tabIndex', '0');
    expect(card).toHaveAttribute('aria-label', 'View details for Test Project');
    expect(image).toHaveAttribute('loading', 'lazy');
  });

  it('renders as an article element', () => {
    const { container } = render(<ProjectCard project={mockProject} />);
    
    const article = container.querySelector('article');
    expect(article).toBeInTheDocument();
    expect(article).toHaveClass('project-card');
  });

  it('applies correct CSS classes', () => {
    const { container } = render(<ProjectCard project={mockProject} />);
    
    expect(container.querySelector('.project-card')).toBeInTheDocument();
    expect(container.querySelector('.project-card__image-container')).toBeInTheDocument();
    expect(container.querySelector('.project-card__image')).toBeInTheDocument();
    expect(container.querySelector('.project-card__content')).toBeInTheDocument();
    expect(container.querySelector('.project-card__title')).toBeInTheDocument();
    expect(container.querySelector('.project-card__description')).toBeInTheDocument();
    expect(container.querySelector('.project-card__technologies')).toBeInTheDocument();
    expect(container.querySelector('.project-card__links')).toBeInTheDocument();
  });
});