import type { Meta } from '@storybook/react-vite';

import { CSAT2 } from './CSAT2';

const meta = {
  title: 'widgets/CSAT2',
  component: CSAT2,
  tags: ['autodocs'],
  argTypes: {
    scaleVisualizationType: {
      control: 'radio',
      options: ['csat_2_emojis_mood', 'csat_2_emojis_thumbs']
    }
  }
} satisfies Meta<typeof CSAT2>;

export default meta;

export const EmojisMood = {
  args: {
    scaleVisualizationType: 'csat_2_emojis_mood',
    mainQuestion: 'Are you satisfied with the result?',
    mainLabelLeft: undefined,
    mainLabelRight: undefined,
    feedbackQuestion: 'We’d love to hear your thoughts — what can we improve?',
    feedbackButtonText: 'Submit',
    feedbackType: 'text',
    feedbackChoices: null,
    successText: 'Thank you for your feedback'
  }
};

export const EmojisThumbs = {
  args: {
    scaleVisualizationType: 'csat_2_emojis_thumbs',
    mainQuestion: 'Are you satisfied with the result?',
    mainLabelLeft: undefined,
    mainLabelRight: undefined,
    feedbackQuestion: 'We’d love to hear your thoughts — what can we improve?',
    feedbackButtonText: 'Submit',
    feedbackType: 'choices',
    feedbackChoices: ['Very easy', 'Very difficult'],
    successText: 'Thank you for your feedback'
  }
};
