import { useCallback, useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { domToDataUrl } from 'modern-screenshot';

import { Popup } from '../components/Popup';
import { Surface } from '../components/Surface';
import { Survey, type SurveyProps } from '../surveys/Survey';
import type { SurveyTheme } from '../types';
import { cn } from '../utils';

import { ShadowHost } from './ShadowHost';
import { withinShadow } from './withinShadow';
import { brutal } from './themes/brutal';
import { chat } from './themes/chat';
import { editorial } from './themes/editorial';
import { enterprise } from './themes/enterprise';
import { minimal } from './themes/minimal';
import { playful } from './themes/playful';
import { receipt } from './themes/receipt';
import { retroOs } from './themes/retro-os';
import { soft } from './themes/soft';
import { terminal } from './themes/terminal';
import type { CustomTheme } from './themes/types';

import './Themes.stories.css';

type Mode = 'light' | 'dark' | 'auto' | 'minimal' | 'soft' | 'brutal' | 'terminal' | 'playful' | 'chat' | 'editorial' | 'enterprise' | 'receipt' | 'retro-os';

const MODES: Record<Mode, { label: string; description: string; theme: SurveyTheme; custom?: CustomTheme }> = {
  light: {
    label: 'Light',
    description: 'Default palette, same as no theme',
    theme: 'light'
  },
  dark: {
    label: 'Dark',
    description: 'Ready dark palette for dark sites',
    theme: 'dark'
  },
  auto: {
    label: 'Auto',
    description: 'Follows the visitor\'s system color scheme',
    theme: 'auto'
  },
  minimal: {
    label: 'Minimal',
    description: 'Embedded in articles, docs, product pages',
    theme: minimal.theme,
    custom: minimal
  },
  soft: {
    label: 'Soft',
    description: 'Consumer apps, wellness, onboarding',
    theme: soft.theme,
    custom: soft
  },
  brutal: {
    label: 'Brutal',
    description: 'Indie products, creative studios, portfolios',
    theme: brutal.theme,
    custom: brutal
  },
  terminal: {
    label: 'Terminal',
    description: 'Developer tools, CLIs, API platforms',
    theme: terminal.theme,
    custom: terminal
  },
  playful: {
    label: 'Playful',
    description: 'Learning apps, consumer apps, gamification',
    theme: playful.theme,
    custom: playful
  },
  chat: {
    label: 'Chat',
    description: 'Support chats, help centers',
    theme: chat.theme,
    custom: chat
  },
  editorial: {
    label: 'Editorial',
    description: 'Blogs, media, documentation',
    theme: editorial.theme,
    custom: editorial
  },
  enterprise: {
    label: 'Enterprise',
    description: 'B2B SaaS, admin panels, internal tools',
    theme: enterprise.theme,
    custom: enterprise
  },
  receipt: {
    label: 'Receipt',
    description: 'After a purchase: e-commerce, food delivery, restaurants',
    theme: receipt.theme,
    custom: receipt
  },
  'retro-os': {
    label: 'Retro OS',
    description: 'Promo campaigns, nostalgia marketing, games',
    theme: retroOs.theme,
    custom: retroOs
  }
};

const isMode = (value: string): value is Mode => value in MODES;

const getThemeCopy = (mode: Mode): string => {
  const { label, theme, custom } = MODES[mode];

  return `/* ${label} theme for the Feedback Tools SDK: paste into your site CSS and pass theme: '${theme}' to ftools('init') */\n\n${custom?.css ?? ''}`;
};

const COPY_LABELS = { copied: 'Copied', failed: 'Copy failed' };

const CopyCssButton: React.FC<{ mode: Mode }> = ({ mode }) => {
  const [status, setStatus] = useState<'idle' | keyof typeof COPY_LABELS>('idle');

  useEffect(() => {
    if (status === 'idle') {
      return;
    }

    const timeout = setTimeout(() => setStatus('idle'), 2000);

    return () => clearTimeout(timeout);
  }, [status]);

  const onClick = useCallback(async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(getThemeCopy(mode));
      setStatus('copied');
    } catch {
      setStatus('failed');
    }
  }, [mode]);

  if (!MODES[mode].custom) {
    return null;
  }

  return (
    <button
      aria-live="polite"
      className="themes-copy"
      type="button"
      onClick={onClick}
    >
      {status === 'idle' ? `Copy ${MODES[mode].label} CSS` : COPY_LABELS[status]}
    </button>
  );
};

