import type { Meta, StoryObj } from '@storybook/react-vite';

import { Popup } from '../../components/Popup';
import { minHeightDecorator } from '../../utils/storybook';

import { CSAT5Survey, type CSAT5SurveyProps } from '../CSAT5Survey';

const meta = {
  title: 'widgets/CSAT5 Survey',
  component: CSAT5Survey,
  tags: ['autodocs'],
  argTypes: {
    scaleVisualizationType: {
      control: 'radio',
      options: [
        'emoji',
        'numbers',
        'stars'
      ]
    }
  }
} satisfies Meta<typeof CSAT5Survey>;

export default meta;
type Story = StoryObj<typeof meta>

const commonProps: Partial<CSAT5SurveyProps> = {
  mainQuestion: 'How would you rate your satisfaction with our product?',
  mainLabelLeft: 'Very unsatisfied',
  mainLabelRight: 'Very satisfied',
  feedbackQuestion: 'We’d love to hear your thoughts — what can we improve?',
  feedbackButtonText: 'Submit',
  feedbackType: 'none',
  feedbackChoices: null,
  successText: 'Thank you for your feedback'
}

export const Emoji: Story = {
  args: {
    scaleVisualizationType: 'emoji',
    ...commonProps,
    feedbackQuestion: '',
    feedbackButtonText: ''
  },
  parameters: {
    title: 'teest',
    layout: 'centered',
  }
};

export const EmojiPopup: Story = {
  args: {
    scaleVisualizationType: 'emoji',
    ...commonProps,
    feedbackQuestion: '',
    feedbackButtonText: ''
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
    scaleVisualizationType: 'numbers',
    ...commonProps,
    feedbackType: 'text',
    feedbackChoices: []
  },
  parameters: {
    layout: 'centered',
  }
};

export const NumbersPopup: Story = {
  args: {
    scaleVisualizationType: 'numbers',
    ...commonProps,
    feedbackType: 'text',
    feedbackChoices: []
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
    scaleVisualizationType: 'stars',
    ...commonProps,
    feedbackType: 'choices',
    feedbackChoices: ['Very easy', 'Very difficult']
  },
  parameters: {
    layout: 'centered',
  }
};

export const StarsPopup: Story = {
  args: {
    scaleVisualizationType: 'stars',
    ...commonProps,
    feedbackType: 'choices',
    feedbackChoices: ['Very easy', 'Very difficult']
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
