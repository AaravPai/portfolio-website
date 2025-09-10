describe('Accessibility Tests', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.injectAxe();
  });

  it('should have no accessibility violations on homepage', () => {
    cy.checkA11y();
  });

  it('should have no accessibility violations in each section', () => {
    const sections = ['hero', 'about', 'projects', 'skills', 'resume', 'contact'];
    
    sections.forEach(section => {
      cy.get(`#${section}`).scrollIntoView();
      cy.checkA11y(`#${section}`, {
        rules: {
          'color-contrast': { enabled: true },
          'keyboard-navigation': { enabled: true },
          'focus-management': { enabled: true }
        }
      });
    });
  });

  it('should support keyboard navigation', () => {
    // Tab through all focusable elements
    cy.get('body').tab();
    cy.focused().should('have.attr', 'href', '#main-content'); // Skip link
    
    // Continue tabbing through navigation
    cy.focused().tab();
    cy.focused().should('contain', 'About');
    
    cy.focused().tab();
    cy.focused().should('contain', 'Projects');
    
    // Test Enter key activation
    cy.focused().type('{enter}');
    cy.get('#projects').should('be.visible');
  });

  it('should have proper focus management in modals', () => {
    // Open project modal
    cy.get('#projects').scrollIntoView();
    cy.get('[data-testid="project-card"]').first().click();
    
    // Focus should be trapped in modal
    cy.get('[data-testid="project-modal"]').should('be.visible');
    cy.focused().should('be.visible');
    
    // Tab should cycle within modal
    cy.focused().tab();
    cy.focused().should('be.within', '[data-testid="project-modal"]');
    
    // Escape should close modal
    cy.get('body').type('{esc}');
    cy.get('[data-testid="project-modal"]').should('not.exist');
  });

  it('should have proper ARIA labels and roles', () => {
    // Check navigation has proper ARIA
    cy.get('[role="menubar"]').should('exist');
    cy.get('[role="menuitem"]').should('have.length.greaterThan', 0);
    
    // Check form has proper labels
    cy.get('#contact').scrollIntoView();
    cy.get('input[name="name"]').should('have.attr', 'aria-describedby');
    cy.get('input[name="email"]').should('have.attr', 'aria-describedby');
    cy.get('textarea[name="message"]').should('have.attr', 'aria-describedby');
    
    // Check buttons have proper labels
    cy.get('button').each(($button) => {
      cy.wrap($button).should('satisfy', ($el) => {
        return $el.attr('aria-label') || $el.text().trim().length > 0;
      });
    });
  });

  it('should announce dynamic content changes', () => {
    // Test form validation announcements
    cy.get('#contact').scrollIntoView();
    cy.get('button[type="submit"]').click();
    
    // Error messages should be announced
    cy.get('[role="alert"]').should('exist');
    
    // Test theme switch announcement
    cy.get('[aria-label*="Switch to"]').click();
    cy.get('[aria-live="polite"]').should('exist');
  });

  it('should work with screen readers', () => {
    // Test heading structure
    cy.get('h1').should('have.length', 1);
    cy.get('h2').should('have.length.greaterThan', 0);
    
    // Test landmark regions
    cy.get('main').should('exist');
    cy.get('nav').should('exist');
    cy.get('footer').should('exist');
    
    // Test skip links
    cy.get('.skip-links a').should('have.length.greaterThan', 0);
    cy.get('.skip-links a').first().click();
    cy.focused().should('have.attr', 'id', 'main-content');
  });

  it('should maintain accessibility in different themes', () => {
    // Test light theme accessibility
    cy.checkA11y(null, {
      rules: {
        'color-contrast': { enabled: true }
      }
    });
    
    // Switch to dark theme
    cy.switchTheme('dark');
    
    // Test dark theme accessibility
    cy.checkA11y(null, {
      rules: {
        'color-contrast': { enabled: true }
      }
    });
  });
});