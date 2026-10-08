import type { SurveyTheme } from '../types';

import styles from '../styles/themes.module.scss';

export const getThemeClassName = (theme?: SurveyTheme): string | undefined => (
  theme ? styles[theme] : undefined
);
