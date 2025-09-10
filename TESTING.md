# Testing Documentation

This document outlines the comprehensive testing strategy for the portfolio website, including unit tests, integration tests, end-to-end tests, and visual regression tests.

## Test Structure

```
src/
├── test/
│   ├── setup.ts                    # Test configuration and mocks
│   ├── accessibility.test.tsx      # Accessibility compliance tests
│   ├── accessibility-basic.test.tsx
│   ├── accessibility-components.test.tsx
│   ├── performance.test.ts         # Performance benchmarks
│   ├── responsive.test.tsx         # Responsive design tests
│   └── integration/
│       └── user-workflows.test.tsx # User journey integration tests
├── components/
│   └── **/*.test.tsx               # Component unit tests
├── hooks/
│   └── **/*.test.ts                # Custom hooks tests
├── utils/
│   └── **/*.test.ts                # Utility function tests
└── services/
    └── **/*.test.ts                # Service layer tests

cypress/
├── e2e/
│   ├── critical-user-flows.cy.ts  # End-to-end user flows
│   ├── accessibility.cy.ts        # E2E accessibility tests
│   ├── responsive.cy.ts           # E2E responsive tests
│   └── visual-regression.cy.ts    # Visual regression tests
└── support/
    ├── commands.ts                 # Custom Cypress commands
    └── e2e.ts                      # E2E test configuration
```

## Test Categories

### 1. Unit Tests

**Purpose**: Test individual components, hooks, and utilities in isolation.

**Coverage**:
- All React components
- Custom hooks
- Utility functions
- Service functions
- Data models and validation

**Run Command**: `npm run test:run`

**Key Features**:
- Component rendering and props
- User interactions
- State management
- Error handling
- Edge cases

### 2. Integration Tests

**Purpose**: Test how different parts of the application work together.

**Coverage**:
- Complete user workflows
- Component interactions
- Theme switching
- Form submissions
- Navigation flows

**Run Command**: `npm run test:integration`

**Key Features**:
- Multi-step user journeys
- Cross-component communication
- State persistence
- Error recovery

### 3. End-to-End Tests

**Purpose**: Test the complete application from a user's perspective.

**Coverage**:
- Critical user paths
- Form submissions
- Navigation
- Mobile interactions
- Performance requirements

**Run Command**: `npm run test:e2e`

**Key Features**:
- Real browser testing
- Network requests
- File downloads
- Mobile responsiveness
- Performance metrics

### 4. Accessibility Tests

**Purpose**: Ensure WCAG 2.1 AA compliance and screen reader compatibility.

**Coverage**:
- Color contrast ratios
- Keyboard navigation
- Screen reader support
- ARIA attributes
- Focus management

**Run Command**: `npm run test:accessibility`

**Key Features**:
- Automated axe-core audits
- Manual accessibility testing
- Keyboard-only navigation
- Screen reader simulation

### 5. Visual Regression Tests

**Purpose**: Detect unintended visual changes across themes and viewports.

**Coverage**:
- Theme consistency
- Responsive layouts
- Component states
- Interactive elements

**Run Command**: `npm run test:visual`

**Key Features**:
- Screenshot comparisons
- Theme switching validation
- Responsive design verification
- State change detection

### 6. Performance Tests

**Purpose**: Ensure the application meets performance benchmarks.

**Coverage**:
- Load times
- Bundle sizes
- Core Web Vitals
- Lighthouse scores

**Run Command**: `npm run test:performance`

**Key Features**:
- Performance budgets
- Lighthouse audits
- Bundle analysis
- Loading metrics

## Test Configuration

### Vitest Configuration

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    testTimeout: 10000,
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*'
      ]
    }
  }
});
```

### Cypress Configuration

```typescript
// cypress.config.ts
export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4173',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true
  }
});
```

## Running Tests

### Local Development

```bash
# Run all unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run integration tests
npm run test:integration

# Run E2E tests (requires built app)
npm run build
npm run preview &
npm run test:e2e

# Open Cypress GUI
npm run test:e2e:open

