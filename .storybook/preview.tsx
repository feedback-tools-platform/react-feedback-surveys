import type { Preview } from '@storybook/react-vite';
import { withThemeByClassName } from '@storybook/addon-themes';

import '../src/styles/global.scss';
import './preview.css';

const MY_VIEWPORTS = {
  // Small Mobile (320-375px)
  iphoneSE: { name: 'iPhone SE - 320', styles: { height: '568px', width: '320px' }, type: 'mobile' },
  galaxyS8: { name: 'Galaxy S8 - 360', styles: { height: '740px', width: '360px' }, type: 'mobile' },
  iphone12: { name: 'iPhone 12/13/14 - 390', styles: { height: '844px', width: '390px' }, type: 'mobile' },

  // Standard Mobile (375-414px)
  iphoneXR: { name: 'iPhone XR/11 - 414', styles: { height: '896px', width: '414px' }, type: 'mobile' },
  pixel5: { name: 'Pixel 5 - 393', styles: { height: '851px', width: '393px' }, type: 'mobile' },

  // Large Mobile (414-430px)
  iphone14ProMax: { name: 'iPhone 14 Pro Max - 430', styles: { height: '932px', width: '430px' }, type: 'mobile' },
  galaxyS21: { name: 'Galaxy S21 - 412', styles: { height: '915px', width: '412px' }, type: 'mobile' },

  // Tablet Portrait (768-834px)
  ipadMini: { name: 'iPad Mini - 768', styles: { height: '1024px', width: '768px' }, type: 'tablet' },
  ipadAir: { name: 'iPad Air - 820', styles: { height: '1180px', width: '820px' }, type: 'tablet' },

  // Tablet Landscape (1024-1180px)
  ipadPro11: { name: 'iPad Pro 11" - 834', styles: { height: '1194px', width: '834px' }, type: 'tablet' },
  ipadPro13: { name: 'iPad Pro 12.9" - 1024', styles: { height: '1366px', width: '1024px' }, type: 'tablet' },

  // Desktop (1280-1920px)
  laptop: { name: 'Laptop - 1280', styles: { height: '800px', width: '1280px' }, type: 'desktop' },
  desktop: { name: 'Desktop - 1440', styles: { height: '900px', width: '1440px' }, type: 'desktop' },
  desktopLarge: { name: 'Desktop Large - 1920', styles: { height: '1080px', width: '1920px' }, type: 'desktop' }
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    viewport: {
      options: MY_VIEWPORTS
    },
    backgrounds: {
      grid: {
        cellSize: 20,
        opacity: 0.1,
        cellAmount: 5
      }
    }
  },
  decorators: [
    withThemeByClassName({
      themes: {
        light: '',
        dark: 'dark',
      },
      defaultTheme: 'light',
      parentSelector: 'body',
    }),
  ],
};

export default preview;
