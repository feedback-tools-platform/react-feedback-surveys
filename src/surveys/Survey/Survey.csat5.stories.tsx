import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn, userEvent, waitFor, within, expect } from 'storybook/test';
import { domToDataUrl } from 'modern-screenshot';

import { Popup } from '../../components/Popup';
import { Surface } from '../../components/Surface';
import { minHeightDecorator } from '../../utils/storybook';

import { Survey, type CsatSurveyProps5 } from './Survey';

const meta = {
  title: 'widgets/Survey/CSAT 5 points',
  component: Survey,
  tags: ['autodocs'],
  argTypes: {
    scaleStyle: {
      control: 'radio',
      options: [
        'emoji',
        'numbers',
        'stars'
      ]
    },
    dir: {
      control: 'radio',
      options: ['ltr', 'rtl', 'auto']
    },
    responseType: {
      control: 'radio',
      options: [null, 'choices', 'text']
    }
  }
} satisfies Meta<typeof Survey>;

export default meta;
type Story = StoryObj<typeof meta>

const commonProps: Omit<CsatSurveyProps5, 'scaleStyle'> = {
  type: 'csat',
  points: 5,
  question: 'How would you rate your satisfaction with our product?',
  minLabel: 'Very unsatisfied',
  maxLabel: 'Very satisfied',
  responseType: null,
  textQuestion: 'We’d love to hear your thoughts — what can we improve?',
  textButtonSendLabel: 'Submit',
  textButtonSkipLabel: 'Skip',
  choiceOptions: null,
  thankYouMessage: 'Thank you for your feedback',
  onScoreSubmit: fn(),
  onFeedbackSubmit: fn()
}

export const Emoji: Story = {
  args: {
    ...commonProps,
    scaleStyle: 'emoji',
    textQuestion: '',
    textButtonSendLabel: ''
  },
  parameters: {
    layout: 'centered',
  }
};

export const EmojiSurface: Story = {
  args: {
    ...commonProps,
    scaleStyle: 'emoji',
    textQuestion: '',
    textButtonSendLabel: ''
  },
  decorators: [
    minHeightDecorator(240)
  ],
  name: 'Emoji (surface)',
  render: (args) => (
    <Surface>
      <Survey {...args} />
    </Surface>
  ),
  parameters: {
    layout: 'centered',
  }
};

const arabicProps: Omit<CsatSurveyProps5, 'scaleStyle'> = {
  ...commonProps,
  dir: 'rtl',
  question: 'كيف تقيّم رضاك عن منتجنا؟',
  minLabel: 'غير راضٍ جدًا',
  maxLabel: 'راضٍ جدًا',
  textQuestion: 'نحب أن نسمع رأيك — ما الذي يمكننا تحسينه؟',
  textButtonSendLabel: 'إرسال',
  textButtonSkipLabel: 'تخطي',
  choiceOptions: [],
  thankYouMessage: 'شكرًا لملاحظاتك',
  strings: {
    yourFeedbackLabel: 'ملاحظاتك'
  }
}

export const NumbersRTL: Story = {
  args: {
    ...arabicProps,
    scaleStyle: 'numbers',
    responseType: 'text'
  },
  decorators: [
    minHeightDecorator(240)
  ],
  name: 'Numbers (Arabic, RTL)',
  render: (args) => (
    <Surface>
      <Survey {...args} />
    </Surface>
  ),
  parameters: {
    layout: 'centered',
  }
};

export const EmojiPopup: Story = {
  args: {
    ...commonProps,
    scaleStyle: 'emoji',
    textQuestion: '',
    textButtonSendLabel: ''
  },
  decorators: [
    minHeightDecorator(240)
  ],
  name: 'Emoji (popup)',
  render: (args) => (
    <Popup>
      <Survey {...args} />
    </Popup>
  ),
};

export const EmojiInteractions: Story = {
  ...Emoji,
  name: 'Emoji (interactions)',
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // Click on score 5
    const scoreButton = canvas.getByRole('button', { name: 'Score 5' });
    await userEvent.click(scoreButton);

    // Verify score callback was called
    await expect(args.onScoreSubmit).toHaveBeenCalledWith({ value: 5 });

    // Verify thank you message appears (no feedback screen for Emoji)
    await expect(canvas.getByText('Thank you for your feedback')).toBeInTheDocument();
  },
};

export const Numbers: Story = {
  args: {
    ...commonProps,
    scaleStyle: 'numbers',
    responseType: 'text',
    choiceOptions: []
  },
  parameters: {
    layout: 'centered',
  }
};

