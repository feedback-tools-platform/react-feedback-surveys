import type { Meta, StoryObj } from '@storybook/react-vite';

import { Popup } from '../../components/Popup';
import { minHeightDecorator } from '../../utils/storybook';

import { CES7Survey, type CES7SurveyProps } from './CES7Survey';

const meta = {
  title: 'widgets/CES7 Survey',
  component: CES7Survey,
  tags: ['autodocs'],
  argTypes: {
    scaleVisualizationType: {
      control: 'radio',
      options: ['numbers']
    }
  }
} satisfies Meta<typeof CES7Survey>;

export default meta;
type Story = StoryObj<typeof meta>

const commonProps: Partial<CES7SurveyProps> = {
  mainQuestion: 'How easy was it to complete your task?',
  mainLabelLeft: 'Very difficult',
  mainLabelRight: 'Very easy',
  feedbackQuestion: 'We’d love to hear your thoughts — what can we improve?',
  feedbackButtonText: 'Submit',
  feedbackType: 'none',
  feedbackChoices: null,
  successText: 'Thank you for your feedback'
}

export const Numbers: Story = {
  args: {
    scaleVisualizationType: 'numbers',
    ...commonProps,
    feedbackType: 'text',
    feedbackChoices: null,
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
    feedbackChoices: null,
  },
  decorators: [
    minHeightDecorator(240)
  ],
  render: (args) => (
    <Popup>
      <CES7Survey {...args} />
    </Popup>
  ),
};
