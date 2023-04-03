/* eslint-disable global-require */
import type { PresetProperty } from '@storybook/types';
import { hasVitePlugins } from '@storybook/builder-vite';
import { dirname, join } from 'path';
import type { StorybookConfig } from './types';

const wrapForPnP = (input: string) => dirname(require.resolve(join(input, 'package.json')));

export const core: PresetProperty<'core', StorybookConfig> = {
  builder: wrapForPnP('@storybook/builder-vite') as '@storybook/builder-vite',
  renderer: wrapForPnP('@storybook/react'),
};

export const viteFinal: StorybookConfig['viteFinal'] = async (config, { presets }) => {
  const { plugins = [] } = config;

  // Add react plugin if not present
  if (!(await hasVitePlugins(plugins, ['vite:react-babel', 'vite:react-swc']))) {
    const { default: react } = await import('@vitejs/plugin-react');
    plugins.push(react());
  }

  // Add docgen plugin
  const { reactDocgen: reactDocgenOption, reactDocgenTypescriptOptions } = await presets.apply<any>(
    'typescript',
    {}
  );
  let typescriptPresent;

  try {
    require.resolve('typescript');
    typescriptPresent = true;
  } catch (e) {
    typescriptPresent = false;
  }

  if (reactDocgenOption === 'react-docgen-typescript' && typescriptPresent) {
    plugins.push(
      require('@joshwooding/vite-plugin-react-docgen-typescript')({
        ...reactDocgenTypescriptOptions,
        // We *need* this set so that RDT returns default values in the same format as react-docgen
        savePropValueAsString: true,
      })
    );
  }

  // Add react-docgen so long as the option is not false
  if (typeof reactDocgenOption === 'string') {
    const { reactDocgen } = await import('./plugins/react-docgen');
    // Needs to run before the react plugin, so add to the front
    plugins.unshift(
      // If react-docgen is specified, use it for everything, otherwise only use it for non-typescript files
      reactDocgen({
        include: reactDocgenOption === 'react-docgen' ? /\.(mjs|tsx?|jsx?)$/ : /\.(mjs|jsx?)$/,
      })
    );
  }

  return config;
};
