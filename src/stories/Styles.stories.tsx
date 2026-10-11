import { useCallback, useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';
import { domToDataUrl } from 'modern-screenshot';

import { Popup } from '../components/Popup';
import { Surface } from '../components/Surface';
import { Survey, type CsatSurveyProps2, type SurveyProps } from '../surveys/Survey';
import type { SurveyTheme } from '../types';
import { cn } from '../utils';

import { HighlightedCode } from './HighlightedCode';
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
import { toUniversalCss } from './styles/toUniversalCss';
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

const DOCS_URL = 'https://feedback.tools/react-feedback-surveys/docs/styling';
const SDK_URL = 'https://feedback.tools/docs/sdk';
const SDK_DOCS_URL = `${SDK_URL}/styling`;

const getThemeNote = (mode: Mode): string => (followsTheme(mode) ? "'light', 'dark' or 'auto'" : `'${MODES[mode].theme}'`);

// the copy explains itself, so it still makes sense pasted into a stylesheet, a chat or an LLM prompt
const getStyleCopy = (mode: Mode): string => {
  const { label, custom } = MODES[mode];
  const header = [
    `/* ${label} style from the react-feedback-surveys style catalog.`,
    ' * An example to copy and change: it isn\'t versioned or updated with the library.',
    ' *',
    ` * Theme: ${getThemeNote(mode)}`,
    ` * React: wrap <Surface> in <div className="ftools-survey ftools-embed ${mode}">,`,
    ` *   or <Popup> in <div className="ftools-survey ftools-popup ${mode}">, and pass the theme to it`,
    ` * Feedback Tools SDK (hosted feedback.tools surveys): pass className: '${mode}' and the theme to ftools('init')`,
    ` * Guide: ${DOCS_URL}`,
    ' */'
  ];

  return `${header.join('\n')}\n\n${toUniversalCss(custom?.css ?? '')}`;
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
          {`${label} CSS`}
        </span>

        <CopyCssButton mode={mode} />
      </div>

      <pre tabIndex={0}>
        <HighlightedCode
          code={getStyleCopy(mode)}
          language="css"
        />
      </pre>
    </section>
  );
};

const getReactSnippet = (mode: Mode, theme: SurveyTheme): string => {
  const hostClass = MODES[mode].custom ? ` ${mode}` : '';

  if (!hostClass) {
    return `<Surface theme="${theme}">\n  <Survey /* ... */ />\n</Surface>\n\n// or as a popup\n<Popup theme="${theme}">\n  <Survey /* ... */ />\n</Popup>`;
  }

  return [
    `<div className="ftools-survey ftools-embed${hostClass}">`,
    `  <Surface theme="${theme}">`,
    '    <Survey /* ... */ />',
    '  </Surface>',
    '</div>',
    '',
    '// or as a popup',
    `<div className="ftools-survey ftools-popup${hostClass}">`,
    `  <Popup theme="${theme}">`,
    '    <Survey /* ... */ />',
    '  </Popup>',
    '</div>'
  ].join('\n');
};

const getSdkSnippet = (mode: Mode, theme: SurveyTheme): string => [
  'ftools(\'init\', {',
  '  surveyId: \'SURVEY_ID\',',
  '  publishableKey: \'PUBLISHABLE_KEY\',',
  ...(MODES[mode].custom ? [`  className: '${mode}',`] : []),
  `  theme: '${theme}'`,
  '});'
].join('\n');

const GUIDE_LINKS = [
  { label: 'Styling guide', href: DOCS_URL },
  { label: 'CSS variables', href: `${DOCS_URL}#css-variables` },
  { label: 'Part names', href: `${DOCS_URL}#custom-classes` },
  { label: 'Feedback Tools SDK styling', href: SDK_DOCS_URL }
];

