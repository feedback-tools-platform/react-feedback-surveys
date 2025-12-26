/**
 * Class names for the root popup layout elements
 */
export interface RootClassNames {
  /** Wrapper container */
  base?: string;
  /** Survey head wrapper (title + close) */
  head?: string;
  /** Survey main title text */
  title?: string;
  /** Survey content wrapper (scale or feedback screen) */
  body?: string;
  /** Rating screen wrapper */
  rating?: string;
  /** Feedback screen wrapper */
  feedback?: string;
  /** Success screen wrapper */
  success?: string;
  /** Close button element */
  close?: string;
}

/**
 * Class names for rating scale components
 */
export interface ScaleClassNames {
  /** Rating scale wrapper */
  base?: string;
  /** List wrapper for rating buttons */
  list?: string;
  /** Single rating button */
  button?: string;
  /** Optional icon used inside button */
  icon?: string;
  /** Score text or number indicator */
  score?: string;
  /** Labels below scale (left/right limits) */
  labels?: string;
}

/**
 * Available screens in survey flow
 */
export type SurveyScreen =
  /** Rating screen (first screen) */
  | 'rating'
  /** Final "thanks" message screen */
  | 'success'
  /** Feedback input screen */
  | 'feedback';

/**
 * Payload sent when submitting survey data
 */
export interface SurveySubmitPayload {
  /** Selected rating value */
  value?: number;
  /** Optional text or array of selected choices */
  text?: string | string[];
}

/**
 * Callback function for survey submission
 * @param payload - The survey data to submit
 * @returns void or Promise<void> for async operations
 */
export type SurveyCallback = (payload: SurveySubmitPayload) => void | Promise<void>;

/**
 * Shared props for all survey components
 */
export interface SharedSurveyProps {
  /** Optional classNames to customize internal parts */
  classNames?: {
    base?: RootClassNames;
    scale?: ScaleClassNames;
  };
  /** Text direction for RTL/LTR support */
  dir?: 'ltr' | 'rtl' | 'auto';
  /** Main survey question (screen 1) */
  question: string;
  /** Left label for the rating scale */
  minLabel?: string;
  /** Right label for the rating scale */
  maxLabel?: string;
  /** Type of feedback collection */
  responseType?: null | 'text' | 'choices';
  /** Follow-up feedback question (screen 2) */
  textQuestion?: string;
  /** Submit button text */
  textButtonLabel?: string;
  /** Optional predefined choices for feedback */
  choiceOptions?: string[] | null;
  /** Success message text */
  thankYouMessage: string;
  /** Callback when score data is submitted */
  onScoreSubmit?: SurveyCallback;
  /** Callback when survey data is submitted */
  onFeedbackSubmit?: SurveyCallback;
}
