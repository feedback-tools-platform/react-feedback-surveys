import React from 'react';

import useSurveyState from '../../hooks/useSurveyState';
import type { SharedSurveyProps } from '../../types';

import Base from '../../components/Base';

import CSAT5Emojis from './CSAT5Emojis';
import CSAT5Numbers from './CSAT5Numbers';
import CSAT5Stars from './CSAT5Stars';

import styles from './CSAT5.module.scss';

export interface CSAT5Props extends SharedSurveyProps {
  scaleVisualizationType: 'csat_5_emojis'
    | 'csat_5_numbers'
    | 'csat_5_stars';
}

export const CSAT5: React.FC<CSAT5Props> = ({
  animated,
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
  footerContent,
  onClose,
  onSubmit,
}) => {
  const {
    screen,
    onScoreChange,
    onFeedbackChange
  } = useSurveyState(feedbackType, onSubmit)

  return (
    <Base
      animated={animated}
      className={styles.root}
      classNames={classNames?.base}
      name="csat5"
      screen={screen}
      widgetType="csat_5"
      mainQuestion={mainQuestion}
      feedbackQuestion={feedbackQuestion}
      feedbackButtonText={feedbackButtonText}
      feedbackType={feedbackType}
      feedbackChoices={feedbackChoices}
      successText={successText}
      footerContent={footerContent}
      onClose={onClose}
      onFeedback={onFeedbackChange}
    >
      {(scaleVisualizationType === 'csat_5_emojis') && (
        <CSAT5Emojis
          classNames={classNames?.scale}
          labelLeft={mainLabelLeft}
          labelRight={mainLabelRight}
          onChange={onScoreChange}
        />
      )}

      {(scaleVisualizationType === 'csat_5_numbers') && (
        <CSAT5Numbers
          classNames={classNames?.scale}
          labelLeft={mainLabelLeft}
          labelRight={mainLabelRight}
          onChange={onScoreChange}
        />
      )}

      {(scaleVisualizationType === 'csat_5_stars') && (
        <CSAT5Stars
          classNames={classNames?.scale}
          labelLeft={mainLabelLeft}
          labelRight={mainLabelRight}
          onChange={onScoreChange}
        />
      )}
    </Base>
  );
};
