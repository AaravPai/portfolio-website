// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Add custom commands for accessibility testing
import 'cypress-axe';

// Add visual regression testing
import 'cypress-visual-regression/dist/support';

// Configure visual regression
Cypress.Commands.add('compareSnapshot', (name: string, options?: any) => {
  cy.compareSnapshot(name, options);
});

// Add theme switching helper
Cypress.Commands.add('switchTheme', (theme: 'light' | 'dark') => {
  cy.get('[aria-label*="Switch to"]').click();
  cy.get('html').should('have.attr', 'data-theme', theme);
});

// Add responsive testing helpers
Cypress.Commands.add('setViewport', (size: 'mobile' | 'tablet' | 'desktop') => {
  const viewports = {
    mobile: [375, 667],
    tablet: [768, 1024],
    desktop: [1280, 720]
  };
  
  const [width, height] = viewports[size];
  cy.viewport(width, height);
});

declare global {
  namespace Cypress {
    interface Chainable {
      compareSnapshot(name: string, options?: any): Chainable<void>;
      switchTheme(theme: 'light' | 'dark'): Chainable<void>;
      setViewport(size: 'mobile' | 'tablet' | 'desktop'): Chainable<void>;
    }
  }
}