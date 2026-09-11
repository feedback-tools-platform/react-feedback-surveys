import { useCallback, useId, useRef, useState } from 'react';

import useAttachments from '../../hooks/useAttachments';
import { type SharedSurveyProps, type SurveyAttachment } from '../../types';

import ScreenshotIcon from '../../icons/screenshot.svg';

import { Attachment } from '../Attachment';

import styles from './Feedback.module.scss';

export interface FeedbackProps {
  /** Submit button label */
  buttonSendLabel?: React.ReactNode;
  /** Skip button label */
  buttonSkipLabel?: React.ReactNode;
  /** aria-label for the form itself */
  formLabel?: string;
  /** Type of feedback collection */
  responseType?: SharedSurveyProps['responseType'];
  /** Disables skipping and disables Send until there's something to submit. @default false */
  feedbackRequired?: boolean;
  /** Whether a previous submission is still pending. Disables Submit/Skip and ignores further submits. */
  isLoading?: boolean;
  /** Optional predefined feedback choices */
  choiceOptions?: SharedSurveyProps['choiceOptions'];
  /** Label for the free-text input shown alongside choice checkboxes */
  additionalFeedbackLabel?: string;
  /** Label for the open-ended feedback textarea */
  yourFeedbackLabel?: string;
  /** Placeholder for the free-text input next to choice checkboxes */
  otherPlaceholder?: SharedSurveyProps['otherPlaceholder'];
  /** Label for the screenshot-attachment control */
  screenshotButtonLabel?: SharedSurveyProps['screenshotButtonLabel'];
  /** Shown to the respondent when `onCaptureScreenshot` fails */
  screenshotErrorMessage?: SharedSurveyProps['screenshotErrorMessage'];
  /** aria-label for opening an attachment thumbnail in a new tab */
  attachmentOpenLabel?: string;
  /** Visible caption under an attachment thumbnail, also used as its image alt text */
  attachmentCaption?: SharedSurveyProps['attachmentCaption'];
  /** aria-label/title for removing an attachment */
  attachmentRemoveLabel?: string;
  /** Maximum number of attachments a respondent may confirm, across every attachment source */
  maxAttachments?: SharedSurveyProps['maxAttachments'];
  /** Enables an optional screenshot-attachment control */
  onCaptureScreenshot?: SharedSurveyProps['onCaptureScreenshot'];
  /** Callback when feedback is submitted (omitted when skipped) */
  onSubmit?: (text?: string | string[], attachments?: SurveyAttachment[]) => void;
}

