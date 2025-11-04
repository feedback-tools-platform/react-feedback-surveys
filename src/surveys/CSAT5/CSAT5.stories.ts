import type { Meta } from '@storybook/react-vite';

import { CSAT5 } from './CSAT5';

const meta = {
  title: 'widgets/CSAT5',
  component: CSAT5,
  tags: ['autodocs'],
  argTypes: {
    scaleVisualizationType: {
      control: 'radio',
      options: [
        'csat_5_emojis',
        'csat_5_numbers',
        'csat_5_stars'
      ]
    }
  }
} satisfies Meta<typeof CSAT5>;

export default meta;

export const Emojis = {
  args: {
    scaleVisualizationType: 'csat_5_emojis',
    mainQuestion: 'How would you rate your satisfaction with our product?',
    mainLabelLeft: 'Very dissatisfied',
    mainLabelRight: 'Very satisfied',
    feedbackType: 'none',
    feedbackChoices: [],
    successText: 'Thank you for your feedback'
  }
};

export const Numbers = {
  args: {
    scaleVisualizationType: 'csat_5_numbers',
    mainQuestion: 'How would you rate your satisfaction with our product?',
    mainLabelLeft: 'Very dissatisfied',
    mainLabelRight: 'Very satisfied',
    feedbackQuestion: 'How satisfied are you with our onboarding process?',
    feedbackButtonText: 'Submit',
    feedbackType: 'text',
    feedbackChoices: null,
    successText: 'Thank you for your feedback',
  }
};

export const Stars = {
  args: {
    scaleVisualizationType: 'csat_5_stars',
    mainQuestion: 'How would you rate your satisfaction with our product?',
    mainLabelLeft: 'Very dissatisfied',
    mainLabelRight: 'Very satisfied',
    feedbackQuestion: 'How satisfied are you with our onboarding process?',
    feedbackButtonText: 'Submit',
    feedbackType: 'choices',
    feedbackChoices: ['Very easy', 'Very difficult'],
    successText: 'Thank you for your feedback',
  }
};