export const NumbersSurface: Story = {
  args: {
    ...commonProps,
    scaleStyle: 'numbers',
    responseType: 'text',
    choiceOptions: []
  },
  decorators: [
    minHeightDecorator(240)
  ],
  name: 'Numbers (surface)',
  render: (args) => (
    <Surface>
      <Survey {...args} />
    </Surface>
  ),
  parameters: {
    layout: 'centered',
  }
};

export const NumbersPopup: Story = {
  args: {
    ...commonProps,
    scaleStyle: 'numbers',
    responseType: 'text',
    choiceOptions: []
  },
  decorators: [
    minHeightDecorator(240)
  ],
  name: 'Numbers (popup)',
  render: (args) => (
    <Popup>
      <Survey {...args} />
    </Popup>
  ),
};

export const NumbersInteractions: Story = {
  ...Numbers,
  name: 'Numbers (interactions)',
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // Click on score 4
    const scoreButton = canvas.getByRole('button', { name: 'Score 4' });
    await userEvent.click(scoreButton);

    // Verify score callback was called
    await expect(args.onScoreSubmit).toHaveBeenCalledWith({ value: 4 });

    // Wait for feedback screen to appear
    const textarea = await canvas.findByRole('textbox', { name: 'Your feedback' });
    await expect(textarea).toBeInTheDocument();

    // Type feedback text
    await userEvent.type(textarea, 'Good product overall');

    // Submit feedback
    const submitButton = canvas.getByRole('button', { name: 'Submit' });
    await userEvent.click(submitButton);

    // Verify feedback callback was called
    await expect(args.onFeedbackSubmit).toHaveBeenCalledWith({
      value: 4,
      text: 'Good product overall'
    });

    // Verify thank you message appears
    await expect(canvas.getByText('Thank you for your feedback')).toBeInTheDocument();
  },
};

export const NumbersSubmitRequiresContent: Story = {
  ...Numbers,
  name: 'Numbers (submit disabled until there is content)',
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // Click on score 4
    const scoreButton = canvas.getByRole('button', { name: 'Score 4' });
    await userEvent.click(scoreButton);

    // Submit is disabled with nothing typed — the respondent must either add content or Skip,
    // never submit empty
    const submitButton = await canvas.findByRole('button', { name: 'Submit' });
    await expect(submitButton).toBeDisabled();
    await userEvent.click(submitButton);
    await expect(args.onFeedbackSubmit).not.toHaveBeenCalled();

    // Typing enables it
    const textarea = canvas.getByRole('textbox', { name: 'Your feedback' });
    await userEvent.type(textarea, 'G');
    await expect(submitButton).toBeEnabled();

    // Clearing the text disables it again
    await userEvent.clear(textarea);
    await expect(submitButton).toBeDisabled();
  },
};

export const Stars: Story = {
  args: {
    ...commonProps,
    scaleStyle: 'stars',
    responseType: 'choices',
    choiceOptions: ['Very easy', 'Very difficult']
  },
  parameters: {
    layout: 'centered',
  }
};

export const StarsSurface: Story = {
  args: {
    ...commonProps,
    scaleStyle: 'stars',
    responseType: 'choices',
    choiceOptions: ['Very easy', 'Very difficult']
  },
  decorators: [
    minHeightDecorator(240)
  ],
  name: 'Stars (surface)',
  render: (args) => (
    <Surface>
      <Survey {...args} />
    </Surface>
  ),
  parameters: {
    layout: 'centered',
  }
};

export const StarsPopup: Story = {
  args: {
    ...commonProps,
    scaleStyle: 'stars',
    responseType: 'choices',
    choiceOptions: ['Very easy', 'Very difficult']
  },
  decorators: [
    minHeightDecorator(240)
  ],
  name: 'Stars (popup)',
  render: (args) => (
    <Popup>
      <Survey {...args} />
    </Popup>
  ),
};

