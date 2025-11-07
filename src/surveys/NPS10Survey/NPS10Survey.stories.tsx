import type { Meta, StoryObj } from '@storybook/react-vite';

import { Popup } from '../../components/Popup';
import { minHeightDecorator } from '../../utils/storybook';

import { NPS10Survey, type NPS10SurveyProps } from './NPS10Survey';

const meta = {
  title: 'widgets/NPS10 Survey',
  component: NPS10Survey,
  tags: ['autodocs'],
  argTypes: {
    scaleVisualizationType: {
      control: 'radio',
      options: ['numbers']
    }
  }
} satisfies Meta<typeof NPS10Survey>;

export default meta;
type Story = StoryObj<typeof meta>

const commonProps: Partial<NPS10SurveyProps> = {
  mainQuestion: 'How likely are you to recommend our product/service to a friend or colleague?',
  mainLabelLeft: 'Very unlikely',
  mainLabelRight: 'Very likely',
  feedbackQuestion: 'We’d love to hear your thoughts — what can we improve?',
  feedbackButtonText: 'Submit',
  feedbackType: 'text',
  feedbackChoices: null,
  successText: 'Thank you for your feedback'
};

export const Numbers: Story = {
  args: {
    scaleVisualizationType: 'numbers',
    ...commonProps
  },
  parameters: {
    layout: 'centered',
  }
};

export const NumbersPopup: Story = {
  args: {
    scaleVisualizationType: 'numbers',
    ...commonProps
  },
  decorators: [
    minHeightDecorator(240)
  ],
  render: (args) => (
    <Popup>
      <NPS10Survey {...args} />
    </Popup>
  ),
};
