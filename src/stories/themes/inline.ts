import type { CustomTheme } from './types';

import './inline.css';

export const inline: CustomTheme = {
  theme: 'light',
  surface: 'inline-surface',
  // a popup keeps its background: a transparent popup over page content is unreadable
  popup: {},
  classNames: {
    base: {
      base: 'inline-root'
    }
  }
};
