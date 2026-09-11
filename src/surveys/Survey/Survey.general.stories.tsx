import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn, userEvent, within, expect } from 'storybook/test';
import { domToDataUrl } from 'modern-screenshot';

import { Popup } from '../../components/Popup';
import { Surface } from '../../components/Surface';
import { minHeightDecorator } from '../../utils/storybook';

import { Survey, type GeneralSurveyProps } from './Survey';

const meta = {
  title: 'widgets/Survey/General',
  component: Survey,
  tags: ['autodocs'],
  argTypes: {
    dir: {
      control: 'radio',
      options: ['ltr', 'rtl', 'auto']
    },
    responseType: {
      control: 'radio',
      options: ['text', 'choices']
    }
  }
} satisfies Meta<typeof Survey>;

export default meta;
type Story = StoryObj<typeof meta>

const commonProps: GeneralSurveyProps = {
  type: 'general',
  textQuestion: 'Have suggestions? We would love to hear them',
  textButtonSendLabel: 'Submit',
  responseType: 'text',
  choiceOptions: null,
  thankYouMessage: 'Thank you for your feedback',
  onFeedbackSubmit: fn()
}

export const TextFeedback: Story = {
  args: {
    ...commonProps
  },
  parameters: {
    layout: 'centered',
  }
};

export const TextFeedbackSurface: Story = {
  args: {
    ...commonProps
  },
  decorators: [
    minHeightDecorator(240)
  ],
  name: 'Text feedback (surface)',
  render: (args) => (
    <Surface>
      <Survey {...args} />
    </Surface>
  ),
  parameters: {
    layout: 'centered',
  }
};

const arabicProps: GeneralSurveyProps = {
  type: 'general',
  dir: 'rtl',
  textQuestion: 'هل لديك ملاحظات؟ يسعدنا الاستماع إليها',
  textButtonSendLabel: 'إرسال',
  responseType: 'text',
  choiceOptions: null,
  thankYouMessage: 'شكرًا لملاحظاتك',
  strings: {
    yourFeedbackLabel: 'ملاحظاتك'
  },
  onFeedbackSubmit: fn()
}

export const TextFeedbackRTL: Story = {
  args: {
    ...arabicProps
  },
  decorators: [
    minHeightDecorator(240)
  ],
  name: 'Text feedback (Arabic, RTL)',
  render: (args) => (
    <Surface>
      <Survey {...args} />
    </Surface>
  ),
  parameters: {
    layout: 'centered',
  }
};

export const TextFeedbackPopup: Story = {
  args: {
    ...commonProps
  },
  decorators: [
    minHeightDecorator(240)
  ],
  name: 'Text feedback (popup)',
  render: (args) => (
    <Popup>
      <Survey {...args} />
    </Popup>
  ),
};

export const TextFeedbackInteractions: Story = {
  ...TextFeedback,
  name: 'Text feedback (interactions)',
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // The text feedback field is shown immediately — there is no rating screen to click through first
    const textarea = await canvas.findByRole('textbox', { name: 'Your feedback' });
    await expect(textarea).toBeInTheDocument();

    await userEvent.type(textarea, 'Would love a dark mode');

    const submitButton = canvas.getByRole('button', { name: 'Submit' });
    await userEvent.click(submitButton);

    await expect(args.onFeedbackSubmit).toHaveBeenCalledWith({
      value: undefined,
      text: 'Would love a dark mode',
      attachments: undefined
    });

    await expect(canvas.getByText('Thank you for your feedback')).toBeInTheDocument();
  },
};

export const RequiredInteractions: Story = {
  ...TextFeedback,
  name: 'Text feedback (required)',
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // No rating step means feedback is the only chance to leave anything at all —
    // there's no Skip button, and Submit stays disabled until there's text to send.
    await expect(canvas.queryByRole('button', { name: 'Skip' })).not.toBeInTheDocument();

    const submitButton = canvas.getByRole('button', { name: 'Submit' });
    await expect(submitButton).toBeDisabled();

    const textarea = await canvas.findByRole('textbox', { name: 'Your feedback' });
    await userEvent.type(textarea, 'Would love a dark mode');

    await expect(submitButton).toBeEnabled();
    await userEvent.click(submitButton);

    await expect(args.onFeedbackSubmit).toHaveBeenCalledWith({
      value: undefined,
      text: 'Would love a dark mode',
      attachments: undefined
    });

    await expect(canvas.getByText('Thank you for your feedback')).toBeInTheDocument();
  },
};

const screenshotProps: GeneralSurveyProps = {
  ...commonProps,
  onCaptureScreenshot: () => domToDataUrl(document.body)
}

export const ScreenshotAttach: Story = {
  args: {
    ...screenshotProps
  },
  name: 'Text feedback (screenshot attach)',
  parameters: {
    layout: 'centered',
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    const attachButton = await canvas.findByRole('button', { name: 'Capture screenshot' });
    await userEvent.click(attachButton);

    await expect(await canvas.findByAltText('Screenshot')).toBeInTheDocument();

    const textarea = canvas.getByRole('textbox', { name: 'Your feedback' });
    await userEvent.type(textarea, 'Something looks broken here');
    const submitButton = canvas.getByRole('button', { name: 'Submit' });
    await userEvent.click(submitButton);

    await expect(args.onFeedbackSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        text: 'Something looks broken here',
        attachments: [
          expect.objectContaining({ kind: 'screenshot' })
        ]
      })
    );

    await expect(canvas.getByText('Thank you for your feedback')).toBeInTheDocument();
  },
};

export const Preview: Story = {
  args: {
    ...screenshotProps
  },
  name: 'Preview docs',
  parameters: {
    layout: 'fullscreen',
  },
  render: (args) => (
    <div
      style={{
        display: 'inline-flex',
        padding: '1.5rem',
        background: '#5fe7d0'
      }}
    >
      <Surface>
        <Survey {...args} />
      </Surface>
    </div>
  ),
};
