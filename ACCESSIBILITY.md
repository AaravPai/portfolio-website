# Accessibility Guide

This portfolio website is built with accessibility as a core principle, following WCAG 2.1 AA guidelines and modern accessibility best practices.

## 🎯 Accessibility Features

### Semantic HTML Structure
- Proper heading hierarchy (H1 → H2 → H3)
- Semantic landmarks (`main`, `nav`, `header`, `footer`)
- Meaningful section labeling with `aria-labelledby`
- Proper form structure with labels and descriptions

### Keyboard Navigation
- Full keyboard accessibility for all interactive elements
- Logical tab order throughout the application
- Skip links for efficient navigation
- Focus trapping in modals and overlays
- Visible focus indicators on all focusable elements

### Screen Reader Support
- Comprehensive ARIA labels and descriptions
- Live regions for dynamic content announcements
- Proper image alt text and decorative image handling
- Form validation messages associated with fields
- Navigation state announcements

### Color and Contrast
- WCAG AA compliant color contrast ratios (4.5:1 minimum)
- Enhanced contrast in dark theme
- High contrast mode support
- Color is not the only means of conveying information

### Responsive Accessibility
- Touch-friendly target sizes (44px minimum)
- Mobile-optimized navigation
- Responsive text scaling
- Viewport meta tag for proper scaling

### Motion and Animation
- Respects `prefers-reduced-motion` setting
- Essential animations preserved with reduced duration
- Smooth scrolling with fallback for reduced motion

## 🛠 Development Tools

### Accessibility Audit
The project includes built-in accessibility auditing tools:

```typescript
// Run accessibility audit manually
window.runA11yAudit();

// Keyboard shortcut: Ctrl/Cmd + Shift + A
```

### Testing
Comprehensive accessibility test suite:

```bash
# Run accessibility tests
npm test accessibility-basic

# Run all tests
npm test
```

### Color Contrast Utilities
```typescript
import { getContrastRatio, meetsWCAGAA } from './utils/accessibility';

// Check contrast ratio
const ratio = getContrastRatio('#000000', '#ffffff'); // 21:1

// Validate WCAG compliance
const isCompliant = meetsWCAGAA('#0056b3', '#ffffff'); // true
```

## 🎨 Theme Accessibility

### Light Theme Colors
- Background: `#ffffff` (White)
- Primary Text: `#212529` (16.75:1 contrast)
- Secondary Text: `#495057` (7.0:1 contrast)
- Accent: `#0056b3` (7.15:1 contrast)

### Dark Theme Colors
- Background: `#1a1a1a` (Dark Gray)
- Primary Text: `#ffffff` (15.3:1 contrast)
- Secondary Text: `#e9ecef` (11.7:1 contrast)
- Accent: `#66b3ff` (7.2:1 contrast)

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Tab` | Navigate forward through interactive elements |
| `Shift + Tab` | Navigate backward through interactive elements |
| `Enter` / `Space` | Activate buttons and links |
| `Escape` | Close modals and overlays |
| `Arrow Keys` | Navigate within components (where applicable) |
| `Ctrl/Cmd + Shift + A` | Run accessibility audit (development) |

## 🔍 Skip Links

The website provides skip links for efficient keyboard navigation:
- Skip to main content
- Skip to navigation
- Skip to contact form

Skip links are hidden by default and become visible when focused.

## 📱 Mobile Accessibility

### Touch Targets
- Minimum 44px touch target size
- Adequate spacing between interactive elements
- Swipe gestures with keyboard alternatives

### Mobile Navigation
- Collapsible hamburger menu
- Focus management in mobile overlays
- Touch-optimized interactions

## 🧪 Testing Checklist

### Manual Testing
- [ ] Navigate entire site using only keyboard
- [ ] Test with screen reader (NVDA, JAWS, VoiceOver)
- [ ] Verify color contrast in both themes
- [ ] Test with 200% zoom level
- [ ] Validate with reduced motion enabled
- [ ] Check high contrast mode compatibility

### Automated Testing
- [ ] Run accessibility test suite
- [ ] Use browser accessibility tools
- [ ] Validate HTML semantics
- [ ] Check ARIA implementation

## 🔧 Accessibility Utilities

### Focus Management
```typescript
import { useFocusManagement } from './hooks/useFocusManagement';

const { containerRef } = useFocusManagement(isOpen, {
  trapFocus: true,
  restoreFocus: true,
  autoFocus: true
});
```

### Screen Reader Announcements
```typescript
import { announceToScreenReader } from './utils/accessibility';

announceToScreenReader('Form submitted successfully', 'assertive');
```

### Keyboard Navigation
```typescript
import { useKeyboardNavigation } from './hooks/useFocusManagement';

const { handleKeyDown } = useKeyboardNavigation(items, {
  orientation: 'horizontal',
  loop: true
});
```

## 📋 WCAG 2.1 Compliance

This website aims to meet WCAG 2.1 Level AA standards:

### Level A
- ✅ 1.1.1 Non-text Content
- ✅ 1.3.1 Info and Relationships
- ✅ 1.3.2 Meaningful Sequence
- ✅ 1.3.3 Sensory Characteristics
- ✅ 2.1.1 Keyboard
- ✅ 2.1.2 No Keyboard Trap
- ✅ 2.4.1 Bypass Blocks
- ✅ 2.4.2 Page Titled
- ✅ 3.3.1 Error Identification
- ✅ 4.1.1 Parsing
- ✅ 4.1.2 Name, Role, Value

### Level AA
- ✅ 1.4.3 Contrast (Minimum)
- ✅ 1.4.4 Resize Text
- ✅ 2.4.6 Headings and Labels
- ✅ 2.4.7 Focus Visible
- ✅ 3.2.1 On Focus
- ✅ 3.2.2 On Input
- ✅ 3.3.2 Labels or Instructions

## 🚀 Continuous Improvement

Accessibility is an ongoing process. We regularly:
- Update dependencies for security and accessibility fixes
- Review and test new features for accessibility compliance
- Gather feedback from users with disabilities
- Stay current with accessibility best practices and guidelines

## 📞 Accessibility Feedback

If you encounter any accessibility barriers or have suggestions for improvement, please:
- Open an issue in the project repository
- Contact us through the website's contact form
- Email accessibility concerns directly

We are committed to making this website accessible to all users and welcome your feedback.

## 📚 Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Accessibility Resources](https://webaim.org/)
- [MDN Accessibility Documentation](https://developer.mozilla.org/en-US/docs/Web/Accessibility)
- [A11y Project Checklist](https://www.a11yproject.com/checklist/)
- [Color Contrast Analyzer](https://www.tpgi.com/color-contrast-checker/)

---

*This accessibility guide is a living document and will be updated as the website evolves and accessibility standards advance.*