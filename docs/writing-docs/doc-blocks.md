---
title: Doc blocks
---

Storybook offers a number of doc blocks to help document your components and other aspects of your project.

There are two common ways to use doc blocks in Storybook, within MDX and as part of the docs page template.

## Within MDX

The blocks are most commonly used within Storybook's [MDX documentation](./mdx.md):

![Screenshot of mdx content](./mdx-example.png)

<!-- prettier-ignore-start -->
```md
{/* ButtonDocs.mdx */}

import { Meta, Primary, Controls, Story } from '@storybook/blocks';
import * as ButtonStories from './Button.stories';

<Meta of={ButtonStories} />

# Button

A button is ...

<Primary />

## Props

<Controls />

## Stories

### Primary

Button can be of primary importance

<Story of={ButtonStories.Primary} />

Button can be of secondary importance

<Story of={ButtonStories.Secondary} />

{/* ... */}
```
<!-- prettier-ignore-end -->

## Customizing the automatic docs page

The blocks are also used to define the page template for [automatics docs](./autodocs.md). For example, here's the default template:

![Screenshot of automatic docs template](./autodocs-default-template.png)

```jsx
import { Title, Subtitle, Description, Primary, Controls, Stories } from '@storybook/blocks';

export const autoDocsTemplate = () => (
  <>
    <Title />
    <Subtitle />
    <Description />
    <Primary />
    <Controls />
    <Stories />
  </>
);
```

