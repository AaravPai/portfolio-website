/// <reference types="cypress" />

// Custom command for filling contact form
Cypress.Commands.add('fillContactForm', (data: {
  name: string;
  email: string;
  message: string;
}) => {
  cy.get('input[name="name"]').type(data.name);
  cy.get('input[name="email"]').type(data.email);
  cy.get('textarea[name="message"]').type(data.message);
});

// Custom command for navigation testing
Cypress.Commands.add('navigateToSection', (section: string) => {
  cy.get(`[aria-label*="Navigate to ${section}"]`).click();
  cy.get(`#${section.toLowerCase()}`).should('be.visible');
});

// Custom command for accessibility testing
Cypress.Commands.add('checkA11y', (context?: string, options?: any) => {
  cy.injectAxe();
  cy.checkA11y(context, options);
});

// Custom command for performance testing
Cypress.Commands.add('checkPerformance', () => {
  cy.window().then((win) => {
    const performance = win.performance;
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    
    // Check load time is under 3 seconds
    expect(navigation.loadEventEnd - navigation.fetchStart).to.be.lessThan(3000);
    
    // Check First Contentful Paint
    const paintEntries = performance.getEntriesByType('paint');
    const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    if (fcp) {
      expect(fcp.startTime).to.be.lessThan(2000);
    }
  });
});

declare global {
  namespace Cypress {
    interface Chainable {
      fillContactForm(data: { name: string; email: string; message: string }): Chainable<void>;
      navigateToSection(section: string): Chainable<void>;
      checkA11y(context?: string, options?: any): Chainable<void>;
      checkPerformance(): Chainable<void>;
    }
  }
}