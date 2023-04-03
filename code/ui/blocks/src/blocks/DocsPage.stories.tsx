import type { Meta, StoryObj } from '@storybook/react';
import { DocsPage } from './DocsPage';

const meta = {
  component: DocsPage,
  parameters: {
    docsStyles: true,
  },
} satisfies Meta<typeof DocsPage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    relativeCsfPaths: ['../examples/Button.stories'],
  },
};
export const SingleStory: Story = {
  parameters: {
    relativeCsfPaths: ['../examples/DocsPageParameters.stories'],
  },
};
