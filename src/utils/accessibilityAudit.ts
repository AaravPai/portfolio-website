/**
 * Accessibility audit utilities for runtime checking
 */

import { getContrastRatio, meetsWCAGAA, meetsWCAGAAA } from './accessibility';

export interface AccessibilityIssue {
  type: 'error' | 'warning' | 'info';
  element: HTMLElement;
  message: string;
  wcagGuideline?: string;
  suggestion?: string;
}

export interface AccessibilityAuditResult {
  issues: AccessibilityIssue[];
  score: number;
  summary: {
    errors: number;
    warnings: number;
    info: number;
  };
}

// Color contrast audit
export const auditColorContrast = (element: HTMLElement = document.body): AccessibilityIssue[] => {
  const issues: AccessibilityIssue[] = [];
  const textElements = element.querySelectorAll('*');

  textElements.forEach((el) => {
    const htmlEl = el as HTMLElement;
    const styles = window.getComputedStyle(htmlEl);
    const color = styles.color;
    const backgroundColor = styles.backgroundColor;

    // Skip elements without text content
    if (!htmlEl.textContent?.trim()) return;

    // Skip elements with transparent backgrounds
    if (backgroundColor === 'rgba(0, 0, 0, 0)' || backgroundColor === 'transparent') return;

    try {
      // Convert colors to hex for contrast calculation
      const textColor = rgbToHex(color);
      const bgColor = rgbToHex(backgroundColor);

      if (textColor && bgColor) {
        const contrastRatio = getContrastRatio(textColor, bgColor);
        const fontSize = parseFloat(styles.fontSize);
        const fontWeight = styles.fontWeight;

        // Large text threshold (18pt or 14pt bold)
        const isLargeText = fontSize >= 18 || (fontSize >= 14 && (fontWeight === 'bold' || parseInt(fontWeight) >= 700));
        const requiredRatio = isLargeText ? 3 : 4.5;

        if (contrastRatio < requiredRatio) {
          issues.push({
            type: 'error',
            element: htmlEl,
            message: `Insufficient color contrast: ${contrastRatio.toFixed(2)}:1 (required: ${requiredRatio}:1)`,
            wcagGuideline: 'WCAG 2.1 AA - 1.4.3 Contrast (Minimum)',
            suggestion: `Increase contrast between text (${textColor}) and background (${bgColor})`,
          });
        } else if (contrastRatio < 7 && !meetsWCAGAAA(textColor, bgColor)) {
          issues.push({
            type: 'warning',
            element: htmlEl,
            message: `Good contrast but doesn't meet AAA standards: ${contrastRatio.toFixed(2)}:1`,
            wcagGuideline: 'WCAG 2.1 AAA - 1.4.6 Contrast (Enhanced)',
            suggestion: 'Consider improving contrast for AAA compliance',
          });
        }
      }
    } catch (error) {
      // Skip elements where color parsing fails
    }
  });

  return issues;
};

// Heading structure audit
export const auditHeadingStructure = (element: HTMLElement = document.body): AccessibilityIssue[] => {
  const issues: AccessibilityIssue[] = [];
  const headings = Array.from(element.querySelectorAll('h1, h2, h3, h4, h5, h6'));

  if (headings.length === 0) {
    issues.push({
      type: 'error',
      element,
      message: 'No headings found on the page',
      wcagGuideline: 'WCAG 2.1 AA - 1.3.1 Info and Relationships',
      suggestion: 'Add proper heading structure to organize content',
    });
    return issues;
  }

  // Check for H1
  const h1Elements = headings.filter(h => h.tagName === 'H1');
  if (h1Elements.length === 0) {
    issues.push({
      type: 'error',
      element,
      message: 'No H1 heading found',
      wcagGuideline: 'WCAG 2.1 AA - 1.3.1 Info and Relationships',
      suggestion: 'Add an H1 heading to identify the main topic of the page',
    });
  } else if (h1Elements.length > 1) {
    issues.push({
      type: 'warning',
      element,
      message: `Multiple H1 headings found (${h1Elements.length})`,
      wcagGuideline: 'WCAG 2.1 AA - 1.3.1 Info and Relationships',
      suggestion: 'Consider using only one H1 per page for better structure',
    });
  }

  // Check heading hierarchy
  let previousLevel = 0;
  headings.forEach((heading) => {
    const level = parseInt(heading.tagName.charAt(1));
    
    if (previousLevel > 0 && level > previousLevel + 1) {
      issues.push({
        type: 'warning',
        element: heading as HTMLElement,
        message: `Heading level skipped: ${heading.tagName} follows H${previousLevel}`,
        wcagGuideline: 'WCAG 2.1 AA - 1.3.1 Info and Relationships',
        suggestion: 'Use sequential heading levels for better structure',
      });
    }

    // Check for empty headings
    if (!heading.textContent?.trim()) {
      issues.push({
        type: 'error',
        element: heading as HTMLElement,
        message: 'Empty heading found',
        wcagGuideline: 'WCAG 2.1 AA - 1.3.1 Info and Relationships',
        suggestion: 'Provide meaningful text for all headings',
      });
    }

    previousLevel = level;
  });

  return issues;
};

