import type { Meta, StoryObj } from '@storybook/react-vite';

import { Popup } from '../../components/Popup';
import { minHeightDecorator } from '../../utils/storybook';

import { CSAT2Survey, type CSAT2SurveyProps } from './CSAT2Survey';

const meta = {
  title: 'widgets/CSAT2 Survey',
  component: CSAT2Survey,
  tags: ['autodocs'],
  argTypes: {
    scaleVisualizationType: {
      control: 'radio',
      options: ['emoji', 'thumbs']
    }
  }
} satisfies Meta<typeof CSAT2Survey>;

export default meta;
type Story = StoryObj<typeof meta>

const commonProps: Partial<CSAT2SurveyProps> = {
  classNames: undefined,
  mainQuestion: 'Are you satisfied with the result?',
  mainLabelLeft: undefined,
  mainLabelRight: undefined,
  feedbackQuestion: 'We’d love to hear your thoughts — what can we improve?',
  feedbackButtonText: 'Submit',
  feedbackType: 'none',
  feedbackChoices: null,
  successText: 'Thank you for your feedback'
}

export const Emoji: Story = {
  args: {
    ...commonProps,
    scaleVisualizationType: 'emoji',
    feedbackType: 'text',
    feedbackChoices: []
  },
  parameters: {
    layout: 'centered',
  }
};

export const EmojiPopup: Story = {
  args: {
    scaleVisualizationType: 'emoji',
    ...commonProps,
    feedbackType: 'choices',
    feedbackChoices: ['Very easy', 'Very difficult']
  },
  decorators: [
    minHeightDecorator(240)
  ],
  render: (args) => (
    <Popup>
      <CSAT2Survey {...args} />
    </Popup>
  ),
};

export const Thumbs: Story = {
  args: {
    scaleVisualizationType: 'emoji',
    ...commonProps,
    feedbackType: 'choices',
    feedbackChoices: ['Very easy', 'Very difficult']
  },
  parameters: {
    layout: 'centered',
  }
};

export const ThumbsPopup: Story = {
  args: {
    scaleVisualizationType: 'emoji',
    ...commonProps,
    feedbackType: 'choices',
    feedbackChoices: ['Very easy', 'Very difficult']
  },
  decorators: [
    minHeightDecorator(240)
  ],
  render: (args) => (
    <Popup>
      <CSAT2Survey {...args} />
    </Popup>
  ),
};