const PlatformSnippets: React.FC<{ mode: Mode; theme: SurveyTheme }> = ({ mode, theme }) => (
  <div className="styles-guide-platforms">
    <div>
      <h3>
        React
      </h3>

      <p className="styles-guide-platform-note">
        This library in your React app.
      </p>

      <pre className="styles-snippet">
        <HighlightedCode
          code={getReactSnippet(mode, theme)}
          language="javascript"
        />
      </pre>
    </div>

    <div>
      <h3>
        Feedback Tools SDK
      </h3>

      <p className="styles-guide-platform-note">
        Only if you use hosted surveys from
        {' '}
        <a
          href={SDK_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          feedback.tools
        </a>
        : the same widget, added to any site with a script.
      </p>

      <pre className="styles-snippet">
        <HighlightedCode
          code={getSdkSnippet(mode, theme)}
          language="javascript"
        />
      </pre>
    </div>
  </div>
);

// what a visitor needs after seeing the style: where the CSS goes, how to attach it, what to change, where to read more
const StyleGuide: React.FC<{ mode: Mode; theme: SurveyTheme }> = ({ mode, theme }) => {
  const { label, custom } = MODES[mode];

  return (
    <section
      aria-labelledby="styles-guide-title"
      className="styles-guide"
    >
      <h2 id="styles-guide-title">
        {custom ? `Use the ${label} style` : `Use the ${label} theme`}
      </h2>

      {custom ? (
        <ol className="styles-guide-steps">
          <li>
            <strong>
              Copy the CSS below
            </strong>
            {' into your site\'s stylesheet. Keep it outside any '}
            <code>
              @layer
            </code>
            , so it wins over the widget&apos;s own styles.
          </li>

          <li>
            <strong>
              Attach it to the widget
            </strong>
            {` with the ${mode} class and the ${getThemeNote(mode)} theme.`}

            <PlatformSnippets
              mode={mode}
              theme={theme}
            />
          </li>

          <li>
            <strong>
              Make it yours.
            </strong>
            {' The CSS is an example, not a dependency: it isn\'t versioned or updated with the library. Change it freely, starting with the '}
            <code>
              --ft-*
            </code>
            {' variables at the top.'}
          </li>
        </ol>
      ) : (
        <>
          <p>
            A built-in theme needs no CSS: pass it as
            {' '}
            <code>
              theme
            </code>
            .
          </p>

          <PlatformSnippets
            mode={mode}
            theme={theme}
          />
        </>
      )}

      <p className="styles-guide-links">
        Learn more:
        {GUIDE_LINKS.map(({ label: linkLabel, href }) => (
          <a
            key={href}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {linkLabel}
          </a>
        ))}
      </p>
    </section>
  );
};

// the page runs the same universal CSS the Copy button hands out
const StyleSheetTag: React.FC<{ mode: Mode }> = ({ mode }) => {
  const css = MODES[mode].custom?.css;

  if (!css) {
    return null;
  }

  return (
    <style>
      {toUniversalCss(css)}
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

          <div className="styles-heading">
            <h1>
              {MODES[mode].label}
            </h1>

            {!!MODES[mode].custom && (
              <ThemeVariants mode={mode} />
            )}
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

        <StyleGuide
          mode={mode}
          theme={theme}
        />

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
    <header className="styles-catalog-intro">
      <h1>
        Style catalog
      </h1>

      <p>
        Ready-made looks to copy and change. Open a style to see it on every survey type, with its CSS and the steps
        to add it to your React app. Every style is plain CSS on top of the
        {' '}
        <a
          href={DOCS_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          styling API
        </a>
        .
      </p>
    </header>

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

interface CollageTile {
  mode: CatalogMode;
  /** Choice to check or text to type on the feedback step; without it the tile stays on the rating step */
  answer?: string;
}

const COLLAGE_TILES: CollageTile[] = [
  { mode: 'terminal', answer: 'Build' },
  { mode: 'editorial', answer: 'A section on pricing' },
  { mode: 'retro-os' },
  { mode: 'receipt' },
  { mode: 'brutal', answer: 'Dark mode' },
  { mode: 'chat' },
  { mode: 'playful' },
  { mode: 'paper', answer: 'More examples' },
  { mode: 'sticky-note', answer: 'A dark mode for the dashboard' }
];

const COLLAGE = COLLAGE_TILES.map((tile) => ({
  ...tile,
  survey: CATALOG.find(({ mode }) => mode === tile.mode)!.survey
}));

// terminal reads best on its dark palette; every other tile stays light
const getCollageTheme = (mode: CatalogMode): SurveyTheme => (mode === 'terminal' ? 'dark' : 'light');

// user-event typing inside a shadow root never reaches React, so set the value natively and fire `input`
const fillField = (field: HTMLTextAreaElement, text: string): void => {
  Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')?.set?.call(field, text);
  field.dispatchEvent(new Event('input', { bubbles: true }));
};

const StylesCollage: React.FC = () => (
  <div className="styles-collage">
    {COLLAGE.map(({ mode, survey }) => {
      const { label } = MODES[mode];
      const { theme, stage } = resolveTheme(mode, getCollageTheme(mode));

      return (
        <section
          key={mode}
          aria-label={`${label} style`}
          className={cn('styles-collage-tile', stage)}
          data-capture={mode}
        >
          <StyleSheetTag mode={mode} />

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

          <span className="styles-collage-label">
            {label}
          </span>
        </section>
      );
    })}
  </div>
);

// hidden from the sidebar: `npm run capture-previews` shoots it whole and tile by tile
export const Collage: Story = {
  tags: ['!dev'],
  render: () => (
    <StylesCollage />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    for (const { mode, answer, survey } of COLLAGE) {
      if (!answer) {
        continue;
      }

      const region = canvas.getByRole('region', { name: `${MODES[mode].label} style` });
      const tile = await withinShadow(region.querySelector('.ftools-survey')!);

      // general surveys already open on the feedback step
      if (survey.type !== 'general') {
        await userEvent.click(tile.getAllByRole('button')[0]);
      }

      if (survey.responseType === 'choices') {
        const checkbox = tile.getByRole('checkbox', { name: answer });

        await userEvent.click(checkbox);

        // the shot shows the step at rest, without a focus ring
        checkbox.blur();
      } else {
        fillField(tile.getByRole<HTMLTextAreaElement>('textbox'), answer);
      }

      await expect(tile.getByRole('button', { name: survey.textButtonSendLabel })).toBeEnabled();
    }

    // capture-previews waits for this mark before the shot
    canvasElement.setAttribute('data-ready', '');
  }
};

type Dom = 'shadow' | 'plain';

const DOMS: Dom[] = ['shadow', 'plain'];

// the SDK's shadow host, or the wrapper a React app puts around the widget: the same classes either way
const StyleHost: React.FC<{ dom: Dom; className: string; children: React.ReactNode }> = ({ dom, className, children }) => {
  if (dom === 'shadow') {
    return (
      <ShadowHost className={className}>
        {children}
      </ShadowHost>
    );
  }

  return (
    <div className={cn('ftools-survey', className)}>
      {children}
    </div>
  );
};

const PlainDomCatalog: React.FC = () => (
  <div className="styles-dom-catalog">
    {CATALOG.map(({ mode, survey }) => {
      const { label, custom } = MODES[mode];
      const { theme, stage } = resolveTheme(mode, 'light');

      return (
        <section
          key={mode}
          aria-label={`${label} style`}
          className={cn('styles-dom-pair', stage)}
        >
          <style>
            {toUniversalCss(custom?.css ?? '')}
          </style>

          {DOMS.map((dom) => (
            <div
              key={dom}
              className="styles-dom"
              data-dom={dom}
            >
              <StyleHost
                className={cn('ftools-embed', mode)}
                dom={dom}
              >
                <Surface theme={theme}>
                  <Survey
                    {...survey}
                    strings={{ feedbackFormLabel: `${label} ${dom} DOM feedback form` }}
                    onScoreSubmit={fn()}
                    onFeedbackSubmit={fn()}
                  />
                </Surface>
              </StyleHost>

              <StyleHost
                className={cn('ftools-popup', mode)}
                dom={dom}
              >
                <Popup
                  animated={false}
                  style={{ position: 'static' }}
                  theme={theme}
                >
                  <Survey
                    {...getPopupSurvey(mode)}
                    strings={{ feedbackFormLabel: `${label} ${dom} DOM popup feedback form` }}
                  />
                </Popup>
              </StyleHost>
            </div>
          ))}
        </section>
      );
    })}
  </div>
);

const COMPARED_PROPERTIES = [
  'color', 'background-color', 'background-image', 'border-top-width', 'border-top-style', 'border-top-color',
  'border-bottom-width', 'border-top-left-radius', 'box-shadow', 'outline-style', 'opacity', 'transform',
  'font-family', 'font-size', 'font-weight', 'font-style', 'letter-spacing', 'text-transform', 'text-decoration-line',
  'padding-top', 'padding-left', 'margin-top', 'margin-left', 'gap', 'display', 'width', 'height', 'content'
];

const describeParts = (root: ParentNode): string[] => [...root.querySelectorAll('[part]')].flatMap((element) => (
  ['', '::before', '::after'].map((pseudo) => {
    const style = getComputedStyle(element, pseudo || null);
    const values = COMPARED_PROPERTIES.map((property) => `${property}: ${style.getPropertyValue(property)}`);

    return `${element.getAttribute('part')}${pseudo} { ${values.join('; ')} }`;
  })
));

// every part, with its ::before and ::after, must compute the same in a shadow root and in plain DOM
const findDomMismatches = (canvasElement: HTMLElement): string[] => CATALOG.flatMap(({ mode }) => {
  const [shadow, plain] = DOMS.map((dom) => {
    const column = canvasElement.querySelector(`[aria-label="${MODES[mode].label} style"] [data-dom="${dom}"]`)!;
    const roots = dom === 'shadow' ? [...column.querySelectorAll('.ftools-survey')].map((host) => host.shadowRoot!) : [column];

    return roots.flatMap(describeParts);
  });

  return shadow.flatMap((line, index) => (line === plain[index] ? [] : [`${mode}\n  shadow: ${line}\n  plain:  ${plain[index]}`]));
});

const openEveryFeedbackStep = async (canvasElement: HTMLElement): Promise<void> => {
  for (const host of canvasElement.querySelectorAll<HTMLElement>('[data-dom] > div')) {
    const tile = host.shadowRoot ? await withinShadow(host) : within(host);
    const point = tile.queryAllByRole('button').find((button) => button.getAttribute('part') === 'point');

    if (point) {
      await userEvent.click(point);
    }

    const checkbox = tile.queryAllByRole('checkbox')[0];

    if (checkbox) {
      await userEvent.click(checkbox);
    }
  }
};

// hidden from the sidebar: proves the copied CSS styles a widget the same with and without a shadow root
export const CatalogPlainDom: Story = {
  tags: ['!dev'],
  parameters: {
    // each survey shows twice on purpose, so its region name repeats; the real catalog stories still run this rule
    a11y: {
      config: {
        rules: [{ id: 'landmark-unique', enabled: false }]
      }
    }
  },
  render: () => (
    <PlainDomCatalog />
  ),
  play: async ({ canvasElement }) => {
    await waitFor(() => expect(canvasElement.querySelectorAll('[data-dom="shadow"] .ftools-survey')).toHaveLength(CATALOG.length * 2));

    for (const host of canvasElement.querySelectorAll('[data-dom="shadow"] .ftools-survey')) {
      await withinShadow(host);
    }

    await expect(findDomMismatches(canvasElement)).toEqual([]);

    await openEveryFeedbackStep(canvasElement);

    // a state change starts transitions; compare the styles they end on
    await Promise.all(document.getAnimations().map((animation) => animation.finished));
    await expect(findDomMismatches(canvasElement)).toEqual([]);
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
      await expect(writeText).toHaveBeenCalledWith(expect.stringContaining("Theme: 'light', 'dark' or 'auto'"));
      await expect(writeText).toHaveBeenCalledWith(expect.stringContaining('<div className="ftools-survey ftools-embed terminal">'));
      await expect(writeText).toHaveBeenCalledWith(expect.stringContaining("pass className: 'terminal' and the theme to ftools('init')"));

      // one stylesheet for both: `::part()` for the SDK's shadow root, part attributes for a plain DOM app
      await expect(writeText).toHaveBeenCalledWith(expect.stringContaining('.ftools-survey.terminal::part(checkbox checked)'));
      await expect(writeText).toHaveBeenCalledWith(expect.stringContaining('.ftools-survey.terminal [part~="checkbox"][part~="checked"]'));
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