export const StarsInteractions: Story = {
  ...Stars,
  name: 'Stars (interactions)',
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // Click on score 3
    const scoreButton = canvas.getByRole('button', { name: '3 stars' });
    await userEvent.click(scoreButton);

    // Verify score callback was called
    await expect(args.onScoreSubmit).toHaveBeenCalledWith({ value: 3 });

    // Wait for feedback screen with choices
    const checkbox1 = await canvas.findByRole('checkbox', { name: 'Very easy' });
    await expect(checkbox1).toBeInTheDocument();

    // Select first choice
    await userEvent.click(checkbox1);
    await expect(checkbox1).toBeChecked();

    // Submit feedback
    const submitButton = canvas.getByRole('button', { name: 'Submit' });
    await userEvent.click(submitButton);

    // Verify feedback callback was called
    await expect(args.onFeedbackSubmit).toHaveBeenCalledWith({
      value: 3,
      text: ['Very easy']
    });

    // Verify thank you message appears
    await expect(canvas.getByText('Thank you for your feedback')).toBeInTheDocument();
  },
};

const emailProps: Omit<CsatSurveyProps5, 'scaleStyle'> = {
  ...commonProps,
  responseType: 'text',
  choiceOptions: [],
  collectContact: true,
  contactQuestion: 'Want us to follow up?',
  contactSubtext: "Leave your email and we'll get back to you about your feedback. Optional.",
  contactButtonSendLabel: 'Send',
  contactButtonSkipLabel: 'Skip',
  onContactSubmit: fn()
}

const goToEmailStep = async (canvasElement: HTMLElement) => {
  const canvas = within(canvasElement);

  // Click on score 4
  const scoreButton = canvas.getByRole('button', { name: 'Score 4' });
  await userEvent.click(scoreButton);

  // Submit follow-up feedback
  const textarea = await canvas.findByRole('textbox', { name: 'Your feedback' });
  await userEvent.type(textarea, 'Good product overall');
  const feedbackSubmit = canvas.getByRole('button', { name: 'Submit' });
  await userEvent.click(feedbackSubmit);

  // Wait for the email step to appear, then leave it for manual interaction
  await canvas.findByRole('textbox', { name: 'Email address' });
};

export const EmailStep: Story = {
  args: {
    ...emailProps,
    scaleStyle: 'numbers'
  },
  name: 'Numbers (email step)',
  parameters: {
    layout: 'centered',
  },
  play: async ({ canvasElement }) => {
    await goToEmailStep(canvasElement);
  },
};

export const EmailStepSurface: Story = {
  ...EmailStep,
  decorators: [
    minHeightDecorator(240)
  ],
  name: 'Numbers (email step, surface)',
  render: (args) => (
    <Surface>
      <Survey {...args} />
    </Surface>
  ),
};

export const EmailStepPopup: Story = {
  ...EmailStep,
  decorators: [
    minHeightDecorator(240)
  ],
  name: 'Numbers (email step, popup)',
  render: (args) => (
    <Popup>
      <Survey {...args} />
    </Popup>
  ),
};

export const EmailSubmitInteractions: Story = {
  args: {
    ...emailProps,
    scaleStyle: 'numbers'
  },
  name: 'Numbers (email submit)',
  parameters: {
    layout: 'centered',
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await goToEmailStep(canvasElement);

    // Email collection screen appears instead of the thank-you screen
    await expect(canvas.getByText('Want us to follow up?')).toBeInTheDocument();
    const emailInput = canvas.getByRole('textbox', { name: 'Email address' });
    await userEvent.type(emailInput, 'user@example.com');

    const emailSubmit = canvas.getByRole('button', { name: 'Send' });
    await userEvent.click(emailSubmit);

    // Verify contact callback was called and success screen appears
    await expect(args.onContactSubmit).toHaveBeenCalledWith({
      value: 4,
      text: 'Good product overall',
      email: 'user@example.com'
    });
    await expect(canvas.getByText('Thank you for your feedback')).toBeInTheDocument();
  },
};

export const EmailInvalidInteractions: Story = {
  args: {
    ...emailProps,
    scaleStyle: 'numbers'
  },
  name: 'Numbers (email invalid)',
  parameters: {
    layout: 'centered',
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await goToEmailStep(canvasElement);

    // Submitting an invalid email flags the field and moves focus into it, instead of sending
    const emailInput = canvas.getByRole('textbox', { name: 'Email address' });
    await userEvent.type(emailInput, 'not-an-email');

    const emailSubmit = canvas.getByRole('button', { name: 'Send' });
    await userEvent.click(emailSubmit);

    await expect(args.onContactSubmit).not.toHaveBeenCalled();
    await expect(emailInput).toHaveAttribute('aria-invalid', 'true');
    await expect(emailInput).toHaveFocus();

    // Typing clears the invalid state and lets the submission through
    await userEvent.clear(emailInput);
    await userEvent.type(emailInput, 'user@example.com');
    await expect(emailInput).toHaveAttribute('aria-invalid', 'false');
    await userEvent.click(emailSubmit);

    await expect(args.onContactSubmit).toHaveBeenCalledWith({
      value: 4,
      text: 'Good product overall',
      email: 'user@example.com'
    });
  },
};

