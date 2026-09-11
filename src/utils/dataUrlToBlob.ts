/**
 * Converts a `data:` URL into a `Blob`. Chrome refuses to open a `data:` URL
 * as a top-level navigation (e.g. via `target="_blank"`), so preview URLs
 * are always converted to `blob:` upfront to keep "open in a new tab" working.
 */
export const dataUrlToBlob = (dataUrl: string): Blob => {
  const [header, body = ''] = dataUrl.split(',');
  const mime = /^data:([^;]*)/.exec(header)?.[1] || 'application/octet-stream';

  if (header.includes(';base64')) {
    const binary = atob(body);
    const bytes = new Uint8Array(binary.length);

    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }

    return new Blob([bytes], { type: mime });
  }

  return new Blob([decodeURIComponent(body)], { type: mime });
};