// themes target `.ftools-survey`, the extra class keeps several of them apart on one page
const ThemeStyle: React.FC<{ mode: Mode }> = ({ mode }) => {
  const css = MODES[mode].custom?.css;

  if (!css) {
    return null;
  }

  return (
    <style>
      {css.replaceAll('.ftools-survey', `.ftools-survey.theme-${mode}`)}
    </style>
  );
};

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

  const { theme } = MODES[mode];

  return (
    <div className={cn('themes-stage', `themes-stage-${mode}`)}>
      <ThemeStyle mode={mode} />

      <div className="themes-content">
        <div className="themes-toolbar">
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

          <p className="themes-description">
            {MODES[mode].description}
          </p>

          <CopyCssButton mode={mode} />
        </div>

        <div className="themes-grid">
          {SURFACE_SURVEYS.map(({ id, props }) => (
            <ShadowHost
              key={id}
              className={cn('ftools-embed', `theme-${mode}`)}
              id={`showcase-${id}`}
            >
              <Surface theme={theme}>
                <Survey {...props} />
              </Surface>
            </ShadowHost>
          ))}

          <ShadowHost
            className={cn('ftools-popup', `theme-${mode}`)}
            id="showcase-popup"
          >
            <Popup
              animated={false}
              style={{ position: 'static' }}
              theme={theme}
            >
              <Survey {...POPUP_SURVEY} />
            </Popup>
          </ShadowHost>
        </div>
      </div>
    </div>
  );
};

