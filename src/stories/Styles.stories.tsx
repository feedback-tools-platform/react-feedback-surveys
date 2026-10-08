import { useCallback, useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { domToDataUrl } from 'modern-screenshot';

import { Popup } from '../components/Popup';
import { Surface } from '../components/Surface';
import { Survey, type CsatSurveyProps2, type SurveyProps } from '../surveys/Survey';
import type { SurveyTheme } from '../types';
import { cn } from '../utils';

import { ShadowHost } from './ShadowHost';
import { withinShadow } from './withinShadow';
import { blueprint } from './styles/blueprint';
import { brutal } from './styles/brutal';
import { chat } from './styles/chat';
import { editorial } from './styles/editorial';
import { enterprise } from './styles/enterprise';
import { helpful } from './styles/helpful';
import { minimal } from './styles/minimal';
import { paper } from './styles/paper';
import { playful } from './styles/playful';
import { receipt } from './styles/receipt';
import { retroOs } from './styles/retro-os';
import { soft } from './styles/soft';
import { stickyNote } from './styles/sticky-note';
import { terminal } from './styles/terminal';
import type { CustomStyle } from './styles/types';

import './Styles.stories.css';

type Mode = 'light' | 'dark' | 'auto' | 'minimal' | 'soft' | 'helpful' | 'brutal' | 'terminal' | 'playful' | 'chat' | 'editorial' | 'enterprise' | 'receipt' | 'retro-os' | 'blueprint' | 'sticky-note' | 'paper';

interface ModeConfig {
  label: string;
  description: string;
  theme: SurveyTheme;
  custom?: CustomStyle;
}

const MODES: Record<Mode, ModeConfig> = {
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
  helpful: {
    label: 'Helpful',
    description: 'A one-line question at the end of docs and help articles. Pair it with a survey that has no feedback step',
    theme: helpful.theme,
    custom: helpful
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
  },
  blueprint: {
    label: 'Blueprint',
    description: 'Hardware, engineering, architecture',
    theme: blueprint.theme,
    custom: blueprint
  },
  'sticky-note': {
    label: 'Sticky note',
    description: 'Idea boards, suggestion boxes, team retros',
    theme: stickyNote.theme,
    custom: stickyNote
  },
  paper: {
    label: 'Paper',
    description: 'Notes, education, kids products',
    theme: paper.theme,
    custom: paper
  }
};

const isMode = (value: string): value is Mode => value in MODES;

// the class the site passes as `className` to ftools('init'); built-in themes need none
const getStyleClass = (mode: Mode): string | undefined => (MODES[mode].custom ? mode : undefined);

// a custom style on `auto` keeps the built-in palette, so it works in light and dark
const followsTheme = (mode: Mode): boolean => !!MODES[mode].custom && MODES[mode].theme === 'auto';

// the Light/Dark/Auto tabs are an explicit choice; a custom style that keeps the built-in palette takes the toolbar theme
const resolveTheme = (mode: Mode, toolbarTheme?: SurveyTheme) => {
  const { theme } = MODES[mode];

  if (!followsTheme(mode)) {
    return { theme, stage: `styles-stage-${mode}` };
  }

  const base = toolbarTheme ?? theme;

  // its own backdrop, in the tone of the palette it shows
  return { theme: base, stage: `styles-stage-${mode} styles-tone-${base}` };
};

const getStyleCopy = (mode: Mode): string => {
  const { label, theme, custom } = MODES[mode];
  const pass = followsTheme(mode) ? "theme: 'light', 'dark' or 'auto'" : `theme: '${theme}'`;

  return `/* ${label} style for the Feedback Tools SDK: paste into your site CSS and pass className: '${mode}' and ${pass} to ftools('init') */\n\n${custom?.css ?? ''}`;
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
      await navigator.clipboard.writeText(getStyleCopy(mode));
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
      className="styles-copy"
      type="button"
      onClick={onClick}
    >
      {status === 'idle' ? (
        <>
          Copy
          <span className="styles-sr-only">
            {` ${MODES[mode].label} CSS`}
          </span>
        </>
      ) : COPY_LABELS[status]}
    </button>
  );
};

