import React from 'react';

import { SurveyRoot } from '../../components/SurveyRoot';
import useSurveyState from '../../hooks/useSurveyState';
import type { SharedSurveyProps } from '../../types';

import { NPS10SurveyNumbers } from './NPS10SurveyNumbers';

import styles from './NPS10Survey.module.scss';

export interface NPS10SurveyProps extends SharedSurveyProps {
  /** Visual style for the rating scale */
  scaleStyle: 'numbers'
}

export const NPS10Survey: React.FC<NPS10SurveyProps> = ({
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
        <NPS10SurveyNumbers
          classNames={classNames?.scale}
          minLabel={minLabel}
          maxLabel={maxLabel}
          onChange={onScoreChange}
        />
      )}
    </SurveyRoot>
  );
};
