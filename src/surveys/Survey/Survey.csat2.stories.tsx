import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn, userEvent, within, expect } from 'storybook/test';

import { Popup } from '../../components/Popup';
import { Surface } from '../../components/Surface';
import { minHeightDecorator } from '../../utils/storybook';

import { Survey, type CsatSurveyProps2 } from './Survey';

const meta = {
  title: 'widgets/Survey/CSAT 2 points',
  component: Survey,
  tags: ['autodocs'],
  argTypes: {
    scaleStyle: {
      control: 'radio',
      options: ['emoji', 'thumbs']
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

const commonProps: Omit<CsatSurveyProps2, 'scaleStyle'> = {
  type: 'csat',
  points: 2,
  classNames: undefined,
  question: 'Are you satisfied with the result?',
  minLabel: undefined,
  maxLabel: undefined,
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
    minLabel: 'No',
    maxLabel: 'Yes',
    scaleStyle: 'emoji',
    responseType: 'text',
    choiceOptions: []
  },
  parameters: {
    layout: 'centered',
  }
};

export const EmojiSurface: Story = {
  args: {
    scaleStyle: 'emoji',
    ...commonProps,
    minLabel: 'No',
    maxLabel: 'Yes',
    responseType: 'choices',
    choiceOptions: ['Very easy', 'Very difficult']
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
    scaleStyle: 'emoji',
    ...commonProps,
    minLabel: 'No',
    maxLabel: 'Yes',
    responseType: 'choices',
    choiceOptions: ['Very easy', 'Very difficult']
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

    // Click on score 2
    const scoreButton = canvas.getByRole('button', { name: 'Yes' });
    await userEvent.click(scoreButton);

    // Verify score callback was called
    await expect(args.onScoreSubmit).toHaveBeenCalledWith({ value: 1 });

    // Wait for feedback screen to appear
    const textarea = await canvas.findByRole('textbox', { name: 'Your feedback' });
    await expect(textarea).toBeInTheDocument();

    // Type feedback text
    await userEvent.type(textarea, 'Very satisfied!');

    // Submit feedback
    const submitButton = canvas.getByRole('button', { name: 'Submit' });
    await userEvent.click(submitButton);

    // Verify feedback callback was called
    await expect(args.onFeedbackSubmit).toHaveBeenCalledWith({
      value: 1,
      text: 'Very satisfied!'
    });

    // Verify thank you message appears
    await expect(canvas.getByText('Thank you for your feedback')).toBeInTheDocument();
  },
};

export const EmojiZeroInteractions: Story = {
  ...Emoji,
  name: 'Emoji (score 0)',
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // Click on "No" — the dissatisfied option, and falsy, so the most regression-prone value
    const scoreButton = canvas.getByRole('button', { name: 'No' });
    await userEvent.click(scoreButton);

    // Verify score callback was called with 0, not skipped as if no score were selected
    await expect(args.onScoreSubmit).toHaveBeenCalledWith({ value: 0 });

    // Skip the follow-up feedback and verify the flow still reaches success
    const skipButton = await canvas.findByRole('button', { name: 'Skip' });
    await userEvent.click(skipButton);

    await expect(args.onFeedbackSubmit).not.toHaveBeenCalled();
    await expect(canvas.getByText('Thank you for your feedback')).toBeInTheDocument();
  },
};

const arabicProps: Omit<CsatSurveyProps2, 'scaleStyle'> = {
  ...commonProps,
  dir: 'rtl',
  question: 'هل أنت راضٍ عن النتيجة؟',
  minLabel: 'لا',
  maxLabel: 'نعم',
  textQuestion: 'نحب أن نسمع رأيك — ما الذي يمكننا تحسينه؟',
  textButtonSendLabel: 'إرسال',
  textButtonSkipLabel: 'تخطي',
  responseType: 'choices',
  choiceOptions: ['سهل جدًا', 'صعب جدًا'],
  thankYouMessage: 'شكرًا لملاحظاتك',
  strings: {
    additionalFeedbackLabel: 'ملاحظات إضافية'
  }
}

export const ThumbsRTL: Story = {
  args: {
    scaleStyle: 'thumbs',
    ...arabicProps
  },
  decorators: [
    minHeightDecorator(240)
  ],
  name: 'Thumbs (Arabic, RTL)',
  render: (args) => (
    <Surface>
      <Survey {...args} />
    </Surface>
  ),
  parameters: {
    layout: 'centered',
  }
};

export const Thumbs: Story = {
  args: {
    scaleStyle: 'thumbs',
    ...commonProps,
    responseType: 'choices',
    choiceOptions: ['Very easy', 'Very difficult']
  },
  parameters: {
    layout: 'centered',
  }
};

export const ThumbsSurface: Story = {
  args: {
    scaleStyle: 'thumbs',
    ...commonProps,
    responseType: 'choices',
    choiceOptions: ['Very easy', 'Very difficult']
  },
  decorators: [
    minHeightDecorator(240)
  ],
  name: 'Thumbs (surface)',
  render: (args) => (
    <Surface>
      <Survey {...args} />
    </Surface>
  ),
  parameters: {
    layout: 'centered',
  }
};


export const ThumbsPopup: Story = {
  args: {
    scaleStyle: 'thumbs',
    ...commonProps,
    responseType: 'choices',
    choiceOptions: ['Very easy', 'Very difficult']
  },
  decorators: [
    minHeightDecorator(240)
  ],
  name: 'Thumbs (popup)',
  render: (args) => (
    <Popup>
      <Survey {...args} />
    </Popup>
  ),
};

export const ThumbsInteractions: Story = {
  ...Thumbs,
  name: 'Thumbs (interactions)',
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // Click on score 1
    const scoreButton = canvas.getByRole('button', { name: 'Thumbs up' });
    await userEvent.click(scoreButton);

    // Verify score callback was called
    await expect(args.onScoreSubmit).toHaveBeenCalledWith({ value: 1 });

    // Wait for feedback screen with choices
    const checkbox1 = await canvas.findByRole('checkbox', { name: 'Very easy' });
    await expect(checkbox1).toBeInTheDocument();

    // Select choice
    await userEvent.click(checkbox1);
    await expect(checkbox1).toBeChecked();

    // Submit feedback
    const submitButton = canvas.getByRole('button', { name: 'Submit' });
    await userEvent.click(submitButton);

    // Verify feedback callback was called
    await expect(args.onFeedbackSubmit).toHaveBeenCalledWith({
      value: 1,
      text: ['Very easy']
    });

    // Verify thank you message appears
    await expect(canvas.getByText('Thank you for your feedback')).toBeInTheDocument();
  },
};

export const ThumbsZeroInteractions: Story = {
  ...Thumbs,
  name: 'Thumbs (score 0)',
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // Click on "Thumbs down" — falsy, so the most regression-prone value
    const scoreButton = canvas.getByRole('button', { name: 'Thumbs down' });
    await userEvent.click(scoreButton);

    // Verify score callback was called with 0, not skipped as if no score were selected
    await expect(args.onScoreSubmit).toHaveBeenCalledWith({ value: 0 });

    // Skip the follow-up feedback and verify the flow still reaches success
    const skipButton = await canvas.findByRole('button', { name: 'Skip' });
    await userEvent.click(skipButton);

    await expect(args.onFeedbackSubmit).not.toHaveBeenCalled();
    await expect(canvas.getByText('Thank you for your feedback')).toBeInTheDocument();
  },
};

export const Preview: Story = {
  args: {
    scaleStyle: 'thumbs',
    ...commonProps,
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
  )
};
