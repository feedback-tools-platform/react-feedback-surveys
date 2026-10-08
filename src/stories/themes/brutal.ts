import type { CustomTheme } from './types';

import './brutal.css';

export const brutal: CustomTheme = {
  theme: 'light',
  surface: 'brutal-surface',
  popup: {
    content: 'brutal-surface',
    close: 'brutal-close'
  },
  classNames: {
    base: {
      title: 'brutal-title'
    },
    scale: {
      button: 'brutal-scale-button',
      labels: 'brutal-labels'
    },
    form: {
      check: 'brutal-check',
      field: 'brutal-field',
      attachButton: 'brutal-attach-button',
      attachmentRemove: 'brutal-attachment-remove',
      submit: 'brutal-submit',
      skip: 'brutal-skip'
    }
  }
};
