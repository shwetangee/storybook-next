import { expect } from '@storybook/jest';
import type { ComponentProps } from 'react';
import React from 'react';

import { TooltipLinkList } from '@storybook/components';
import { styled } from '@storybook/theming';
import { within, userEvent, screen } from '@storybook/testing-library';
import { SidebarMenu, ToolbarMenu } from './Menu';
import { useMenu } from '../../containers/menu';

export default {
  component: SidebarMenu,
  title: 'Sidebar/Menu',
};

const fakemenu: ComponentProps<typeof TooltipLinkList>['links'] = [
  { title: 'has icon', icon: 'link', id: 'icon' },
  { title: 'has no icon', id: 'non' },
];

export const Items = () => <TooltipLinkList links={fakemenu} />;

export const Real = () => <SidebarMenu menu={fakemenu} isHighlighted />;

export const Toolbar = () => <ToolbarMenu menu={fakemenu} />;

const DoubleThemeRenderingHack = styled.div({
  '#storybook-root > [data-side="left"] > &': {
    textAlign: 'right',
  },
});

export const Expanded = () => {
  const menu = useMenu(
    {
      // @ts-expect-error (Converted from ts-ignore)
      getShortcutKeys: () => ({}),
      getAddonsShortcuts: () => ({}),
      versionUpdateAvailable: () => false,
      releaseNotesVersion: () => '6.0.0',
    },
    false,
    false,
    false,
    false,
    false
  );
  return (
    <DoubleThemeRenderingHack>
      <SidebarMenu menu={menu} isHighlighted />
    </DoubleThemeRenderingHack>
  );
};
// @ts-expect-error (needs to be converted to CSF3)
Expanded.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await new Promise((res) => {
    setTimeout(res, 500);
  });
  const menuButton = await canvas.findByRole('button');
  await userEvent.click(menuButton);
  const aboutStorybookBtn = await screen.findByText(/About your Storybook/);
  await expect(aboutStorybookBtn).toBeInTheDocument();
};

export const ExpandedWithoutReleaseNotes = () => {
  const menu = useMenu(
    {
      // @ts-expect-error (invalid)
      getShortcutKeys: () => ({}),
      getAddonsShortcuts: () => ({}),
      versionUpdateAvailable: () => false,
      releaseNotesVersion: () => undefined,
    },
    false,
    false,
    false,
    false,
    false
  );

  return (
    <DoubleThemeRenderingHack>
      <SidebarMenu menu={menu} />
    </DoubleThemeRenderingHack>
  );
};
// @ts-expect-error (needs to be converted to CSF3)
ExpandedWithoutReleaseNotes.play = async (context) => {
  const canvas = within(context.canvasElement);
  await new Promise((res) => {
    setTimeout(res, 500);
  });
  await Expanded.play(context);
  const releaseNotes = await canvas.queryByText(/Release notes/);
  await expect(releaseNotes).not.toBeInTheDocument();
};
