import React from 'react';

import { SurveyRoot } from '../../components/SurveyRoot';
import useSurveyState from '../../hooks/useSurveyState';
import type { SharedSurveyProps } from '../../types';

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
      classNames={classNames?.base}
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
          labelLeft={minLabel}
          labelRight={maxLabel}
          onChange={onScoreChange}
        />
      )}
    </SurveyRoot>
  );
};
