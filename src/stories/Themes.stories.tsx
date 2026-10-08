import { useCallback, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { domToDataUrl } from 'modern-screenshot';

import { Popup } from '../components/Popup';
import { Surface } from '../components/Surface';
import { Survey, type SurveyProps } from '../surveys/Survey';
import type { SurveyTheme } from '../types';
import { cn } from '../utils';

import { brutal } from './themes/brutal';
import { chat } from './themes/chat';
import { editorial } from './themes/editorial';
import { enterprise } from './themes/enterprise';
import { inline } from './themes/inline';
import { playful } from './themes/playful';
import { receipt } from './themes/receipt';
import { retroOs } from './themes/retro-os';
import { soft } from './themes/soft';
import { terminal } from './themes/terminal';
import type { CustomTheme } from './themes/types';

import './Themes.stories.css';

type Mode = 'light' | 'dark' | 'auto' | 'inline' | 'soft' | 'brutal' | 'terminal' | 'playful' | 'chat' | 'editorial' | 'enterprise' | 'receipt' | 'retro-os';

const MODES: Record<Mode, { label: string; theme: SurveyTheme; custom?: CustomTheme }> = {
  light: { label: 'Light', theme: 'light' },
  dark: { label: 'Dark', theme: 'dark' },
  auto: { label: 'Auto', theme: 'auto' },
  inline: { label: 'Inline', theme: inline.theme, custom: inline },
  soft: { label: 'Soft', theme: soft.theme, custom: soft },
  brutal: { label: 'Brutal', theme: brutal.theme, custom: brutal },
  terminal: { label: 'Terminal', theme: terminal.theme, custom: terminal },
  playful: { label: 'Playful', theme: playful.theme, custom: playful },
  chat: { label: 'Chat', theme: chat.theme, custom: chat },
  editorial: { label: 'Editorial', theme: editorial.theme, custom: editorial },
  enterprise: { label: 'Enterprise', theme: enterprise.theme, custom: enterprise },
  receipt: { label: 'Receipt', theme: receipt.theme, custom: receipt },
  'retro-os': { label: 'Retro OS', theme: retroOs.theme, custom: retroOs }
};

const isMode = (value: string): value is Mode => value in MODES;

const SURFACE_SURVEYS: { id: string; props: SurveyProps }[] = [
  {
    id: 'nps',
    props: {
      type: 'nps',
      scaleStyle: 'numbers',
      question: 'How likely are you to recommend us to a friend?',
      minLabel: 'Not likely',
      maxLabel: 'Very likely',
      responseType: 'text',
      textQuestion: 'What is the main reason for your score?',
      thankYouMessage: 'Thank you for your feedback',
      onScoreSubmit: fn(),
      onFeedbackSubmit: fn()
    }
  },
  {
    id: 'csat-stars',
    props: {
      type: 'csat',
      points: 5,
      scaleStyle: 'stars',
      question: 'How would you rate your experience?',
      minLabel: 'Very bad',
      maxLabel: 'Excellent',
      responseType: 'choices',
      textQuestion: 'What could we do better?',
      choiceOptions: ['Speed', 'Design', 'Support'],
      thankYouMessage: 'Thank you for your feedback',
      onScoreSubmit: fn(),
      onFeedbackSubmit: fn()
    }
  },
  {
    id: 'general-text',
    props: {
      type: 'general',
      textQuestion: 'Have suggestions? We would love to hear them',
      textButtonSendLabel: 'Submit',
      thankYouMessage: 'Thank you for your feedback',
      strings: {
        feedbackFormLabel: 'Suggestion form'
      },
      onCaptureScreenshot: () => domToDataUrl(document.body),
      onFeedbackSubmit: fn()
    }
  },
  {
    id: 'general-choices',
    props: {
      type: 'general',
      responseType: 'choices',
      textQuestion: 'What went wrong?',
      textButtonSendLabel: 'Submit',
      choiceOptions: ['Too slow', 'Confusing interface', 'Missing a feature'],
      thankYouMessage: 'Thank you for your feedback',
      strings: {
        feedbackFormLabel: 'Problem report form'
      },
      onFeedbackSubmit: fn()
    }
  }
];

const POPUP_SURVEY: SurveyProps = {
  type: 'csat',
  points: 2,
  scaleStyle: 'thumbs',
  question: 'Was this page helpful?',
  responseType: 'text',
  textQuestion: 'How can we improve it?',
  textButtonSendLabel: 'Submit',
  textButtonSkipLabel: 'Skip',
  thankYouMessage: 'Thank you for your feedback',
  onScoreSubmit: fn(),
  onFeedbackSubmit: fn()
};

interface ThemesShowcaseProps {
  /** Theme selected on first render */
  initialMode?: Mode;
}

const ThemesShowcase: React.FC<ThemesShowcaseProps> = ({
  initialMode = 'light'
}) => {
  const [mode, setMode] = useState<Mode>(initialMode);

  const onModeClick = useCallback((event: React.MouseEvent<HTMLButtonElement>): void => {
    const value = event.currentTarget.value;

    if (isMode(value)) {
      setMode(value);
    }
  }, []);

  const { theme, custom } = MODES[mode];

  return (
    <div className={cn('themes-stage', `themes-stage-${mode}`)}>
      <div
        aria-label="Theme"
        className="themes-switcher"
        role="group"
      >
        {(Object.keys(MODES) as Mode[]).map((key) => (
          <button
            key={key}
            aria-pressed={mode === key}
            type="button"
            value={key}
            onClick={onModeClick}
          >
            {MODES[key].label}
          </button>
        ))}
      </div>

      <div className="themes-grid">
        {SURFACE_SURVEYS.map(({ id, props }) => (
          <Surface
            key={id}
            className={custom?.surface}
            theme={theme}
          >
            <Survey
              {...props}
              classNames={custom?.classNames}
            />
          </Surface>
        ))}

        <Popup
          animated={false}
          classNames={custom?.popup}
          style={{ position: 'static' }}
          theme={theme}
        >
          <Survey
            {...POPUP_SURVEY}
            classNames={custom?.classNames}
          />
        </Popup>
      </div>
    </div>
  );
};

const meta = {
  title: 'widgets/Themes',
  component: ThemesShowcase,
  parameters: {
    layout: 'fullscreen'
  },
  argTypes: {
    initialMode: {
      control: 'radio',
      options: Object.keys(MODES)
    }
  }
} satisfies Meta<typeof ThemesShowcase>;

export default meta;
type Story = StoryObj<typeof meta>

const backgroundOf = (element: Element) => getComputedStyle(element).backgroundColor;

export const Playground: Story = {};

export const Dark: Story = {
  args: {
    initialMode: 'dark'
  }
};

export const Inline: Story = {
  args: {
    initialMode: 'inline'
  }
};

export const Soft: Story = {
  args: {
    initialMode: 'soft'
  }
};

export const Brutal: Story = {
  args: {
    initialMode: 'brutal'
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole('checkbox', { name: 'Too slow' });

    await userEvent.click(checkbox);

    // `input:checked + .brutal-check` is weaker than the library's `.checkbox:checked + .check`, the layer lets it win
    await expect(backgroundOf(checkbox.nextElementSibling!)).toBe('rgb(255, 214, 10)');
  }
};

export const Terminal: Story = {
  args: {
    initialMode: 'terminal'
  }
};

export const Playful: Story = {
  args: {
    initialMode: 'playful'
  }
};

export const Chat: Story = {
  args: {
    initialMode: 'chat'
  }
};

export const Editorial: Story = {
  args: {
    initialMode: 'editorial'
  }
};

export const Enterprise: Story = {
  args: {
    initialMode: 'enterprise'
  }
};

export const Receipt: Story = {
  args: {
    initialMode: 'receipt'
  }
};

export const RetroOs: Story = {
  name: 'Retro OS',
  args: {
    initialMode: 'retro-os'
  }
};

type CatalogMode = Exclude<Mode, 'light' | 'dark' | 'auto'>;

const CATALOG_TEXTS = {
  textButtonSendLabel: 'Submit',
  thankYouMessage: 'Thank you for your feedback'
};

interface CatalogEntry {
  mode: CatalogMode;
  useCase: string;
  survey: SurveyProps;
  /** Show the rating scale instead of opening the feedback step */
  showRating?: boolean;
}

const CATALOG: CatalogEntry[] = [
  {
    mode: 'inline',
    showRating: true,
    useCase: 'Embedded in articles, docs, product pages',
    survey: {
      ...CATALOG_TEXTS,
      type: 'csat',
      points: 2,
      scaleStyle: 'thumbs',
      question: 'Did you find what you were looking for?',
      responseType: 'text',
      textQuestion: 'What were you looking for?'
    }
  },
  {
    mode: 'soft',
    showRating: true,
    useCase: 'Consumer apps, wellness, onboarding',
    survey: {
      ...CATALOG_TEXTS,
      type: 'csat',
      points: 5,
      scaleStyle: 'emoji',
      question: 'How do you feel about your first week?',
      minLabel: 'Not great',
      maxLabel: 'Amazing',
      responseType: 'text',
      textQuestion: 'What would make it better?'
    }
  },
  {
    mode: 'chat',
    useCase: 'Support chats, help centers',
    survey: {
      ...CATALOG_TEXTS,
      type: 'csat',
      points: 2,
      scaleStyle: 'thumbs',
      question: 'Did we solve your problem today?',
      responseType: 'choices',
      textQuestion: 'What went wrong?',
      choiceOptions: ['Slow reply', 'Wrong answer', 'Not solved']
    }
  },
  {
    mode: 'playful',
    useCase: 'Learning apps, consumer apps, gamification',
    survey: {
      ...CATALOG_TEXTS,
      type: 'csat',
      points: 5,
      scaleStyle: 'emoji',
      question: 'How was today’s lesson?',
      minLabel: 'Boring',
      maxLabel: 'Loved it',
      responseType: 'choices',
      textQuestion: 'What should we change?',
      choiceOptions: ['Too easy', 'Too hard']
    }
  },
  {
    mode: 'editorial',
    useCase: 'Blogs, media, documentation',
    survey: {
      ...CATALOG_TEXTS,
      type: 'csat',
      points: 2,
      scaleStyle: 'emoji',
      question: 'Was this article helpful?',
      responseType: 'text',
      textQuestion: 'What was missing?'
    }
  },
  {
    mode: 'enterprise',
    useCase: 'B2B SaaS, admin panels, internal tools',
    survey: {
      ...CATALOG_TEXTS,
      type: 'ces',
      scaleStyle: 'numbers',
      question: 'How easy was it to set up the integration?',
      minLabel: 'Very difficult',
      maxLabel: 'Very easy',
      responseType: 'text',
      textQuestion: 'What slowed you down?'
    }
  },
  {
    mode: 'receipt',
    showRating: true,
    useCase: 'After a purchase: e-commerce, food delivery, restaurants',
    survey: {
      ...CATALOG_TEXTS,
      type: 'csat',
      points: 5,
      scaleStyle: 'numbers',
      question: 'How was your order?',
      minLabel: 'Poor',
      maxLabel: 'Excellent',
      responseType: 'text',
      textQuestion: 'What could make your next order better?'
    }
  },
  {
    mode: 'retro-os',
    useCase: 'Promo campaigns, nostalgia marketing, games',
    survey: {
      ...CATALOG_TEXTS,
      type: 'csat',
      points: 5,
      scaleStyle: 'stars',
      question: 'How would you rate Setup Wizard?',
      minLabel: 'Poor',
      maxLabel: 'Excellent',
      responseType: 'choices',
      textQuestion: 'What went wrong during setup?',
      choiceOptions: ['Too many steps', 'Unclear errors', 'It froze']
    }
  },
  {
    mode: 'terminal',
    useCase: 'Developer tools, CLIs, API platforms',
    survey: {
      ...CATALOG_TEXTS,
      type: 'csat',
      points: 5,
      scaleStyle: 'numbers',
      question: 'How smooth was the install?',
      minLabel: 'Broken',
      maxLabel: 'Flawless',
      responseType: 'text',
      textQuestion: 'Which step failed?'
    }
  },
  {
    mode: 'brutal',
    useCase: 'Indie products, creative studios, portfolios',
    survey: {
      ...CATALOG_TEXTS,
      type: 'general',
      responseType: 'choices',
      textQuestion: 'What should we build next?',
      textButtonSendLabel: 'Vote',
      choiceOptions: ['Dark mode', 'Mobile app', 'Integrations']
    }
  }
];

const ThemesCatalog: React.FC = () => (
  <div className="themes-catalog">
    {CATALOG.map(({ mode, useCase, survey }) => {
      const { label, theme, custom } = MODES[mode];

      return (
        <section
          key={mode}
          aria-label={`${label} theme`}
          className={cn('themes-tile', `themes-stage-${mode}`)}
        >
          <div className="themes-tile-caption">
            <strong>
              {label}
            </strong>
            <span>
              {useCase}
            </span>
          </div>

          <Surface
            className={custom?.surface}
            theme={theme}
          >
            <Survey
              {...survey}
              classNames={custom?.classNames}
              strings={{ feedbackFormLabel: `${label} feedback form` }}
              onScoreSubmit={fn()}
              onFeedbackSubmit={fn()}
            />
          </Surface>
        </section>
      );
    })}
  </div>
);

const openFeedbackSteps = async (canvasElement: HTMLElement, entries: CatalogEntry[]) => {
  const canvas = within(canvasElement);

  for (const { mode, survey } of entries) {
    const tile = within(canvas.getByRole('region', { name: `${MODES[mode].label} theme` }));

    // general surveys already open on the feedback step
    if (survey.type !== 'general') {
      await userEvent.click(tile.getAllByRole('button')[0]);
    }

    await expect(tile.getByRole('button', { name: /Submit|Vote/ })).toBeVisible();
  }
};

export const Catalog: Story = {
  name: 'Catalog (themes by use case)',
  render: () => (
    <ThemesCatalog />
  ),
  play: async ({ canvasElement }) => {
    await openFeedbackSteps(canvasElement, CATALOG.filter(({ showRating }) => !showRating));
  }
};

// hidden from the sidebar: it only exists so the a11y check also covers every theme's feedback step
export const CatalogFeedbackStep: Story = {
  tags: ['!dev'],
  render: () => (
    <ThemesCatalog />
  ),
  play: async ({ canvasElement }) => {
    await openFeedbackSteps(canvasElement, CATALOG);
  }
};

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
  name: 'Cascade (variables beat theme, nearest theme wins)',
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
