import type { PopupProps } from '../../components/Popup';
import type { SurveyClassNames, SurveyTheme } from '../../types';

export interface CustomTheme {
  /** Built-in theme the custom one starts from */
  theme: SurveyTheme;
  /** Class for `Surface` — carries the theme's `--ft-*` values down to the survey */
  surface: string;
  /** Class names for `Popup` */
  popup: PopupProps['classNames'];
  /** Class names for `Survey` */
  classNames: SurveyClassNames;
}
