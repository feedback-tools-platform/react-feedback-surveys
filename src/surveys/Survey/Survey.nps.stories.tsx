import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn, userEvent, within, expect } from 'storybook/test';

import { Popup } from '../../components/Popup';
import { Surface } from '../../components/Surface';
import { minHeightDecorator } from '../../utils/storybook';

import { Survey, type NpsSurveyProps } from './Survey';

const meta = {
  title: 'widgets/Survey/NPS',
  component: Survey,
  tags: ['autodocs'],
  argTypes: {
    scaleStyle: {
      control: 'radio',
      options: ['numbers']
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

const commonProps: NpsSurveyProps = {
  type: 'nps',
  scaleStyle: 'numbers',
  question: 'How likely are you to recommend our product/service to a friend or colleague?',
  minLabel: 'Very unlikely',
  maxLabel: 'Very likely',
  responseType: 'text',
  textQuestion: 'We’d love to hear your thoughts — what can we improve?',
  textButtonSendLabel: 'Submit',
  textButtonSkipLabel: 'Skip',
  choiceOptions: null,
  thankYouMessage: 'Thank you for your feedback',
  onScoreSubmit: fn(),
  onFeedbackSubmit: fn()
};

export const Numbers: Story = {
  args: {
    ...commonProps
  },
  parameters: {
    layout: 'centered',
  }
};

export const NumbersSurface: Story = {
  args: {
    ...commonProps
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

const arabicProps: NpsSurveyProps = {
  ...commonProps,
  dir: 'rtl',
  question: 'ما مدى احتمال أن توصي بمنتجنا أو خدمتنا لصديق أو زميل؟',
  minLabel: 'غير محتمل جدًا',
  maxLabel: 'محتمل جدًا',
  textQuestion: 'نحب أن نسمع رأيك — ما الذي يمكننا تحسينه؟',
  textButtonSendLabel: 'إرسال',
  textButtonSkipLabel: 'تخطي',
  choiceOptions: null,
  thankYouMessage: 'شكرًا لملاحظاتك',
  strings: {
    yourFeedbackLabel: 'ملاحظاتك'
  }
};

export const NumbersRTL: Story = {
  args: {
    ...arabicProps
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

export const NumbersPopup: Story = {
  args: {
    ...commonProps
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

    // Click on score 9
    const scoreButton = canvas.getByRole('button', { name: 'Score 9' });
    await userEvent.click(scoreButton);

    // Verify score callback was called
    await expect(args.onScoreSubmit).toHaveBeenCalledWith({ value: 9 });

    // Wait for feedback screen to appear
    const textarea = await canvas.findByRole('textbox', { name: 'Your feedback' });
    await expect(textarea).toBeInTheDocument();

    // Type feedback text
    await userEvent.type(textarea, 'Excellent service!');

    // Submit feedback
    const submitButton = canvas.getByRole('button', { name: 'Submit' });
    await userEvent.click(submitButton);

    // Verify feedback callback was called
    await expect(args.onFeedbackSubmit).toHaveBeenCalledWith({
      value: 9,
      text: 'Excellent service!'
    });

    // Verify thank you message appears
    await expect(canvas.getByText('Thank you for your feedback')).toBeInTheDocument();
  },
};

export const NumbersZeroInteractions: Story = {
  ...Numbers,
  name: 'Numbers (score 0)',
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // Click on score 0 — the detractor floor, and falsy, so the most regression-prone value
    const scoreButton = canvas.getByRole('button', { name: 'Score 0' });
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
    ...commonProps
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

export const PreviewMobile: Story = {
  args: {
    ...commonProps
  },
  globals: {
    viewport: {
      value: 'iphoneXR'
    }
  },
  name: 'Preview docs (mobile)',
  parameters: {
    layout: 'fullscreen',
  },
  render: (args) => (
    <div
      style={{
        width: 340,
        boxSizing: 'border-box',
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
