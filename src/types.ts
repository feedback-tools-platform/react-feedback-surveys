export interface BaseClassNames {
  root?: string;
  head?: string;
  title?: string;
  body?: string;
  close?: string;
}

export interface ScaleClassNames {
  root?: string;
  list?: string;
  button?: string;
  icon?: string;
  score?: string;
  labels?: string;
}

/**
 * Widget type identifier
 */
export type WidgetType = 'nps_10' | 'ces_7' | 'csat_5' | 'csat_2';

/**
 * Payload sent when submitting survey data
 */
export interface SurveySubmitPayload {
  /** Selected rating value */
  value?: number;
  /** Optional text or array of selected choices */
  comment?: string | string[];
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
  /** Show up animation **/
  animated?: boolean;
  /** Optional classNames to customize internal parts */
  classNames?: {
    base?: BaseClassNames;
    scale?: ScaleClassNames;
  };
  /** Main survey question (screen 1) */
  mainQuestion?: string;
  /** Left label for the rating scale */
  mainLabelLeft?: string;
  /** Right label for the rating scale */
  mainLabelRight?: string;
  /** Follow-up feedback question (screen 2) */
  feedbackQuestion?: string;
  /** Submit button text */
  feedbackButtonText?: string;
  /** Type of feedback collection */
  feedbackType?: 'none' | 'text' | 'choices';
  /** Optional predefined choices for feedback */
  feedbackChoices?: string[] | null;
  /** Success message text */
  successText?: string;
  /** Footer content placeholder (e.g., logo, brand info, or additional elements) **/
  footerContent?: React.ReactNode;
  /** Callback when survey is closed */
  onClose?: () => void;
  /** Callback when survey data is submitted */
  onSubmit?: SurveyCallback;
}