export const EmailSkipInteractions: Story = {
  ...EmailSubmitInteractions,
  name: 'Numbers (email skip)',
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    await goToEmailStep(canvasElement);

    // Skip the email collection screen
    const skipButton = await canvas.findByRole('button', { name: 'Skip' });
    await userEvent.click(skipButton);

    // Verify contact callback was NOT called and success screen still appears
    await expect(args.onContactSubmit).not.toHaveBeenCalled();
    await expect(canvas.getByText('Thank you for your feedback')).toBeInTheDocument();
  },
};

export const EmailSkippedWithUserId: Story = {
  args: {
    ...commonProps,
    scaleStyle: 'emoji',
    textQuestion: '',
    textButtonSendLabel: '',
    collectContact: true,
    userId: 'user-123',
    onContactSubmit: fn()
  },
  name: 'Emoji (email skipped, userId provided)',
  parameters: {
    layout: 'centered',
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // Click on score 5
    const scoreButton = canvas.getByRole('button', { name: 'Score 5' });
    await userEvent.click(scoreButton);

    // Email step is skipped entirely because userId is already known
    await expect(args.onContactSubmit).not.toHaveBeenCalled();
    await expect(canvas.getByText('Thank you for your feedback')).toBeInTheDocument();
  },
};

export const Preview: Story = {
  args: {
    ...commonProps,
    scaleStyle: 'emoji',
  },
  name: 'Preview docs',
  parameters: {
    layout: 'fullscreen',
  },
  render: (args) => (
    <div
      style={{
        display: 'inline-flex',
        padding: '1.5rem',
        background: '#5fe7d0'
      }}
    >
      <Surface>
        <Survey {...args} />
      </Surface>
    </div>
  ),
};

export const PreviewPopup: Story = {
  args: {
    ...commonProps,
    scaleStyle: 'stars',
  },
  name: 'Preview docs (popup)',
  parameters: {
    layout: 'fullscreen',
  },
  render: (args) => (
    <div
      style={{
        display: 'inline-flex',
        padding: '1.5rem',
        background: '#5fe7d0'
      }}
    >
      <Popup style={{ position: 'static' }}>
        <Survey {...args} />
      </Popup>
    </div>
  ),
};

const screenshotProps: Omit<CsatSurveyProps5, 'scaleStyle'> = {
  ...commonProps,
  responseType: 'text',
  choiceOptions: [],
  onCaptureScreenshot: () => domToDataUrl(document.body)
}

export const ScreenshotAttach: Story = {
  args: {
    ...screenshotProps,
    scaleStyle: 'numbers'
  },
  name: 'Numbers (screenshot attach)',
  parameters: {
    layout: 'centered',
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // Click on score 4
    const scoreButton = canvas.getByRole('button', { name: 'Score 4' });
    await userEvent.click(scoreButton);

    // Capture a screenshot — it's attached immediately, no confirm step
    const attachButton = await canvas.findByRole('button', { name: 'Capture screenshot' });
    await userEvent.click(attachButton);

    await expect(await canvas.findByAltText('Screenshot')).toBeInTheDocument();

    // Type feedback and submit
    const textarea = canvas.getByRole('textbox', { name: 'Your feedback' });
    await userEvent.type(textarea, 'Something looks broken here');
    const submitButton = canvas.getByRole('button', { name: 'Submit' });
    await userEvent.click(submitButton);

    // Verify the screenshot travels with the rest of the feedback
    await expect(args.onFeedbackSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        value: 4,
        text: 'Something looks broken here',
        attachments: [
          expect.objectContaining({ kind: 'screenshot' })
        ]
      })
    );

    await expect(canvas.getByText('Thank you for your feedback')).toBeInTheDocument();
  },
};

