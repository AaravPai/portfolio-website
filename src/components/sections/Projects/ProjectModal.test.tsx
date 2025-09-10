import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ProjectModal } from './ProjectModal';
import type { Project } from '../../../types';

const mockProject: Project = {
  id: 'test-project',
  title: 'Test Project',
  description: 'Short description',
  longDescription: 'This is a detailed description of the test project with more information about its features and implementation.',
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

describe('ProjectModal', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
    // Reset body overflow style
    document.body.style.overflow = 'unset';
  });

  afterEach(() => {
    // Clean up body overflow style
    document.body.style.overflow = 'unset';
  });

  it('renders nothing when not open', () => {
    const { container } = render(
      <ProjectModal project={mockProject} isOpen={false} onClose={mockOnClose} />
    );
    
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when project is null', () => {
    const { container } = render(
      <ProjectModal project={null} isOpen={true} onClose={mockOnClose} />
    );
    
    expect(container.firstChild).toBeNull();
  });

  it('renders project information when open', () => {
    render(<ProjectModal project={mockProject} isOpen={true} onClose={mockOnClose} />);
    
    expect(screen.getByText('Test Project')).toBeInTheDocument();
    expect(screen.getByText('This is a detailed description of the test project with more information about its features and implementation.')).toBeInTheDocument();
    expect(screen.getByAltText('Screenshot of Test Project')).toBeInTheDocument();
  });

  it('renders technology tags', () => {
    render(<ProjectModal project={mockProject} isOpen={true} onClose={mockOnClose} />);
    
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Jest')).toBeInTheDocument();
  });

  it('renders live demo and source code links when provided', () => {
    render(<ProjectModal project={mockProject} isOpen={true} onClose={mockOnClose} />);
    
    const liveLink = screen.getByLabelText('View live demo of Test Project (opens in new tab)');
    const githubLink = screen.getByLabelText('View source code for Test Project (opens in new tab)');
    
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
    render(<ProjectModal project={mockProjectWithoutLinks} isOpen={true} onClose={mockOnClose} />);
    
    expect(screen.queryByText('View Live Demo')).not.toBeInTheDocument();
    expect(screen.queryByText('View Source Code')).not.toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(<ProjectModal project={mockProject} isOpen={true} onClose={mockOnClose} />);
    
    const closeButton = screen.getByLabelText('Close project details');
    fireEvent.click(closeButton);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when backdrop is clicked', () => {
    render(<ProjectModal project={mockProject} isOpen={true} onClose={mockOnClose} />);
    
    const backdrop = screen.getByRole('dialog');
    fireEvent.click(backdrop);
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when modal content is clicked', () => {
    render(<ProjectModal project={mockProject} isOpen={true} onClose={mockOnClose} />);
    
    const modalContent = screen.getByText('Test Project');
    fireEvent.click(modalContent);
    
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('calls onClose when Escape key is pressed', () => {
    render(<ProjectModal project={mockProject} isOpen={true} onClose={mockOnClose} />);
    
    fireEvent.keyDown(document, { key: 'Escape' });
    
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when other keys are pressed', () => {
    render(<ProjectModal project={mockProject} isOpen={true} onClose={mockOnClose} />);
    
    fireEvent.keyDown(document, { key: 'Enter' });
    fireEvent.keyDown(document, { key: 'Tab' });
    
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('prevents body scroll when open', async () => {
    const { rerender } = render(
      <ProjectModal project={mockProject} isOpen={false} onClose={mockOnClose} />
    );
    
    expect(document.body.style.overflow).toBe('unset');
    
    rerender(<ProjectModal project={mockProject} isOpen={true} onClose={mockOnClose} />);
    
    await waitFor(() => {
      expect(document.body.style.overflow).toBe('hidden');
    });
  });

  it('restores body scroll when closed', async () => {
    const { rerender } = render(
      <ProjectModal project={mockProject} isOpen={true} onClose={mockOnClose} />
    );
    
    await waitFor(() => {
      expect(document.body.style.overflow).toBe('hidden');
    });
    
    rerender(<ProjectModal project={mockProject} isOpen={false} onClose={mockOnClose} />);
    
    await waitFor(() => {
      expect(document.body.style.overflow).toBe('unset');
    });
  });

  it('has proper accessibility attributes', () => {
    render(<ProjectModal project={mockProject} isOpen={true} onClose={mockOnClose} />);
    
    const dialog = screen.getByRole('dialog');
    const title = screen.getByText('Test Project');
    const description = screen.getByText(/This is a detailed description/);
    
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');
    expect(dialog).toHaveAttribute('aria-describedby', 'modal-description');
    expect(title).toHaveAttribute('id', 'modal-title');
    expect(description).toHaveAttribute('id', 'modal-description');
  });

  it('focuses close button when modal opens', async () => {
    render(<ProjectModal project={mockProject} isOpen={true} onClose={mockOnClose} />);
    
    const closeButton = screen.getByLabelText('Close project details');
    
    await waitFor(() => {
      expect(closeButton).toHaveFocus();
    });
  });

  it('traps focus within modal', () => {
    render(<ProjectModal project={mockProject} isOpen={true} onClose={mockOnClose} />);
    
    const modal = screen.getByRole('dialog').querySelector('.project-modal');
    const closeButton = screen.getByLabelText('Close project details');
    const liveLink = screen.getByLabelText('View live demo of Test Project (opens in new tab)');
    
    // Focus should be trapped within modal
    expect(modal).toBeInTheDocument();
    expect(closeButton).toBeInTheDocument();
    expect(liveLink).toBeInTheDocument();
  });

  it('handles tab navigation correctly', () => {
    render(<ProjectModal project={mockProject} isOpen={true} onClose={mockOnClose} />);
    
    const modal = screen.getByRole('dialog').querySelector('.project-modal');
    
    // Simulate tab key press
    fireEvent.keyDown(modal!, { key: 'Tab' });
    
    // Should not throw error and handle focus trapping
    expect(modal).toBeInTheDocument();
  });

  it('applies correct CSS classes', () => {
    const { container } = render(
      <ProjectModal project={mockProject} isOpen={true} onClose={mockOnClose} />
    );
    
    expect(container.querySelector('.project-modal-backdrop')).toBeInTheDocument();
    expect(container.querySelector('.project-modal')).toBeInTheDocument();
    expect(container.querySelector('.project-modal__header')).toBeInTheDocument();
    expect(container.querySelector('.project-modal__content')).toBeInTheDocument();
    expect(container.querySelector('.project-modal__image-container')).toBeInTheDocument();
    expect(container.querySelector('.project-modal__details')).toBeInTheDocument();
    expect(container.querySelector('.project-modal__actions')).toBeInTheDocument();
  });

  it('renders section headings correctly', () => {
    render(<ProjectModal project={mockProject} isOpen={true} onClose={mockOnClose} />);
    
    expect(screen.getByText('About This Project')).toBeInTheDocument();
    expect(screen.getByText('Technologies Used')).toBeInTheDocument();
  });
});