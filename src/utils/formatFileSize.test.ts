import { describe, expect, it } from 'vitest';

import { formatFileSize } from './formatFileSize';

describe('formatFileSize', () => {
  it('formats zero bytes', () => {
    expect(formatFileSize(0)).toBe('0 B');
  });

  it('formats sizes just below one kilobyte', () => {
    expect(formatFileSize(1023)).toBe('1023 B');
  });

  it('formats exactly one kilobyte', () => {
    expect(formatFileSize(1024)).toBe('1.0 KB');
  });

  it('drops the decimal for double-digit kilobytes', () => {
    expect(formatFileSize(15 * 1024)).toBe('15 KB');
  });

  it('formats exactly one megabyte', () => {
    expect(formatFileSize(1024 * 1024)).toBe('1.0 MB');
  });

  it('formats exactly five gigabytes', () => {
    expect(formatFileSize(5 * 1024 * 1024 * 1024)).toBe('5.0 GB');
  });

  // There's no TB unit — sizes past GB stay expressed in GB rather than
  // growing another unit, which is the current (intentional-or-not) cap.
  it('stays capped at gigabytes beyond one gigabyte', () => {
    const twoTerabytes = 2048 * 1024 * 1024 * 1024;

    expect(formatFileSize(twoTerabytes)).toBe('2048 GB');
  });
});
