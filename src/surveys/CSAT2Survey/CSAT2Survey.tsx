import React from 'react';

import { SurveyRoot } from '../../components/SurveyRoot';
import useSurveyState from '../../hooks/useSurveyState';
import type { SharedSurveyProps } from '../../types';

import { CSAT2SurveyEmoji } from './CSAT2SurveyEmoji';
import { CSAT2SurveyThumbs } from './CSAT2SurveyThumbs';

import styles from './CSAT2Survey.module.scss';

export interface CSAT2SurveyProps extends SharedSurveyProps {
  /** Visual style for the rating scale */
  scaleVisualizationType: 'emoji' | 'thumbs';
}

export const CSAT2Survey: React.FC<CSAT2SurveyProps> = ({
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
      name="csat2"
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
        <CSAT2SurveyEmoji
          classNames={classNames?.scale}
          labelLeft={mainLabelLeft}
          labelRight={mainLabelRight}
          onChange={onScoreChange}
        />
      )}

      {(scaleVisualizationType === 'thumbs') && (
        <CSAT2SurveyThumbs
          classNames={classNames?.scale}
          labelLeft={mainLabelLeft}
          labelRight={mainLabelRight}
          onChange={onScoreChange}
        />
      )}
    </SurveyRoot>
  );
};