// Form accessibility audit
export const auditForms = (element: HTMLElement = document.body): AccessibilityIssue[] => {
  const issues: AccessibilityIssue[] = [];
  const formElements = element.querySelectorAll('input, select, textarea');

  formElements.forEach((formElement) => {
    const htmlEl = formElement as HTMLElement;
    const id = htmlEl.id;
    const type = htmlEl.getAttribute('type');

    // Skip hidden inputs
    if (type === 'hidden') return;

    // Check for labels
    const hasLabel = 
      htmlEl.getAttribute('aria-label') ||
      htmlEl.getAttribute('aria-labelledby') ||
      (id && document.querySelector(`label[for="${id}"]`)) ||
      htmlEl.closest('label');

    if (!hasLabel) {
      issues.push({
        type: 'error',
        element: htmlEl,
        message: 'Form element missing accessible label',
        wcagGuideline: 'WCAG 2.1 AA - 1.3.1 Info and Relationships',
        suggestion: 'Add a label, aria-label, or aria-labelledby attribute',
      });
    }

    // Check for required field indicators
    if (htmlEl.hasAttribute('required')) {
      const hasRequiredIndicator = 
        htmlEl.getAttribute('aria-required') === 'true' ||
        htmlEl.getAttribute('aria-label')?.includes('required') ||
        htmlEl.getAttribute('aria-labelledby') ||
        (id && document.querySelector(`label[for="${id}"]`)?.textContent?.includes('*'));

      if (!hasRequiredIndicator) {
        issues.push({
          type: 'warning',
          element: htmlEl,
          message: 'Required field not clearly indicated to screen readers',
          wcagGuideline: 'WCAG 2.1 AA - 3.3.2 Labels or Instructions',
          suggestion: 'Add aria-required="true" or include "required" in the label',
        });
      }
    }

    // Check for error associations
    if (htmlEl.getAttribute('aria-invalid') === 'true') {
      const hasErrorDescription = htmlEl.getAttribute('aria-describedby');
      if (!hasErrorDescription) {
        issues.push({
          type: 'error',
          element: htmlEl,
          message: 'Invalid field missing error description',
          wcagGuideline: 'WCAG 2.1 AA - 3.3.1 Error Identification',
          suggestion: 'Use aria-describedby to associate error messages with form fields',
        });
      }
    }
  });

  return issues;
};

// Image accessibility audit
export const auditImages = (element: HTMLElement = document.body): AccessibilityIssue[] => {
  const issues: AccessibilityIssue[] = [];
  const images = element.querySelectorAll('img');

  images.forEach((img) => {
    const alt = img.getAttribute('alt');
    const ariaHidden = img.getAttribute('aria-hidden');

    // Check for alt text
    if (alt === null && ariaHidden !== 'true') {
      issues.push({
        type: 'error',
        element: img,
        message: 'Image missing alt attribute',
        wcagGuideline: 'WCAG 2.1 AA - 1.1.1 Non-text Content',
        suggestion: 'Add alt attribute with descriptive text or aria-hidden="true" for decorative images',
      });
    }

    // Check for empty alt on non-decorative images
    if (alt === '' && ariaHidden !== 'true') {
      const isDecorative = img.closest('[role="presentation"]') || 
                          img.parentElement?.tagName === 'BUTTON' ||
                          img.classList.contains('decorative');
      
      if (!isDecorative) {
        issues.push({
          type: 'warning',
          element: img,
          message: 'Image with empty alt text may not be decorative',
          wcagGuideline: 'WCAG 2.1 AA - 1.1.1 Non-text Content',
          suggestion: 'Verify if image is decorative or needs descriptive alt text',
        });
      }
    }

    // Check for overly long alt text
    if (alt && alt.length > 125) {
      issues.push({
        type: 'warning',
        element: img,
        message: 'Alt text is very long (over 125 characters)',
        wcagGuideline: 'WCAG 2.1 AA - 1.1.1 Non-text Content',
        suggestion: 'Consider using shorter alt text and providing detailed description elsewhere',
      });
    }
  });

  return issues;
};

