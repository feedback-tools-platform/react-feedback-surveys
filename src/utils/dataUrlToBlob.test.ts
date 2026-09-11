import { describe, expect, it } from 'vitest';

import { dataUrlToBlob } from './dataUrlToBlob';

describe('dataUrlToBlob', () => {
  it('decodes a base64 body with a mime type', async () => {
    const blob = dataUrlToBlob(`data:text/plain;base64,${btoa('hello world')}`);

    expect(blob.type).toBe('text/plain');
    expect(blob.size).toBe('hello world'.length);
    expect(await blob.text()).toBe('hello world');
  });

  it('decodes a URI-encoded body without base64', async () => {
    const blob = dataUrlToBlob('data:text/plain,hello%20world');

    expect(blob.type).toBe('text/plain');
    expect(await blob.text()).toBe('hello world');
  });

  it('falls back to application/octet-stream when the mime type is missing', async () => {
    const blob = dataUrlToBlob('data:,plain');

    expect(blob.type).toBe('application/octet-stream');
    expect(await blob.text()).toBe('plain');
  });

  it('falls back to application/octet-stream for a base64 body with a missing mime type', async () => {
    const blob = dataUrlToBlob(`data:;base64,${btoa('x')}`);

    expect(blob.type).toBe('application/octet-stream');
    expect(await blob.text()).toBe('x');
  });

  it('handles a zero-byte base64 body', () => {
    const blob = dataUrlToBlob('data:image/png;base64,');

    expect(blob.type).toBe('image/png');
    expect(blob.size).toBe(0);
  });
});
