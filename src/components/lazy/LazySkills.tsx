import { lazy } from 'react';

export const LazySkills = lazy(() => 
  import('../sections/Skills').then(module => ({ default: module.default }))
);