import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn, userEvent, within, expect } from 'storybook/test';

import { Popup } from '../../components/Popup';
import { minHeightDecorator } from '../../utils/storybook';

import { CSAT5Survey, type CSAT5SurveyProps } from '../CSAT5Survey';
import { Surface } from '../../components/Surface';

const meta = {
  title: 'widgets/CSAT5 Survey',
  component: CSAT5Survey,
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
} satisfies Meta<typeof CSAT5Survey>;

export default meta;
type Story = StoryObj<typeof meta>

const commonProps: Omit<CSAT5SurveyProps, 'scaleStyle'> = {
  question: 'How would you rate your satisfaction with our product?',
  minLabel: 'Very unsatisfied',
  maxLabel: 'Very satisfied',
  responseType: null,
  textQuestion: 'We’d love to hear your thoughts — what can we improve?',
  textButtonLabel: 'Submit',
  choiceOptions: null,
  thankYouMessage: 'Thank you for your feedback',
  onScoreSubmit: fn(),
  onFeedbackSubmit: fn()
}

export const Emoji: Story = {
  args: {
    scaleStyle: 'emoji',
    ...commonProps,
    textQuestion: '',
    textButtonLabel: ''
  },
  parameters: {
    title: 'teest',
    layout: 'centered',
  }
};

export const EmojiSurface: Story = {
  args: {
    scaleStyle: 'emoji',
    ...commonProps,
    textQuestion: '',
    textButtonLabel: ''
  },
  decorators: [
    minHeightDecorator(240)
  ],
  name: 'Emoji (surface)',
  render: (args) => (
    <Surface>
      <CSAT5Survey {...args} />
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
    textQuestion: '',
    textButtonLabel: ''
  },
  decorators: [
    minHeightDecorator(240)
  ],
  name: 'Emoji (popup)',
  render: (args) => (
    <Popup>
      <CSAT5Survey {...args} />
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
    scaleStyle: 'numbers',
    ...commonProps,
    responseType: 'text',
    choiceOptions: []
  },
  parameters: {
    layout: 'centered',
  }
};

export const NumbersSurface: Story = {
  args: {
    scaleStyle: 'numbers',
    ...commonProps,
    responseType: 'text',
    choiceOptions: []
  },
  decorators: [
    minHeightDecorator(240)
  ],
  name: 'Numbers (surface)',
  render: (args) => (
    <Surface>
      <CSAT5Survey {...args} />
    </Surface>
  ),
  parameters: {
    layout: 'centered',
  }
};

export const NumbersPopup: Story = {
  args: {
    scaleStyle: 'numbers',
    ...commonProps,
    responseType: 'text',
    choiceOptions: []
  },
  decorators: [
    minHeightDecorator(240)
  ],
  name: 'Numbers (popup)',
  render: (args) => (
    <Popup>
      <CSAT5Survey {...args} />
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
    scaleStyle: 'stars',
    ...commonProps,
    responseType: 'choices',
    choiceOptions: ['Very easy', 'Very difficult']
  },
  parameters: {
    layout: 'centered',
  }
};

export const StarsSurface: Story = {
  args: {
    scaleStyle: 'stars',
    ...commonProps,
    responseType: 'choices',
    choiceOptions: ['Very easy', 'Very difficult']
  },
  decorators: [
    minHeightDecorator(240)
  ],
  name: 'Stars (surface)',
  render: (args) => (
    <Surface>
      <CSAT5Survey {...args} />
    </Surface>
  ),
  parameters: {
    layout: 'centered',
  }
};

export const StarsPopup: Story = {
  args: {
    scaleStyle: 'stars',
    ...commonProps,
    responseType: 'choices',
    choiceOptions: ['Very easy', 'Very difficult']
  },
  decorators: [
    minHeightDecorator(240)
  ],
  name: 'Stars (popup)',
  render: (args) => (
    <Popup>
      <CSAT5Survey {...args} />
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

export const Preview: Story = {
  args: {
    scaleStyle: 'emoji',
    ...commonProps,
  },
  name: 'Preview docs',
  parameters: {
    layout: 'centered',
  },
  render: (args) => (
    <div
      style={{
        display: 'flex',
        padding: '1.5rem',
        background: '#5fe7d0'
      }}
    >
      <Surface>
        <CSAT5Survey {...args} />
      </Surface>
    </div>
  ),
};

export const PreviewPopup: Story = {
  args: {
    scaleStyle: 'stars',
    ...commonProps,
  },
  name: 'Preview docs (popup)',
  parameters: {
    layout: 'centered',
  },
  render: (args) => (
    <div
      style={{
        display: 'flex',
        padding: '1.5rem',
        background: '#5fe7d0'
      }}
    >
      <Popup style={{ position: 'static' }}>
        <CSAT5Survey {...args} />
      </Popup>
    </div>
  ),
};
