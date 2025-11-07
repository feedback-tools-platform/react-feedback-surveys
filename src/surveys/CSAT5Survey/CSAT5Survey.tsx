import React from 'react';

import { SurveyRoot } from '../../components/SurveyRoot';
import useSurveyState from '../../hooks/useSurveyState';
import type { SharedSurveyProps } from '../../types';

import { CSAT5SurveyEmoji } from './CSAT5SurveyEmoji';
import { CSAT5SurveyNumbers } from './CSAT5SurveyNumbers';
import { CSAT5SurveyStars } from './CSAT5SurveyStars';

import styles from './CSAT5Survey.module.scss';

export interface CSAT5SurveyProps extends SharedSurveyProps {
  /** Visual style for the rating scale */
  scaleVisualizationType: 'emoji' | 'numbers' | 'stars';
}

export const CSAT5Survey: React.FC<CSAT5SurveyProps> = ({
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
      name="csat5"
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
      {(scaleVisualizationType === 'emoji') && (
        <CSAT5SurveyEmoji
          classNames={classNames?.scale}
          labelLeft={mainLabelLeft}
          labelRight={mainLabelRight}
          onChange={onScoreChange}
        />
      )}

      {(scaleVisualizationType === 'numbers') && (
        <CSAT5SurveyNumbers
          classNames={classNames?.scale}
          labelLeft={mainLabelLeft}
          labelRight={mainLabelRight}
          onChange={onScoreChange}
        />
      )}

      {(scaleVisualizationType === 'stars') && (
        <CSAT5SurveyStars
          classNames={classNames?.scale}
          labelLeft={mainLabelLeft}
          labelRight={mainLabelRight}
          onChange={onScoreChange}
        />
      )}
    </SurveyRoot>
  );
};
