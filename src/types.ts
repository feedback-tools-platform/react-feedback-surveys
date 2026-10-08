/**
 * Class names for the survey's parts. Each key matches the part's `part` attribute in kebab case
 * (`pointIcon` → `part="point-icon"`), so the same names style it inside and outside a shadow root.
 */
export interface SurveyClassNames {
  /** Survey wrapper */
  root?: string;
  /** Row with the title */
  head?: string;
  /** Question, step question or thank-you text */
  title?: string;
  /** Content under the head: the scale, a form or the success icon */
  body?: string;
  /** Added to `root` on the rating step */
  rating?: string;
  /** Added to `root` on the feedback step */
  feedback?: string;
  /** Added to `root` on the email step */
  contact?: string;
  /** Added to `root` on the success step */
  success?: string;
  /** Icon on the success step */
  successIcon?: string;
  /** Rating scale: the points and the legend */
  scale?: string;
  /** Row of rating points */
  points?: string;
  /** Single rating point (button) */
  point?: string;
  /** Emoji, star or thumb inside a point */
  pointIcon?: string;
  /** Added to `pointIcon` while the star is filled (hovered or focused, together with the stars before it) */
  pointIconFilled?: string;
  /** Number inside a point */
  pointScore?: string;
  /** Min and max captions under the scale */
  legend?: string;
  /** Form on the feedback and email steps */
  form?: string;
  /** Text above the email field */
  subtext?: string;
  /** List of predefined choices */
  choices?: string;
  /** Single choice (the clickable label) */
  choice?: string;
  /** Visible checkbox square of a choice */
  checkbox?: string;
  /** Every text field: the feedback textarea, the "Other" input and the email input */
  field?: string;
  /** Screenshot capture button */
  attach?: string;
  /** Attached screenshot row */
  attachment?: string;
  /** Button that removes an attachment */
  remove?: string;
  /** Capture error row */
  error?: string;
  /** Button that hides the capture error */
  dismiss?: string;
  /** Wrapper for the submit and skip buttons */
  actions?: string;
  /** Submit button */
  submit?: string;
  /** Skip button */
  skip?: string;
  /** Added to `choice` while it is checked */
  choiceChecked?: string;
  /** Added to `checkbox` while its choice is checked */
  checkboxChecked?: string;
  /** Added to `field` while it shows a validation error */
  fieldInvalid?: string;
  /** Added to `attach` while a screenshot is being captured */
  attachBusy?: string;
}

/**
 * Built-in color theme. `auto` follows the visitor's system color scheme. Custom `--ft-*`
 * variables still override every built-in theme.
 */
export type SurveyTheme = 'light' | 'dark' | 'auto';

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
  /** aria-label for the screenshot control while a capture is in progress. @default 'Capturing screenshot…' */
  screenshotProcessingLabel?: string;
  /** aria-label/title for hiding the screenshot capture error. @default 'Dismiss error' */
  screenshotErrorDismissLabel?: string;
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
  classNames?: SurveyClassNames;
  /** Built-in color theme. Set it on the outermost widget component (`Popup` or `Surface`) — nested components inherit it. @default 'light' */
  theme?: SurveyTheme;
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
