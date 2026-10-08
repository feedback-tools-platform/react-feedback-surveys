import type { CustomTheme } from './types';

import './terminal.css';

export const terminal: CustomTheme = {
  theme: 'dark',
  surface: 'terminal-surface',
  popup: {
    content: 'terminal-surface'
  },
  classNames: {
    base: {
      title: 'terminal-title'
    },
    scale: {
      button: 'terminal-scale-button'
    },
    form: {
      check: 'terminal-check',
      field: 'terminal-field',
      attachButton: 'terminal-attach-button',
      submit: 'terminal-submit',
      skip: 'terminal-skip'
    }
  }
};
