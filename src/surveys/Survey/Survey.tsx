import React from 'react';

import { SurveyRoot } from '../../components/SurveyRoot';
import useSurveyState from '../../hooks/useSurveyState';
import type { SharedSurveyProps } from '../../types';
import { cn } from '../../utils';

import { CSAT5SurveyEmoji } from '../CSAT5Scale/CSAT5SurveyEmoji';
import { CSAT5SurveyNumbers } from '../CSAT5Scale/CSAT5SurveyNumbers';
import { CSAT5SurveyStars } from '../CSAT5Scale/CSAT5SurveyStars';
import { CSAT2SurveyEmoji } from '../CSAT2Scale/CSAT2SurveyEmoji';
import { CSAT2SurveyThumbs } from '../CSAT2Scale/CSAT2SurveyThumbs';
import { CES7SurveyNumbers } from '../CES7Scale/CES7SurveyNumbers';
import { NPS10SurveyNumbers } from '../NPS10Scale/NPS10SurveyNumbers';

import styles from './Survey.module.scss';

/** Customer Satisfaction survey, rated on a 5-point scale */
export interface CsatSurveyProps5 extends SharedSurveyProps {
  /** Survey methodology */
  type: 'csat';
  /** Number of points on the rating scale */
  points: 5;
  /** Visual style for the rating scale */
  scaleStyle: 'emoji' | 'numbers' | 'stars';
}

/** Customer Satisfaction survey, rated on a 2-point scale */
export interface CsatSurveyProps2 extends SharedSurveyProps {
  /** Survey methodology */
  type: 'csat';
  /** Number of points on the rating scale */
  points: 2;
  /** Visual style for the rating scale */
  scaleStyle: 'emoji' | 'thumbs';
}

/** Customer Effort Score survey, rated on a fixed 7-point scale */
export interface CesSurveyProps extends SharedSurveyProps {
  /** Survey methodology */
  type: 'ces';
  /** Visual style for the rating scale */
  scaleStyle: 'numbers';
}

/** Net Promoter Score survey, rated on a fixed 0–10 scale */
export interface NpsSurveyProps extends SharedSurveyProps {
  /** Survey methodology */
  type: 'nps';
  /** Visual style for the rating scale */
  scaleStyle: 'numbers';
}

export type SurveyProps =
  | CsatSurveyProps5
  | CsatSurveyProps2
  | CesSurveyProps
  | NpsSurveyProps;

export const Survey: React.FC<SurveyProps> = (props) => {
  const {
    classNames,
    dir,
    question,
    minLabel,
    maxLabel,
    textQuestion,
    textButtonSendLabel,
    textButtonSkipLabel,
    responseType,
    choiceOptions,
    thankYouMessage,
    collectContact,
    userId,
    contactQuestion,
    contactSubtext,
    contactButtonSendLabel,
    contactButtonSkipLabel,
    onScoreSubmit,
    onFeedbackSubmit,
    onContactSubmit
  } = props;

  const {
    screen,
    onScoreChange,
    onFeedbackChange,
    onContactChange
  } = useSurveyState({
    responseType,
    collectContact,
    userId,
    onScoreSubmit,
    onFeedbackSubmit,
    onContactSubmit
  })

  const formatKey = props.type === 'csat'
    ? (props.points === 2 ? 'Csat2' : 'Csat5')
    : props.type === 'ces'
      ? 'Ces'
      : 'Nps';

  return (
    <SurveyRoot
      className={styles.base}
      classNames={{
        ...classNames?.base,
        rating: cn(styles[`rating${formatKey}`], classNames?.base?.rating),
        feedback: cn(styles[`feedback${formatKey}`], classNames?.base?.feedback),
        contact: cn(styles[`contact${formatKey}`], classNames?.base?.contact),
        success: cn(styles[`success${formatKey}`], classNames?.base?.success)
      }}
      dir={dir}
      screen={screen}
      question={question}
      textQuestion={textQuestion}
      textButtonSendLabel={textButtonSendLabel}
      textButtonSkipLabel={textButtonSkipLabel}
      responseType={responseType}
      choiceOptions={choiceOptions}
      thankYouMessage={thankYouMessage}
      contactQuestion={contactQuestion}
      contactSubtext={contactSubtext}
      contactButtonSendLabel={contactButtonSendLabel}
      contactButtonSkipLabel={contactButtonSkipLabel}
      onFeedback={onFeedbackChange}
      onContact={onContactChange}
    >
      {(props.type === 'csat' && props.points === 5 && props.scaleStyle === 'emoji') && (
        <CSAT5SurveyEmoji
          classNames={classNames?.scale}
          minLabel={minLabel}
          maxLabel={maxLabel}
          onChange={onScoreChange}
        />
      )}

      {(props.type === 'csat' && props.points === 5 && props.scaleStyle === 'numbers') && (
        <CSAT5SurveyNumbers
          classNames={classNames?.scale}
          minLabel={minLabel}
          maxLabel={maxLabel}
          onChange={onScoreChange}
        />
      )}

      {(props.type === 'csat' && props.points === 5 && props.scaleStyle === 'stars') && (
        <CSAT5SurveyStars
          classNames={classNames?.scale}
          minLabel={minLabel}
          maxLabel={maxLabel}
          onChange={onScoreChange}
        />
      )}

      {(props.type === 'csat' && props.points === 2 && props.scaleStyle === 'emoji') && (
        <CSAT2SurveyEmoji
          classNames={classNames?.scale}
          minLabel={minLabel}
          maxLabel={maxLabel}
          onChange={onScoreChange}
        />
      )}

      {(props.type === 'csat' && props.points === 2 && props.scaleStyle === 'thumbs') && (
        <CSAT2SurveyThumbs
          classNames={classNames?.scale}
          minLabel={minLabel}
          maxLabel={maxLabel}
          onChange={onScoreChange}
        />
      )}

      {(props.type === 'ces' && props.scaleStyle === 'numbers') && (
        <CES7SurveyNumbers
          classNames={classNames?.scale}
          minLabel={minLabel}
          maxLabel={maxLabel}
          onChange={onScoreChange}
        />
      )}

      {(props.type === 'nps' && props.scaleStyle === 'numbers') && (
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
