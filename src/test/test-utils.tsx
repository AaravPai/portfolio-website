import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { vi } from 'vitest';
import { ThemeProvider } from '../contexts/ThemeContext';

// Mock data for testing
export const mockProjectData = {
  id: 'test-project',
  title: 'Test Project',
  description: 'A test project for unit testing',
  longDescription: 'This is a longer description for testing purposes',
  technologies: ['React', 'TypeScript', 'Jest'],
  imageUrl: '/images/test-project.jpg',
  liveUrl: 'https://test-project.com',
  githubUrl: 'https://github.com/test/project',
  featured: true,
};

export const mockSkillData = {
  name: 'React',
  category: 'frontend' as const,
  proficiency: 5 as const,
  icon: 'react-icon',
};

export const mockExperienceData = {
  company: 'Test Company',
  position: 'Senior Developer',
  startDate: '2020-01',
  endDate: '2023-12',
  description: ['Developed amazing features', 'Led a team of developers'],
  technologies: ['React', 'Node.js', 'TypeScript'],
};

export const mockContactFormData = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  message: 'This is a test message for the contact form.',
};

// Custom render function with providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialTheme?: 'light' | 'dark';
}

export function renderWithProviders(
  ui: React.ReactElement,
  { initialTheme = 'light', ...renderOptions }: CustomRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <ThemeProvider initialTheme={initialTheme}>
        {children}
      </ThemeProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

// Mock implementations
export const mockIntersectionObserver = () => {
  const mockIntersectionObserver = vi.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  });
  window.IntersectionObserver = mockIntersectionObserver;
};

export const mockResizeObserver = () => {
  const mockResizeObserver = vi.fn();
  mockResizeObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  });
  window.ResizeObserver = mockResizeObserver;
};

export const mockMatchMedia = (matches = false) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
};

export const mockLocalStorage = () => {
  const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  };
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
  });
  return localStorageMock;
};

export const mockScrollIntoView = () => {
  Element.prototype.scrollIntoView = vi.fn();
};

export const mockGetBoundingClientRect = (rect = {}) => {
  const defaultRect = {
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: 0,
    height: 0,
    x: 0,
    y: 0,
  };
  
  Element.prototype.getBoundingClientRect = vi.fn(() => ({
    ...defaultRect,
    ...rect,
    toJSON: vi.fn(),
  }));
};

// Test helpers
export const waitForLoadingToFinish = () => {
  return new Promise((resolve) => setTimeout(resolve, 0));
};

export const createMockFile = (name = 'test.pdf', type = 'application/pdf') => {
  return new File(['test content'], name, { type });
};

export const triggerResize = (width = 1024, height = 768) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  });
  window.dispatchEvent(new Event('resize'));
};

export const triggerScroll = (scrollY = 100) => {
  Object.defineProperty(window, 'scrollY', {
    writable: true,
    configurable: true,
    value: scrollY,
  });
  window.dispatchEvent(new Event('scroll'));
};

// Accessibility test helpers
export const getByAriaLabel = (container: HTMLElement, label: string) => {
  return container.querySelector(`[aria-label="${label}"]`);
};

export const getByAriaLabelledBy = (container: HTMLElement, id: string) => {
  return container.querySelector(`[aria-labelledby="${id}"]`);
};

export const hasAriaExpanded = (element: Element, expanded: boolean) => {
  return element.getAttribute('aria-expanded') === expanded.toString();
};

export const hasAriaHidden = (element: Element, hidden: boolean) => {
  return element.getAttribute('aria-hidden') === hidden.toString();
};

// Performance test helpers
export const measureRenderTime = async (renderFn: () => void) => {
  const start = performance.now();
  renderFn();
  await waitForLoadingToFinish();
  const end = performance.now();
  return end - start;
};

// Form test helpers
export const fillForm = async (
  user: any,
  formData: Record<string, string>
) => {
  for (const [name, value] of Object.entries(formData)) {
    const field = document.querySelector(`[name="${name}"]`) as HTMLElement;
    if (field) {
      await user.clear(field);
      await user.type(field, value);
    }
  }
};

export const submitForm = async (user: any, submitSelector = 'button[type="submit"]') => {
  const submitButton = document.querySelector(submitSelector) as HTMLElement;
  if (submitButton) {
    await user.click(submitButton);
  }
};

// Network mocking helpers
export const mockFetch = (response: any, ok = true) => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok,
      json: () => Promise.resolve(response),
      text: () => Promise.resolve(JSON.stringify(response)),
    })
  ) as any;
};

export const mockFetchError = (error = new Error('Network error')) => {
  global.fetch = vi.fn(() => Promise.reject(error)) as any;
};

// Theme test helpers
export const expectThemeClass = (element: Element, theme: 'light' | 'dark') => {
  const html = document.documentElement;
  expect(html).toHaveAttribute('data-theme', theme);
};

// Animation test helpers
export const mockAnimations = () => {
  // Mock CSS animations
  Element.prototype.animate = vi.fn(() => ({
    finished: Promise.resolve(),
    cancel: vi.fn(),
    finish: vi.fn(),
    pause: vi.fn(),
    play: vi.fn(),
    reverse: vi.fn(),
    updatePlaybackRate: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })) as any;
  
  // Mock CSS transitions
  const originalGetComputedStyle = window.getComputedStyle;
  window.getComputedStyle = vi.fn((element) => {
    const style = originalGetComputedStyle(element);
    return {
      ...style,
      transitionDuration: '0s',
      animationDuration: '0s',
    } as CSSStyleDeclaration;
  });
};

// Cleanup helpers
export const cleanupMocks = () => {
  vi.clearAllMocks();
  vi.restoreAllMocks();
};

// Re-export everything from testing-library
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';