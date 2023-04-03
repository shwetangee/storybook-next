import { hasVitePlugins } from '@storybook/builder-vite';
import type { PresetProperty } from '@storybook/types';
import type { StorybookConfig } from './types';
import { handleSvelteKit } from './utils';
import { svelteDocgen } from './plugins/svelte-docgen';

export const core: PresetProperty<'core', StorybookConfig> = {
  builder: '@storybook/builder-vite',
  renderer: '@storybook/svelte',
};

export const viteFinal: NonNullable<StorybookConfig['viteFinal']> = async (config, options) => {
  const { plugins = [] } = config;
  // TODO: set up eslint import to use typescript resolver
  // eslint-disable-next-line import/no-unresolved
  const { svelte, loadSvelteConfig } = await import('@sveltejs/vite-plugin-svelte');
  const svelteConfig = await loadSvelteConfig();

  // Add svelte plugin if the user does not have a Vite config of their own
  if (!(await hasVitePlugins(plugins, ['vite-plugin-svelte']))) {
    plugins.push(svelte());
  }

  // Add docgen plugin
  plugins.push(svelteDocgen(svelteConfig));

  await handleSvelteKit(plugins, options);

  return {
    ...config,
    plugins,
  };
};
