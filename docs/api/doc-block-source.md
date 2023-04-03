---
title: 'Source'
---

The `Source` block is used to render a snippet of source code directly.

![Screenshot of Source block](./doc-block-source.png)

<!-- prettier-ignore-start -->
```md
{/* ButtonDocs.mdx */}

import { Meta, Source } from '@storybook/blocks';
import * as ButtonStories from './Button.stories';

<Meta of={ButtonStories} />

<Source of={ButtonStories.Primary} />
```
<!-- prettier-ignore-end -->

## Source

```js
import { Source } from '@storybook/blocks';
```

<details>
<summary>Configuring with props <strong>and</strong> parameters</summary>

ℹ️ Like most blocks, the `Source` block is configured with props in MDX. Many of those props derive their default value from a corresponding [parameter](../writing-stories/parameters.md) in the block's namespace, `parameters.docs.source`.

The following `language` configurations are equivalent:

<!-- prettier-ignore-start -->

<CodeSnippets
  paths={[
    'angular/api-doc-block-source-parameter.ts.mdx',
    'web-components/api-doc-block-source-parameter.js.mdx',
    'web-components/api-doc-block-source-parameter.ts.mdx',
    'common/api-doc-block-source-parameter.js.mdx',
    'common/api-doc-block-source-parameter.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

<!-- prettier-ignore-start -->
```md
{/* ButtonDocs.mdx */}

<Source of={ButtonStories.Basic} language="tsx" />
```
<!-- prettier-ignore-end -->

The example above applied the parameter at the [story](../writing-stories/parameters.md#story-parameters) level, but it could also be applied at the [component](../writing-stories/parameters.md#component-parameters) (or meta) level or [project](../writing-stories/parameters.md#global-parameters) level.

</details>

### `code`

Type: `string`

Default: `parameters.docs.source.code`

Provides the source code to be rendered.

<!-- prettier-ignore-start -->
```md
{/* ButtonDocs.mdx */}

import { Meta, Source } from '@storybook/blocks';
import * as ButtonStories from './Button.stories';

<Meta of={ButtonStories} />

<Source code={`const thisIsCustomSource = true;
if (isSyntaxHighlighted) {
  console.log('syntax highlighting is working');
}`} />
```
<!-- prettier-ignore-end -->

### `dark`

Type: `boolean`

Default: `parameters.docs.source.dark`

Determines if the snippet is rendered in dark mode.

<div class="aside">

💡 Light mode is only supported when the `Source` block is rendered independently. When rendered as part of a [`Canvas` block](./doc-block-canvas.md)—like it is in [autodocs](../writing-docs/autodocs.md)—it will always use dark mode.

</div>

### `format`

Type: `boolean | 'dedent' | BuiltInParserName`

Default: `parameters.docs.source.format` or `true`

Specifies the formatting used on source code. Both `true` and `'dedent'` have the same effect of removing any extraneous indentation. Supports all valid [prettier parser names](https://prettier.io/docs/en/configuration.html#setting-the-parserdocsenoptionshtmlparser-option).

### `language`

Type:

<!-- prettier-ignore-start -->
```ts
'jsextra' | 'jsx' | 'json' | 'yml' | 'md' | 'bash' | 'css' | 'html' | 'tsx' | 'typescript' | 'graphql'
```
<!-- prettier-ignore-end -->

Default: `parameters.docs.source.language` or `'jsx'`

Specifies the language used for syntax highlighting.

### `of`

Type: Story export

Specifies which story's source is rendered.

### `transform`

Type: `(code: string, storyContext: StoryContext) => string`

Default: `parameters.docs.source.transform`

A function to dynamically transform the source before being rendered, based on the original source and any story context necessary. The returned string is displayed as-is.
If both [`code`](#code) and `transform` are specified, `transform` will be ignored.

### `type`

Type: `'auto' | 'code' | 'dynamic'`

Default: `parameters.docs.source.type` or `'auto'`

Specifies how the source code is rendered.

- **auto**: Same as **dynamic**, if supported by the framework in use; otherwise same as **code**
- **code**: Renders the value of [`code` prop](#code), otherwise renders static story source
- **dynamic**: Renders the story source with dynamically updated arg values

<div class="aside">

💡 Note that dynamic snippets will only work if the story uses [`args`](../writing-stories/args.md) and the [`Story` block](./doc-block-story.md) for that story is rendered along with the `Source` block.

</div>

### `id` (deprecated)

Type: `string`

Specifies the story id for which to render the source code. Referencing a story this way is no longer supported; use the [`of` prop](#of), instead.

### `ids` (deprecated)

Type: `string[]`

Specifies the story ids for which to render source code. Multiple stories are no longer supported; to render a single story's source, use the [`of` prop](#of).
