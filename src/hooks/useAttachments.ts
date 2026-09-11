import { useCallback, useEffect, useRef, useState } from 'react';

import type { SurveyAttachment } from '../types';
import { dataUrlToBlob } from '../utils/dataUrlToBlob';

export interface AttachmentItem {
  /** Stable id for React keys and removal, local to this form instance */
  id: string;
  /** Discriminates the *source* that produced this attachment (screenshot today, more later) */
  kind: SurveyAttachment['kind'];
  /** Raw attachment data, as returned by the capture function */
  data: string | Blob;
  /** Always-renderable preview URL — a `blob:` URL when `data` needed one created */
  previewUrl: string;
  /** MIME type, when it could be determined — decides image vs generic preview, independent of `kind` */
  mimeType?: string;
  /** Original filename, when known (e.g. from a native `File`) */
  name?: string;
  /** Size in bytes, when known (unavailable when `data` is an already-hosted URL string) */
  size?: number;
}

/**
 * Manages the list of screenshot attachments confirmed on a feedback form, all through
 * `addAttachment`/`removeAttachment`.
 */
const useAttachments = () => {
  const [attachments, setAttachments] = useState<AttachmentItem[]>([]);

  const nextIdRef = useRef<number>(0);
  const objectUrlsRef = useRef<Set<string>>(new Set());

  const releaseObjectUrl = useCallback((url: string): void => {
    if (objectUrlsRef.current.has(url)) {
      URL.revokeObjectURL(url);
      objectUrlsRef.current.delete(url);
    }
  }, []);

  useEffect(() => () => {
    objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    objectUrlsRef.current.clear();
  }, []);

  const addAttachment = useCallback((data: string | Blob): void => {
    let previewUrl: string;
    let mimeType: string | undefined;
    let name: string | undefined;
    let size: number | undefined;

    if (typeof data === 'string' && !data.startsWith('data:')) {
      // An already-hosted URL string — mime/name/size aren't knowable from it alone.
      previewUrl = data;
    } else {
      const blob = (typeof data === 'string') ? dataUrlToBlob(data) : data;

      mimeType = blob.type || undefined;
      name = (typeof File !== 'undefined' && data instanceof File) ? data.name : undefined;
      size = blob.size;
      previewUrl = URL.createObjectURL(blob);
      objectUrlsRef.current.add(previewUrl);
    }

    const id = String(nextIdRef.current++);

    setAttachments((prev) => [...prev, {
      id,
      kind: 'screenshot',
      data,
      previewUrl,
      mimeType,
      name,
      size
    }]);
  }, []);

  const removeAttachment = useCallback((id: string): void => {
    setAttachments((prev) => {
      const item = prev.find((a) => a.id === id);

      if (item) {
        releaseObjectUrl(item.previewUrl);
      }

      return prev.filter((a) => a.id !== id);
    });
  }, [releaseObjectUrl]);

  const toSurveyAttachments = useCallback((): SurveyAttachment[] | undefined => {
    if (!attachments.length) {
      return undefined;
    }

    return attachments.map(({ kind, data, name, mimeType, size }) => ({ kind, data, name, mimeType, size }));
  }, [attachments]);

  return {
    attachments,
    addAttachment,
    removeAttachment,
    toSurveyAttachments
  };
};

export default useAttachments;
