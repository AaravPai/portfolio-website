import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Projects } from './Projects';

// Mock the projects data
vi.mock('../../../data/projects', () => ({
  projects: [
    {
      id: 'project-1',
      title: 'E-commerce Platform',
      description: 'Full-stack e-commerce solution',
      longDescription: 'Detailed description of e-commerce platform',
      technologies: ['React', 'Node.js', 'MongoDB'],
      imageUrl: '/ecommerce.jpg',
      liveUrl: 'https://ecommerce.com',
      githubUrl: 'https://github.com/user/ecommerce',
      featured: true,
    },
    {
      id: 'project-2',
      title: 'Task Management App',
      description: 'Collaborative task management',
      longDescription: 'Detailed description of task management app',
      technologies: ['React', 'TypeScript', 'Firebase'],
      imageUrl: '/taskapp.jpg',
      liveUrl: 'https://taskapp.com',
      githubUrl: 'https://github.com/user/taskapp',
      featured: false,
    },
    {
      id: 'project-3',
      title: 'Analytics Dashboard',
      description: 'Data visualization dashboard',
      longDescription: 'Detailed description of analytics dashboard',
      technologies: ['Vue.js', 'D3.js', 'Python'],
      imageUrl: '/analytics.jpg',
      liveUrl: 'https://analytics.com',
      githubUrl: 'https://github.com/user/analytics',
      featured: true,
    },
  ],
}));

