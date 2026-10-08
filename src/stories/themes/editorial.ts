import type { CustomTheme } from './types';

import './editorial.css';

export const editorial: CustomTheme = {
  theme: 'light',
  surface: 'editorial-surface',
  popup: {
    content: 'editorial-surface'
  },
  classNames: {
    base: {
      title: 'editorial-title'
    },
    scale: {
      button: 'editorial-scale-button',
      icon: 'editorial-icon',
      labels: 'editorial-labels'
    },
    form: {
      choice: 'editorial-choice',
      check: 'editorial-check',
      field: 'editorial-field',
      attachButton: 'editorial-attach-button',
      submit: 'editorial-submit',
      skip: 'editorial-skip'
    }
  }
};
