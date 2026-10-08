import { waitFor, within } from 'storybook/test';

// ShadowHost attaches its root and portals the survey after the first commit, so wait until the survey is there
export const withinShadow = async (host: Element) => {
  await waitFor(() => {
    if (!host.shadowRoot?.querySelector('[part~="root"]')) {
      throw new Error('the survey has not rendered into the shadow root yet');
    }
  });

  // testing-library queries accept a shadow root, its types only name elements
  return within(host.shadowRoot as unknown as HTMLElement);
};
