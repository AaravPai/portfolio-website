import { describe, it, expect } from 'vitest';
import { ResumeDownload } from './ResumeDownload';

describe('ResumeDownload', () => {
  it('component exports correctly', () => {
    expect(ResumeDownload).toBeDefined();
    expect(typeof ResumeDownload).toBe('function');
  });

  it('component has correct display name', () => {
    expect(ResumeDownload.name).toBe('ResumeDownload');
  });
});