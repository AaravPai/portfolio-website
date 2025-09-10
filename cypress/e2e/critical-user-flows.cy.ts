describe('Critical User Flows', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Homepage Load and Navigation', () => {
    it('should load homepage within performance budget', () => {
      cy.checkPerformance();
    });

    it('should display all main sections', () => {
      cy.get('#hero').should('be.visible');
      cy.get('#about').should('be.visible');
      cy.get('#projects').should('be.visible');
      cy.get('#skills').should('be.visible');
      cy.get('#resume').should('be.visible');
      cy.get('#contact').should('be.visible');
    });

    it('should navigate between sections smoothly', () => {
      cy.navigateToSection('About');
      cy.navigateToSection('Projects');
      cy.navigateToSection('Skills');
      cy.navigateToSection('Resume');
      cy.navigateToSection('Contact');
    });
  });

  describe('Contact Form Workflow', () => {
    beforeEach(() => {
      cy.get('#contact').scrollIntoView();
    });

    it('should complete full contact form submission flow', () => {
      const testData = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        message: 'This is a test message for the contact form. It should be long enough to pass validation.'
      };

      cy.fillContactForm(testData);
      
      // Submit form
      cy.get('button[type="submit"]').click();
      
      // Should show loading state
      cy.get('button[type="submit"]').should('contain', 'Sending...');
      
      // Should show success message (mocked)
      cy.get('[role="alert"]', { timeout: 10000 }).should('contain', 'Message sent successfully');
    });

    it('should show validation errors for invalid form data', () => {
      // Try to submit empty form
      cy.get('button[type="submit"]').click();
      
      // Should show validation errors
      cy.get('.error-message').should('have.length.greaterThan', 0);
      cy.get('input[name="name"]').should('have.class', 'error');
      cy.get('input[name="email"]').should('have.class', 'error');
      cy.get('textarea[name="message"]').should('have.class', 'error');
    });

    it('should validate email format', () => {
      cy.get('input[name="email"]').type('invalid-email');
      cy.get('input[name="name"]').click(); // Trigger blur
      
      cy.get('#email-error').should('contain', 'Please enter a valid email address');
    });
  });

  describe('Project Showcase Interaction', () => {
    beforeEach(() => {
      cy.get('#projects').scrollIntoView();
    });

    it('should display project cards and open project details', () => {
      // Should show project cards
      cy.get('[data-testid="project-card"]').should('have.length.greaterThan', 0);
      
      // Click on first project
      cy.get('[data-testid="project-card"]').first().click();
      
      // Should open project modal
      cy.get('[data-testid="project-modal"]').should('be.visible');
      cy.get('[data-testid="project-modal"]').should('contain', 'Live Demo');
      cy.get('[data-testid="project-modal"]').should('contain', 'Source Code');
      
      // Should close modal
      cy.get('[aria-label="Close modal"]').click();
      cy.get('[data-testid="project-modal"]').should('not.exist');
    });

    it('should handle project filtering', () => {
      // If filtering is implemented
      cy.get('[data-testid="project-filter"]').then(($filters) => {
        if ($filters.length > 0) {
          cy.get('[data-testid="project-filter"]').first().click();
          cy.get('[data-testid="project-card"]').should('be.visible');
        }
      });
    });
  });

  describe('Resume Download Flow', () => {
    it('should download resume when button is clicked', () => {
      cy.get('[aria-label*="Download resume"]').click();
      
      // Check that download was initiated
      cy.readFile('cypress/downloads/resume.pdf', { timeout: 10000 }).should('exist');
    });
  });

  describe('Theme Switching Flow', () => {
    it('should switch between light and dark themes', () => {
      // Start with light theme
      cy.get('html').should('have.attr', 'data-theme', 'light');
      
      // Switch to dark theme
      cy.switchTheme('dark');
      
      // Verify dark theme is applied
      cy.get('html').should('have.attr', 'data-theme', 'dark');
      cy.get('body').should('have.css', 'background-color').and('not.equal', 'rgb(255, 255, 255)');
      
      // Switch back to light theme
      cy.switchTheme('light');
      
      // Verify light theme is restored
      cy.get('html').should('have.attr', 'data-theme', 'light');
    });

    it('should persist theme preference on page reload', () => {
      // Switch to dark theme
      cy.switchTheme('dark');
      
      // Reload page
      cy.reload();
      
      // Should still be dark theme
      cy.get('html').should('have.attr', 'data-theme', 'dark');
    });
  });
});