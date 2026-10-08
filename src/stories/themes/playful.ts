import type { CustomTheme } from './types';

import './playful.css';

export const playful: CustomTheme = {
  theme: 'light',
  surface: 'playful-surface',
  popup: {
    content: 'playful-surface'
  },
  classNames: {
    base: {
      title: 'playful-title'
    },
    scale: {
      button: 'playful-scale-button',
      labels: 'playful-labels'
    },
    form: {
      choice: 'playful-choice',
      check: 'playful-check',
      field: 'playful-field',
      attachButton: 'playful-attach-button',
      submit: 'playful-submit',
      skip: 'playful-skip'
    }
  }
};
