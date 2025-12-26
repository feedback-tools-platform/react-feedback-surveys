import React from 'react';

import { SurveyRoot } from '../../components/SurveyRoot';
import useSurveyState from '../../hooks/useSurveyState';
import type { SharedSurveyProps } from '../../types';

import { CSAT5SurveyEmoji } from './CSAT5SurveyEmoji';
import { CSAT5SurveyNumbers } from './CSAT5SurveyNumbers';
import { CSAT5SurveyStars } from './CSAT5SurveyStars';

import styles from './CSAT5Survey.module.scss';
import { cn } from '../../utils';

export interface CSAT5SurveyProps extends SharedSurveyProps {
  /** Visual style for the rating scale */
  scaleStyle: 'emoji' | 'numbers' | 'stars';
}

export const CSAT5Survey: React.FC<CSAT5SurveyProps> = ({
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
      {(scaleStyle === 'emoji') && (
        <CSAT5SurveyEmoji
          classNames={classNames?.scale}
          minLabel={minLabel}
          maxLabel={maxLabel}
          onChange={onScoreChange}
        />
      )}

      {(scaleStyle === 'numbers') && (
        <CSAT5SurveyNumbers
          classNames={classNames?.scale}
          minLabel={minLabel}
          maxLabel={maxLabel}
          onChange={onScoreChange}
        />
      )}

      {(scaleStyle === 'stars') && (
        <CSAT5SurveyStars
          classNames={classNames?.scale}
          minLabel={minLabel}
          maxLabel={maxLabel}
          onChange={onScoreChange}
        />
      )}
    </SurveyRoot>
  );
};
