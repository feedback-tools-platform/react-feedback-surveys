import React from 'react';

import Base from '../../components/Base';
import useSurveyState from '../../hooks/useSurveyState';
import type { SharedSurveyProps } from '../../types';

import CES7Numbers from './CES7Numbers';

import styles from './CES7.module.scss';

export interface CES7Props extends SharedSurveyProps {
  scaleVisualizationType: 'ces_7_numbers'
}

export const CES7: React.FC<CES7Props> = ({
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
      animated={animated}
      className={styles.root}
      classNames={classNames?.base}
      name="ces7"
      screen={screen}
      widgetType="ces_7"
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
      {(scaleVisualizationType === 'ces_7_numbers') && (
        <CES7Numbers
          classNames={classNames?.scale}
          labelLeft={mainLabelLeft}
          labelRight={mainLabelRight}
          onChange={onScoreChange}
        />
      )}
    </Base>
  );
};