# Run specific test suites
npm run test:accessibility
npm run test:visual
npm run test:performance
```

### Continuous Integration

The CI pipeline runs all test suites automatically:

1. **Unit Tests**: Run on Node.js 18.x and 20.x
2. **Integration Tests**: Run on latest Node.js
3. **E2E Tests**: Run in headless Chrome
4. **Accessibility Tests**: Include axe-core audits
5. **Performance Tests**: Include Lighthouse audits
6. **Visual Regression**: Compare screenshots
7. **Security Tests**: Audit dependencies

## Test Data and Mocks

### Mock Data

Test data is centralized in test files and includes:
- Sample project data
- User form inputs
- API responses
- Theme configurations

### Mocks

Common mocks include:
- EmailJS service
- IntersectionObserver
- ResizeObserver
- LocalStorage
- Window methods

## Coverage Requirements

### Minimum Coverage Targets

- **Statements**: 80%
- **Branches**: 75%
- **Functions**: 80%
- **Lines**: 80%

### Critical Path Coverage

- Contact form submission: 100%
- Theme switching: 100%
- Navigation: 100%
- Accessibility features: 100%

## Performance Budgets

### Lighthouse Score Targets

- **Performance**: ≥ 90
- **Accessibility**: ≥ 95
- **Best Practices**: ≥ 90
- **SEO**: ≥ 90

### Load Time Targets

- **First Contentful Paint**: < 2s
- **Largest Contentful Paint**: < 2.5s
- **Total Load Time**: < 3s
- **Bundle Size**: < 500KB

## Accessibility Standards

### WCAG 2.1 AA Compliance

- Color contrast ratio ≥ 4.5:1
- Keyboard navigation support
- Screen reader compatibility
- Focus management
- Semantic HTML structure

### Testing Tools

- **axe-core**: Automated accessibility testing
- **Cypress-axe**: E2E accessibility testing
- **Manual testing**: Keyboard and screen reader testing

## Visual Regression

### Screenshot Comparison

- Baseline images stored in version control
- Automatic comparison on test runs
- Diff images generated for failures
- Support for multiple viewports and themes

### Responsive Testing

- Mobile: 375x667
- Tablet: 768x1024
- Desktop: 1280x720
- Large: 1920x1080

## Debugging Tests

### Common Issues

1. **Timing Issues**: Use `waitFor` for async operations
2. **Mock Problems**: Ensure mocks are properly reset
3. **DOM Queries**: Use semantic queries when possible
4. **Accessibility**: Test with screen readers

### Debug Commands

```bash
# Run tests in debug mode
npm run test -- --reporter=verbose

# Run specific test file
npm run test -- src/components/Hero/Hero.test.tsx

# Run tests with coverage details
npm run test:coverage -- --reporter=verbose

# Debug Cypress tests
npm run test:e2e:open
```

## Best Practices

### Unit Tests

- Test behavior, not implementation
- Use semantic queries
- Mock external dependencies
- Test error states
- Keep tests focused and isolated

### Integration Tests

- Test complete user workflows
- Use realistic test data
- Test cross-component interactions
- Verify state persistence
- Test error recovery

### E2E Tests

- Focus on critical user paths
- Use page object patterns
- Test on multiple browsers
- Include performance checks
- Test mobile interactions

### Accessibility Tests

- Test with keyboard only
- Verify screen reader output
- Check color contrast
- Test focus management
- Validate ARIA attributes

## Maintenance

### Regular Tasks

- Update test data
- Review coverage reports
- Update visual baselines
- Audit dependencies
- Performance monitoring

### Test Review Process

1. All tests must pass before merge
2. Coverage must meet minimum thresholds
3. New features require corresponding tests
4. Visual changes require baseline updates
5. Performance regressions are blocked

## Resources

- [Testing Library Documentation](https://testing-library.com/)
- [Vitest Documentation](https://vitest.dev/)
- [Cypress Documentation](https://docs.cypress.io/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Web Performance Metrics](https://web.dev/metrics/)