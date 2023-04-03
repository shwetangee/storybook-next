---
title: 'Automatic documentation and Storybook'
---

Storybook Autodocs is a powerful tool that can help you quickly generate comprehensive documentation for your UI components. By leveraging Autodocs, you're transforming your stories into living documentation which can be further extended with [MDX](./mdx.md) and [Doc Blocks](./doc-blocks.md) to provide a clear and concise understanding of your components' functionality.

## Setup automated documentation

To enable auto-generated documentation for your stories, you'll need to add the `tags` configuration property to the story's default export. For example:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'react/button-story-auto-docs.js.mdx',
    'react/button-story-auto-docs.ts.mdx',
    'vue/button-story-auto-docs.js.mdx',
    'vue/button-story-auto-docs.ts.mdx',
    'angular/button-story-auto-docs.ts.mdx',
    'svelte/button-story-auto-docs.js.mdx',
    'web-components/button-story-auto-docs.js.mdx',
    'web-components/button-story-auto-docs.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

![Storybook autodocs](./autodocs.png)


Once the story loads, Storybook infers the relevant metadata (e.g., [`args`](../writing-stories/args.md), [`argTypes`](../api/argtypes.md), [`parameters`](../writing-stories/parameters.md)) and automatically generates a documentation page with this information positioned at the root-level of your component tree in the sidebar.

### Configure

By default, Storybook offers zero-config support for documentation and automatically sets up a documentation page for each story enabled via the `tags` configuration property. However, you can extend your Storybook configuration file (i.e., `.storybook/main.js|ts|cjs`) and provide additional options to control how documentation gets created. Listed below are the available options and examples of how to use them.

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-auto-docs-full-config.js.mdx',
    'common/storybook-auto-docs-full-config.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

| Option        | Description                                                                                                                         |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `autodocs`    | Configures auto-generated documentation pages. Available options: `true`, `false`,`tag` (default) <br/> `docs: { autodocs: false }` |
| `defaultName` | Renames the auto-generated documentation page<br/> `docs: { defaultName: 'Documentation' }`                                         |

### Write a custom template

To replace the default documentation template used by Storybook, you can extend your UI configuration file (i.e., `.storybook/preview.js`) and introduce a `docs` [parameter](./doc-blocks.md#customizing-the-automatic-docs-page). This parameter accepts a `page` function that returns a React component, which you can use to generate the required template. For example:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-preview-auto-docs-custom-template-function.js.mdx',
    'common/storybook-preview-auto-docs-custom-template-function.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

<div class="aside">

💡 Internally, Storybook uses a similar implementation to generate the default template. See the Doc Blocks [API reference](./doc-blocks.md#available-blocks) if you want to learn more about how Doc Blocks work.

</div>

Going over the code snippet in more detail. When Storybook starts up, it will override the default template with the custom one composed of the following:

1. A header with the component's metadata retrieved by the `Title`, `Subtitle`, and `Description` Doc Blocks.
2. The first story defined in the file via the `Primary` Doc Block with a handy set of UI controls to zoom in and out of the component.
3. An interactive table with all the relevant [`args`](../writing-stories/args.md) and [`argTypes`](../api/argtypes.md) defined in the story via the `Controls` Doc Block.
4. A overview of the remaining stories via the `Stories` Doc Block.

#### With MDX

You can also use MDX to generate the documentation template. This is useful in non-React projects where JSX-handling is not configured. Normally, when you create an MDX file in your project, it is treated as normal documentation. To indicate that an MDX file is a documentation template, supply the `isTemplate` property to its [`Meta`](../api/doc-block-meta.md) Doc Block. For example:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-mdx-template-with-prop.mdx.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

Then you can use it in your `.storybook/preview.js` or an individual story file by importing it:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-preview-auto-docs-custom-mdx-template.js.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

<div class="aside">

💡 If you only need to override the documentation page for a single component, we recommend creating an MDX file and referencing it directly via the `<Meta of={} />` Doc Block.

</div>

### Customize component documentation

Creating automated documentation with Storybook's Autodocs provides you with the starting point to build a sustainable documentation pattern. Nevertheless, it may not be suited for every case, and you may want to extend it and provide additional information. We recommend combining [MDX](./mdx.md) alongside Storybook's [Doc Blocks](./doc-blocks.md) for such cases to author your documentation.

## Advanced configuration

### Customize the Docs Container

The Docs Container is the component that wraps up the documentation page. It's responsible for rendering the documentation page in Storybook's UI. You can customize it by creating your own component and updating your Storybook UI configuration file (i.e., `.storybook/preview.js`) to reference it.

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-preview-auto-docs-custom-docs-container.js.mdx',
    'common/storybook-preview-auto-docs-custom-docs-container.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

### Override the default theme

By default, Storybook provides two themes for the UI: `light` and `dark`. If you need to customize the theme used by the documentation to match the existing one, you can update your Storybook UI configuration file (i.e., `.storybook/preview.js`) and apply it.

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-preview-auto-docs-override-theme.js.mdx',
    'common/storybook-preview-auto-docs-override-theme.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

### Working with custom MDX components

Out of the box, Storybook has a set of components that you can use to customize your documentation page. If you're working with a design system or component library and wish to add them to your documentation page, you can override the `MDXProvider` component inherited from `@mdx-js/react` with your own. However, there's a caveat to this, the component replacement will only have an impact if you're writing documentation using Markdown syntax (e.g., `#` for headings). Native HTML elements, such as `<h1>`, will not be replaced with your custom implementation.

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'common/storybook-preview-auto-docs-override-mdx-container.js.mdx',
    'common/storybook-preview-auto-docs-override-mdx-container.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

<div class="aside">

💡 This is not a Storybook issue but a breaking change introduced with MDX 2. For more information on this and other breaking changes, see our [MDX documentation](./mdx.md#breaking-changes).

</div>

## Troubleshooting

### The auto-generated documentation is not showing up in a monorepo setup

Out of the box, Storybook's Autodocs feature is built to generate documentation for your stories automatically. Nevertheless, if you're working with a monorepo setup (e.g., [`Yarn Workspaces`](https://yarnpkg.com/features/workspaces), [`pnpm Workspaces`](https://pnpm.io/workspaces)), you may run into issues where part of the documentation may not be generated for you. To help you troubleshoot those issues, we've prepared some recommendations that might help you.

Update your import statements to reference the component directly instead of the package's root. For example:

<!-- prettier-ignore-start -->


<CodeSnippets
  paths={[
    'common/storybook-fix-imports-autodocs-monorepo.js.mdx',
    'common/storybook-fix-imports-autodocs-monorepo.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

Additionally, if you're developing using TypeScript, you may need to update Storybook's configuration file (i.e., `.storybook/main.js|ts`) to include the following:

<!-- prettier-ignore-start -->


<CodeSnippets
  paths={[
    'common/storybook-main-fix-imports-autodocs-monorepo.js.mdx',
    'common/storybook-main-fix-imports-autodocs-monorepo.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

If you're still encountering issues, we recommend reaching out to the maintainers using the default communication channels (e.g., [Discord server](https://discord.com/channels/486522875931656193/570426522528382976), [GitHub issues](https://github.com/storybookjs/storybook/issues)).

#### Learn more about Storybook documentation

- Autodocs for creating documentation for your stories
- [MDX](./mdx.md) for customizing your documentation
- [Doc Blocks](./doc-blocks.md) for authoring your documentation
- [Publishing docs](./build-documentation.md) to automate the process of publishing your documentation
