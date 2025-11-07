import { useCallback, useId, useState } from 'react';

import { type SharedSurveyProps } from '../../types';

import styles from './Feedback.module.scss';

export interface FeedbackProps {
  /** Submit button text */
  buttonText?: React.ReactNode;
  /** Type of feedback collection */
  feedbackType?: SharedSurveyProps['feedbackType'];
  /** Optional predefined feedback choices */
  feedbackChoices?: SharedSurveyProps['feedbackChoices'];
  /** Callback when feedback is submitted */
  onSubmit?: (comment: string | string[]) => void;
}

export const Feedback: React.FC<FeedbackProps> = ({
  buttonText = 'Submit',
  feedbackType,
  feedbackChoices,
  onSubmit
}) => {
  const formId = useId();

  const [comment, setComment] = useState<string>('');
  const [selected, setSelected] = useState<string[]>([]);

  const onCommentKeyDown = useCallback((event: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>): void => {
    event.stopPropagation();
  }, []);

  const onCommentChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void => {
    setComment(event.currentTarget.value);
  }, []);

  const onChoiceChange = useCallback((event: React.ChangeEvent<HTMLInputElement>): void => {
    const { value, checked } = event.currentTarget;

    setSelected((prev) => {
      if (checked) {
        return [...prev, value];
      }

      return prev.filter((s) => s !== value);
    });
  }, []);

  const onFormSubmit = useCallback((event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const commentValue = comment.trim();

    if (feedbackType === 'choices') {
      onSubmit?.([...selected, commentValue].filter(Boolean));
      return;
    }

    onSubmit?.(comment.trim());
  }, [
    comment,
    feedbackType,
    selected,
    onSubmit
  ]);

  if (!feedbackType) {
    return null;
  }

  const textareaId = `${formId}-feedback-textarea`;
  const inputId = `${formId}-feedback-input`;
  const choicesId = `${formId}-feedback-choices`;

  return (
    <form
      className={styles.base}
      noValidate
      onSubmit={onFormSubmit}
      aria-label="Feedback form"
    >
      {(feedbackType === 'choices') && (
        <div
          id={choicesId}
          className={styles.choices}
        >
          {feedbackChoices?.map((choice) => (
            <div
              key={choice}
              className={styles.choice}
            >
              <label className={styles.label}>
                <input
                  className={styles.checkbox}
                  checked={selected.includes(choice)}
                  name="feedback"
                  type="checkbox"
                  value={choice}
                  onChange={onChoiceChange}
                  onKeyDown={onCommentKeyDown}
                  aria-label={choice}
                />

                <span className={styles.check} aria-hidden="true" />

                {choice}
              </label>
            </div>
          ))}
        </div>
      )}

      {(feedbackType === 'choices') && (
        <>
          <label
            htmlFor={inputId}
            className={styles.sr}
          >
            Additional feedback
          </label>

          <input
            id={inputId}
            name="feedback"
            value={comment}
            maxLength={1000}
            className={styles.input}
            placeholder="Other"
            onChange={onCommentChange}
            aria-label="Additional feedback"
            aria-describedby={choicesId}
          />
        </>
      )}

      {(feedbackType === 'text') && (
        <>
          <label
            htmlFor={textareaId}
            className={styles.sr}
          >
            Your feedback
          </label>

          <textarea
            aria-label="Your feedback"
            aria-required="true"
            className={styles.textarea}
            id={textareaId}
            maxLength={1000}
            name="feedback"
            rows={4}
            value={comment}
            onChange={onCommentChange}
            onKeyDown={onCommentKeyDown}
          />
        </>
      )}

      <button
        className={styles.submit}
        type="submit"
      >
        {buttonText}
      </button>
    </form>
  );
};
