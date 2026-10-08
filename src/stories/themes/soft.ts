import type { CustomTheme } from './types';

import './soft.css';

export const soft: CustomTheme = {
  theme: 'light',
  surface: 'soft-surface',
  popup: {
    content: 'soft-surface'
  },
  classNames: {
    form: {
      check: 'soft-check',
      submit: 'soft-submit',
      skip: 'soft-skip'
    }
  }
};
