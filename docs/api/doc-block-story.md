---
title: 'Story'
---

Stories (component tests) are Storybook's fundamental building blocks.

In Storybook Docs, you can render any of your stories from your CSF files in the context of an MDX file with all annotations (parameters, args, loaders, decorators, play function) applied using the `Story` block.

<div class="aside">

Typically you want to use the [`Canvas` block](./doc-block-canvas.md) to render a story with a surrounding border and the source block, but you can use the `Story` block to render just the story.

</div>

![Screenshot of Story block](./doc-block-story.png)

<!-- prettier-ignore-start -->
```md
{/* ButtonDocs.mdx */}

import { Meta, Story } from '@storybook/blocks';
import * as ButtonStories from './Button.stories';

<Meta of={ButtonStories} />

<Story of={ButtonStories.Primary} />
```
<!-- prettier-ignore-end -->

## Story

```js
import { Story } from '@storybook/blocks';
```

<details>
<summary>Configuring with props <strong>and</strong> parameters</summary>

ℹ️ Like most blocks, the `Story` block is configured with props in MDX. Many of those props derive their default value from a corresponding [parameter](../writing-stories/parameters.md) in the block's namespace, `parameters.docs.story`.

The following `autoplay` configurations are equivalent:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'angular/api-doc-block-story-parameter.ts.mdx',
    'web-components/api-doc-block-story-parameter.js.mdx',
    'web-components/api-doc-block-story-parameter.ts.mdx',
    'common/api-doc-block-story-parameter.js.mdx',
    'common/api-doc-block-story-parameter.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

<!-- prettier-ignore-start -->
```md
{/* ButtonDocs.mdx */}

<Story of={ButtonStories.Basic} autoplay />
```
<!-- prettier-ignore-end -->

The example above applied the parameter at the [story](../writing-stories/parameters.md#story-parameters) level, but it could also be applied at the [component](../writing-stories/parameters.md#component-parameters) (or meta) level or [project](../writing-stories/parameters.md#global-parameters) level.

</details>

### `autoplay`

Type: `boolean`

Default: `parameters.docs.story.autoplay`

Determines whether a story's play function runs.

Because all stories render simultaneously in docs entries, play functions can perform arbitrary actions that can interact with each other (such as stealing focus or scrolling the screen). For that reason, by default, stories **do not run play functions in docs mode**.

However, if you know your play function is “safe” to run in docs, you can use this prop to run it automatically.

### `height`

Type: `string`

Default: `parameters.docs.story.height`

Set a minimum height (note for an iframe this is the actual height) when rendering a story in an iframe or inline. This overrides `parameters.docs.story.iframeHeight` for iframes.

### `inline`

Type: `boolean`

Default: `parameters.docs.story.inline` or `true` (for [supported frameworks](../configure/frameworks-feature-support.md))

Determines whether the story is rendered `inline` (in the same browser frame as the other docs content) or in an iframe.

### `meta`

Type: CSF file exports

Specifies the CSF file to which the story is associated.

You can render a story from a CSF file that you haven’t attached to the MDX file (via `Meta`) by using the `meta` prop. Pass the **full set of exports** from the CSF file (not the default export!).

<!-- prettier-ignore-start -->
```md
{/* ButtonDocs.mdx */}

import { Meta, Story } from '@storybook/blocks';
import * as ButtonStories from './Button.stories';
import * as HeaderStories from './Header.stories';

<Meta of={ButtonStories} />

{/* Although this MDX file is largely concerned with Button,
    it can render Header stories too */}
<Story of={HeaderStories.LoggedIn} meta={HeaderStories} />
```
<!-- prettier-ignore-end -->

### `of`

Type: Story export

Specifies which story is rendered by the `Story` block. If no `of` is defined and the MDX file is [attached](./doc-block-meta.md#attached-vs-unattached), the primary (first) story will be rendered.

### `args` (deprecated)

Type: `Partial<TArgs>`

Defining and configuring stories in MDX is deprecated. See the [Migration guide](https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#mdx-docs-files) for details.

### `argTypes` (deprecated)

Type: `Partial<ArgTypes<TArgs>>`

Defining and configuring stories in MDX is deprecated. See the [Migration guide](https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#mdx-docs-files) for details.

### `decorators` (deprecated)

Type: `DecoratorFunction<TRenderer, TArgs>[]`

Defining and configuring stories in MDX is deprecated. See the [Migration guide](https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#mdx-docs-files) for details.

### `loaders` (deprecated)

Type: `LoaderFunction<TRenderer, TArgs>[]`

Defining and configuring stories in MDX is deprecated. See the [Migration guide](https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#mdx-docs-files) for details.

### `name` (deprecated)

Type: `StoryName`

Defining and configuring stories in MDX is deprecated. See the [Migration guide](https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#mdx-docs-files) for details.

### `parameters` (deprecated)

Type: `Parameters`

Defining and configuring stories in MDX is deprecated. See the [Migration guide](https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#mdx-docs-files) for details.

### `play` (deprecated)

Type: `PlayFunction<TRenderer, TArgs>`

Defining and configuring stories in MDX is deprecated. See the [Migration guide](https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#mdx-docs-files) for details.

### `render` (deprecated)

Type: `ArgsStoryFn<TRenderer, TArgs>`

Defining and configuring stories in MDX is deprecated. See the [Migration guide](https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#mdx-docs-files) for details.

### `story` (deprecated)

Type: `Omit<StoryAnnotations<TRenderer, TArgs>, 'story'>`

Defining and configuring stories in MDX is deprecated. See the [Migration guide](https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#mdx-docs-files) for details.

### `storyName` (deprecated)

Type: `StoryName`

Defining and configuring stories in MDX is deprecated. See the [Migration guide](https://github.com/storybookjs/storybook/blob/next/MIGRATION.md#mdx-docs-files) for details.
