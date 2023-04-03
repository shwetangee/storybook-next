import fse from 'fs-extra';
import dedent from 'ts-dedent';
import { SupportedLanguage } from '../project_types';
import { configureMain, configurePreview } from './configure';

jest.mock('fs-extra');

describe('configureMain', () => {
  beforeAll(() => {
    jest.clearAllMocks();
  });

  test('should generate main.js', async () => {
    await configureMain({
      language: SupportedLanguage.JAVASCRIPT,
      addons: [],
      storybookConfigFolder: '.storybook',
      framework: {
        name: '@storybook/react-vite',
      },
    });

    const { calls } = (fse.writeFile as unknown as jest.Mock).mock;
    const [mainConfigPath, mainConfigContent] = calls[0];

    expect(mainConfigPath).toEqual('./.storybook/main.js');
    expect(mainConfigContent).toMatchInlineSnapshot(`
      "/** @type { import('@storybook/react-vite').StorybookConfig } */
      const config = {
        stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(js|jsx|ts|tsx)'],
        addons: [],
        framework: {
          name: '@storybook/react-vite',
        },
      };
      export default config;
      "
    `);
  });

  test('should generate main.ts', async () => {
    await configureMain({
      language: SupportedLanguage.TYPESCRIPT_4_9,
      addons: [],
      storybookConfigFolder: '.storybook',
      framework: {
        name: '@storybook/react-vite',
      },
    });

    const { calls } = (fse.writeFile as unknown as jest.Mock).mock;
    const [mainConfigPath, mainConfigContent] = calls[0];

    expect(mainConfigPath).toEqual('./.storybook/main.ts');
    expect(mainConfigContent).toMatchInlineSnapshot(`
      "import type { StorybookConfig } from '@storybook/react-vite';
      const config: StorybookConfig = {
        stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(js|jsx|ts|tsx)'],
        addons: [],
        framework: {
          name: '@storybook/react-vite',
        },
      };
      export default config;
      "
    `);
  });

  test('should handle resolved paths in pnp', async () => {
    await configureMain({
      language: SupportedLanguage.JAVASCRIPT,
      addons: [
        "%%path.dirname(require.resolve(path.join('@storybook/addon-links', 'package.json')))%%",
        "%%path.dirname(require.resolve(path.join('@storybook/addon-essentials', 'package.json')))%%",
        "%%path.dirname(require.resolve(path.join('@storybook/preset-create-react-app', 'package.json')))%%",
        "%%path.dirname(require.resolve(path.join('@storybook/addon-interactions', 'package.json')))%%",
      ],
      storybookConfigFolder: '.storybook',
      framework: {
        name: "%%path.dirname(require.resolve(path.join('@storybook/react-webpack5', 'package.json')))%%",
      },
    });

    const { calls } = (fse.writeFile as unknown as jest.Mock).mock;
    const [mainConfigPath, mainConfigContent] = calls[0];

    expect(mainConfigPath).toEqual('./.storybook/main.js');
    expect(mainConfigContent).toMatchInlineSnapshot(`
      "import path from 'path';

      /** @type { import('@storybook/react-webpack5').StorybookConfig } */
      const config = {
        stories: ['../stories/**/*.mdx', '../stories/**/*.stories.@(js|jsx|ts|tsx)'],
        addons: [
          path.dirname(require.resolve(path.join('@storybook/addon-links', 'package.json'))),
          path.dirname(require.resolve(path.join('@storybook/addon-essentials', 'package.json'))),
          path.dirname(require.resolve(path.join('@storybook/preset-create-react-app', 'package.json'))),
          path.dirname(require.resolve(path.join('@storybook/addon-interactions', 'package.json'))),
        ],
        framework: {
          name: path.dirname(require.resolve(path.join('@storybook/react-webpack5', 'package.json'))),
        },
      };
      export default config;
      "
    `);
  });
});

describe('configurePreview', () => {
  test('should generate preview.js', async () => {
    await configurePreview({
      language: SupportedLanguage.JAVASCRIPT,
      storybookConfigFolder: '.storybook',
      rendererId: 'react',
    });

    const { calls } = (fse.writeFile as unknown as jest.Mock).mock;
    const [previewConfigPath, previewConfigContent] = calls[0];

    expect(previewConfigPath).toEqual('./.storybook/preview.js');
    expect(previewConfigContent).toMatchInlineSnapshot(`
      "/** @type { import('@storybook/react').Preview } */
      const preview = {
        parameters: {
          actions: { argTypesRegex: '^on[A-Z].*' },
          controls: {
            matchers: {
              color: /(background|color)$/i,
              date: /Date$/,
            },
          },
        },
      };

      export default preview;
      "
    `);
  });

  test('should generate preview.ts', async () => {
    await configurePreview({
      language: SupportedLanguage.TYPESCRIPT_4_9,
      storybookConfigFolder: '.storybook',
      rendererId: 'react',
    });

    const { calls } = (fse.writeFile as unknown as jest.Mock).mock;
    const [previewConfigPath, previewConfigContent] = calls[0];

    expect(previewConfigPath).toEqual('./.storybook/preview.ts');
    expect(previewConfigContent).toMatchInlineSnapshot(`
      "import type { Preview } from '@storybook/react';

      const preview: Preview = {
        parameters: {
          actions: { argTypesRegex: '^on[A-Z].*' },
          controls: {
            matchers: {
              color: /(background|color)$/i,
              date: /Date$/,
            },
          },
        },
      };

      export default preview;
      "
    `);
  });

  test('should not do anything if the framework template already included a preview', async () => {
    (fse.pathExists as unknown as jest.Mock).mockReturnValueOnce(true);
    await configurePreview({
      language: SupportedLanguage.TYPESCRIPT_4_9,
      storybookConfigFolder: '.storybook',
      rendererId: 'react',
    });
    expect(fse.writeFile).not.toHaveBeenCalled();
  });

  test('should add prefix if frameworkParts are passed', async () => {
    await configurePreview({
      language: SupportedLanguage.TYPESCRIPT_4_9,
      storybookConfigFolder: '.storybook',
      rendererId: 'angular',
      frameworkPreviewParts: {
        prefix: dedent`
        import { setCompodocJson } from "@storybook/addon-docs/angular";
        import docJson from "../documentation.json";
        setCompodocJson(docJson);
      `,
      },
    });

    const { calls } = (fse.writeFile as unknown as jest.Mock).mock;
    const [previewConfigPath, previewConfigContent] = calls[0];

    expect(previewConfigPath).toEqual('./.storybook/preview.ts');
    expect(previewConfigContent).toMatchInlineSnapshot(`
      "import type { Preview } from '@storybook/angular';
      import { setCompodocJson } from '@storybook/addon-docs/angular';
      import docJson from '../documentation.json';
      setCompodocJson(docJson);

      const preview: Preview = {
        parameters: {
          actions: { argTypesRegex: '^on[A-Z].*' },
          controls: {
            matchers: {
              color: /(background|color)$/i,
              date: /Date$/,
            },
          },
        },
      };

      export default preview;
      "
    `);
  });
});
