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
  scaleStyle,
  question,
  minLabel,
  maxLabel,
  textQuestion,
  textButtonLabel,
  responseType,
  choiceOptions,
  thankYouMessage,
  footer,
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
      screen={screen}
      question={question}
      textQuestion={textQuestion}
      textButtonLabel={textButtonLabel}
      responseType={responseType}
      choiceOptions={choiceOptions}
      thankYouMessage={thankYouMessage}
      footer={footer}
      onFeedback={onFeedbackChange}
    >
      {(scaleStyle === 'numbers') && (
        <NPS10SurveyNumbers
          classNames={classNames?.scale}
          labelLeft={minLabel}
          labelRight={maxLabel}
          onChange={onScoreChange}
        />
      )}
    </SurveyRoot>
  );
};
