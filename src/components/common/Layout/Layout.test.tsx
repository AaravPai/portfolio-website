import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import Layout from './Layout';
import { ThemeProvider } from '../../../contexts/ThemeContext';

// Mock the Header and Footer components
vi.mock('../Header', () => ({
  default: () => <div data-testid="header">Header</div>
}));

vi.mock('../Footer', () => ({
  default: () => <div data-testid="footer">Footer</div>
}));

// Helper function to render Layout with ThemeProvider
const renderLayout = (props = {}) => {
  return render(
    <ThemeProvider>
      <Layout {...props}>
        <div data-testid="test-content">Test Content</div>
      </Layout>
    </ThemeProvider>
  );
};

describe('Layout Component', () => {
  it('renders header, main content, and footer', () => {
    renderLayout();
    
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('test-content')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('renders main content with proper structure', () => {
    renderLayout();
    
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
    expect(main).toHaveAttribute('id', 'main-content');
    expect(main).toHaveClass('layout__main');
  });

  it('renders children content', () => {
    renderLayout();
    
    expect(screen.getByTestId('test-content')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies custom className when provided', () => {
    renderLayout({ className: 'custom-layout' });
    
    const layout = document.querySelector('.layout');
    expect(layout).toHaveClass('custom-layout');
  });

  it('has proper layout structure', () => {
    renderLayout();
    
    const layout = document.querySelector('.layout');
    expect(layout).toBeInTheDocument();
    expect(layout).toHaveClass('layout');
  });

  it('maintains proper semantic structure', () => {
    renderLayout();
    
    // Check that header comes before main
    const header = screen.getByTestId('header');
    const main = screen.getByRole('main');
    const footer = screen.getByTestId('footer');
    
    expect(header.compareDocumentPosition(main)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    expect(main.compareDocumentPosition(footer)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });

  describe('Accessibility', () => {
    it('has proper main landmark', () => {
      renderLayout();
      
      const main = screen.getByRole('main');
      expect(main).toBeInTheDocument();
      expect(main).toHaveAttribute('id', 'main-content');
    });

    it('provides skip link target', () => {
      renderLayout();
      
      const main = screen.getByRole('main');
      expect(main).toHaveAttribute('id', 'main-content');
    });
  });
});