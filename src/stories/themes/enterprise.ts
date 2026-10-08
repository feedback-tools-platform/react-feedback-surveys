import type { CustomTheme } from './types';

import './enterprise.css';

export const enterprise: CustomTheme = {
  theme: 'light',
  surface: 'enterprise-surface',
  popup: {
    content: 'enterprise-surface'
  },
  classNames: {
    base: {
      title: 'enterprise-title'
    },
    scale: {
      list: 'enterprise-scale-list',
      button: 'enterprise-scale-button',
      labels: 'enterprise-labels'
    },
    form: {
      choice: 'enterprise-choice',
      check: 'enterprise-check',
      field: 'enterprise-field',
      attachButton: 'enterprise-attach-button',
      actions: 'enterprise-actions',
      submit: 'enterprise-submit',
      skip: 'enterprise-skip'
    }
  }
};
