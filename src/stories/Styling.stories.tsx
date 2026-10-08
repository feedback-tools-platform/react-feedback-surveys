import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { Surface } from '../components/Surface';
import { Survey, type SurveyProps } from '../surveys/Survey';

import './Themes.stories.css';

// how styles combine: --ft-* against themes, the cascade layer against selectors, state keys against parts
const meta = {
  title: 'Styling'
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>

const backgroundOf = (element: Element) => getComputedStyle(element).backgroundColor;

const getChoicesSurvey = (label: string): SurveyProps => ({
  type: 'general',
  responseType: 'choices',
  choiceOptions: ['Bug', 'Idea'],
  textQuestion: `${label}: what is it about?`,
  textButtonSendLabel: 'Submit',
  thankYouMessage: 'Thank you for your feedback',
  strings: {
    feedbackFormLabel: `${label} form`
  },
  onFeedbackSubmit: fn()
});

const getCascadeSurvey = (label: string): SurveyProps => ({
  type: 'general',
  textQuestion: `${label}: have suggestions?`,
  textButtonSendLabel: 'Submit',
  thankYouMessage: 'Thank you for your feedback',
  strings: {
    feedbackFormLabel: `${label} form`
  }
});

export const Cascade: Story = {
  render: () => (
    <div className="themes-stage themes-stage-dark">
      <div className="themes-grid">
        <div style={{ '--ft-color-bg': '260 60% 20%' } as React.CSSProperties}>
          <Surface
            id="cascade-variables"
            theme="dark"
          >
            <Survey {...getCascadeSurvey('Custom background')} />
          </Surface>
        </div>

        <Surface
          id="cascade-outer"
          theme="dark"
        >
          <Surface
            id="cascade-inner"
            theme="light"
          >
            <Survey {...getCascadeSurvey('Nested light')} />
          </Surface>
        </Surface>
      </div>

      <div
        id="cascade-probe"
        style={{ backgroundColor: 'hsl(260 60% 20%)' }}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const byId = (id: string) => canvasElement.querySelector(`#cascade-${id}`)!;
    const white = 'rgb(255, 255, 255)';

    await expect(backgroundOf(byId('variables'))).toBe(backgroundOf(byId('probe')));
    await expect(backgroundOf(byId('outer'))).not.toBe(white);
    await expect(backgroundOf(byId('inner'))).toBe(white);
  }
};

export const LayerOverride: Story = {
  render: () => (
    <>
      <style>
        {'.layer-probe { background-color: rgb(255, 214, 10); }'}
      </style>

      <Survey
        {...getChoicesSurvey('Layer')}
        classNames={{ checkbox: 'layer-probe' }}
      />
    </>
  ),
  play: async ({ canvasElement }) => {
    const checkbox = within(canvasElement).getByRole('checkbox', { name: 'Bug' });

    await userEvent.click(checkbox);

    // the library's `.checkbox:checked + .check` is more specific; only the cascade layer lets this plain class win
    await expect(getComputedStyle(checkbox.nextElementSibling!).backgroundColor).toBe('rgb(255, 214, 10)');
  }
};

export const StateClassNames: Story = {
  render: () => (
    <Survey
      {...getChoicesSurvey('State classes')}
      classNames={{
        choice: 'my-choice',
        checkbox: 'my-checkbox',
        choiceChecked: 'my-choice-checked',
        checkboxChecked: 'my-checkbox-checked'
      }}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole('checkbox', { name: 'Bug' });
    const choice = checkbox.closest('label')!;
    const box = checkbox.nextElementSibling!;

    await expect(choice).toHaveClass('my-choice');
    await expect(choice).not.toHaveClass('my-choice-checked');

    // each state key lands on its own part only, so a utility class never leaks to the neighbour
    await userEvent.click(checkbox);
    await expect(choice).toHaveClass('my-choice', 'my-choice-checked');
    await expect(choice).not.toHaveClass('my-checkbox-checked');
    await expect(box).toHaveClass('my-checkbox', 'my-checkbox-checked');
    await expect(box).not.toHaveClass('my-choice-checked');

    await userEvent.click(checkbox);
    await expect(choice).not.toHaveClass('my-choice-checked');
    await expect(box).not.toHaveClass('my-checkbox-checked');
  }
};

export const Accent: Story = {
  render: () => (
    <div style={{ '--ft-color-accent': '0 100% 30%' } as React.CSSProperties}>
      <Survey {...getChoicesSurvey('Accent')} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole('checkbox', { name: 'Bug' });
    const accent = 'rgb(153, 0, 0)';

    await userEvent.click(checkbox);

    // one variable recolors the primary action: the submit button and the checked box
    await expect(backgroundOf(checkbox.nextElementSibling!)).toBe(accent);
    await expect(backgroundOf(canvas.getByRole('button', { name: 'Submit' }))).toBe(accent);
    await expect(getComputedStyle(canvas.getByRole('button', { name: 'Submit' })).color).toBe('rgb(255, 255, 255)');
  }
};
