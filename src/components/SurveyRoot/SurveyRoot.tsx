import { useId } from 'react';

import type {
  RootClassNames,
  SharedSurveyProps,
  SurveyScreen
} from '../../types';
import { cn } from '../../utils';

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
  /** Survey component name for CSS classes */
  name: string;
  /** Main survey question */
  mainQuestion?: SharedSurveyProps['mainQuestion'];
  /** Follow-up feedback question */
  feedbackQuestion?: SharedSurveyProps['feedbackQuestion'];
  /** Submit button text */
  feedbackButtonText?: SharedSurveyProps['feedbackButtonText'];
  /** Type of feedback collection */
  feedbackType?: SharedSurveyProps['feedbackType']
  /** Optional predefined choices for feedback */
  feedbackChoices?: SharedSurveyProps['feedbackChoices'];
  /** Success message text */
  successText?: SharedSurveyProps['successText'];
  /** Current screen */
  screen: SurveyScreen;
  /** Survey bottom content */
  footerComponent?: SharedSurveyProps['footerComponent'];
  /** Callback when feedback is submitted */
  onFeedback?: (comment: string | string[]) => void;
}

export const SurveyRoot: React.FC<SurveyRootProps> = ({
  children,
  className = '',
  mainQuestion,
  feedbackQuestion,
  feedbackButtonText,
  feedbackType,
  feedbackChoices,
  successText,
  screen,
  footerComponent,
  onFeedback,
  classNames
}) => {
  const titleId = useId();

  return (
    <div className={cn(styles.base, className, classNames?.base)}>
      <div className={cn(styles.head, classNames?.head)}>
        <div
          aria-level={2}
          id={titleId}
          className={cn(styles.title, classNames?.title)}
          role="heading"
        >
          {(screen === 'main') && mainQuestion}
          {(screen === 'feedback') && feedbackQuestion}
          {(screen === 'success') && successText}
        </div>
      </div>

      {(screen === 'main') && (
        <div
          aria-label="Rating selection"
          aria-labelledby={titleId}
          className={cn(styles.body, classNames?.body)}
          role="region"
        >
          {children}
        </div>
      )}

      {(screen === 'feedback') && (
        <div
          aria-label="Feedback form"
          aria-labelledby={titleId}
          className={cn(styles.body, classNames?.body)}
          role="region"
        >
          <Feedback
            buttonText={feedbackButtonText}
            feedbackChoices={feedbackChoices}
            feedbackType={feedbackType}
            onSubmit={onFeedback}
          />
        </div>
      )}

      {(screen === 'success') && (
        <div
          aria-atomic="true"
          aria-live="polite"
          aria-label={successText}
          aria-labelledby={titleId}
          className={cn(styles.body, classNames?.body)}
          tabIndex={-1}
          role="status"
        >
          <Success />
        </div>
      )}

      {footerComponent}
    </div>
  );
};
