# Skills Component

A responsive skills showcase component that displays technical skills organized by categories with visual proficiency indicators.

## Features

- **Categorized Display**: Skills are automatically grouped into Frontend, Backend, Tools, and Other categories
- **Visual Proficiency**: Progress bars show skill proficiency levels (1-5 scale)
- **Responsive Design**: Adapts to different screen sizes with mobile-first approach
- **Smooth Animations**: Staggered animations for section reveals and progress bar fills
- **Accessibility**: Full keyboard navigation and screen reader support
- **Theme Support**: Works with light/dark theme system

## Usage

```tsx
import Skills from './components/sections/Skills';

function App() {
  return (
    <div>
      <Skills />
    </div>
  );
}
```

## Data Structure

Skills are loaded from `src/data/skills.ts` and should follow this interface:

```typescript
interface Skill {
  name: string;
  category: 'frontend' | 'backend' | 'tools' | 'other';
  proficiency: 1 | 2 | 3 | 4 | 5;
  icon?: string; // Optional, for future icon support
}
```

## Styling

The component uses CSS custom properties for theming:
- `--bg-primary`: Main background color
- `--bg-secondary`: Section background color
- `--text-primary`: Primary text color
- `--text-secondary`: Secondary text color
- `--accent-primary`: Primary accent color
- `--accent-secondary`: Secondary accent color
- `--border-color`: Border color
- `--shadow`: Box shadow color

## Animations

- **Fade In Up**: Title and subtitle animate in from bottom
- **Slide In Left**: Individual skill items slide in from left
- **Progress Fill**: Skill bars animate to their target width
- **Shimmer Effect**: Subtle shimmer animation on progress bars
- **Hover Effects**: Category cards lift on hover

## Responsive Breakpoints

- **Mobile (≤480px)**: Single column, reduced padding
- **Tablet (≤768px)**: Single column, adjusted spacing
- **Desktop (>768px)**: Multi-column grid layout

## Accessibility Features

- Semantic HTML structure with proper heading hierarchy
- ARIA labels for section identification
- Keyboard navigation support
- Screen reader compatible
- Respects `prefers-reduced-motion` setting
- High contrast mode support

## Testing

Comprehensive test suite covers:
- Component rendering and structure
- Skill categorization and grouping
- Progress bar calculations
- Accessibility attributes
- Responsive design classes
- Animation and styling classes

Run tests with:
```bash
npm test Skills.test.tsx
```