If you [override the default page template](./autodocs.md#write-a-custom-template), you can use doc blocks in a similar manner to build the perfect docs page for your project.

Note that some doc blocks render other blocks. For example, the `<Stories />` block expands to:

<!-- prettier-ignore-start -->
```md
## Stories

<Canvas>
  ### Story name
  <Description />
  <Story />
  <Source />
</Canvas>

{/* ... repeat <Canvas> for each story */}
```
<!-- prettier-ignore-end -->

As a result, for example, customizing the [`Source`](../api/doc-block-source.md) block via parameters (see next section) will also affect the Source blocks rendered as part of [`Canvas`](../api/doc-block-canvas.md) blocks.

## Customizing doc blocks

In both use cases (MDX and automatic docs), many of the doc blocks can be customized via [parameters](../writing-stories/parameters.md).

For example, you can filter out the `style` prop from all [`Controls`](../api/doc-block-controls.md) tables through your Storybook:

<!-- prettier-ignore-start -->
<CodeSnippets
  paths={[
    'common/storybook-preview-doc-blocks-controls-exclude-prop.js.mdx',
    'common/storybook-preview-doc-blocks-controls-exclude-prop.ts.mdx',
  ]}
/>

<!-- prettier-ignore-end -->

<div class="aside">

ℹ️ Parameters can also be defined at the [component](../writing-stories/parameters.md#component-parameters) (or meta) level or the [story](../writing-stories/parameters.md#story-parameters) level, allowing you to customize doc blocks exactly as you need, where you need.

</div>

The blocks that accept customization via parameters are marked in the list of available blocks, below.

When using a doc block in MDX, it can also be customized with its props:

<!-- prettier-ignore-start -->
```md
<Controls exclude={['style']}>
```
<!-- prettier-ignore-end -->

## Available blocks

Each block has a dedicated API reference page, detailing usage, available options, and technical details.

### [ArgTypes](../api/doc-block-argtypes.md)

<div class="aside">

Accepts parameters in the namespace `parameters.docs.argTypes`.

</div>

The `ArgTypes` block can be used to show a static table of [arg types](../api/argtypes.md) for a given component, as a way to document its interface.

![Screenshot of ArgTypes block](../api/doc-block-argtypes.png)

### [Canvas](../api/doc-block-canvas.md)

<div class="aside">

Accepts parameters in the namespace `parameters.docs.canvas`.

</div>

The `Canvas` block is a wrapper around a [`Story`](../api/doc-block-story.md), featuring a toolbar that allows you to interact with its content while automatically providing the required [`Source`](../api/doc-block-source.md) snippets.

![Screenshot of Canvas block](../api/doc-block-canvas.png)

### [ColorPalette](../api/doc-block-colorpalette.md)

The `ColorPalette` block allows you to document all color-related items (e.g., swatches) used throughout your project.

![Screenshot of ColorPalette and ColorItem blocks](../api/doc-block-colorpalette.png)

### [Controls](../api/doc-block-controls.md)

<div class="aside">

Accepts parameters in the namespace `parameters.docs.controls`.

</div>

The `Controls` block can be used to show a dynamic table of args for a given story, as a way to document its interface, and to allow you to change the args for a (separately) rendered story (via the [`Story`](../api/doc-block-story.md) or [`Canvas`](../api/doc-block-canvas.md) blocks).

![Screenshot of Controls block](../api/doc-block-controls.png)

### [Description](../api/doc-block-description.md)

The `Description` block displays the description for a component, story, or meta, obtained from their respective JSDoc comments.

![Screenshot of Description block](../api/doc-block-title-subtitle-description.png)

### [IconGallery](../api/doc-block-icongallery.md)

The `IconGallery` block enables you to easily document all icons associated with your project, displayed in a neat grid.

![Screenshot of IconGallery and IconItem blocks](../api/doc-block-icongallery.png)

### [Markdown](../api/doc-block-markdown.md)

The `Markdown` block allows you to import and include plain markdown in your MDX files.

![Screenshot of Markdown block](../api/doc-block-markdown.png)

### [Meta](../api/doc-block-meta.md)

The `Meta` block is used to [attach](#attached-vs-unattached) a custom MDX docs page alongside a component’s list of stories. It doesn’t render any content, but serves two purposes in an MDX file:

- Attaches the MDX file to a component and its stories, or
- Controls the location of the unattached docs entry in the sidebar.

### [Primary](../api/doc-block-primary.md)

The `Primary` block displays the primary (first defined in the stories file) story, in a [`Story`](../api/doc-block-story.md) block. It is typically rendered immediately under the title in a docs entry.

![Screenshot of Primary block](../api/doc-block-primary.png)

### [Source](../api/doc-block-source.md)

<div class="aside">

Accepts parameters in the namespace `parameters.docs.source`.

</div>

The `Source` block is used to render a snippet of source code directly.

![Screenshot of Source block](../api/doc-block-source.png)

### [Stories](../api/doc-block-stories.md)

The `Stories` block renders the full collection of stories in a stories file.

![Screenshot of Stories block](../api/doc-block-stories.png)

### [Story](../api/doc-block-story.md)

<div class="aside">

Accepts parameters in the namespace `parameters.docs.story`.

</div>

Stories (component tests) are Storybook's fundamental building blocks.

In Storybook Docs, you can render any of your stories from your CSF files in the context of an MDX file with all annotations (parameters, args, loaders, decorators, play function) applied using the `Story` block.

![Screenshot of Story block](../api/doc-block-story.png)

### [Subtitle](../api/doc-block-subtitle.md)

The `Subtitle` block can serve as a secondary heading for your docs entry.

![Screenshot of Subtitle block](../api/doc-block-title-subtitle-description.png)

### [Title](../api/doc-block-title.md)

The `Title` block serves as the primary heading for your docs entry. It is typically used to provide the component or page name.

![Screenshot of Title block](../api/doc-block-title-subtitle-description.png)

### [Typeset](../api/doc-block-typeset.md)

The `Typeset` block helps document the fonts used throughout your project.

![Screenshot of Typeset block](../api/doc-block-typeset.png)

### [Unstyled](../api/doc-block-unstyled.md)

The `Unstyled` block is a special block that disables Storybook's default styling in MDX docs wherever it is added.

By default, most elements (like `h1`, `p`, etc.) in docs have a few default styles applied to ensure the docs look good. However, sometimes you might want some of your content to not have these styles applied. In those cases, wrap the content with the `Unstyled` block to remove the default styles.

![Screenshot of Unstyled block](../api/doc-block-unstyled.png)

## Make your own doc blocks

Storybook also provides a [`useOf` hook](../api/doc-block-useof.md) to make it easier to create your own blocks that function in the same manner as the built-in blocks.

#### Learn more about Storybook documentation

- [Autodocs](./autodocs.md) for creating documentation for your stories
- [MDX](./mdx.md) for customizing your documentation
- Doc Blocks for authoring your documentation
- [Publishing docs](./build-documentation.md) to automate the process of publishing your documentation