export const ScreenshotRemove: Story = {
  args: {
    ...screenshotProps,
    scaleStyle: 'numbers'
  },
  name: 'Numbers (screenshot remove)',
  parameters: {
    layout: 'centered',
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // Click on score 4
    const scoreButton = canvas.getByRole('button', { name: 'Score 4' });
    await userEvent.click(scoreButton);

    // Capture a screenshot, then remove it via the "x" on the thumbnail
    const attachButton = await canvas.findByRole('button', { name: 'Capture screenshot' });
    await userEvent.click(attachButton);

    const removeButton = await canvas.findByRole('button', { name: 'Remove screenshot' });
    await userEvent.click(removeButton);

    // The attach control is available again, and the form still submits normally
    await expect(canvas.getByRole('button', { name: 'Capture screenshot' })).toBeInTheDocument();

    const textarea = canvas.getByRole('textbox', { name: 'Your feedback' });
    await userEvent.type(textarea, 'Good product overall');
    const submitButton = canvas.getByRole('button', { name: 'Submit' });
    await userEvent.click(submitButton);

    await expect(args.onFeedbackSubmit).toHaveBeenCalledWith({
      value: 4,
      text: 'Good product overall',
      attachments: undefined
    });

    await expect(canvas.getByText('Thank you for your feedback')).toBeInTheDocument();
  },
};

export const ScreenshotSkipDisabled: Story = {
  args: {
    ...screenshotProps,
    scaleStyle: 'numbers'
  },
  name: 'Numbers (skip disabled while a screenshot is attached)',
  parameters: {
    layout: 'centered',
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // Click on score 4
    const scoreButton = canvas.getByRole('button', { name: 'Score 4' });
    await userEvent.click(scoreButton);

    // Skip is enabled before any attachment exists
    const skipButton = await canvas.findByRole('button', { name: 'Skip' });
    await expect(skipButton).toBeEnabled();

    // Once a screenshot is attached, Skip is disabled — an attachment must be explicitly
    // submitted or removed, never silently discarded
    const attachButton = canvas.getByRole('button', { name: 'Capture screenshot' });
    await userEvent.click(attachButton);
    await canvas.findByAltText('Screenshot');

    await expect(skipButton).toBeDisabled();
    await userEvent.click(skipButton);
    await expect(args.onFeedbackSubmit).not.toHaveBeenCalled();

    // Removing the attachment re-enables Skip
    const removeButton = canvas.getByRole('button', { name: 'Remove screenshot' });
    await userEvent.click(removeButton);

    await expect(skipButton).toBeEnabled();
  },
};

export const ScreenshotChoicesRequiresChoiceOrText: Story = {
  args: {
    ...screenshotProps,
    scaleStyle: 'numbers',
    responseType: 'choices',
    choiceOptions: ['Very easy', 'Very difficult']
  },
  name: 'Numbers (choices: attachment alone does not unlock submit)',
  parameters: {
    layout: 'centered',
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const scoreButton = canvas.getByRole('button', { name: 'Score 4' });
    await userEvent.click(scoreButton);

    // Attach a screenshot without picking a choice or typing anything
    const attachButton = await canvas.findByRole('button', { name: 'Capture screenshot' });
    await userEvent.click(attachButton);
    await canvas.findByAltText('Screenshot');

    // For choices, an attachment alone doesn't unlock Submit — unlike `text`, there's no
    // invalid-state UI here, the button just stays disabled until a choice or text is added
    const submitButton = canvas.getByRole('button', { name: 'Submit' });
    await expect(submitButton).toBeDisabled();

    // Picking a choice unlocks it
    const checkbox = canvas.getByRole('checkbox', { name: 'Very easy' });
    await userEvent.click(checkbox);
    await expect(submitButton).toBeEnabled();

    await userEvent.click(submitButton);

    await expect(args.onFeedbackSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        value: 4,
        text: ['Very easy'],
        attachments: [
          expect.objectContaining({ kind: 'screenshot' })
        ]
      })
    );
  },
};

export const ScreenshotMultiple: Story = {
  args: {
    ...screenshotProps,
    scaleStyle: 'numbers',
    maxAttachments: 2
  },
  name: 'Numbers (screenshot, maxAttachments=2)',
  parameters: {
    layout: 'centered',
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // Click on score 4
    const scoreButton = canvas.getByRole('button', { name: 'Score 4' });
    await userEvent.click(scoreButton);

    // Capture a first screenshot — with maxAttachments={2} the button stays available
    const attachButton = await canvas.findByRole('button', { name: 'Capture screenshot' });
    await userEvent.click(attachButton);

    await expect(await canvas.findAllByAltText('Screenshot')).toHaveLength(1);
    await expect(canvas.getByRole('button', { name: 'Capture screenshot' })).toBeInTheDocument();

    // Capture a second screenshot — the cap is now reached, so the button hides
    await userEvent.click(canvas.getByRole('button', { name: 'Capture screenshot' }));

    // Wait for the second capture to actually resolve
    await waitFor(() => {
      expect(canvas.getAllByAltText('Screenshot')).toHaveLength(2);
    });
    await expect(canvas.queryByRole('button', { name: 'Capture screenshot' })).not.toBeInTheDocument();

    // Attachments alone aren't enough to submit — text is still required
    const textarea = canvas.getByRole('textbox', { name: 'Your feedback' });
    await userEvent.type(textarea, 'Two screenshots attached');

    const submitButton = canvas.getByRole('button', { name: 'Submit' });
    await userEvent.click(submitButton);

    await expect(args.onFeedbackSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        value: 4,
        text: 'Two screenshots attached',
        attachments: [
          expect.objectContaining({ kind: 'screenshot' }),
          expect.objectContaining({ kind: 'screenshot' })
        ]
      })
    );
  },
};

