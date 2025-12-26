import React from 'react';

import { SurveyRoot } from '../../components/SurveyRoot';
import useSurveyState from '../../hooks/useSurveyState';
import type { SharedSurveyProps } from '../../types';
import { cn } from '../../utils';

import { CES7SurveyNumbers } from './CES7SurveyNumbers';

import styles from './CES7Survey.module.scss';

export interface CES7SurveyProps extends SharedSurveyProps {
  /** Visual style for the rating scale */
  scaleStyle: 'numbers'
}

export const CES7Survey: React.FC<CES7SurveyProps> = ({
  classNames,
  dir,
  scaleStyle,
  question,
  minLabel,
  maxLabel,
  textQuestion,
  textButtonLabel,
  responseType,
  choiceOptions,
  thankYouMessage,
  onScoreSubmit,
  onFeedbackSubmit
}) => {
  const {
    screen,
    onScoreChange,
    onFeedbackChange
  } = useSurveyState({
    responseType,
    onScoreSubmit,
    onFeedbackSubmit
  })

  return (
    <SurveyRoot
      className={styles.base}
      classNames={{
        ...classNames?.base,
        rating: cn(styles.rating, classNames?.base?.rating),
        feedback: cn(styles.feedback, classNames?.base?.feedback),
        success: cn(styles.success, classNames?.base?.success)
      }}
      dir={dir}
      screen={screen}
      question={question}
      textQuestion={textQuestion}
      textButtonLabel={textButtonLabel}
      responseType={responseType}
      choiceOptions={choiceOptions}
      thankYouMessage={thankYouMessage}
      onFeedback={onFeedbackChange}
    >
      {(scaleStyle === 'numbers') && (
        <CES7SurveyNumbers
          classNames={classNames?.scale}
          minLabel={minLabel}
          maxLabel={maxLabel}
          onChange={onScoreChange}
        />
      )}
    </SurveyRoot>
  );
};
