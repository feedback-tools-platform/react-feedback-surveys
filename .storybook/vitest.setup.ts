import * as a11yAddonAnnotations from '@storybook/addon-a11y/preview';
import { setProjectAnnotations } from '@storybook/react-vite';
import * as projectAnnotations from './preview';

// This is an important step to apply the right configuration when testing your stories.
// More info at: https://storybook.js.org/docs/api/portable-stories/portable-stories-vitest#setprojectannotations
// @storybook/addon-vitest logs that this call is redundant since Storybook 10.3 and can be removed —
// that's wrong for our setup: removing it drops the a11y addon annotations and breaks the tests.
setProjectAnnotations([a11yAddonAnnotations, projectAnnotations]);
