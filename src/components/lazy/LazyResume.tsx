import { lazy } from 'react';

export const LazyResume = lazy(() => 
  import('../sections/Resume').then(module => ({ default: module.Resume }))
);