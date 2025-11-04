import type { Meta } from '@storybook/react-vite';

import { NPS10 } from './NPS10';

const meta = {
  title: 'widgets/NPS10',
  component: NPS10,
  tags: ['autodocs'],
  argTypes: {
    scaleVisualizationType: {
      control: 'radio',
      options: ['nps_10_numbers']
    }
  }
} satisfies Meta<typeof NPS10>;

export default meta;

export const Numbers = {
  args: {
    scaleVisualizationType: 'nps_10_numbers',
    mainQuestion: 'How likely are you to recommend our product/service to a friend or colleague?',
    mainLabelLeft: 'Very unlikely',
    mainLabelRight: 'Very likely',
    feedbackQuestion: 'How satisfied are you with our onboarding process?',
    feedbackButtonText: 'Submit',
    feedbackType: 'text',
    feedbackChoices: null,
    successText: 'Thank you for your feedback'
  }
};