const meta = {
  title: 'Themes',
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

type CatalogMode = Exclude<Mode, 'light' | 'dark' | 'auto'>;

const CATALOG_TEXTS = {
  textButtonSendLabel: 'Submit',
  thankYouMessage: 'Thank you for your feedback'
};

interface CatalogEntry {
  mode: CatalogMode;
  survey: SurveyProps;
  /** Show the rating scale instead of opening the feedback step */
  showRating?: boolean;
}

const CATALOG: CatalogEntry[] = [
  {
    mode: 'minimal',
    showRating: true,
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
    survey: {
      ...CATALOG_TEXTS,
      type: 'csat',
      points: 5,
      scaleStyle: 'numbers',
      question: 'How smooth was the install?',
      minLabel: 'Broken',
      maxLabel: 'Flawless',
      responseType: 'choices',
      textQuestion: 'Which step failed?',
      choiceOptions: ['Download', 'Build', 'Config']
    }
  },
  {
    mode: 'brutal',
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
    {CATALOG.map(({ mode, survey }) => {
      const { label, description, theme } = MODES[mode];

      return (
        <section
          key={mode}
          aria-label={`${label} theme`}
          className={cn('themes-tile', `themes-stage-${mode}`)}
        >
          <ThemeStyle mode={mode} />

          <div className="themes-tile-caption">
            <a
              className="themes-tile-link"
              href={`./?path=/story/themes--${mode}`}
              target="_top"
            >
              {label}
            </a>
            <span>
              {description}
            </span>

            <CopyCssButton mode={mode} />
          </div>

          <ShadowHost className={cn('ftools-embed', `theme-${mode}`)}>
            <Surface theme={theme}>
              <Survey
                {...survey}
                strings={{ feedbackFormLabel: `${label} feedback form` }}
                onScoreSubmit={fn()}
                onFeedbackSubmit={fn()}
              />
            </Surface>
          </ShadowHost>
        </section>
      );
    })}
  </div>
);

const openFeedbackSteps = async (canvasElement: HTMLElement, entries: CatalogEntry[]) => {
  const canvas = within(canvasElement);

  for (const { mode, survey } of entries) {
    const region = canvas.getByRole('region', { name: `${MODES[mode].label} theme` });
    const tile = await withinShadow(region.querySelector('.ftools-survey')!);

    // general surveys already open on the feedback step
    if (survey.type !== 'general') {
      await userEvent.click(tile.getAllByRole('button')[0]);
    }

    await expect(tile.getByRole('button', { name: /Submit|Vote/ })).toBeVisible();
  }
};

export const Catalog: Story = {
  render: () => (
    <ThemesCatalog />
  ),
  play: async ({ canvasElement }) => {
    // story ids are the kebab-case export names, which match the mode keys
    const link = within(canvasElement).getByRole('link', { name: 'Retro OS' });

    await expect(link).toHaveAttribute('href', './?path=/story/themes--retro-os');

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

export const Playground: Story = {};

export const Dark: Story = {
  args: {
    initialMode: 'dark'
  }
};

export const Minimal: Story = {
  args: {
    initialMode: 'minimal'
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
    const shadow = await withinShadow(canvasElement.querySelector('#showcase-general-choices')!);
    const checkbox = shadow.getByRole('checkbox', { name: 'Too slow' });

    await userEvent.click(checkbox);

    // a page `::part()` rule wins over every style inside the shadow root, so the theme's yellow beats the library's `:checked` fill
    await expect(backgroundOf(checkbox.nextElementSibling!)).toBe('rgb(255, 214, 10)');
  }
};

export const Terminal: Story = {
  args: {
    initialMode: 'terminal'
  },
  play: async ({ canvasElement }) => {
    const shadow = await withinShadow(canvasElement.querySelector('#showcase-general-choices')!);
    const checkbox = shadow.getByRole('checkbox', { name: 'Too slow' });
    const check = checkbox.nextElementSibling!;
    const pseudo = (element: Element, name: string) => getComputedStyle(element, name);

    await expect(pseudo(check, '::before').content).toContain('[ ]');
    await userEvent.click(checkbox);
    await expect(pseudo(check, '::before').content).toContain('[x]');
    await expect(pseudo(check, '::after').content).toBe('none');

    const title = shadow.getByRole('heading');

    const submit = shadow.getByRole('button', { name: 'Submit' });
    const field = shadow.getByRole('textbox');

    // a terminal has one text size: title, choices, field and buttons all match
    for (const element of [title, checkbox.closest('label')!, field, submit]) {
      await expect(getComputedStyle(element).fontSize).toBe('14px');
    }

    const writeText = fn(async () => undefined);
    const clipboard = Object.getOwnPropertyDescriptor(navigator, 'clipboard');

    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });

    try {
      const copy = within(canvasElement).getByRole('button', { name: 'Copy Terminal CSS' });

      await userEvent.click(copy);
      await expect(writeText).toHaveBeenCalledWith(expect.stringContaining("pass theme: 'dark' to ftools('init')"));
      await expect(writeText).toHaveBeenCalledWith(expect.stringContaining('.ftools-survey::part(checkbox checked)'));
      await expect(copy).toHaveTextContent('Copied');
    } finally {
      // the stub is on the shared page, later stories must get the real clipboard back
      if (clipboard) {
        Object.defineProperty(navigator, 'clipboard', clipboard);
      } else {
        Reflect.deleteProperty(navigator, 'clipboard');
      }
    }

    // no fade: the enabled Submit is fully opaque right after the click
    await expect(getComputedStyle(submit).transitionDuration).toBe('0s');
    await expect(getComputedStyle(submit).opacity).toBe('1');
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
  },
  play: async ({ canvasElement }) => {
    const shadow = await withinShadow(canvasElement.querySelector('#showcase-general-choices')!);
    const checkbox = shadow.getByRole('checkbox', { name: 'Too slow' });
    const choice = checkbox.closest('label')!;

    await expect(backgroundOf(choice)).not.toBe('rgb(37, 99, 235)');
    await userEvent.click(checkbox);
    await expect(backgroundOf(choice)).toBe('rgb(37, 99, 235)');

    // a star keeps clear of the chip border around it
    const stars = await withinShadow(canvasElement.querySelector('#showcase-csat-stars')!);
    const point = stars.getAllByRole('button')[0];
    const box = point.getBoundingClientRect();
    const star = point.querySelector('[part~="point-icon"]')!.getBoundingClientRect();

    await expect(star.left - box.left).toBeGreaterThanOrEqual(4);
    await expect(box.bottom - star.bottom).toBeGreaterThanOrEqual(4);

    // the enabled Submit fades in; the a11y check must not catch it halfway
    const submit = shadow.getByRole('button', { name: 'Submit' });

    await waitFor(() => expect(getComputedStyle(submit).opacity).toBe('1'));
  }
};

export const Editorial: Story = {
  args: {
    initialMode: 'editorial'
  },
  play: async ({ canvasElement }) => {
    const shadow = await withinShadow(canvasElement.querySelector('#showcase-general-text')!);
    const field = getComputedStyle(shadow.getByRole('textbox'));

    // the rules repeat every 28px from the top edge, so text lines must start there too
    await expect(field.paddingTop).toBe('0px');
    await expect(field.lineHeight).toBe('28px');
    await expect(field.backgroundSize).toBe('100% 28px');
  }
};

export const Enterprise: Story = {
  args: {
    initialMode: 'enterprise'
  },
  play: async ({ canvasElement }) => {
    const host = canvasElement.querySelector('#showcase-popup')!;
    const shadow = await withinShadow(host);

    await userEvent.click(host.shadowRoot!.querySelector('[part="point"]')!);

    const field = (await shadow.findByRole('textbox')).getBoundingClientRect();
    const textEdge = (button: Element) => {
      const { left, right } = button.getBoundingClientRect();
      const { paddingLeft, paddingRight } = getComputedStyle(button);

      return { left: left + parseFloat(paddingLeft), right: right - parseFloat(paddingRight) };
    };

    // full-width footer buttons keep their text on the content edges
    await expect(textEdge(shadow.getByRole('button', { name: 'Skip' })).left).toBe(field.left);
    await expect(textEdge(shadow.getByRole('button', { name: 'Submit' })).right).toBe(field.right);
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
  },
  play: async ({ canvasElement }) => {
    const host = canvasElement.querySelector('#showcase-popup')!;

    await withinShadow(host);

    const head = host.shadowRoot!.querySelector('[part="head"]')!;
    const close = host.shadowRoot!.querySelector('[part="close"]')!.getBoundingClientRect();

    // the title bar's text area ends before the close button that sits on it
    await expect(head.getBoundingClientRect().right - parseFloat(getComputedStyle(head).paddingRight)).toBeLessThanOrEqual(close.left);
  }
};
