import type { FunctionComponent, MouseEvent, ReactElement } from 'react';
import React, { Children, cloneElement } from 'react';
import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
import { TooltipLinkList, WithTooltip } from '@storybook/components';
import { Shortcut } from './menu';

const onLinkClick = action('onLinkClick');

interface StoryLinkWrapperProps {
  href: string;
  passHref?: boolean;
}

const StoryLinkWrapper: FunctionComponent<StoryLinkWrapperProps> = ({
  href,
  passHref = false,
  children,
}) => {
  const child = Children.only(children) as ReactElement;
  return cloneElement(child, {
    href: passHref && href,
    onClick: (e: MouseEvent) => {
      e.preventDefault();
      onLinkClick(href);
    },
  });
};

export default {
  component: TooltipLinkList,
  decorators: [
    (storyFn) => (
      <div
        style={{
          height: '300px',
        }}
      >
        <WithTooltip placement="top" startOpen tooltip={storyFn()}>
          <div>Tooltip</div>
        </WithTooltip>
      </div>
    ),
  ],
  excludeStories: ['links'],
} satisfies Meta<typeof TooltipLinkList>;

type Story = StoryObj<typeof TooltipLinkList>;

export const WithShortcuts = {
  args: {
    links: [
      {
        id: '1',
        title: 'Link 1',
        center: 'This is an addition description',
        right: <Shortcut keys={['⌘']} />,
        href: 'http://google.com',
      },
      {
        id: '2',
        title: 'Link 2',
        center: 'This is an addition description',
        right: <Shortcut keys={['⌘', 'K']} />,
        href: 'http://google.com',
      },
    ],
    LinkWrapper: StoryLinkWrapper,
  },
} satisfies Story;

export const WithShortcutsActive = {
  args: {
    links: [
      {
        id: '1',
        title: 'Link 1',
        center: 'This is an addition description',
        active: true,
        right: <Shortcut keys={['⌘']} />,
        href: 'http://google.com',
      },
      {
        id: '2',
        title: 'Link 2',
        center: 'This is an addition description',
        right: <Shortcut keys={['⌘', 'K']} />,
        href: 'http://google.com',
      },
    ],
    LinkWrapper: StoryLinkWrapper,
  },
} satisfies Story;
