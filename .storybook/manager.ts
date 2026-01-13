import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';

const theme = create({
  base: 'light',
  brandTitle: 'React Feedback Surveys',
  brandUrl: 'https://feedback.tools/react-feedback-surveys',
  brandTarget: '_self',
});

addons.setConfig({
  theme,
});
