/**
 * Development accessibility utilities
 * Only runs in development mode
 */

import { logAccessibilityAudit } from './accessibilityAudit';

// Auto-run accessibility audit in development
if (process.env.NODE_ENV === 'development') {
  // Run audit after page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      logAccessibilityAudit();
    }, 2000); // Wait for components to render
  });

  // Add keyboard shortcut to run audit (Ctrl/Cmd + Shift + A)
  document.addEventListener('keydown', (event) => {
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'A') {
      event.preventDefault();
      console.clear();
      logAccessibilityAudit();
    }
  });

  // Add to window for manual testing
  (window as any).runA11yAudit = logAccessibilityAudit;
  
  console.log('🔍 Accessibility tools loaded:');
  console.log('- Press Ctrl/Cmd + Shift + A to run accessibility audit');
  console.log('- Call window.runA11yAudit() to run audit manually');
}