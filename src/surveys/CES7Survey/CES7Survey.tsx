import React from 'react';

import { SurveyRoot } from '../../components/SurveyRoot';
import useSurveyState from '../../hooks/useSurveyState';
import type { SharedSurveyProps } from '../../types';

import { CES7SurveyNumbers } from './CES7SurveyNumbers';

import styles from './CES7Survey.module.scss';

export interface CES7SurveyProps extends SharedSurveyProps {
  /** Visual style for the rating scale */
  scaleVisualizationType: 'numbers'
}

export const CES7Survey: React.FC<CES7SurveyProps> = ({
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
      name="ces7"
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
        <CES7SurveyNumbers
          classNames={classNames?.scale}
          labelLeft={mainLabelLeft}
          labelRight={mainLabelRight}
          onChange={onScoreChange}
        />
      )}
    </SurveyRoot>
  );
};
