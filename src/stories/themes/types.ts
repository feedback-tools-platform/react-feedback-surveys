import type { SurveyTheme } from '../../types';

export interface CustomTheme {
  /** Built-in theme the custom one starts from */
  theme: SurveyTheme;
  /** Theme stylesheet: `--ft-*` on the `.ftools-survey` host and `::part()` rules, copied as is into a site stylesheet */
  css: string;
}
