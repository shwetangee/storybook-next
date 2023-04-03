import { global as globalThis } from '@storybook/global';
import { expect } from '@storybook/jest';
import type { PlayFunctionContext } from '@storybook/types';

export default {
  component: globalThis.Components.Pre,
  args: { text: 'No content' },
};

export const Default = {
  play: async ({ title }: PlayFunctionContext<any>) => {
    await expect(title).toBe('lib/store/autotitle');
  },
};
