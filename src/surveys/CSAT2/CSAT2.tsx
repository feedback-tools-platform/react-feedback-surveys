import React from 'react';

import type { SharedSurveyProps } from '../../types';

import Base from '../../components/Base';
import useSurveyState from '../../hooks/useSurveyState';

import CSAT2EmojisMood from './CSAT2EmojisMood';
import CSAT2EmojisThumbs from './CSAT2EmojisThumbs';

import styles from './CSAT2.module.scss';

export interface CSAT2Props extends SharedSurveyProps {
  scaleVisualizationType: 'csat_2_emojis_mood' | 'csat_2_emojis_thumbs';
}

export const CSAT2: React.FC<CSAT2Props> = ({
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
      name="csat2"
      screen={screen}
      widgetType="csat_2"
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
      {(scaleVisualizationType === 'csat_2_emojis_mood') && (
        <CSAT2EmojisMood
          classNames={classNames?.scale}
          labelLeft={mainLabelLeft}
          labelRight={mainLabelRight}
          onChange={onScoreChange}
        />
      )}

      {(scaleVisualizationType === 'csat_2_emojis_thumbs') && (
        <CSAT2EmojisThumbs
          classNames={classNames?.scale}
          labelLeft={mainLabelLeft}
          labelRight={mainLabelRight}
          onChange={onScoreChange}
        />
      )}
    </Base>
  );
};
