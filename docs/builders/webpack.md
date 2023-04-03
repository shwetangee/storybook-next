---
title: 'Webpack'
---

Storybook Webpack builder is the default builder for Storybook. This builder enables you to create a seamless development and testing experience for your components and provides an efficient way to develop UI components in isolation allowing you to leverage your existing Webpack configuration with Storybook.

## Configure

By default, Storybook provides zero-config support for Webpack and automatically sets up a baseline configuration created to work with the most common use cases. However, you can extend your Storybook configuration file (i.e., `.storybook/main.js|ts`) and provide additional options to improve your Storybook's performance or customize it to your needs. Listed below are the available options and examples of how to use them.

| Option            | Description                                                                                                                                                                                       |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `storyStoreV7`    | Enabled by default.<br/> Configures Webpack's [code splitting](https://webpack.js.org/guides/code-splitting/) feature<br/> `features: { storyStoreV7: false }`                                    |
| `lazyCompilation` | Enables Webpack's experimental [`lazy compilation`](https://webpack.js.org/configuration/experiments/#experimentslazycompilation)<br/>`core: { builder: { options: { lazyCompilation: true } } }` |
| `fsCache`         | Configures Webpack's filesystem [caching](https://webpack.js.org/configuration/cache/#cachetype) feature<br/> `core: { builder: { options: { fsCache: true } } }`                                 |

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-main-webpack-options.js.mdx',
    'common/storybook-main-webpack-options.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

### Override the default configuration

Storybook's Webpack configuration is based on [Webpack 5](https://webpack.js.org/), allowing it to be extended to fit your project's needs. If you need to add a loader or a plugin, you can provide the `webpackFinal` configuration element in your [`.storybook/main.js|ts`](../configure/overview.md#configure-your-storybook-project) file. The configuration element should export a function that receives the baseline configuration as the first argument and Storybook's options object as the second argument. For example:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-main-add-sass-config.js.mdx',
    'common/storybook-main-add-sass-config.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

When Storybook starts, it automatically merges the configuration into its own. However, when providing the `webpackFinal` configuration element, you're responsible for merging the configuration yourself. We recommend that you handle the changes to the `config` object responsibly, preserving both the `entry` and `output` properties.

#### Working with Webpack plugins

Another way to customize your Storybook configuration is to add a custom plugin or loader to help with code optimization, asset management, or other tasks. Nevertheless, since Storybook relies on the `HtmlWebpackPlugin` to generate the preview page, we recommend that you append the changes to the `config.plugins` array rather than overwriting it. For example:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-main-simplified-config.js.mdx',
    'common/storybook-main-simplified-config.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

Additionally, when working with Webpack loaders that don't explicitly include specific file extensions (i.e., via the `test` property), you should `exclude` the `.ejs` file extension for that loader.

### Import a custom Webpack configuration

If you already have an existing Webpack configuration file that you need to reuse with Storybook, you can import it and merge it into the default configuration. For example:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-main-using-existing-config.js.mdx',
    'common/storybook-main-using-existing-config.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

<div class="aside">
💡 Projects scaffolded based on generators may require that you import their specific Webpack configuration files. We suggest reading your generator's documentation for more information.

</div>

### Debug Webpack configuration

If you intend to debug the Webpack configuration used by Storybook, you can use the Storybook CLI to help you. If you're running in [development mode](../api/cli-options.md#dev), you can use the following command:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-debug-webpack-dev.yarn.js.mdx',
    'common/storybook-debug-webpack-dev.npm.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

Additionally, if you're generating a [static build](../api/cli-options.md#build) of your Storybook, you can use the following command:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-debug-webpack-prod.yarn.js.mdx',
    'common/storybook-debug-webpack-prod.npm.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

## What about Webpack 4 support?

Support for Webpack 4 has been removed and is no longer being maintained. If you're upgrading your Storybook, it will automatically use Webpack 5 and attempt to migrate your configuration. However, if you're working with a custom Webpack configuration, you may need to update it to work with Webpack 5. The migration process is necessary to ensure that your project runs smoothly with the latest version of Storybook. You can follow the instructions provided on the Webpack [website](https://webpack.js.org/migrate/5/) to update your configuration.

## Troubleshooting

### TypeScript modules are not resolved within Storybook

Storybook's default Webpack configuration provides support for most project setups without the need for any additional configuration. Nevertheless, depending on your project configuration, or the framework of choice, you may run into issues with TypeScript modules not being resolved within Storybook when aliased from your [`tsconfig` file](https://www.typescriptlang.org/tsconfig). If you encounter this issue, you can use [`tsconfig-paths-webpack-plugin`](https://github.com/dividab/tsconfig-paths-webpack-plugin#tsconfig-paths-webpack-plugin) while [extending Storybook's Webpack config](#override-the-default-configuration) as follows:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-main-ts-module-resolution.js.mdx',
    'common/storybook-main-ts-module-resolution.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

### Pre-bundled assets do not show in the Storybook UI

As Storybook relies on [esbuild](https://esbuild.github.io/) to build its internal manager, support for bundling assets with the `managerWebpack` will no longer have an impact on the Storybook UI. We recommend removing existing `managerWebpack` configuration elements from your Storybook configuration file and bundling assets other than images or CSS into JavaScript beforehand.

#### Learn more about builders

- [Vite builder](./vite.md) for bundling with Vite
- Webpack builder for bundling with Webpack
- [Builder API](./builder-api.md) for building a Storybook builder
