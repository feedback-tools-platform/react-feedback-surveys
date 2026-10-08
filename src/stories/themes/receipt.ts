import type { CustomTheme } from './types';

import './receipt.css';

export const receipt: CustomTheme = {
  theme: 'light',
  surface: 'receipt-surface',
  popup: {
    content: 'receipt-surface'
  },
  classNames: {
    base: {
      head: 'receipt-head',
      title: 'receipt-title'
    },
    scale: {
      button: 'receipt-scale-button',
      labels: 'receipt-labels'
    },
    form: {
      check: 'receipt-check',
      field: 'receipt-field',
      attachButton: 'receipt-attach-button',
      actions: 'receipt-actions',
      submit: 'receipt-submit',
      skip: 'receipt-skip'
    }
  }
};
