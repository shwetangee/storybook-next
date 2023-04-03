import { global as globalThis } from '@storybook/global';

export default {
  component: globalThis.Components.Button,
  tags: ['autodocs'],
  args: { label: 'Click Me!' },
  parameters: { chromatic: { disable: true } },
};

/**
 * A basic button
 */
export const Basic = {
  args: { label: 'Basic' },
};

/**
 * Won't show up in DocsPage
 */
export const Disabled = {
  args: { label: 'Disabled in DocsPage' },
  parameters: { docs: { disable: true } },
};

/**
 * Another button, just to show multiple stories
 */
export const Another = {
  args: { label: 'Another' },
};
