import type { CustomTheme } from './types';

import './retro-os.css';

export const retroOs: CustomTheme = {
  theme: 'light',
  surface: 'retro-surface',
  popup: {
    content: 'retro-surface',
    close: 'retro-raised retro-close'
  },
  classNames: {
    base: {
      head: 'retro-head',
      title: 'retro-title',
      body: 'retro-body'
    },
    scale: {
      button: 'retro-raised',
      labels: 'retro-labels'
    },
    form: {
      check: 'retro-check',
      field: 'retro-field',
      attachButton: 'retro-raised',
      attachmentRemove: 'retro-raised',
      submit: 'retro-raised retro-action',
      skip: 'retro-raised retro-action'
    }
  }
};
