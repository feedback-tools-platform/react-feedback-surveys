import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn, userEvent, within, expect } from 'storybook/test';

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
      text: 'Very easy'
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
