import type { AttachmentItem } from '../../hooks/useAttachments';
import { formatFileSize } from '../../utils/formatFileSize';

import styles from './Attachment.module.scss';

export interface AttachmentProps {
  attachment: AttachmentItem;
  /** aria-label for opening the thumbnail in a new tab. @default 'Open screenshot in a new tab' */
  openLabel?: string;
  /** Visible caption under the thumbnail, also used as the thumbnail image's alt text. @default 'Screenshot' */
  caption?: string;
  /** aria-label/title for the remove button. @default 'Remove screenshot' */
  removeLabel?: string;
  onRemove: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const Attachment: React.FC<AttachmentProps> = ({
  attachment,
  openLabel = 'Open screenshot in a new tab',
  caption = 'Screenshot',
  removeLabel = 'Remove screenshot',
  onRemove
}) => (
  <div className={styles.attachment}>
    <a
      aria-label={openLabel}
      className={styles.attachmentPreview}
      href={attachment.previewUrl}
      rel="noopener noreferrer"
      target="_blank"
    >
      <img
        alt={caption}
        className={styles.attachmentThumbnail}
        src={attachment.previewUrl}
      />

      <div className={styles.attachmentCaption}>
        <span className={styles.attachmentName}>
          {caption}
        </span>

        {(attachment.size !== undefined) && (
          <span className={styles.attachmentSize}>
            {formatFileSize(attachment.size)}
          </span>
        )}
      </div>
    </a>

    <button
      aria-label={removeLabel}
      className={styles.attachmentRemove}
      data-id={attachment.id}
      title={removeLabel}
      type="button"
      onClick={onRemove}
    />
  </div>
);
