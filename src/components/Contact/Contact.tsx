import { useCallback, useId, useRef, useState } from 'react';

import styles from './Contact.module.scss';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface ContactProps {
  /** Submit button label */
  buttonSendLabel?: React.ReactNode;
  /** Skip button label */
  buttonSkipLabel?: React.ReactNode;
  /** Descriptive text shown above the email input */
  subtext?: React.ReactNode;
  /** aria-label for the form itself */
  formLabel?: string;
  /** Label for the email input, used for both its visible label and aria-label */
  emailLabel?: string;
  /** Whether a previous submission is still pending. Disables Submit/Skip and ignores further submits. */
  isLoading?: boolean;
  /** Callback when the email is submitted (omitted when skipped) */
  onSubmit?: (email?: string) => void;
}

export const Contact: React.FC<ContactProps> = ({
  subtext,
  buttonSendLabel = 'Send',
  buttonSkipLabel = 'Skip',
  formLabel = 'Contact form',
  emailLabel = 'Email address',
  isLoading,
  onSubmit
}) => {
  const formId = useId();

  const [email, setEmail] = useState<string>('');
  const [isInvalid, setIsInvalid] = useState<boolean>(false);
  const emailInputRef = useRef<HTMLInputElement>(null);

  const onEmailKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>): void => {
    event.stopPropagation();
  }, []);

  const onEmailChange = useCallback((event: React.ChangeEvent<HTMLInputElement>): void => {
    setEmail(event.currentTarget.value);

    if (isInvalid) {
      setIsInvalid(false);
    }
  }, [isInvalid]);

  const onFormSubmit = useCallback((event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (isLoading) {
      return;
    }

    const value = email.trim();

    if (!value || !EMAIL_PATTERN.test(value)) {
      setIsInvalid(true);
      emailInputRef.current?.focus();
      return;
    }

    onSubmit?.(value);
  }, [
    email,
    isLoading,
    onSubmit
  ]);

  const onSkip = useCallback((): void => {
    if (isLoading) {
      return;
    }

    onSubmit?.(undefined);
  }, [
    isLoading,
    onSubmit
  ]);

  const inputId = `${formId}-contact-input`;

  return (
    <form
      aria-label={formLabel}
      className={styles.base}
      noValidate
      onSubmit={onFormSubmit}
    >
      <label
        htmlFor={inputId}
        className={styles.sr}
      >
        {emailLabel}
      </label>

      {!!subtext && (
        <div className={styles.subtext}>
          {subtext}
        </div>
      )}

      <input
        ref={emailInputRef}
        aria-label={emailLabel}
        aria-invalid={isInvalid}
        className={`${styles.input} ${isInvalid ? styles.invalid : ''}`}
        id={inputId}
        maxLength={254}
        name="email"
        placeholder="your@email.com"
        type="email"
        value={email}
        onChange={onEmailChange}
        onKeyDown={onEmailKeyDown}
      />

      <div className={styles.actions}>
        <button
          className={styles.skip}
          disabled={isLoading}
          type="button"
          onClick={onSkip}
        >
          {buttonSkipLabel}
        </button>

        <button
          className={styles.submit}
          disabled={isLoading}
          type="submit"
        >
          {buttonSendLabel}
        </button>
      </div>
    </form>
  );
};
