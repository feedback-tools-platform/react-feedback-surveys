import React from 'react';

import useSurveyState from '../../hooks/useSurveyState';
import type { SharedSurveyProps } from '../../types';

import Base from '../../components/Base';

import NPS10Numbers from './NPS10Numbers';

import styles from './NPS10.module.scss';

export interface NPS10Props extends SharedSurveyProps {
  scaleVisualizationType: 'nps_10_numbers'
}

export const NPS10: React.FC<NPS10Props> = ({
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
  onSubmit
}) => {
  const {
    screen,
    onScoreChange,
    onFeedbackChange
  } = useSurveyState(feedbackType, onSubmit)

  return (
    <Base
      className={styles.root}
      classNames={classNames?.base}
      animated={animated}
      name="nps10"
      screen={screen}
      widgetType="nps_10"
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
      {(scaleVisualizationType === 'nps_10_numbers') && (
        <NPS10Numbers
          classNames={classNames?.scale}
          labelLeft={mainLabelLeft}
          labelRight={mainLabelRight}
          onChange={onScoreChange}
        />
      )}
    </Base>
  );
};
