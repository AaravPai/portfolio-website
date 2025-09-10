import {
  projects,
  skills,
  experiences,
  education,
  personalInfo,
  validateDataIntegrity,
  getProjectsByCategory,
  getSkillsByCategory,
  sortSkillsByProficiency,
  getExperienceByDateRange,
} from './index';

describe('Data Integration Tests', () => {
  test('all data passes integrity validation', () => {
    const errors = validateDataIntegrity(projects, skills, experiences);
    
    if (errors.length > 0) {
      console.error('Data integrity errors:', errors);
    }
    
    expect(errors).toHaveLength(0);
  });

  test('data helper functions work with real data', () => {
    // Test project filtering
    const featuredProjects = getProjectsByCategory(projects, true);
    const allProjects = getProjectsByCategory(projects);
    
    expect(featuredProjects.length).toBeLessThanOrEqual(allProjects.length);
    expect(allProjects.length).toBe(projects.length);

    // Test skill filtering and sorting
    const frontendSkills = getSkillsByCategory(skills, 'frontend');
    const sortedSkills = sortSkillsByProficiency(skills);
    
    expect(frontendSkills.every(skill => skill.category === 'frontend')).toBe(true);
    expect(sortedSkills[0].proficiency).toBeGreaterThanOrEqual(sortedSkills[sortedSkills.length - 1].proficiency);

    // Test experience sorting
    const sortedExperiences = getExperienceByDateRange(experiences);
    expect(sortedExperiences.length).toBe(experiences.length);
    
    // Most recent experience should be first
    if (sortedExperiences.length > 1) {
      const first = sortedExperiences[0];
      const second = sortedExperiences[1];
      
      if (first.endDate === 'Present') {
        expect(true).toBe(true); // Present is always most recent
      } else if (second.endDate !== 'Present') {
        const firstEnd = new Date(first.endDate);
        const secondEnd = new Date(second.endDate);
        expect(firstEnd.getTime()).toBeGreaterThanOrEqual(secondEnd.getTime());
      }
    }
  });

  test('data consistency across modules', () => {
    // Check that we have data in all required areas
    expect(projects.length).toBeGreaterThan(0);
    expect(skills.length).toBeGreaterThan(0);
    expect(experiences.length).toBeGreaterThan(0);
    expect(education.length).toBeGreaterThan(0);

    // Check that personal info is complete
    expect(personalInfo.name).toBeTruthy();
    expect(personalInfo.title).toBeTruthy();
    expect(personalInfo.email).toBeTruthy();

    // Check that we have skills in multiple categories
    const categories = [...new Set(skills.map(skill => skill.category))];
    expect(categories.length).toBeGreaterThan(1);
    expect(categories).toContain('frontend');

    // Check that we have at least one featured project
    const featuredCount = projects.filter(project => project.featured).length;
    expect(featuredCount).toBeGreaterThan(0);

    // Check that experiences have meaningful data
    experiences.forEach(experience => {
      expect(experience.description.length).toBeGreaterThan(0);
      expect(experience.technologies.length).toBeGreaterThan(0);
      expect(experience.company.trim().length).toBeGreaterThan(0);
      expect(experience.position.trim().length).toBeGreaterThan(0);
    });
  });

  test('data is suitable for portfolio display', () => {
    // Check that projects have display-ready content
    projects.forEach(project => {
      expect(project.title.trim().length).toBeGreaterThan(0);
      expect(project.description.trim().length).toBeGreaterThan(10);
      expect(project.longDescription.trim().length).toBeGreaterThan(project.description.length);
      expect(project.technologies.length).toBeGreaterThan(0);
      expect(project.imageUrl).toBeTruthy();
    });

    // Check that skills have meaningful proficiency levels
    skills.forEach(skill => {
      expect(skill.name.trim().length).toBeGreaterThan(0);
      expect(skill.proficiency).toBeGreaterThanOrEqual(1);
      expect(skill.proficiency).toBeLessThanOrEqual(5);
    });

    // Check that experiences tell a story
    experiences.forEach(experience => {
      expect(experience.description.some(desc => desc.length > 20)).toBe(true);
      expect(experience.technologies.length).toBeGreaterThan(0);
    });

    // Check that education entries are complete
    education.forEach(edu => {
      expect(edu.degree.trim().length).toBeGreaterThan(0);
      expect(edu.school.trim().length).toBeGreaterThan(0);
      expect(edu.year.trim().length).toBeGreaterThan(0);
    });
  });

  test('data supports required portfolio features', () => {
    // Requirements 2.1, 2.2: Projects section needs project data
    expect(projects.length).toBeGreaterThan(0);
    const featuredProjects = projects.filter(p => p.featured);
    expect(featuredProjects.length).toBeGreaterThan(0);

    // Requirement 3.1: Skills section needs categorized skills
    const skillCategories = [...new Set(skills.map(s => s.category))];
    expect(skillCategories.length).toBeGreaterThanOrEqual(2);

    // Requirement 4.1: Resume section needs experience data
    expect(experiences.length).toBeGreaterThan(0);
    expect(education.length).toBeGreaterThan(0);

    // Check that we have contact information
    expect(personalInfo.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  });

  test('performance considerations for data size', () => {
    // Ensure data sizes are reasonable for web performance
    expect(projects.length).toBeLessThan(50); // Reasonable number of projects
    expect(skills.length).toBeLessThan(100); // Reasonable number of skills
    expect(experiences.length).toBeLessThan(20); // Reasonable work history

    // Check that descriptions aren't excessively long
    projects.forEach(project => {
      expect(project.description.length).toBeLessThan(500);
      expect(project.longDescription.length).toBeLessThan(2000);
    });

    experiences.forEach(experience => {
      experience.description.forEach(desc => {
        expect(desc.length).toBeLessThan(500);
      });
    });
  });
});