import { lazy } from 'react';

export const LazyContact = lazy(() => 
  import('../sections/Contact').then(module => ({ default: module.Contact }))
);