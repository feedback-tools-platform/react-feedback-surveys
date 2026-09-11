import { useId } from 'react';

import type {
  RootClassNames,
  SharedSurveyProps,
  SurveyAttachment,
  SurveyScreen
} from '../../types';
import { cn } from '../../utils';

import { Contact } from '../Contact';
import { Feedback } from '../Feedback';
import { Success } from '../Success';

import styles from './SurveyRoot.module.scss';

export interface SurveyRootProps {
  /** Survey content (rating visualization) */
  children: React.ReactNode;
  /** Additional CSS class name */
  className?: string;
  /** Optional classNames to customize internal parts */
  classNames?: RootClassNames;
  /** Text direction for RTL/LTR support */
  dir?: SharedSurveyProps['dir'];
  /** Main survey question */
  question?: SharedSurveyProps['question'];
  /** Follow-up feedback question */
  textQuestion?: SharedSurveyProps['textQuestion'];
  /** Submit button text */
  textButtonSendLabel?: SharedSurveyProps['textButtonSendLabel'];
  /** Skip button text */
  textButtonSkipLabel?: SharedSurveyProps['textButtonSkipLabel'];
  /** aria-label for the feedback step's form/region */
  feedbackFormLabel?: string;
  /** Type of feedback collection */
  responseType?: SharedSurveyProps['responseType']
  /** Disables skipping the feedback step and disables Send until there's something to submit. @default false */
  feedbackRequired?: boolean;
  /** Optional predefined choices for feedback */
  choiceOptions?: SharedSurveyProps['choiceOptions'];
  /** Label for the free-text input shown alongside choice checkboxes */
  additionalFeedbackLabel?: string;
  /** Label for the open-ended feedback textarea */
  yourFeedbackLabel?: string;
  /** Placeholder for the free-text input next to choice checkboxes */
  otherPlaceholder?: SharedSurveyProps['otherPlaceholder'];
  /** Enables an optional screenshot-attachment control on the feedback step */
  onCaptureScreenshot?: SharedSurveyProps['onCaptureScreenshot'];
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
  /** Success message text */
  thankYouMessage?: SharedSurveyProps['thankYouMessage'];
  /** aria-label for the contact step's form/region */
  contactFormLabel?: string;
  /** Question shown on the email collection screen */
  contactQuestion?: SharedSurveyProps['contactQuestion'];
  /** Descriptive text shown above the email input */
  contactSubtext?: SharedSurveyProps['contactSubtext'];
  /** Label for the email input on the email collection screen */
  emailLabel?: string;
  /** Submit button text for the email collection screen */
  contactButtonSendLabel?: SharedSurveyProps['contactButtonSendLabel'];
  /** Skip button text for the email collection screen */
  contactButtonSkipLabel?: SharedSurveyProps['contactButtonSkipLabel'];
  /** Current screen */
  screen: SurveyScreen;
  /** Whether a consumer callback for the current step is pending */
  isLoading?: boolean;
  /** Callback when feedback is submitted (omitted when skipped) */
  onFeedback?: (text?: string | string[], attachments?: SurveyAttachment[]) => void;
  /** Callback when contact is submitted (omitted when skipped) */
  onContact?: (email?: string) => void;
}

export const SurveyRoot: React.FC<SurveyRootProps> = ({
  children,
  className,
  classNames,
  dir,
  question,
  textQuestion,
  textButtonSendLabel,
  textButtonSkipLabel,
  feedbackFormLabel = 'Feedback form',
  responseType,
  feedbackRequired,
  choiceOptions,
  additionalFeedbackLabel,
  yourFeedbackLabel,
  otherPlaceholder,
  onCaptureScreenshot,
  screenshotButtonLabel,
  screenshotErrorMessage,
  attachmentOpenLabel,
  attachmentCaption,
  attachmentRemoveLabel,
  maxAttachments,
  thankYouMessage,
  contactFormLabel = 'Contact form',
  contactQuestion,
  contactSubtext,
  emailLabel,
  contactButtonSendLabel,
  contactButtonSkipLabel,
  screen,
  isLoading,
  onFeedback,
  onContact
}) => {
  const titleId = useId();

  return (
    <div
      className={cn(
        styles.base,
        className,
        classNames?.base,
        classNames?.[screen]
      )}
      dir={dir}
    >
      <div className={cn(styles.head, classNames?.head)}>
        <div
          aria-level={2}
          id={titleId}
          className={cn(styles.title, classNames?.title)}
          role="heading"
        >
          {(screen === 'rating') && question}
          {(screen === 'feedback') && textQuestion}
          {(screen === 'contact') && contactQuestion}
          {(screen === 'success') && thankYouMessage}
        </div>
      </div>

      {(screen === 'rating') && (
        <div
          aria-labelledby={titleId}
          className={cn(styles.body, classNames?.body)}
          role="region"
        >
          {children}
        </div>
      )}

      {(screen === 'feedback') && (
        <div
          aria-labelledby={titleId}
          className={cn(styles.body, classNames?.body)}
          role="region"
        >
          <Feedback
            buttonSendLabel={textButtonSendLabel}
            buttonSkipLabel={textButtonSkipLabel}
            formLabel={feedbackFormLabel}
            choiceOptions={choiceOptions}
            responseType={responseType}
            feedbackRequired={feedbackRequired}
            isLoading={isLoading}
            additionalFeedbackLabel={additionalFeedbackLabel}
            yourFeedbackLabel={yourFeedbackLabel}
            otherPlaceholder={otherPlaceholder}
            onCaptureScreenshot={onCaptureScreenshot}
            screenshotButtonLabel={screenshotButtonLabel}
            screenshotErrorMessage={screenshotErrorMessage}
            attachmentOpenLabel={attachmentOpenLabel}
            attachmentCaption={attachmentCaption}
            attachmentRemoveLabel={attachmentRemoveLabel}
            maxAttachments={maxAttachments}
            onSubmit={onFeedback}
          />
        </div>
      )}

      {(screen === 'contact') && (
        <div
          aria-labelledby={titleId}
          className={cn(styles.body, classNames?.body)}
          role="region"
        >
          <Contact
            buttonSendLabel={contactButtonSendLabel}
            buttonSkipLabel={contactButtonSkipLabel}
            formLabel={contactFormLabel}
            emailLabel={emailLabel}
            subtext={contactSubtext}
            isLoading={isLoading}
            onSubmit={onContact}
          />
        </div>
      )}

      {(screen === 'success') && (
        <div
          aria-atomic="true"
          aria-live="polite"
          aria-labelledby={titleId}
          className={cn(styles.body, classNames?.body)}
          tabIndex={-1}
          role="status"
        >
          <Success />
        </div>
      )}
    </div>
  );
};