let resolveScreenshotCapture: ((data: string | Blob) => void) | undefined;

const pendingScreenshotProps: Omit<CsatSurveyProps5, 'scaleStyle'> = {
  ...commonProps,
  responseType: 'text',
  choiceOptions: [],
  onCaptureScreenshot: () => new Promise<string | Blob>((resolve) => {
    resolveScreenshotCapture = resolve;
  })
}

export const SubmitBlockedWhileScreenshotPending: Story = {
  args: {
    ...pendingScreenshotProps,
    scaleStyle: 'numbers'
  },
  name: 'Numbers (submit stays blocked while a screenshot capture is pending)',
  parameters: {
    layout: 'centered',
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const scoreButton = canvas.getByRole('button', { name: 'Score 4' });
    await userEvent.click(scoreButton);

    // Start a capture that stays pending until resolveScreenshotCapture() is called below
    const attachButton = await canvas.findByRole('button', { name: 'Capture screenshot' });
    await userEvent.click(attachButton);

    await expect(await canvas.findByRole('button', { name: 'Processing…' })).toBeInTheDocument();

    // Submit is disabled for the entire pending window — clicking it is a no-op
    const submitButton = canvas.getByRole('button', { name: 'Submit' });
    await expect(submitButton).toBeDisabled();
    await userEvent.click(submitButton);
    await expect(args.onFeedbackSubmit).not.toHaveBeenCalled();

    // Resolve the capture — the attachment lands and Submit becomes available again
    resolveScreenshotCapture?.(await domToDataUrl(document.body));

    await expect(await canvas.findByAltText('Screenshot')).toBeInTheDocument();
    await waitFor(() => expect(submitButton).toBeEnabled());

    // The attachment alone still isn't enough — submitting without text flags the field instead
    // and moves focus into it
    await userEvent.click(submitButton);
    await expect(args.onFeedbackSubmit).not.toHaveBeenCalled();
    const textarea = canvas.getByRole('textbox', { name: 'Your feedback' });
    await expect(textarea).toHaveAttribute('aria-invalid', 'true');
    await expect(textarea).toHaveFocus();

    // Typing clears the invalid state and lets the submission through
    await userEvent.type(textarea, 'Something looks broken here');
    await expect(textarea).toHaveAttribute('aria-invalid', 'false');
    await userEvent.click(submitButton);

    await expect(args.onFeedbackSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        text: 'Something looks broken here',
        attachments: [
          expect.objectContaining({ kind: 'screenshot' })
        ]
      })
    );
  },
};

const throwingScreenshotProps: Omit<CsatSurveyProps5, 'scaleStyle'> = {
  ...commonProps,
  responseType: 'text',
  choiceOptions: [],
  onCaptureScreenshot: () => {
    throw new Error('Screenshot capture is not supported in this browser');
  }
}

export const ScreenshotCaptureThrows: Story = {
  args: {
    ...throwingScreenshotProps,
    scaleStyle: 'numbers'
  },
  name: 'Numbers (onCaptureScreenshot throws)',
  parameters: {
    layout: 'centered',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const scoreButton = canvas.getByRole('button', { name: 'Score 4' });
    await userEvent.click(scoreButton);

    const attachButton = await canvas.findByRole('button', { name: 'Capture screenshot' });
    await userEvent.click(attachButton);

    const alert = await canvas.findByRole('alert');
    await expect(alert).toHaveTextContent('Screenshot capture is not supported in this browser');

    // Nothing was attached, and the control recovers so capture can be retried
    await expect(canvas.queryByAltText('Screenshot')).not.toBeInTheDocument();
    await expect(canvas.getByRole('button', { name: 'Capture screenshot' })).toBeEnabled();
  },
};
