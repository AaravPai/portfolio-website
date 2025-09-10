# Projects Section

This directory contains the complete implementation of the projects showcase section for the portfolio website.

## Components

### ProjectCard
- **Purpose**: Individual project card component displaying project information
- **Features**:
  - Project image with hover overlay
  - Title, description, and technology tags
  - External links to live demo and source code
  - Keyboard navigation support
  - Responsive design
  - Accessibility compliant

### ProjectModal
- **Purpose**: Detailed project view in a modal dialog
- **Features**:
  - Full project details with long description
  - Technology list and project links
  - Focus management and keyboard navigation
  - Escape key and backdrop click to close
  - Body scroll prevention when open
  - Fully accessible with ARIA attributes

### Projects
- **Purpose**: Main projects section with grid layout and controls
- **Features**:
  - Responsive grid layout for project cards
  - Sorting options (featured first, title, newest)
  - Technology-based filtering
  - Project count display
  - Empty state with reset functionality
  - Modal integration for project details
  - Lazy loading support for images

## Data Structure

Projects are defined in `src/data/projects.ts` with the following interface:

```typescript
interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  technologies: string[];
  imageUrl: string;
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
}
```

## Styling

Each component has its own CSS file with:
- CSS custom properties for theming
- Responsive breakpoints
- Hover and focus states
- Accessibility considerations
- Animation support (with reduced motion respect)

## Testing

Comprehensive test coverage includes:
- Unit tests for individual components
- Integration tests for user workflows
- Accessibility testing
- Responsive behavior testing
- Modal interaction testing

## Usage

```tsx
import { Projects } from './components/sections/Projects';

function App() {
  return (
    <div>
      <Projects />
    </div>
  );
}
```

## Requirements Satisfied

This implementation satisfies the following requirements:
- **2.1**: Display grid/list of featured projects
- **2.2**: Show project title, description, technologies, and preview image
- **2.3**: Detailed project information display
- **2.4**: Live demo links when available
- **2.5**: Source code links when available
- **2.6**: Working links to deployed applications and repositories

## Accessibility Features

- Semantic HTML structure
- ARIA labels and descriptions
- Keyboard navigation support
- Focus management in modal
- Screen reader compatibility
- High contrast mode support
- Reduced motion support