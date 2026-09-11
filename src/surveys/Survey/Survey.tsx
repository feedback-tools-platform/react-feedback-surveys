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

/** General feedback survey — no rating scale, collects text feedback and an optional screenshot */
export interface GeneralSurveyProps extends Omit<SharedSurveyProps, 'question' | 'responseType'> {
  /** Survey methodology */
  type: 'general';
  /** Unused — general surveys have no rating screen to show it on */
  question?: string;
  /** Type of feedback collection. The text feedback step is the whole survey, so it's never skippable. @default 'text' */
  responseType?: 'text' | 'choices';
}

export type SurveyProps =
  | CsatSurveyProps5
  | CsatSurveyProps2
  | CesSurveyProps
  | NpsSurveyProps
  | GeneralSurveyProps;

const FORMAT_KEYS = {
  csat2: 'Csat2',
  csat5: 'Csat5',
  ces: 'Ces',
  nps: 'Nps',
  general: 'General'
} as const;

const getFormatKey = (props: SurveyProps): keyof typeof FORMAT_KEYS => {
  if (props.type === 'csat') {
    return props.points === 2 ? 'csat2' : 'csat5';
  }

  return props.type;
};

export const Survey: React.FC<SurveyProps> = (props) => {
  const {
    classNames,
    dir,
    strings,
    question,
    minLabel,
    maxLabel,
    getScoreLabelSuffix,
    textQuestion,
    textButtonSendLabel,
    textButtonSkipLabel,
    choiceOptions,
    otherPlaceholder,
    maxAttachments,
    screenshotButtonLabel,
    screenshotErrorMessage,
    attachmentCaption,
    thankYouMessage,
    collectContact,
    userId,
    contactQuestion,
    contactSubtext,
    contactButtonSendLabel,
    contactButtonSkipLabel,
    onScoreSubmit,
    onFeedbackSubmit,
    onContactSubmit,
    onCaptureScreenshot
  } = props;

  const hasRating = props.type !== 'general';

  // general surveys have no scale to skip via a null responseType — the text feedback step is the whole survey
  const responseType = props.type === 'general'
    ? (props.responseType ?? 'text')
    : props.responseType;

  const {
    screen,
    isLoading,
    onScoreChange,
    onFeedbackChange,
    onContactChange
  } = useSurveyState({
    responseType,
    hasRating,
    collectContact,
    userId,
    onScoreSubmit,
    onFeedbackSubmit,
    onContactSubmit
  })

  const formatKey = FORMAT_KEYS[getFormatKey(props)];

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
      isLoading={isLoading}
      question={question}
      textQuestion={textQuestion}
      textButtonSendLabel={textButtonSendLabel}
      textButtonSkipLabel={textButtonSkipLabel}
      feedbackFormLabel={strings?.feedbackFormLabel}
      responseType={responseType}
      // Without a rating step, feedback is the respondent's only chance to leave anything at
      // all — skipping it would submit a completely empty response.
      feedbackRequired={!hasRating}
      choiceOptions={choiceOptions}
      additionalFeedbackLabel={strings?.additionalFeedbackLabel}
      yourFeedbackLabel={strings?.yourFeedbackLabel}
      otherPlaceholder={otherPlaceholder}
      thankYouMessage={thankYouMessage}
      contactFormLabel={strings?.contactFormLabel}
      contactQuestion={contactQuestion}
      contactSubtext={contactSubtext}
      emailLabel={strings?.emailLabel}
      contactButtonSendLabel={contactButtonSendLabel}
      contactButtonSkipLabel={contactButtonSkipLabel}
      maxAttachments={maxAttachments}
      screenshotButtonLabel={screenshotButtonLabel}
      screenshotErrorMessage={screenshotErrorMessage}
      attachmentOpenLabel={strings?.attachmentOpenLabel}
      attachmentCaption={attachmentCaption}
      attachmentRemoveLabel={strings?.attachmentRemoveLabel}
      onFeedback={onFeedbackChange}
      onContact={onContactChange}
      onCaptureScreenshot={onCaptureScreenshot}
    >
      {(props.type === 'csat' && props.points === 5 && props.scaleStyle === 'emoji') && (
        <CSAT5SurveyEmoji
          classNames={classNames?.scale}
          minLabel={minLabel}
          maxLabel={maxLabel}
          getScoreLabel={strings?.getScoreLabel}
          onChange={onScoreChange}
        />
      )}

      {(props.type === 'csat' && props.points === 5 && props.scaleStyle === 'numbers') && (
        <CSAT5SurveyNumbers
          classNames={classNames?.scale}
          minLabel={minLabel}
          maxLabel={maxLabel}
          getScoreLabel={strings?.getScoreLabel}
          onChange={onScoreChange}
        />
      )}

      {(props.type === 'csat' && props.points === 5 && props.scaleStyle === 'stars') && (
        <CSAT5SurveyStars
          classNames={classNames?.scale}
          minLabel={minLabel}
          maxLabel={maxLabel}
          getStarsLabel={strings?.getStarsLabel}
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
          getScoreLabel={strings?.getScoreLabel}
          getScoreLabelSuffix={getScoreLabelSuffix}
          onChange={onScoreChange}
        />
      )}

      {(props.type === 'nps' && props.scaleStyle === 'numbers') && (
        <NPS10SurveyNumbers
          classNames={classNames?.scale}
          minLabel={minLabel}
          maxLabel={maxLabel}
          getScoreLabel={strings?.getScoreLabel}
          getScoreLabelSuffix={getScoreLabelSuffix}
          onChange={onScoreChange}
        />
      )}
    </SurveyRoot>
  );
};
