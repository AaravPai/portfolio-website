import { lazy } from 'react';

export const LazyProjects = lazy(() => 
  import('../sections/Projects').then(module => ({ default: module.Projects }))
);