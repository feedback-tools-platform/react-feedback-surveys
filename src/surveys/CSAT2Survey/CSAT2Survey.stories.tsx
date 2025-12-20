import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import { Popup } from '../../components/Popup';
import { minHeightDecorator } from '../../utils/storybook';

import { CSAT2Survey, type CSAT2SurveyProps } from './CSAT2Survey';
import { Surface } from '../../components/Surface';

const meta = {
  title: 'widgets/CSAT2 Survey',
  component: CSAT2Survey,
  tags: ['autodocs'],
  argTypes: {
    scaleStyle: {
      control: 'radio',
      options: ['emoji', 'thumbs']
    },
    dir: {
      control: 'radio',
      options: ['ltr', 'rtl', 'auto']
    },
    responseType: {
      control: 'radio',
      options: [null, 'choices', 'text']
    }
  }
} satisfies Meta<typeof CSAT2Survey>;

export default meta;
type Story = StoryObj<typeof meta>

const commonProps: Omit<CSAT2SurveyProps, 'scaleStyle'> = {
  classNames: undefined,
  question: 'Are you satisfied with the result?',
  minLabel: undefined,
  maxLabel: undefined,
  responseType: null,
  textQuestion: 'We’d love to hear your thoughts — what can we improve?',
  textButtonLabel: 'Submit',
  choiceOptions: null,
  thankYouMessage: 'Thank you for your feedback',
  onScoreSubmit: fn(),
  onFeedbackSubmit: fn()
}

export const Emoji: Story = {
  args: {
    ...commonProps,
    scaleStyle: 'emoji',
    responseType: 'text',
    choiceOptions: []
  },
  parameters: {
    layout: 'centered',
  }
};

export const EmojiSurface: Story = {
  args: {
    scaleStyle: 'emoji',
    ...commonProps,
    responseType: 'choices',
    choiceOptions: ['Very easy', 'Very difficult']
  },
  decorators: [
    minHeightDecorator(240)
  ],
  name: 'Emoji (surface)',
  render: (args) => (
    <Surface>
      <CSAT2Survey {...args} />
    </Surface>
  ),
  parameters: {
    layout: 'centered',
  }
};

export const EmojiPopup: Story = {
  args: {
    scaleStyle: 'emoji',
    ...commonProps,
    responseType: 'choices',
    choiceOptions: ['Very easy', 'Very difficult']
  },
  decorators: [
    minHeightDecorator(240)
  ],
  name: 'Emoji (popup)',
  render: (args) => (
    <Popup>
      <CSAT2Survey {...args} />
    </Popup>
  ),
};

export const Thumbs: Story = {
  args: {
    scaleStyle: 'thumbs',
    ...commonProps,
    responseType: 'choices',
    choiceOptions: ['Very easy', 'Very difficult']
  },
  parameters: {
    layout: 'centered',
  }
};

export const ThumbsSurface: Story = {
  args: {
    scaleStyle: 'thumbs',
    ...commonProps,
    responseType: 'choices',
    choiceOptions: ['Very easy', 'Very difficult']
  },
  decorators: [
    minHeightDecorator(240)
  ],
  name: 'Thumbs (surface)',
  render: (args) => (
    <Surface>
      <CSAT2Survey {...args} />
    </Surface>
  ),
  parameters: {
    layout: 'centered',
  }
};


export const ThumbsPopup: Story = {
  args: {
    scaleStyle: 'thumbs',
    ...commonProps,
    responseType: 'choices',
    choiceOptions: ['Very easy', 'Very difficult']
  },
  decorators: [
    minHeightDecorator(240)
  ],
  name: 'Thumbs (popup)',
  render: (args) => (
    <Popup>
      <CSAT2Survey {...args} />
    </Popup>
  ),
};
