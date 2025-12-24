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
  /** Text direction for RTL/LTR support */
  dir?: SharedSurveyProps['dir'];
  /** Main survey question */
  question?: SharedSurveyProps['question'];
  /** Follow-up feedback question */
  textQuestion?: SharedSurveyProps['textQuestion'];
  /** Submit button text */
  textButtonLabel?: SharedSurveyProps['textButtonLabel'];
  /** Type of feedback collection */
  responseType?: SharedSurveyProps['responseType']
  /** Optional predefined choices for feedback */
  choiceOptions?: SharedSurveyProps['choiceOptions'];
  /** Success message text */
  thankYouMessage?: SharedSurveyProps['thankYouMessage'];
  /** Current screen */
  screen: SurveyScreen;
  /** Callback when feedback is submitted */
  onFeedback?: (text: string | string[]) => void;
}

export const SurveyRoot: React.FC<SurveyRootProps> = ({
  children,
  className,
  classNames,
  dir,
  question,
  textQuestion,
  textButtonLabel,
  responseType,
  choiceOptions,
  thankYouMessage,
  screen,
  onFeedback
}) => {
  const titleId = useId();

  return (
    <div
      className={cn(styles.base, className, classNames?.base)}
      dir={dir}
    >
      <div className={cn(styles.head, classNames?.head)}>
        <div
          aria-level={2}
          id={titleId}
          className={cn(styles.title, classNames?.title)}
          role="heading"
        >
          {(screen === 'main') && question}
          {(screen === 'feedback') && textQuestion}
          {(screen === 'success') && thankYouMessage}
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
            buttonLabel={textButtonLabel}
            choiceOptions={choiceOptions}
            responseType={responseType}
            onSubmit={onFeedback}
          />
        </div>
      )}

      {(screen === 'success') && (
        <div
          aria-atomic="true"
          aria-live="polite"
          aria-label={thankYouMessage}
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
