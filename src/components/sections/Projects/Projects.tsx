import React, { useState, useMemo } from 'react';
import { ProjectCard } from './ProjectCard';
import { ProjectModal } from './ProjectModal';
import { projects } from '../../../data/projects';
import type { Project } from '../../../types';
import './Projects.css';

type SortOption = 'featured' | 'title' | 'newest';
type FilterOption = 'all' | string; // 'all' or specific technology

export const Projects: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');

  // Get unique technologies for filter options
  const availableTechnologies = useMemo(() => {
    const techSet = new Set<string>();
    projects.forEach(project => {
      project.technologies.forEach(tech => techSet.add(tech));
    });
    return Array.from(techSet).sort();
  }, []);

  // Filter and sort projects
  const filteredAndSortedProjects = useMemo(() => {
    let filtered = projects;

    // Apply technology filter
    if (filterBy !== 'all') {
      filtered = projects.filter(project => 
        project.technologies.includes(filterBy)
      );
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'featured':
          // Featured projects first, then by title
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return a.title.localeCompare(b.title);
        case 'title':
          return a.title.localeCompare(b.title);
        case 'newest':
          // For now, sort by ID (assuming newer projects have higher IDs)
          return b.id.localeCompare(a.id);
        default:
          return 0;
      }
    });

    return sorted;
  }, [filterBy, sortBy]);

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  const handleNextProject = () => {
    if (!selectedProject) return;
    
    const currentIndex = filteredAndSortedProjects.findIndex(p => p.id === selectedProject.id);
    const nextIndex = (currentIndex + 1) % filteredAndSortedProjects.length;
    setSelectedProject(filteredAndSortedProjects[nextIndex]);
  };

  const handlePreviousProject = () => {
    if (!selectedProject) return;
    
    const currentIndex = filteredAndSortedProjects.findIndex(p => p.id === selectedProject.id);
    const prevIndex = currentIndex === 0 ? filteredAndSortedProjects.length - 1 : currentIndex - 1;
    setSelectedProject(filteredAndSortedProjects[prevIndex]);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(event.target.value as SortOption);
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterBy(event.target.value as FilterOption);
  };

  return (
    <section className="projects" id="projects" aria-labelledby="projects-title">
      <div className="projects__container">
        <div className="projects__header">
          <h2 id="projects-title" className="projects__title">
            Featured Projects
          </h2>
          <p className="projects__subtitle">
            A showcase of my recent work and technical projects
          </p>
        </div>

        <div className="projects__controls">
          <div className="projects__control-group">
            <label htmlFor="sort-select" className="projects__control-label">
              Sort by:
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={handleSortChange}
              className="projects__control-select"
              aria-label="Sort projects by"
            >
              <option value="featured">Featured First</option>
              <option value="title">Title (A-Z)</option>
              <option value="newest">Newest First</option>
            </select>
          </div>

          <div className="projects__control-group">
            <label htmlFor="filter-select" className="projects__control-label">
              Filter by technology:
            </label>
            <select
              id="filter-select"
              value={filterBy}
              onChange={handleFilterChange}
              className="projects__control-select"
              aria-label="Filter projects by technology"
            >
              <option value="all">All Technologies</option>
              {availableTechnologies.map(tech => (
                <option key={tech} value={tech}>
                  {tech}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="projects__stats">
          <span className="projects__count">
            Showing {filteredAndSortedProjects.length} of {projects.length} projects
          </span>
        </div>

        {filteredAndSortedProjects.length > 0 ? (
          <div 
            className="projects__grid" 
            role="grid" 
            aria-label="Projects grid"
            data-testid="projects-grid"
          >
            {filteredAndSortedProjects.map((project) => (
              <div key={project.id} role="gridcell">
                <ProjectCard
                  project={project}
                  onClick={handleProjectClick}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="projects__empty">
            <p className="projects__empty-message">
              No projects found matching the selected criteria.
            </p>
            <button
              onClick={() => {
                setSortBy('featured');
                setFilterBy('all');
              }}
              className="projects__reset-button"
              type="button"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onNext={filteredAndSortedProjects.length > 1 ? handleNextProject : undefined}
        onPrevious={filteredAndSortedProjects.length > 1 ? handlePreviousProject : undefined}
      />
    </section>
  );
};

export default Projects;