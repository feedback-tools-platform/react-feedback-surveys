import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { Popup } from '../../components/Popup';
import { minHeightDecorator } from '../../utils/storybook';

import { CES7Survey, type CES7SurveyProps } from './CES7Survey';
import { Surface } from '../../components/Surface';

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