export const Feedback: React.FC<FeedbackProps> = ({
  buttonSendLabel = 'Submit',
  buttonSkipLabel = 'Skip',
  formLabel = 'Feedback form',
  responseType,
  feedbackRequired,
  isLoading,
  choiceOptions,
  additionalFeedbackLabel = 'Additional feedback',
  yourFeedbackLabel = 'Your feedback',
  otherPlaceholder = 'Other',
  onCaptureScreenshot,
  screenshotButtonLabel = 'Capture screenshot',
  screenshotErrorMessage = 'Failed to capture screenshot',
  attachmentOpenLabel,
  attachmentCaption,
  attachmentRemoveLabel,
  maxAttachments = 1,
  onSubmit
}) => {
  const formId = useId();

  const [text, setText] = useState<string>('');
  const [selected, setSelected] = useState<string[]>([]);
  const [isTextInvalid, setIsTextInvalid] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { attachments, addAttachment, removeAttachment, toSurveyAttachments } = useAttachments();
  const [isProcessingAttachment, setIsProcessingAttachment] = useState<boolean>(false);
  const [attachmentError, setAttachmentError] = useState<Error | null>(null);

  const onTextKeyDown = useCallback((event: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>): void => {
    event.stopPropagation();
  }, []);

  const onTextChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void => {
    setText(event.currentTarget.value);

    if (isTextInvalid) {
      setIsTextInvalid(false);
    }
  }, [isTextInvalid]);

  const onChoiceChange = useCallback((event: React.ChangeEvent<HTMLInputElement>): void => {
    const { value, checked } = event.currentTarget;

    setSelected((prev) => {
      if (checked) {
        return [...prev, value];
      }

      return prev.filter((s) => s !== value);
    });
  }, []);

  const onScreenshotCapture = useCallback(async (): Promise<void> => {
    if (!onCaptureScreenshot) {
      return;
    }

    setIsProcessingAttachment(true);
    setAttachmentError(null);

    try {
      const data = await onCaptureScreenshot();

      if (typeof data !== 'string' && !(data instanceof Blob)) {
        throw new Error('onCaptureScreenshot must return a string or a Blob');
      }

      addAttachment(data);
    } catch (err) {
      setAttachmentError(err instanceof Error ? err : new Error(screenshotErrorMessage));
    } finally {
      setIsProcessingAttachment(false);
    }
  }, [onCaptureScreenshot, addAttachment, screenshotErrorMessage]);

  const onAttachmentRemoveClick = useCallback((event: React.MouseEvent<HTMLButtonElement>): void => {
    const { id } = event.currentTarget.dataset;

    if (id) {
      removeAttachment(id);
    }

    if (isTextInvalid) {
      setIsTextInvalid(false);
    }
  }, [removeAttachment, isTextInvalid]);

  const onFormSubmit = useCallback((event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    // Guards the disabled Send button against an Enter-key implicit submit slipping through,
    // and against a second submit landing while the previous one is still pending.
    if (isLoading) {
      return;
    }

    const textValue = text.trim();
    const surveyAttachments = toSurveyAttachments();

    // Nothing at all to submit — mirrors the disabled Submit button; Skip covers this case.
    if (!textValue && !selected.length && !surveyAttachments?.length) {
      return;
    }

    if (responseType === 'choices') {
      // An attachment alone isn't feedback for `choices` — needs a selected option or text.
      if (!selected.length && !textValue) {
        return;
      }

      onSubmit?.([...selected, textValue].filter(Boolean), surveyAttachments);
      return;
    }

    // An attachment alone isn't feedback for `text` — flag the field instead of submitting.
    if (!textValue) {
      setIsTextInvalid(true);
      textareaRef.current?.focus();
      return;
    }

    onSubmit?.(textValue, surveyAttachments);
  }, [
    text,
    responseType,
    isLoading,
    selected,
    toSurveyAttachments,
    onSubmit
  ]);

  const onSkip = useCallback((): void => {
    if (isLoading || attachments.length) {
      return;
    }

    onSubmit?.(undefined);
  }, [
    isLoading,
    attachments.length,
    onSubmit
  ]);

  if (!responseType) {
    return null;
  }

  const textareaId = `${formId}-feedback-textarea`;
  const inputId = `${formId}-feedback-input`;
  const choicesId = `${formId}-feedback-choices`;
  const canAddAttachment = attachments.length < maxAttachments;
  const hasChoiceOrTextContent = !!text.trim() || !!selected.length;
  // For `choices`, an attachment alone never unlocks Submit — a choice or text is required, and
  // the button just stays disabled. For `text`, an attachment alone does unlock it, but
  // submitting without text is caught below and flags the field instead.
  const hasContent = responseType === 'choices' ? hasChoiceOrTextContent : (hasChoiceOrTextContent || !!attachments.length);

  const attachTriggers = !!onCaptureScreenshot && canAddAttachment && (
    <div className={styles.attachTriggers}>
      <button
        aria-label={isProcessingAttachment ? 'Processing…' : screenshotButtonLabel}
        className={styles.attachTrigger}
        disabled={isProcessingAttachment}
        type="button"
        onClick={onScreenshotCapture}
      >
        <ScreenshotIcon
          width={16}
          height={16}
        />
      </button>
    </div>
  );

  return (
    <form
      aria-label={formLabel}
      className={styles.base}
      noValidate
      onSubmit={onFormSubmit}
    >
      {(responseType === 'choices') && (
        <div
          className={styles.choices}
          id={choicesId}
        >
          {choiceOptions?.map((choice) => (
            <div
              key={choice}
              className={styles.choice}
            >
              <label className={styles.label}>
                <input
                  aria-label={choice}
                  className={styles.checkbox}
                  checked={selected.includes(choice)}
                  name="feedback"
                  type="checkbox"
                  value={choice}
                  onChange={onChoiceChange}
                  onKeyDown={onTextKeyDown}
                />

                <span className={styles.check} aria-hidden="true" />

                {choice}
              </label>
            </div>
          ))}
        </div>
      )}

      {(responseType === 'choices') && (
        <div className={styles.fieldWrapper}>
          <label
            htmlFor={inputId}
            className={styles.sr}
          >
            {additionalFeedbackLabel}
          </label>

          <input
            aria-label={additionalFeedbackLabel}
            aria-describedby={choicesId}
            className={styles.input}
            id={inputId}
            maxLength={1000}
            name="feedback"
            placeholder={otherPlaceholder}
            value={text}
            onChange={onTextChange}
          />

          {attachTriggers}
        </div>
      )}

      {(responseType === 'text') && (
        <div className={styles.fieldWrapper}>
          <label
            htmlFor={textareaId}
            className={styles.sr}
          >
            {yourFeedbackLabel}
          </label>

          <textarea
            ref={textareaRef}
            aria-label={yourFeedbackLabel}
            aria-invalid={isTextInvalid}
            className={`${styles.textarea} ${isTextInvalid ? styles.invalid : ''}`}
            id={textareaId}
            maxLength={1000}
            name="feedback"
            rows={4}
            value={text}
            onChange={onTextChange}
            onKeyDown={onTextKeyDown}
          />

          {attachTriggers}
        </div>
      )}

      {!!onCaptureScreenshot && (!!attachments.length || !!attachmentError) && (
        <div className={styles.attachments}>
          {!!attachments.length && (
            <div className={styles.attachmentList}>
              {attachments.map((attachment) => (
                <Attachment
                  key={attachment.id}
                  attachment={attachment}
                  caption={attachmentCaption}
                  openLabel={attachmentOpenLabel}
                  removeLabel={attachmentRemoveLabel}
                  onRemove={onAttachmentRemoveClick}
                />
              ))}
            </div>
          )}

          {!!attachmentError && (
            <div
              className={styles.attachmentError}
              role="alert"
            >
              {attachmentError.message}
            </div>
          )}
        </div>
      )}

      <div className={styles.actions}>
        {!feedbackRequired && (
          <button
            className={styles.skip}
            // An attachment must be explicitly submitted or removed — never silently discarded via Skip.
            disabled={isLoading || !!attachments.length}
            type="button"
            onClick={onSkip}
          >
            {buttonSkipLabel}
          </button>
        )}

        <button
          className={styles.submit}
          disabled={isLoading || isProcessingAttachment || !hasContent}
          type="submit"
        >
          {buttonSendLabel}
        </button>
      </div>
    </form>
  );
};