// Interactive elements audit
export const auditInteractiveElements = (element: HTMLElement = document.body): AccessibilityIssue[] => {
  const issues: AccessibilityIssue[] = [];
  const interactiveElements = element.querySelectorAll('button, a, input, select, textarea, [tabindex], [role="button"], [role="link"]');

  interactiveElements.forEach((el) => {
    const htmlEl = el as HTMLElement;
    const tagName = htmlEl.tagName.toLowerCase();
    const role = htmlEl.getAttribute('role');
    const tabIndex = htmlEl.getAttribute('tabindex');

    // Check for accessible names
    const hasAccessibleName = 
      htmlEl.textContent?.trim() ||
      htmlEl.getAttribute('aria-label') ||
      htmlEl.getAttribute('aria-labelledby') ||
      htmlEl.getAttribute('title') ||
      (tagName === 'input' && htmlEl.getAttribute('value')) ||
      htmlEl.querySelector('img[alt]');

    if (!hasAccessibleName) {
      issues.push({
        type: 'error',
        element: htmlEl,
        message: 'Interactive element missing accessible name',
        wcagGuideline: 'WCAG 2.1 AA - 4.1.2 Name, Role, Value',
        suggestion: 'Add text content, aria-label, or aria-labelledby attribute',
      });
    }

    // Check touch target size
    const rect = htmlEl.getBoundingClientRect();
    const minSize = 44; // WCAG AAA recommendation
    
    if (rect.width > 0 && rect.height > 0 && (rect.width < minSize || rect.height < minSize)) {
      issues.push({
        type: 'warning',
        element: htmlEl,
        message: `Touch target too small: ${Math.round(rect.width)}x${Math.round(rect.height)}px (recommended: ${minSize}x${minSize}px)`,
        wcagGuideline: 'WCAG 2.1 AAA - 2.5.5 Target Size',
        suggestion: 'Increase padding or size to meet minimum touch target requirements',
      });
    }

    // Check for keyboard accessibility
    if (tabIndex === '-1' && !htmlEl.hasAttribute('disabled')) {
      const isInModal = htmlEl.closest('[role="dialog"], [role="alertdialog"]');
      if (!isInModal) {
        issues.push({
          type: 'warning',
          element: htmlEl,
          message: 'Interactive element removed from tab order',
          wcagGuideline: 'WCAG 2.1 AA - 2.1.1 Keyboard',
          suggestion: 'Ensure element is keyboard accessible or provide alternative',
        });
      }
    }
  });

  return issues;
};

// Focus management audit
export const auditFocusManagement = (element: HTMLElement = document.body): AccessibilityIssue[] => {
  const issues: AccessibilityIssue[] = [];
  
  // Check for focus indicators
  const focusableElements = element.querySelectorAll(
    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );

  focusableElements.forEach((el) => {
    const htmlEl = el as HTMLElement;
    const styles = window.getComputedStyle(htmlEl, ':focus');
    
    // Check if focus styles are defined
    const hasOutline = styles.outline !== 'none' && styles.outline !== '0px';
    const hasBoxShadow = styles.boxShadow !== 'none';
    const hasBorder = styles.borderColor !== 'transparent';
    
    if (!hasOutline && !hasBoxShadow && !hasBorder) {
      issues.push({
        type: 'warning',
        element: htmlEl,
        message: 'Element may not have visible focus indicator',
        wcagGuideline: 'WCAG 2.1 AA - 2.4.7 Focus Visible',
        suggestion: 'Add visible focus styles (outline, box-shadow, or border)',
      });
    }
  });

  return issues;
};

// Main audit function
export const runAccessibilityAudit = (element: HTMLElement = document.body): AccessibilityAuditResult => {
  const allIssues: AccessibilityIssue[] = [
    ...auditColorContrast(element),
    ...auditHeadingStructure(element),
    ...auditForms(element),
    ...auditImages(element),
    ...auditInteractiveElements(element),
    ...auditFocusManagement(element),
  ];

  const summary = {
    errors: allIssues.filter(issue => issue.type === 'error').length,
    warnings: allIssues.filter(issue => issue.type === 'warning').length,
    info: allIssues.filter(issue => issue.type === 'info').length,
  };

  // Calculate score (0-100)
  const totalIssues = summary.errors + summary.warnings + (summary.info * 0.5);
  const maxPossibleIssues = element.querySelectorAll('*').length * 0.1; // Rough estimate
  const score = Math.max(0, Math.round(100 - (totalIssues / maxPossibleIssues) * 100));

  return {
    issues: allIssues,
    score,
    summary,
  };
};

// Utility function to convert RGB to hex
const rgbToHex = (rgb: string): string | null => {
  const match = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (!match) return null;
  
  const r = parseInt(match[1]);
  const g = parseInt(match[2]);
  const b = parseInt(match[3]);
  
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};

// Development helper to log audit results
export const logAccessibilityAudit = (element?: HTMLElement) => {
  if (process.env.NODE_ENV !== 'development') return;
  
  const results = runAccessibilityAudit(element);
  
  console.group('🔍 Accessibility Audit Results');
  console.log(`Score: ${results.score}/100`);
  console.log(`Issues: ${results.summary.errors} errors, ${results.summary.warnings} warnings, ${results.summary.info} info`);
  
  if (results.issues.length > 0) {
    console.group('Issues Found:');
    results.issues.forEach((issue, index) => {
      const icon = issue.type === 'error' ? '❌' : issue.type === 'warning' ? '⚠️' : 'ℹ️';
      console.group(`${icon} ${issue.type.toUpperCase()}: ${issue.message}`);
      console.log('Element:', issue.element);
      console.log('WCAG Guideline:', issue.wcagGuideline);
      console.log('Suggestion:', issue.suggestion);
      console.groupEnd();
    });
    console.groupEnd();
  } else {
    console.log('✅ No accessibility issues found!');
  }
  
  console.groupEnd();
};