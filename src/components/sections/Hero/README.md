# Hero Component

The Hero component is the main landing section of the portfolio website, featuring an engaging introduction with animated text, professional photo, and call-to-action buttons.

## Features

### ✨ Animations
- **Loading animations**: Smooth fade-in effects for all elements
- **Text cycling**: Animated rotation through different professional titles
- **Typing cursor effect**: Blinking cursor animation on animated text
- **Floating decorations**: Subtle floating animation for visual elements
- **Scroll indicator**: Bouncing arrow animation to encourage scrolling

### 🖼️ Optimized Image Loading
- **Skeleton loading**: Shows placeholder while image loads
- **Fallback support**: Automatically generates avatar if image fails
- **Performance optimized**: Eager loading for above-the-fold content
- **Responsive sizing**: Adapts to different screen sizes

### 📱 Responsive Design
- **Mobile-first approach**: Optimized for all device sizes
- **Touch-friendly**: Proper button sizes and spacing for mobile
- **Flexible layout**: Grid layout that adapts to screen size
- **Typography scaling**: Fluid typography using clamp()

### ♿ Accessibility
- **Semantic HTML**: Proper heading hierarchy and landmarks
- **ARIA labels**: Descriptive labels for all interactive elements
- **Keyboard navigation**: Full keyboard support
- **Screen reader support**: Proper alt text and descriptions
- **Reduced motion**: Respects user's motion preferences

### ⚡ Performance
- **Optimized animations**: CSS-based animations for better performance
- **Memoized callbacks**: Prevents unnecessary re-renders
- **Lazy evaluation**: Efficient text cycling implementation
- **Minimal re-renders**: Optimized state management

## Usage

```tsx
import Hero from './components/sections/Hero';

function App() {
  return (
    <div>
      <Hero />
      {/* Other sections */}
    </div>
  );
}
```

### With custom className

```tsx
<Hero className="custom-hero-styles" />
```

## Customization

### Animated Texts
The animated texts can be customized by modifying the `animatedTexts` array in the component:

```tsx
const animatedTexts = useMemo(() => [
  'Full Stack Developer',
  'React Specialist',
  'Problem Solver',
  'Tech Enthusiast'
], []);
```

### Personal Information
The component automatically pulls personal information from `src/data/resume.ts`:

```tsx
export const personalInfo = {
  name: 'Your Name',
  title: 'Full Stack Developer',
  // ... other fields
};
```

### Profile Image
Place your professional headshot as `profile-photo.jpg` in the `public/images/` directory. The component will automatically fall back to a generated avatar if the image is not found.

## Smooth Scrolling

The Hero component includes smooth scrolling functionality for all call-to-action buttons:

- **View My Work**: Scrolls to `#projects` section
- **Get In Touch**: Scrolls to `#contact` section  
- **Download Resume**: Scrolls to `#resume` section
- **Scroll indicator**: Scrolls to `#about` section

## CSS Classes

### Main Classes
- `.hero`: Main hero section container
- `.hero--loaded`: Applied after loading animation completes
- `.hero__container`: Content wrapper with max-width
- `.hero__content`: Grid layout container

### Text Elements
- `.hero__name`: Main name heading
- `.hero__greeting`: "Hello, I'm" text
- `.hero__name-text`: Name with gradient effect
- `.hero__title-animated`: Cycling animated text
- `.hero__description`: Introduction paragraph

### Interactive Elements
- `.hero__cta`: Base button styles
- `.hero__cta--primary`: Primary action button
- `.hero__cta--secondary`: Secondary action button
- `.hero__cta--outline`: Outline style button

### Image Elements
- `.hero__image-wrapper`: Image container
- `.hero__image`: Profile image
- `.hero__image-decoration`: Floating decoration
- `.hero-image-skeleton`: Loading skeleton

## Testing

The Hero component includes comprehensive tests covering:

- ✅ Rendering and content display
- ✅ Animation functionality
- ✅ Button interactions and smooth scrolling
- ✅ Image loading and error handling
- ✅ Accessibility features
- ✅ Responsive behavior
- ✅ Performance optimizations

Run tests with:
```bash
npm test Hero.test.tsx
```

## Browser Support

- ✅ Modern browsers (Chrome, Firefox, Safari, Edge)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)
- ✅ Graceful degradation for older browsers
- ✅ Reduced motion support for accessibility