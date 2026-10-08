import { useCallback, useId, useRef, useState } from 'react';

import useAttachments from '../../hooks/useAttachments';
import { type FormClassNames, type SharedSurveyProps, type SurveyAttachment } from '../../types';
import { cn } from '../../utils';

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
  /** Disables skipping and requires text or a choice — an attachment alone isn't enough. @default false */
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
  /** aria-label for the screenshot control while a capture is in progress */
  screenshotProcessingLabel?: string;
  /** aria-label/title for hiding the screenshot capture error */
  screenshotErrorDismissLabel?: string;
  /** Maximum number of attachments a respondent may confirm, across every attachment source */
  maxAttachments?: SharedSurveyProps['maxAttachments'];
  /** Enables an optional screenshot-attachment control */
  onCaptureScreenshot?: SharedSurveyProps['onCaptureScreenshot'];
  /** Optional classNames to customize form parts */
  classNames?: FormClassNames;
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
  screenshotProcessingLabel = 'Capturing screenshot…',
  screenshotErrorDismissLabel = 'Dismiss error',
  maxAttachments = 1,
  classNames,
  onSubmit
}) => {
  const formId = useId();

  const [text, setText] = useState<string>('');
  const [selected, setSelected] = useState<string[]>([]);
  const [isTextInvalid, setIsTextInvalid] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { attachments, addAttachment, removeAttachment, toSurveyAttachments } = useAttachments();
  const [isProcessingAttachment, setIsProcessingAttachment] = useState<boolean>(false);
  const [hasAttachmentError, setHasAttachmentError] = useState<boolean>(false);

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
    setHasAttachmentError(false);

    try {
      const data = await onCaptureScreenshot();

      if (typeof data !== 'string' && !(data instanceof Blob)) {
        throw new Error('onCaptureScreenshot must return a string or a Blob');
      }

      addAttachment(data);
    } catch {
      setHasAttachmentError(true);
    } finally {
      setIsProcessingAttachment(false);
    }
  }, [onCaptureScreenshot, addAttachment]);

  const onAttachmentErrorDismiss = useCallback((): void => {
    setHasAttachmentError(false);
  }, []);

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
      if (feedbackRequired && !selected.length && !textValue) {
        return;
      }

      const choices = [...selected, textValue].filter(Boolean);

      onSubmit?.(choices.length ? choices : undefined, surveyAttachments);
      return;
    }

    if (feedbackRequired && !textValue) {
      setIsTextInvalid(true);
      textareaRef.current?.focus();
      return;
    }

    onSubmit?.(textValue || undefined, surveyAttachments);
  }, [
    text,
    responseType,
    feedbackRequired,
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
  // A required `text` step still unlocks Submit for an attachment alone, so the click can flag the empty field.
  const attachmentUnlocksSubmit = !feedbackRequired || responseType === 'text';
  const hasContent = !!text.trim() || !!selected.length || (attachmentUnlocksSubmit && !!attachments.length);

  const attachTriggers = !!onCaptureScreenshot && canAddAttachment && (
    <div className={styles.attachTriggers}>
      <button
        aria-busy={isProcessingAttachment}
        aria-label={isProcessingAttachment ? screenshotProcessingLabel : screenshotButtonLabel}
        className={cn(styles.attachTrigger, classNames?.attachButton)}
        disabled={isProcessingAttachment}
        type="button"
        onClick={onScreenshotCapture}
      >
        {isProcessingAttachment ? (
          <span
            aria-hidden="true"
            className={styles.spinner}
          />
        ) : (
          <ScreenshotIcon
            width={16}
            height={16}
          />
        )}
      </button>
    </div>
  );

  return (
    <form
      aria-label={formLabel}
      className={cn(styles.base, classNames?.base)}
      noValidate
      onSubmit={onFormSubmit}
    >
      {(responseType === 'choices') && (
        <div
          className={cn(styles.choices, classNames?.choices)}
          id={choicesId}
        >
          {choiceOptions?.map((choice) => (
            <div
              key={choice}
              className={styles.choice}
            >
              <label className={cn(styles.label, classNames?.choice)}>
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

                <span
                  aria-hidden="true"
                  className={cn(styles.check, classNames?.check)}
                />

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
            className={cn(styles.input, classNames?.field)}
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
            className={cn(styles.textarea, isTextInvalid && styles.invalid, classNames?.field)}
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

      {!!onCaptureScreenshot && (!!attachments.length || hasAttachmentError) && (
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
                  className={classNames?.attachment}
                  removeClassName={classNames?.attachmentRemove}
                  onRemove={onAttachmentRemoveClick}
                />
              ))}
            </div>
          )}

          {hasAttachmentError && (
            <div className={styles.attachmentError}>
              <span role="alert">
                {screenshotErrorMessage}
              </span>

              <button
                aria-label={screenshotErrorDismissLabel}
                className={cn(styles.attachmentErrorDismiss, classNames?.attachmentRemove)}
                title={screenshotErrorDismissLabel}
                type="button"
                onClick={onAttachmentErrorDismiss}
              />
            </div>
          )}
        </div>
      )}

      <div className={cn(styles.actions, classNames?.actions)}>
        {!feedbackRequired && (
          <button
            className={cn(styles.skip, classNames?.skip)}
            // An attachment must be explicitly submitted or removed — never silently discarded via Skip.
            disabled={isLoading || !!attachments.length}
            type="button"
            onClick={onSkip}
          >
            {buttonSkipLabel}
          </button>
        )}

        <button
          className={cn(styles.submit, classNames?.submit)}
          disabled={isLoading || isProcessingAttachment || !hasContent}
          type="submit"
        >
          {buttonSendLabel}
        </button>
      </div>
    </form>
  );
};
