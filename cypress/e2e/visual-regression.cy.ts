describe('Visual Regression Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Theme Visual Consistency', () => {
    it('should maintain visual consistency in light theme', () => {
      // Ensure light theme is active
      cy.get('html').should('have.attr', 'data-theme', 'light');
      
      // Take screenshots of each section in light theme
      cy.get('#hero').scrollIntoView();
      cy.compareSnapshot('hero-light-theme');
      
      cy.get('#about').scrollIntoView();
      cy.compareSnapshot('about-light-theme');
      
      cy.get('#projects').scrollIntoView();
      cy.compareSnapshot('projects-light-theme');
      
      cy.get('#skills').scrollIntoView();
      cy.compareSnapshot('skills-light-theme');
      
      cy.get('#resume').scrollIntoView();
      cy.compareSnapshot('resume-light-theme');
      
      cy.get('#contact').scrollIntoView();
      cy.compareSnapshot('contact-light-theme');
    });

    it('should maintain visual consistency in dark theme', () => {
      // Switch to dark theme
      cy.switchTheme('dark');
      
      // Take screenshots of each section in dark theme
      cy.get('#hero').scrollIntoView();
      cy.compareSnapshot('hero-dark-theme');
      
      cy.get('#about').scrollIntoView();
      cy.compareSnapshot('about-dark-theme');
      
      cy.get('#projects').scrollIntoView();
      cy.compareSnapshot('projects-dark-theme');
      
      cy.get('#skills').scrollIntoView();
      cy.compareSnapshot('skills-dark-theme');
      
      cy.get('#resume').scrollIntoView();
      cy.compareSnapshot('resume-dark-theme');
      
      cy.get('#contact').scrollIntoView();
      cy.compareSnapshot('contact-dark-theme');
    });

    it('should have smooth theme transition animations', () => {
      // Record initial state
      cy.get('html').should('have.attr', 'data-theme', 'light');
      
      // Switch theme and verify transition
      cy.get('[aria-label*="Switch to"]').click();
      
      // Wait for transition to complete
      cy.wait(500);
      
      // Verify theme changed
      cy.get('html').should('have.attr', 'data-theme', 'dark');
      
      // Take screenshot after transition
      cy.compareSnapshot('theme-transition-complete');
    });
  });

  describe('Component State Visual Tests', () => {
    it('should show proper form validation states', () => {
      cy.get('#contact').scrollIntoView();
      
      // Submit empty form to trigger validation
      cy.get('button[type="submit"]').click();
      
      // Take screenshot of validation state
      cy.compareSnapshot('form-validation-errors');
    });

    it('should show proper modal states', () => {
      cy.get('#projects').scrollIntoView();
      
      // Open project modal
      cy.get('[data-testid="project-card"]').first().click();
      
      // Take screenshot of modal
      cy.compareSnapshot('project-modal-open');
      
      // Close modal
      cy.get('[aria-label="Close modal"]').click();
      
      // Take screenshot after modal closes
      cy.compareSnapshot('project-modal-closed');
    });

    it('should show proper loading states', () => {
      cy.get('#contact').scrollIntoView();
      
      // Fill form with valid data
      cy.fillContactForm({
        name: 'Test User',
        email: 'test@example.com',
        message: 'This is a test message for visual regression testing.'
      });
      
      // Submit form
      cy.get('button[type="submit"]').click();
      
      // Take screenshot of loading state
      cy.compareSnapshot('form-loading-state');
    });
  });

  describe('Responsive Visual Tests', () => {
    const viewports = [
      { name: 'mobile', width: 375, height: 667 },
      { name: 'tablet', width: 768, height: 1024 },
      { name: 'desktop', width: 1280, height: 720 }
    ];

    viewports.forEach(viewport => {
      it(`should maintain visual consistency on ${viewport.name}`, () => {
        cy.viewport(viewport.width, viewport.height);
        
        // Test both themes on each viewport
        ['light', 'dark'].forEach(theme => {
          if (theme === 'dark') {
            cy.switchTheme('dark');
          }
          
          // Take full page screenshot
          cy.compareSnapshot(`full-page-${viewport.name}-${theme}`);
          
          // Take section screenshots
          cy.get('#hero').scrollIntoView();
          cy.compareSnapshot(`hero-${viewport.name}-${theme}`);
          
          cy.get('#projects').scrollIntoView();
          cy.compareSnapshot(`projects-${viewport.name}-${theme}`);
          
          cy.get('#contact').scrollIntoView();
          cy.compareSnapshot(`contact-${viewport.name}-${theme}`);
        });
      });
    });
  });

  describe('Interactive Element Visual States', () => {
    it('should show proper hover states', () => {
      // Test button hover states
      cy.get('.hero__cta--primary').trigger('mouseover');
      cy.compareSnapshot('button-hover-state');
      
      // Test navigation hover states
      cy.get('[role="menuitem"]').first().trigger('mouseover');
      cy.compareSnapshot('nav-hover-state');
      
      // Test project card hover states
      cy.get('#projects').scrollIntoView();
      cy.get('[data-testid="project-card"]').first().trigger('mouseover');
      cy.compareSnapshot('project-card-hover-state');
    });

    it('should show proper focus states', () => {
      // Test keyboard focus states
      cy.get('body').tab();
      cy.compareSnapshot('skip-link-focus');
      
      cy.focused().tab();
      cy.compareSnapshot('nav-button-focus');
      
      // Test form focus states
      cy.get('#contact').scrollIntoView();
      cy.get('input[name="name"]').focus();
      cy.compareSnapshot('form-input-focus');
    });

    it('should show proper active states', () => {
      // Test button active states
      cy.get('.hero__cta--primary').trigger('mousedown');
      cy.compareSnapshot('button-active-state');
    });
  });
});