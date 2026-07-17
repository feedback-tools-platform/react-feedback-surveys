import { useCallback, useId, useState } from 'react';

import styles from './Contact.module.scss';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface ContactProps {
  /** Submit button label */
  buttonSendLabel?: React.ReactNode;
  /** Skip button label */
  buttonSkipLabel?: React.ReactNode;
  /** Descriptive text shown above the email input */
  subtext?: React.ReactNode;
  /** Callback when the email is submitted (omitted when skipped) */
  onSubmit?: (email?: string) => void;
}

export const Contact: React.FC<ContactProps> = ({
  subtext,
  buttonSendLabel = 'Send',
  buttonSkipLabel = 'Skip',
  onSubmit
}) => {
  const formId = useId();

  const [email, setEmail] = useState<string>('');
  const [isInvalid, setIsInvalid] = useState<boolean>(false);

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

    const value = email.trim();

    if (!value || !EMAIL_PATTERN.test(value)) {
      setIsInvalid(true);
      return;
    }

    onSubmit?.(value);
  }, [
    email,
    onSubmit
  ]);

  const onSkip = useCallback((): void => {
    onSubmit?.(undefined);
  }, [onSubmit]);

  const inputId = `${formId}-contact-input`;

  return (
    <form
      aria-label="Contact form"
      className={styles.base}
      noValidate
      onSubmit={onFormSubmit}
    >
      <label
        htmlFor={inputId}
        className={styles.sr}
      >
        Email address
      </label>

      {!!subtext && (
        <div className={styles.subtext}>
          {subtext}
        </div>
      )}

      <input
        aria-label="Email address"
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

      <button
        className={styles.submit}
        type="submit"
      >
        {buttonSendLabel}
      </button>

      <button
        className={styles.skip}
        type="button"
        onClick={onSkip}
      >
        {buttonSkipLabel}
      </button>
    </form>
  );
};
