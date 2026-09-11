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
  /** Contact screen wrapper */
  contact?: string;
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
  /** Feedback input screen */
  | 'feedback'
  /** Optional email/contact collection screen */
  | 'contact'
  /** Final "thanks" message screen */
  | 'success';

/**
 * A single attachment confirmed by the respondent
 */
export interface SurveyAttachment {
  /** Discriminates the source that produced this attachment (not its content type — use `mimeType` for that) */
  kind: 'screenshot';
  /** Raw attachment data, as returned by the source */
  data: string | Blob;
  /** Original filename, when known (e.g. from a native `File`) */
  name?: string;
  /** MIME type, when known and not already carried by a `File`'s own `.type` */
  mimeType?: string;
  /** Size in bytes, when known (unavailable when `data` is an already-hosted URL string) */
  size?: number;
}

/**
 * Payload sent when submitting survey data
 */
export interface SurveySubmitPayload {
  /** Selected rating value */
  value?: number;
  /** Optional text or array of selected choices */
  text?: string | string[];
  /** Attachments (e.g. a screenshot) confirmed by the respondent */
  attachments?: SurveyAttachment[];
}

/**
 * Callback function for survey submission
 * @param payload - The survey data to submit
 * @returns void or Promise<void> for async operations
 */
export type SurveyCallback = (payload: SurveySubmitPayload) => void | Promise<void>;

/**
 * Payload sent when submitting collected contact
 */
export interface ContactSubmitPayload {
  /** Selected rating value */
  value?: number;
  /** Submitted feedback text or selected choices */
  text?: string | string[];
  /** Respondent's email address */
  email: string;
}

/**
 * Callback function for contact submission
 * @param payload - The collected contact data
 * @returns void or Promise<void> for async operations
 */
export type ContactCallback = (payload: ContactSubmitPayload) => void | Promise<void>;

/**
 * Overrides for the library's own aria-labels and other screen-reader-only text. Never visible
 * UI copy — that's `question`, `thankYouMessage`, `otherPlaceholder`, `attachmentCaption`, etc.,
 * always authored by you alongside the rest of the survey content, sitting directly on
 * `SharedSurveyProps`. Every key here is announced to assistive tech only, useful to override
 * e.g. when localizing a survey for a non-English audience. Each key merges over its English
 * default; omit a key to keep that default.
 */
export interface SurveyStrings {
  /** aria-label for the feedback step's form/region. @default 'Feedback form' */
  feedbackFormLabel?: string;
  /** Label for the free-text input shown alongside choice checkboxes. @default 'Additional feedback' */
  additionalFeedbackLabel?: string;
  /** Label for the open-ended feedback textarea shown when there are no predefined choices. @default 'Your feedback' */
  yourFeedbackLabel?: string;
  /** aria-label for the contact step's form/region. @default 'Contact form' */
  contactFormLabel?: string;
  /** Label for the email input on the contact collection screen. @default 'Email address' */
  emailLabel?: string;
  /** aria-label for opening an attachment thumbnail in a new tab. @default 'Open screenshot in a new tab' */
  attachmentOpenLabel?: string;
  /** aria-label/title for removing an attachment. @default 'Remove screenshot' */
  attachmentRemoveLabel?: string;
  /** Builds the aria-label for a numbered scale button. @default (score) => `Score ${score}` */
  getScoreLabel?: (score: number) => string;
  /** Builds the aria-label for a star rating button. @default (score) => `${score} ${score > 1 ? 'stars' : 'star'}` */
  getStarsLabel?: (score: number) => string;
}

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
  /** Overrides for the library's own aria-labels and other screen-reader-only text. See `SurveyStrings`. */
  strings?: SurveyStrings;
  /** Main survey question (screen 1) */
  question: string;
  /** Left label for the rating scale */
  minLabel?: string;
  /** Right label for the rating scale */
  maxLabel?: string;
  /** Builds the visible text appended after the first/last numbered scale button when it carries `minLabel`/`maxLabel`. @default (label) => ` - ${label}` */
  getScoreLabelSuffix?: (label: string) => string;
  /** Type of feedback collection */
  responseType?: null | 'text' | 'choices';
  /** Follow-up feedback question (screen 2) */
  textQuestion?: string;
  /** Submit button text */
  textButtonSendLabel?: string;
  /** Skip button text */
  textButtonSkipLabel?: string;
  /** Optional predefined choices for feedback */
  choiceOptions?: string[] | null;
  /** Placeholder for the free-text input next to choice checkboxes. @default 'Other' */
  otherPlaceholder?: string;
  /** Label for the screenshot-attachment control */
  screenshotButtonLabel?: string;
  /** Shown to the respondent when `onCaptureScreenshot` fails. @default 'Failed to capture screenshot' */
  screenshotErrorMessage?: string;
  /** Maximum number of attachments a respondent may confirm, across every attachment source. @default 1 */
  maxAttachments?: number;
  /** Visible caption under an attachment thumbnail, also used as its image alt text. @default 'Screenshot' */
  attachmentCaption?: string;
  /** Success message text */
  thankYouMessage: string;
  /** Enables an optional email collection step before the success screen. Skipped when `userId` is already provided */
  collectContact?: boolean;
  /** Existing user identity, if already known. When provided, the email collection step is skipped */
  userId?: string;
  /** Question shown on the contact collection screen */
  contactQuestion?: string;
  /** Descriptive text shown above the email input */
  contactSubtext?: string;
  /** Submit button text for the contact collection screen */
  contactButtonSendLabel?: string;
  /** Skip button text for the contact collection screen */
  contactButtonSkipLabel?: string;
  /** Callback when score data is submitted */
  onScoreSubmit?: SurveyCallback;
  /** Callback when survey data is submitted */
  onFeedbackSubmit?: SurveyCallback;
  /** Enables an optional screenshot-attachment control on the feedback step. Hidden unless provided — bring your own capture function, see README */
  onCaptureScreenshot?: () => string | Blob | Promise<string | Blob>;
  /** Callback when contact is submitted */
  onContactSubmit?: ContactCallback;
}
