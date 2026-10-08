import type { SurveyTheme } from '../../types';

export interface CustomStyle {
  /** Built-in theme the style starts from; `auto` when it keeps the built-in palette and works in light and dark */
  theme: SurveyTheme;
  /** Stylesheet: `--ft-*` and `::part()` rules on `.ftools-survey.<name>`, copied as is into a site stylesheet */
  css: string;
}
