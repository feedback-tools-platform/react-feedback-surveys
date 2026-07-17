import React from 'react';

import { SurveyRoot } from '../../components/SurveyRoot';
import useSurveyState from '../../hooks/useSurveyState';
import type { SharedSurveyProps } from '../../types';
import { cn } from '../../utils';

import { NPS10SurveyNumbers } from './NPS10SurveyNumbers';

import styles from './NPS10Survey.module.scss';

export interface NPS10SurveyProps extends SharedSurveyProps {
  /** Visual style for the rating scale */
  scaleStyle: 'numbers'
}

export const NPS10Survey: React.FC<NPS10SurveyProps> = ({
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
      {(scaleStyle === 'numbers') && (
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
