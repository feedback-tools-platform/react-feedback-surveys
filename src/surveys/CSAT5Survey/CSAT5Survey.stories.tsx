import type { Meta, StoryObj } from '@storybook/react-vite';

import { Popup } from '../../components/Popup';
import { minHeightDecorator } from '../../utils/storybook';

import { CSAT5Survey, type CSAT5SurveyProps } from '../CSAT5Survey';

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
  thankYouMessage: 'Thank you for your feedback'
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
  render: (args) => (
    <Popup>
      <CSAT5Survey {...args} />
    </Popup>
  ),
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
  render: (args) => (
    <Popup>
      <CSAT5Survey {...args} />
    </Popup>
  ),
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
  render: (args) => (
    <Popup>
      <CSAT5Survey {...args} />
    </Popup>
  ),
};
