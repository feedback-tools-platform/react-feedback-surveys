import type { Meta, StoryObj } from '@storybook/react-vite';

import { Popup } from '../../components/Popup';
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
  thankYouMessage: 'Thank you for your feedback'
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

export const NumbersPopup: Story = {
  args: {
    ...commonProps,
    responseType: 'choices',
    choiceOptions: null,
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
