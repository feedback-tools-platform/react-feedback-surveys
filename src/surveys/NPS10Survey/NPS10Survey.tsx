import React from 'react';

import { SurveyRoot } from '../../components/SurveyRoot';
import useSurveyState from '../../hooks/useSurveyState';
import type { SharedSurveyProps } from '../../types';

import { NPS10SurveyNumbers } from './NPS10SurveyNumbers';

import styles from './NPS10Survey.module.scss';

export interface NPS10SurveyProps extends SharedSurveyProps {
  /** Visual style for the rating scale */
  scaleVisualizationType: 'numbers'
}

export const NPS10Survey: React.FC<NPS10SurveyProps> = ({
  classNames,
  scaleVisualizationType,
  mainQuestion,
  mainLabelLeft,
  mainLabelRight,
  feedbackQuestion,
  feedbackButtonText,
  feedbackType = 'none',
  feedbackChoices,
  successText,
  footerComponent,
  onScoreSubmit,
  onFeedbackSubmit
}) => {
  const {
    screen,
    onScoreChange,
    onFeedbackChange
  } = useSurveyState({
    feedbackType,
    onScoreSubmit,
    onFeedbackSubmit
  })

  return (
    <SurveyRoot
      className={styles.base}
      classNames={classNames?.base}
      name="nps10"
      screen={screen}
      mainQuestion={mainQuestion}
      feedbackQuestion={feedbackQuestion}
      feedbackButtonText={feedbackButtonText}
      feedbackType={feedbackType}
      feedbackChoices={feedbackChoices}
      successText={successText}
      footerComponent={footerComponent}
      onFeedback={onFeedbackChange}
    >
      {(scaleVisualizationType === 'numbers') && (
        <NPS10SurveyNumbers
          classNames={classNames?.scale}
          labelLeft={mainLabelLeft}
          labelRight={mainLabelRight}
          onChange={onScoreChange}
        />
      )}
    </SurveyRoot>
  );
};
