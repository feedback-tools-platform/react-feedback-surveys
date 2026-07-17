import React from 'react';

import { SurveyRoot } from '../../components/SurveyRoot';
import useSurveyState from '../../hooks/useSurveyState';
import type { SharedSurveyProps } from '../../types';
import { cn } from '../../utils';

import { CSAT2SurveyEmoji } from './CSAT2SurveyEmoji';
import { CSAT2SurveyThumbs } from './CSAT2SurveyThumbs';

import styles from './CSAT2Survey.module.scss';

export interface CSAT2SurveyProps extends SharedSurveyProps {
  /** Visual style for the rating scale */
  scaleStyle: 'emoji' | 'thumbs';
}

export const CSAT2Survey: React.FC<CSAT2SurveyProps> = ({
  classNames,
  dir,
  scaleStyle,
  question,
  minLabel,
  maxLabel,
  textQuestion,
  textButtonLabel,
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
}) => {
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

  return (
    <SurveyRoot
      className={styles.base}
      classNames={{
        ...classNames?.base,
        rating: cn(styles.rating, classNames?.base?.rating),
        feedback: cn(styles.feedback, classNames?.base?.feedback),
        contact: cn(styles.contact, classNames?.base?.contact),
        success: cn(styles.success, classNames?.base?.success)
      }}
      dir={dir}
      screen={screen}
      question={question}
      textQuestion={textQuestion}
      textButtonLabel={textButtonLabel}
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
      {(scaleStyle === 'emoji') && (
        <CSAT2SurveyEmoji
          classNames={classNames?.scale}
          minLabel={minLabel}
          maxLabel={maxLabel}
          onChange={onScoreChange}
        />
      )}

      {(scaleStyle === 'thumbs') && (
        <CSAT2SurveyThumbs
          classNames={classNames?.scale}
          minLabel={minLabel}
          maxLabel={maxLabel}
          onChange={onScoreChange}
        />
      )}
    </SurveyRoot>
  );
};