describe('Projects', () => {
  it('renders projects section with title and subtitle', () => {
    render(<Projects />);
    
    expect(screen.getByText('Featured Projects')).toBeInTheDocument();
    expect(screen.getByText('A showcase of my recent work and technical projects')).toBeInTheDocument();
  });

  it('renders all project cards initially', () => {
    render(<Projects />);
    
    expect(screen.getByText('E-commerce Platform')).toBeInTheDocument();
    expect(screen.getByText('Task Management App')).toBeInTheDocument();
    expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument();
  });

  it('displays correct project count', () => {
    render(<Projects />);
    
    expect(screen.getByText('Showing 3 of 3 projects')).toBeInTheDocument();
  });

  it('renders sort and filter controls', () => {
    render(<Projects />);
    
    expect(screen.getByLabelText('Sort projects by')).toBeInTheDocument();
    expect(screen.getByLabelText('Filter projects by technology')).toBeInTheDocument();
  });

  it('sorts projects by featured first (default)', () => {
    render(<Projects />);
    
    const projectTitles = screen.getAllByRole('gridcell').map(card => 
      card.querySelector('.project-card__title')?.textContent
    );
    
    // Featured projects should come first, then sorted by title
    // E-commerce Platform (featured) and Analytics Dashboard (featured) should come before Task Management App (not featured)
    expect(projectTitles[0]).toBe('Analytics Dashboard'); // featured: true, alphabetically first
    expect(projectTitles[1]).toBe('E-commerce Platform'); // featured: true, alphabetically second
    expect(projectTitles[2]).toBe('Task Management App'); // featured: false
  });

  it('sorts projects by title when selected', () => {
    render(<Projects />);
    
    const sortSelect = screen.getByLabelText('Sort projects by');
    fireEvent.change(sortSelect, { target: { value: 'title' } });
    
    const projectCards = screen.getAllByRole('gridcell');
    const firstCard = projectCards[0];
    
    // Should be sorted alphabetically
    expect(firstCard).toHaveTextContent('Analytics Dashboard');
  });

  it('sorts projects by newest when selected', () => {
    render(<Projects />);
    
    const sortSelect = screen.getByLabelText('Sort projects by');
    fireEvent.change(sortSelect, { target: { value: 'newest' } });
    
    // Should sort by ID in descending order
    const projectCards = screen.getAllByRole('gridcell');
    const firstCard = projectCards[0];
    
    expect(firstCard).toHaveTextContent('Analytics Dashboard'); // project-3
  });

  it('filters projects by technology', () => {
    render(<Projects />);
    
    const filterSelect = screen.getByLabelText('Filter projects by technology');
    fireEvent.change(filterSelect, { target: { value: 'TypeScript' } });
    
    // Only Task Management App uses TypeScript
    expect(screen.getByText('Task Management App')).toBeInTheDocument();
    expect(screen.queryByText('E-commerce Platform')).not.toBeInTheDocument();
    expect(screen.queryByText('Analytics Dashboard')).not.toBeInTheDocument();
    
    expect(screen.getByText('Showing 1 of 3 projects')).toBeInTheDocument();
  });

  it('shows all technologies in filter dropdown', () => {
    render(<Projects />);
    
    const filterSelect = screen.getByLabelText('Filter projects by technology');
    const options = filterSelect.querySelectorAll('option');
    
    // Should include all unique technologies plus "All Technologies"
    const optionTexts = Array.from(options).map(option => option.textContent);
    expect(optionTexts).toContain('All Technologies');
    expect(optionTexts).toContain('React');
    expect(optionTexts).toContain('TypeScript');
    expect(optionTexts).toContain('Vue.js');
    expect(optionTexts).toContain('D3.js');
  });

  it('shows empty state when no projects match filter', () => {
    render(<Projects />);
    
    const filterSelect = screen.getByLabelText('Filter projects by technology');
    fireEvent.change(filterSelect, { target: { value: 'Angular' } }); // Technology not in any project
    
    expect(screen.getByText('No projects found matching the selected criteria.')).toBeInTheDocument();
    expect(screen.getByText('Reset Filters')).toBeInTheDocument();
    expect(screen.getByText('Showing 0 of 3 projects')).toBeInTheDocument();
  });

  it('resets filters when reset button is clicked', () => {
    render(<Projects />);
    
    // Apply a filter that results in no matches to trigger empty state
    const filterSelect = screen.getByLabelText('Filter projects by technology');
    fireEvent.change(filterSelect, { target: { value: 'Angular' } }); // Technology not in any project
    
    expect(screen.getByText('Showing 0 of 3 projects')).toBeInTheDocument();
    expect(screen.getByText('No projects found matching the selected criteria.')).toBeInTheDocument();
    
    // Click reset button
    const resetButton = screen.getByText('Reset Filters');
    fireEvent.click(resetButton);
    
    // Should show all projects again
    expect(screen.getByText('Showing 3 of 3 projects')).toBeInTheDocument();
    expect(screen.getByText('E-commerce Platform')).toBeInTheDocument();
    expect(screen.getByText('Task Management App')).toBeInTheDocument();
    expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument();
  });

  it('opens modal when project card is clicked', async () => {
    render(<Projects />);
    
    const projectCard = screen.getByText('E-commerce Platform').closest('[role="button"]');
    fireEvent.click(projectCard!);
    
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Detailed description of e-commerce platform')).toBeInTheDocument();
    });
  });

  it('closes modal when close button is clicked', async () => {
    render(<Projects />);
    
    // Open modal
    const projectCard = screen.getByText('E-commerce Platform').closest('[role="button"]');
    fireEvent.click(projectCard!);
    
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
    
    // Close modal
    const closeButton = screen.getByLabelText('Close project details');
    fireEvent.click(closeButton);
    
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('has proper accessibility attributes', () => {
    render(<Projects />);
    
    const section = screen.getByRole('region', { name: /featured projects/i });
    const grid = screen.getByRole('grid', { name: 'Projects grid' });
    const gridCells = screen.getAllByRole('gridcell');
    
    expect(section).toHaveAttribute('id', 'projects');
    expect(section).toHaveAttribute('aria-labelledby', 'projects-title');
    expect(grid).toBeInTheDocument();
    expect(gridCells).toHaveLength(3);
  });

  it('maintains filter and sort state independently', () => {
    render(<Projects />);
    
    // Apply filter
    const filterSelect = screen.getByLabelText('Filter projects by technology');
    fireEvent.change(filterSelect, { target: { value: 'React' } });
    
    // Change sort
    const sortSelect = screen.getByLabelText('Sort projects by');
    fireEvent.change(sortSelect, { target: { value: 'title' } });
    
    // Should show filtered and sorted results
    expect(screen.getByText('Showing 2 of 3 projects')).toBeInTheDocument();
    
    // First project should be E-commerce Platform (alphabetically first among React projects)
    const projectCards = screen.getAllByRole('gridcell');
    expect(projectCards[0]).toHaveTextContent('E-commerce Platform');
  });

  it('handles keyboard navigation for controls', () => {
    render(<Projects />);
    
    const sortSelect = screen.getByLabelText('Sort projects by');
    const filterSelect = screen.getByLabelText('Filter projects by technology');
    
    // Should be focusable
    sortSelect.focus();
    expect(sortSelect).toHaveFocus();
    
    filterSelect.focus();
    expect(filterSelect).toHaveFocus();
  });

  it('applies correct CSS classes', () => {
    const { container } = render(<Projects />);
    
    expect(container.querySelector('.projects')).toBeInTheDocument();
    expect(container.querySelector('.projects__container')).toBeInTheDocument();
    expect(container.querySelector('.projects__header')).toBeInTheDocument();
    expect(container.querySelector('.projects__controls')).toBeInTheDocument();
    expect(container.querySelector('.projects__grid')).toBeInTheDocument();
  });
});