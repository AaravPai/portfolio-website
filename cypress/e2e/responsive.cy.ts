describe('Responsive Design Tests', () => {
  const viewports = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1280, height: 720 },
    { name: 'large', width: 1920, height: 1080 }
  ];

  viewports.forEach(viewport => {
    describe(`${viewport.name} viewport (${viewport.width}x${viewport.height})`, () => {
      beforeEach(() => {
        cy.viewport(viewport.width, viewport.height);
        cy.visit('/');
      });

      it('should display properly on different screen sizes', () => {
        // Check that all sections are visible
        cy.get('#hero').should('be.visible');
        cy.get('#about').should('be.visible');
        cy.get('#projects').should('be.visible');
        cy.get('#skills').should('be.visible');
        cy.get('#resume').should('be.visible');
        cy.get('#contact').should('be.visible');
      });

      it('should have appropriate navigation for screen size', () => {
        if (viewport.width < 768) {
          // Mobile: should show hamburger menu
          cy.get('[aria-label*="Toggle mobile menu"]').should('be.visible');
          cy.get('.header__nav-list').should('not.be.visible');
          
          // Test mobile menu functionality
          cy.get('[aria-label*="Toggle mobile menu"]').click();
          cy.get('.header__mobile-nav').should('be.visible');
        } else {
          // Desktop: should show full navigation
          cy.get('.header__nav-list').should('be.visible');
          cy.get('[aria-label*="Toggle mobile menu"]').should('not.be.visible');
        }
      });

      it('should have touch-friendly elements on mobile', () => {
        if (viewport.width < 768) {
          // Check button sizes are touch-friendly (minimum 44px)
          cy.get('button').each(($button) => {
            cy.wrap($button).then(($el) => {
              const rect = $el[0].getBoundingClientRect();
              expect(Math.max(rect.width, rect.height)).to.be.at.least(44);
            });
          });
        }
      });

      it('should handle form layout appropriately', () => {
        cy.get('#contact').scrollIntoView();
        
        // Form should be usable on all screen sizes
        cy.get('.contact-form').should('be.visible');
        cy.get('input[name="name"]').should('be.visible');
        cy.get('input[name="email"]').should('be.visible');
        cy.get('textarea[name="message"]').should('be.visible');
        
        // Form fields should be appropriately sized
        cy.get('input[name="name"]').should('have.css', 'width').and('not.equal', '0px');
      });

      it('should display projects grid appropriately', () => {
        cy.get('#projects').scrollIntoView();
        
        // Projects should be visible and properly laid out
        cy.get('[data-testid="project-card"]').should('be.visible');
        
        if (viewport.width < 768) {
          // Mobile: single column
          cy.get('[data-testid="projects-grid"]').should('have.css', 'grid-template-columns', '1fr');
        } else if (viewport.width < 1024) {
          // Tablet: responsive grid
          cy.get('[data-testid="projects-grid"]').should('have.css', 'grid-template-columns').and('contain', 'minmax');
        } else {
          // Desktop: multi-column
          cy.get('[data-testid="projects-grid"]').should('have.css', 'grid-template-columns').and('contain', 'minmax');
        }
      });

      it('should handle text readability', () => {
        // Text should be readable on all screen sizes
        cy.get('h1').should('have.css', 'font-size').then((fontSize) => {
          const size = parseInt(fontSize);
          expect(size).to.be.at.least(16); // Minimum readable size
        });
        
        cy.get('p').should('have.css', 'line-height').then((lineHeight) => {
          const height = parseFloat(lineHeight);
          expect(height).to.be.at.least(1.2); // Minimum line height for readability
        });
      });
    });
  });

  describe('Orientation Changes', () => {
    it('should handle landscape orientation on mobile', () => {
      cy.viewport(667, 375); // Landscape mobile
      cy.visit('/');
      
      cy.get('#hero').should('be.visible');
      cy.get('.hero__content').should('be.visible');
    });

    it('should handle portrait orientation on tablet', () => {
      cy.viewport(768, 1024); // Portrait tablet
      cy.visit('/');
      
      cy.get('#hero').should('be.visible');
      cy.get('.hero__content').should('be.visible');
    });
  });

  describe('Dynamic Content Resizing', () => {
    it('should handle window resize events', () => {
      cy.visit('/');
      
      // Start with desktop
      cy.viewport(1280, 720);
      cy.get('.header__nav-list').should('be.visible');
      
      // Resize to mobile
      cy.viewport(375, 667);
      cy.get('[aria-label*="Toggle mobile menu"]').should('be.visible');
      
      // Resize back to desktop
      cy.viewport(1280, 720);
      cy.get('.header__nav-list').should('be.visible');
    });
  });
});