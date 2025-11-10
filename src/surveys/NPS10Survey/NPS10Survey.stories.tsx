import type { Meta, StoryObj } from '@storybook/react-vite';

import { Popup } from '../../components/Popup';
import { minHeightDecorator } from '../../utils/storybook';

import { NPS10Survey, type NPS10SurveyProps } from './NPS10Survey';

const meta = {
  title: 'widgets/NPS10 Survey',
  component: NPS10Survey,
  tags: ['autodocs'],
  argTypes: {
    scaleStyle: {
      control: 'radio',
      options: ['numbers']
    },
    responseType: {
      control: 'radio',
      options: [null, 'choices', 'text']
    }
  }
} satisfies Meta<typeof NPS10Survey>;

export default meta;
type Story = StoryObj<typeof meta>

const commonProps: NPS10SurveyProps = {
  scaleStyle: 'numbers',
  question: 'How likely are you to recommend our product/service to a friend or colleague?',
  minLabel: 'Very unlikely',
  maxLabel: 'Very likely',
  responseType: 'text',
  textQuestion: 'We’d love to hear your thoughts — what can we improve?',
  textButtonLabel: 'Submit',
  choiceOptions: null,
  thankYouMessage: 'Thank you for your feedback'
};

export const Numbers: Story = {
  args: {
    ...commonProps
  },
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
      <NPS10Survey {...args} />
    </Popup>
  ),
};