// which built-in palettes a catalog style works with: both when it keeps the built-in palette, its base one otherwise
const ThemeVariants: React.FC<{ mode: Mode }> = ({ mode }) => {
  const { theme } = MODES[mode];
  const variants = followsTheme(mode) ? ['light', 'dark'] : [theme];

  return (
    <span className="styles-variants">
      <span className="styles-sr-only">
        Supports
      </span>

      {variants.map((variant) => (
        <span
          key={variant}
          className={cn('styles-variant', `styles-variant-${variant}`)}
        >
          {variant === 'dark' ? 'Dark' : 'Light'}
        </span>
      ))}
    </span>
  );
};

const StyleCode: React.FC<{ mode: Mode }> = ({ mode }) => {
  const { label, custom } = MODES[mode];

  if (!custom) {
    return null;
  }

  return (
    <section
      aria-label={`${label} style CSS`}
      className="styles-code"
    >
      <div className="styles-code-header">
        <span>
          Paste into your site CSS
        </span>

        <CopyCssButton mode={mode} />
      </div>

      <pre tabIndex={0}>
        <code>
          {getStyleCopy(mode)}
        </code>
      </pre>
    </section>
  );
};

const StyleSheetTag: React.FC<{ mode: Mode }> = ({ mode }) => {
  const css = MODES[mode].custom?.css;

  if (!css) {
    return null;
  }

  return (
    <style>
      {css}
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

const POPUP_SURVEY: CsatSurveyProps2 = {
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

// helpful is a one-line question, so its popup skips the feedback step and goes straight to thanks
const getPopupSurvey = (mode: Mode): CsatSurveyProps2 => (mode === 'helpful' ? { ...POPUP_SURVEY, responseType: null } : POPUP_SURVEY);

interface StylesShowcaseProps {
  /** Style selected on first render */
  initialMode?: Mode;
  /** Base theme from the Storybook toolbar */
  theme?: SurveyTheme;
}

const StylesShowcase: React.FC<StylesShowcaseProps> = ({
  initialMode = 'light',
  theme: toolbarTheme
}) => {
  const [mode, setMode] = useState<Mode>(initialMode);

  const onModeClick = useCallback((event: React.MouseEvent<HTMLButtonElement>): void => {
    const value = event.currentTarget.value;

    if (isMode(value)) {
      setMode(value);
    }
  }, []);

  const { theme, stage } = resolveTheme(mode, toolbarTheme);

  return (
    <div className={cn('styles-stage', stage)}>
      <StyleSheetTag mode={mode} />

      <div className="styles-content">
        <div className="styles-toolbar">
          <div
            aria-label="Style"
            className="styles-switcher"
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

          <p className="styles-description">
            {MODES[mode].description}
          </p>
        </div>

        <div className="styles-grid">
          {SURFACE_SURVEYS.map(({ id, props }) => (
            <ShadowHost
              key={id}
              className={cn('ftools-embed', getStyleClass(mode))}
              id={`showcase-${id}`}
            >
              <Surface theme={theme}>
                <Survey {...props} />
              </Surface>
            </ShadowHost>
          ))}

          <ShadowHost
            className={cn('ftools-popup', getStyleClass(mode))}
            id="showcase-popup"
          >
            <Popup
              animated={false}
              style={{ position: 'static' }}
              theme={theme}
            >
              <Survey {...getPopupSurvey(mode)} />
            </Popup>
          </ShadowHost>
        </div>

        <StyleCode mode={mode} />
      </div>
    </div>
  );
};

const meta = {
  title: 'Style Catalog',
  component: StylesShowcase,
  parameters: {
    layout: 'fullscreen'
  },
  argTypes: {
    initialMode: {
      control: 'radio',
      options: Object.keys(MODES)
    }
  }
} satisfies Meta<typeof StylesShowcase>;

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
    mode: 'helpful',
    showRating: true,
    survey: {
      ...CATALOG_TEXTS,
      type: 'csat',
      points: 2,
      scaleStyle: 'thumbs',
      question: 'Was this page helpful?',
      responseType: null
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
      type: 'csat',
      points: 5,
      scaleStyle: 'numbers',
      question: 'How satisfied are you with the integration setup?',
      minLabel: 'Very unsatisfied',
      maxLabel: 'Very satisfied',
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
  },
  {
    mode: 'blueprint',
    showRating: true,
    survey: {
      ...CATALOG_TEXTS,
      type: 'ces',
      scaleStyle: 'numbers',
      question: 'How easy was it to assemble the kit?',
      minLabel: 'Very hard',
      maxLabel: 'Very easy',
      responseType: 'choices',
      textQuestion: 'Where did you get stuck?',
      choiceOptions: ['Wiring', 'Firmware', 'Instructions']
    }
  },
  {
    mode: 'sticky-note',
    survey: {
      ...CATALOG_TEXTS,
      type: 'general',
      textQuestion: 'Got an idea? Jot it down',
      textButtonSendLabel: 'Stick it'
    }
  },
  {
    mode: 'paper',
    survey: {
      ...CATALOG_TEXTS,
      type: 'csat',
      points: 5,
      scaleStyle: 'stars',
      question: 'How was the class today?',
      minLabel: 'Meh',
      maxLabel: 'Loved it',
      responseType: 'choices',
      textQuestion: 'What should we do differently?',
      choiceOptions: ['Slower pace', 'More examples', 'More breaks']
    }
  }
];

const StylesCatalog: React.FC<{ theme?: SurveyTheme }> = ({ theme: toolbarTheme }) => (
  <div className="styles-catalog">
    {CATALOG.map(({ mode, survey }) => {
      const { label, description } = MODES[mode];
      const { theme, stage } = resolveTheme(mode, toolbarTheme);

      return (
        <section
          key={mode}
          aria-label={`${label} style`}
          className={cn('styles-tile', stage)}
        >
          <StyleSheetTag mode={mode} />

          <div className="styles-tile-caption">
            <a
              className="styles-tile-link"
              href={`./?path=/story/style-catalog--${mode}`}
              target="_top"
            >
              {label}
            </a>
            <span>
              {description}
            </span>

            <ThemeVariants mode={mode} />

            <CopyCssButton mode={mode} />
          </div>

          <ShadowHost className={cn('ftools-embed', getStyleClass(mode))}>
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
    // a survey without a feedback step goes straight to thanks
    if (survey.responseType === null) {
      continue;
    }

    const region = canvas.getByRole('region', { name: `${MODES[mode].label} style` });
    const tile = await withinShadow(region.querySelector('.ftools-survey')!);

    // general surveys already open on the feedback step
    if (survey.type !== 'general') {
      await userEvent.click(tile.getAllByRole('button')[0]);
    }

    await expect(tile.getByRole('button', { name: survey.textButtonSendLabel })).toBeVisible();
  }
};

export const Catalog: Story = {
  render: (args) => (
    <StylesCatalog theme={args.theme} />
  ),
  play: async ({ canvasElement }) => {
    // story ids are the kebab-case export names, which match the mode keys
    const link = within(canvasElement).getByRole('link', { name: 'Retro OS' });

    await expect(link).toHaveAttribute('href', './?path=/story/style-catalog--retro-os');

    await openFeedbackSteps(canvasElement, CATALOG.filter(({ showRating }) => !showRating));
  }
};

// hidden from the sidebar: it only exists so the a11y check also covers every style's feedback step
export const CatalogFeedbackStep: Story = {
  tags: ['!dev'],
  render: (args) => (
    <StylesCatalog theme={args.theme} />
  ),
  play: async ({ canvasElement }) => {
    await openFeedbackSteps(canvasElement, CATALOG);
  }
};

// hidden from the sidebar: the a11y check runs the styles that follow the base palette in dark too
export const CatalogDark: Story = {
  tags: ['!dev'],
  globals: {
    theme: 'dark'
  },
  render: (args) => (
    <StylesCatalog theme={args.theme} />
  )
};

export const CatalogDarkFeedbackStep: Story = {
  tags: ['!dev'],
  globals: {
    theme: 'dark'
  },
  render: (args) => (
    <StylesCatalog theme={args.theme} />
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

export const Helpful: Story = {
  args: {
    initialMode: 'helpful'
  },
  play: async ({ canvasElement }) => {
    const host = canvasElement.querySelector('#showcase-popup')!;

    await withinShadow(host);

    const root = host.shadowRoot!.querySelector('[part~="root"]')!;
    const title = host.shadowRoot!.querySelector('[part="title"]')!.getBoundingClientRect();
    const point = host.shadowRoot!.querySelector('[part="point"]')!.getBoundingClientRect();

    // the rating step is one line: the question and the thumbs share a vertical center
    await expect(getComputedStyle(root).flexDirection).toBe('row');
    await expect(Math.abs((title.top + title.bottom) / 2 - (point.top + point.bottom) / 2)).toBeLessThanOrEqual(1);

    // in a popup it stays a card, and the thumbs end before the close button
    const surface = host.shadowRoot!.querySelector('[part="surface"]')!;
    const points = host.shadowRoot!.querySelector('[part="points"]')!.getBoundingClientRect();
    const close = host.shadowRoot!.querySelector('[part="close"]')!.getBoundingClientRect();

    await expect(getComputedStyle(surface).backgroundColor).toBe('rgb(255, 255, 255)');
    await expect(points.right).toBeLessThanOrEqual(close.left);
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

    // a page `::part()` rule wins over every style inside the shadow root, so the style's yellow beats the library's `:checked` fill
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
      await expect(writeText).toHaveBeenCalledWith(expect.stringContaining("pass className: 'terminal' and theme: 'light', 'dark' or 'auto' to ftools('init')"));
      await expect(writeText).toHaveBeenCalledWith(expect.stringContaining('.ftools-survey.terminal::part(checkbox checked)'));
      await expect(copy).toHaveTextContent('Copied');

      // the block under the examples shows exactly what the button copies
      const code = within(canvasElement).getByRole('region', { name: 'Terminal style CSS' }).querySelector('code')!;

      await expect(writeText).toHaveBeenCalledWith(code.textContent);
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

    // the footer buttons share the field's width and stay inside the survey, above the SDK's own footer
    await expect(shadow.getByRole('button', { name: 'Skip' }).getBoundingClientRect().left).toBe(field.left);
    await expect(shadow.getByRole('button', { name: 'Submit' }).getBoundingClientRect().right).toBe(field.right);
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

export const Blueprint: Story = {
  args: {
    initialMode: 'blueprint'
  },
  play: async ({ canvasElement }) => {
    const host = canvasElement.querySelector('#showcase-general-text')!;
    const shadow = await withinShadow(host);
    const surface = host.shadowRoot!.querySelector('[part="surface"]')!;
    const field = shadow.getByRole('textbox');

    // the grid covers the sheet, while the field is a darker solid sheet so the grid doesn't run through the text
    await expect(getComputedStyle(surface).backgroundImage).toContain('linear-gradient');
    await expect(getComputedStyle(field).backgroundImage).toBe('none');
    await expect(backgroundOf(field)).not.toBe(backgroundOf(surface));
    await expect(backgroundOf(field)).not.toBe('rgba(0, 0, 0, 0)');
  }
};

export const StickyNote: Story = {
  name: 'Sticky note',
  args: {
    initialMode: 'sticky-note'
  }
};

export const Paper: Story = {
  args: {
    initialMode: 'paper'
  }
};

// hidden from the sidebar: checks that a style following the base palette takes the Storybook toolbar theme
export const SoftToolbarDark: Story = {
  tags: ['!dev'],
  globals: {
    theme: 'dark'
  },
  args: {
    initialMode: 'soft'
  },
  play: async ({ canvasElement }) => {
    const host = canvasElement.querySelector('#showcase-nps')!;

    await withinShadow(host);

    const surface = host.shadowRoot!.querySelector('[part="surface"]')!;
    const stage = canvasElement.querySelector('.styles-stage')!;

    await expect(backgroundOf(surface)).not.toBe('rgb(255, 255, 255)');
    await expect(stage).toHaveClass('styles-tone-dark');
  }
};
