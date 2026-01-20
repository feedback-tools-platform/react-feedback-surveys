import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn, userEvent, within, expect } from 'storybook/test';

import { Popup } from '../../components/Popup';
import { Surface } from '../../components/Surface';
import { minHeightDecorator } from '../../utils/storybook';

import { CES7Survey, type CES7SurveyProps } from './CES7Survey';

const meta = {
  title: 'widgets/CES7 Survey',
  component: CES7Survey,
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
} satisfies Meta<typeof CES7Survey>;

export default meta;
type Story = StoryObj<typeof meta>

const commonProps: CES7SurveyProps = {
  scaleStyle: 'numbers',
  question: 'How easy was it to complete your task?',
  minLabel: 'Very difficult',
  maxLabel: 'Very easy',
  textQuestion: 'We’d love to hear your thoughts — what can we improve?',
  textButtonLabel: 'Submit',
  responseType: null,
  choiceOptions: null,
  thankYouMessage: 'Thank you for your feedback',
  onScoreSubmit: fn(),
  onFeedbackSubmit: fn()
}

export const Numbers: Story = {
  args: {
    ...commonProps,
    responseType: 'text',
    choiceOptions: null,
  },
  parameters: {
    layout: 'centered',
  }
};

export const NumbersSurface: Story = {
  args: {
    ...commonProps,
    responseType: 'choices',
    choiceOptions: [
      'Option 1',
      'Option 2 with looong text content'
    ],
  },
  name: 'Numbers (surface)',
  decorators: [
    minHeightDecorator(240)
  ],
  render: (args) => (
    <Surface>
      <CES7Survey {...args} />
    </Surface>
  ),
  parameters: {
    layout: 'centered',
  }
};

export const NumbersPopup: Story = {
  args: {
    ...commonProps,
    responseType: 'choices',
    choiceOptions: [
      'Option 1',
      'Option 2 with looong text content'
    ],
  },
  name: 'Numbers (popup)',
  decorators: [
    minHeightDecorator(240)
  ],
  render: (args) => (
    <Popup>
      <CES7Survey {...args} />
    </Popup>
  ),
};

export const NumbersInteractions: Story = {
  ...Numbers,
  name: 'Numbers (interactions)',
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // Click on score 5
    const scoreButton = canvas.getByRole('button', { name: 'Score 5' });
    await userEvent.click(scoreButton);

    // Verify score callback was called
    await expect(args.onScoreSubmit).toHaveBeenCalledWith({ value: 5 });

    // Wait for feedback screen to appear
    const textarea = await canvas.findByRole('textbox', { name: 'Your feedback' });
    await expect(textarea).toBeInTheDocument();

    // Type feedback text
    await userEvent.type(textarea, 'Great experience!');

    // Submit feedback
    const submitButton = canvas.getByRole('button', { name: 'Submit' });
    await userEvent.click(submitButton);

    // Verify feedback callback was called
    await expect(args.onFeedbackSubmit).toHaveBeenCalledWith({
      value: 5,
      text: 'Great experience!'
    });

    // Verify thank you message appears
    await expect(canvas.getByText('Thank you for your feedback')).toBeInTheDocument();
  },
};

export const Preview: Story = {
  args: {
    ...commonProps
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
        backgroundColor: '#5fe7d0'
      }}
    >
      <Surface>
        <CES7Survey {...args} />
      </Surface>
    </div>
  )
};
