import { useCallback, useId, useState } from 'react';

import { type SharedSurveyProps } from '../../types';

import styles from './Feedback.module.scss';

export interface FeedbackProps {
  /** Submit button label */
  buttonLabel?: React.ReactNode;
  /** Type of feedback collection */
  responseType?: SharedSurveyProps['responseType'];
  /** Optional predefined feedback choices */
  choiceOptions?: SharedSurveyProps['choiceOptions'];
  /** Callback when feedback is submitted */
  onSubmit?: (text: string | string[]) => void;
}

export const Feedback: React.FC<FeedbackProps> = ({
  buttonLabel = 'Submit',
  responseType,
  choiceOptions,
  onSubmit
}) => {
  const formId = useId();

  const [text, setText] = useState<string>('');
  const [selected, setSelected] = useState<string[]>([]);
  const [isInvalid, setIsInvalid] = useState<boolean>(false);

  const onTextKeyDown = useCallback((event: React.KeyboardEvent<HTMLTextAreaElement | HTMLInputElement>): void => {
    event.stopPropagation();
  }, []);

  const onTextChange = useCallback((event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void => {
    setText(event.currentTarget.value);

    if (isInvalid) {
      setIsInvalid(false);
    }
  }, [isInvalid]);

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

    const textValue = text.trim();

    if (responseType === 'choices') {
      onSubmit?.([...selected, textValue].filter(Boolean));
      return;
    }

    if (responseType === 'text' && !textValue) {
      setIsInvalid(true);
      return;
    }

    onSubmit?.(text.trim());
  }, [
    text,
    responseType,
    selected,
    onSubmit
  ]);

  if (!responseType) {
    return null;
  }

  const textareaId = `${formId}-feedback-textarea`;
  const inputId = `${formId}-feedback-input`;
  const choicesId = `${formId}-feedback-choices`;

  return (
    <form
      aria-label="Feedback form"
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
        <>
          <label
            htmlFor={inputId}
            className={styles.sr}
          >
            Additional feedback
          </label>

          <input
            aria-label="Additional feedback"
            aria-describedby={choicesId}
            className={styles.input}
            id={inputId}
            maxLength={1000}
            name="feedback"
            placeholder="Other"
            value={text}
            onChange={onTextChange}
          />
        </>
      )}

      {(responseType === 'text') && (
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
            aria-invalid={isInvalid}
            className={`${styles.textarea} ${isInvalid ? styles.invalid : ''}`}
            id={textareaId}
            maxLength={1000}
            name="feedback"
            rows={4}
            value={text}
            onChange={onTextChange}
            onKeyDown={onTextKeyDown}
          />
        </>
      )}

      <button
        className={styles.submit}
        type="submit"
      >
        {buttonLabel}
      </button>
    </form>
  );
};
