import type { CustomTheme } from './types';

import './chat.css';

export const chat: CustomTheme = {
  theme: 'light',
  surface: 'chat-surface',
  popup: {
    content: 'chat-surface'
  },
  classNames: {
    base: {
      head: 'chat-head',
      title: 'chat-title'
    },
    scale: {
      list: 'chat-scale-list',
      button: 'chat-scale-button'
    },
    form: {
      choices: 'chat-choices',
      choice: 'chat-choice',
      check: 'chat-check',
      field: 'chat-field',
      attachButton: 'chat-attach-button',
      submit: 'chat-submit',
      skip: 'chat-skip'
    }
  }
};
