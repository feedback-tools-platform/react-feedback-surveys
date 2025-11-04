import type { Meta } from '@storybook/react-vite';

import { CES7 } from './CES7';

const meta = {
  title: 'widgets/CES7',
  component: CES7,
  tags: ['autodocs'],
  argTypes: {
    scaleVisualizationType: {
      control: 'radio',
      options: ['ces_7_numbers']
    }
  }
} satisfies Meta<typeof CES7>;

export default meta;

export const Numbers = {
  args: {
    scaleVisualizationType: 'ces_7_numbers',
    mainQuestion: 'How likely are you to recommend our product/service to a friend or colleague?',
    mainLabelLeft: 'Very unlikely',
    mainLabelRight: 'Very likely',
    feedbackQuestion: 'How satisfied are you with our onboarding process?',
    feedbackButtonText: 'Submit',
    feedbackType: 'text',
    feedbackChoices: null,
    successText: 'Thank you for your feedback',
  }
};
