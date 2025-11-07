import type { Preview } from '@storybook/react-vite';

import { minHeightDecorator } from '../src/utils/storybook';

import '../src/styles/global.scss';
import './preview.css';

const MY_VIEWPORTS = {
  iphone5: { name: 'iPhone 5 - 320', styles: { height: '568px', width: '320px' }, type: 'mobile' },
  iphone6: { name: 'iPhone 6 - 375', styles: { height: '667px', width: '375px' }, type: 'mobile' },
  iphone6p: { name: 'iPhone 6 Plus - 414', styles: { height: '736px', width: '414px' }, type: 'mobile' },
  ipad: { name: 'iPad - 768', styles: { height: '1024px', width: '768px' }, type: 'tablet' },
  ipad10p: { name: 'iPad Pro 10.5 - 834', styles: { height: '1112px', width: '834px' }, type: 'tablet' },
  ipad12p: { name: 'iPad Pro 12.9 - 1024', styles: { height: '1366px', width: '1024px' }, type: 'tablet' }
};

const preview: Preview = {
  parameters: {
    actions: {
      argTypesRegex: '^on.*'
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    },
    viewport: {
      options: MY_VIEWPORTS
    },
  }
};

export default preview;
