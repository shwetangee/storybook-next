import type { FunctionComponent, MouseEvent, ReactElement } from 'react';
import React, { Children, cloneElement } from 'react';
import { action } from '@storybook/addon-actions';
import type { Meta, StoryObj } from '@storybook/react';
import { WithTooltip } from './WithTooltip';
import { TooltipLinkList } from './TooltipLinkList';
import { Icons } from '../icon/icon';
import ellipseUrl from './assets/ellipse.png';

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

export const WithoutIcons = {
  args: {
    links: [
      {
        id: '1',
        title: 'Link 1',
        center: 'This is an addition description',
        href: 'http://google.com',
      },
      {
        id: '2',
        title: 'Link 2',
        center: 'This is an addition description',
        href: 'http://google.com',
      },
    ],
    LinkWrapper: StoryLinkWrapper,
  },
} satisfies Story;

export const WithOneIcon = {
  args: {
    links: [
      {
        id: '1',
        title: 'Link 1',
        center: 'This is an addition description',
        icon: 'link',
        href: 'http://google.com',
      },
      {
        id: '2',
        title: 'Link 2',
        center: 'This is an addition description',
        href: 'http://google.com',
      },
    ],
    LinkWrapper: StoryLinkWrapper,
  },
} satisfies Story;

export const ActiveWithoutAnyIcons = {
  args: {
    links: [
      {
        id: '1',
        title: 'Link 1',
        active: true,
        center: 'This is an addition description',
        href: 'http://google.com',
      },
      {
        id: '2',
        title: 'Link 2',
        center: 'This is an addition description',
        href: 'http://google.com',
      },
    ],
    LinkWrapper: StoryLinkWrapper,
  },
} satisfies Story;

export const ActiveWithSeparateIcon = {
  args: {
    links: [
      {
        id: '1',
        title: 'Link 1',
        icon: 'link',
        center: 'This is an addition description',
        href: 'http://google.com',
      },
      {
        id: '2',
        title: 'Link 2',
        active: true,
        center: 'This is an addition description',
        href: 'http://google.com',
      },
    ],
    LinkWrapper: StoryLinkWrapper,
  },
} satisfies Story;

export const ActiveAndIcon = {
  args: {
    links: [
      {
        id: '1',
        title: 'Link 1',
        active: true,
        icon: 'link',
        center: 'This is an addition description',
        href: 'http://google.com',
      },
      {
        id: '2',
        title: 'Link 2',
        center: 'This is an addition description',
        href: 'http://google.com',
      },
    ],
    LinkWrapper: StoryLinkWrapper,
  },
} satisfies Story;

export const WithIllustration = {
  args: {
    links: [
      {
        id: '1',
        title: 'Link 1',
        active: true,
        icon: 'link',
        right: <img src={ellipseUrl} width="16" height="16" alt="ellipse" />,
        center: 'This is an addition description',
        href: 'http://google.com',
      },
      {
        id: '2',
        title: 'Link 2',
        center: 'This is an addition description',
        right: <img src={ellipseUrl} width="16" height="16" alt="ellipse" />,
        href: 'http://google.com',
      },
    ],
    LinkWrapper: StoryLinkWrapper,
  },
} satisfies Story;

export const WithCustomIcon = {
  args: {
    links: [
      {
        id: '1',
        title: 'Link 1',
        active: true,
        icon: <Icons icon="linux" />,
        right: <img src={ellipseUrl} width="16" height="16" alt="ellipse" />,
        center: 'This is an addition description',
        href: 'http://google.com',
      },
      {
        id: '2',
        title: 'Link 2',
        center: 'This is an addition description',
        right: <img src={ellipseUrl} width="16" height="16" alt="ellipse" />,
        href: 'http://google.com',
      },
    ],
    LinkWrapper: StoryLinkWrapper,
  },
} satisfies Story;
