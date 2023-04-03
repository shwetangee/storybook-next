import type { FC } from 'react';
import React, { useCallback, useMemo } from 'react';

import { Badge, Icons } from '@storybook/components';
import type { API } from '@storybook/manager-api';
import { styled, useTheme } from '@storybook/theming';

import { shortcutToHumanString } from '@storybook/manager-api';

const focusableUIElements = {
  storySearchField: 'storybook-explorer-searchfield',
  storyListMenu: 'storybook-explorer-menu',
  storyPanelRoot: 'storybook-panel-root',
};

const Key = styled.span(({ theme }) => ({
  display: 'inline-block',
  height: 16,
  lineHeight: '16px',
  textAlign: 'center',
  fontSize: '11px',
  background: theme.base === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)',
  color: theme.base === 'light' ? theme.color.dark : theme.textMutedColor,
  borderRadius: 2,
  userSelect: 'none',
  pointerEvents: 'none',
  padding: '0 6px',
}));

const KeyChild = styled.code(
  ({ theme }) => `
  padding: 0;
  vertical-align: middle;

  & + & {
    margin-left: 6px;
  }
`
);

export const Shortcut: FC<{ keys: string[] }> = ({ keys }) => (
  <>
    <Key>
      {keys.map((key, index) => (
        <KeyChild key={key}>{shortcutToHumanString([key])}</KeyChild>
      ))}
    </Key>
  </>
);

export const useMenu = (
  api: API,
  showToolbar: boolean,
  isFullscreen: boolean,
  showPanel: boolean,
  showNav: boolean,
  enableShortcuts: boolean
) => {
  const theme = useTheme();
  const shortcutKeys = api.getShortcutKeys();

  const about = useMemo(
    () => ({
      id: 'about',
      title: 'About your Storybook',
      onClick: () => api.navigateToSettingsPage('/settings/about'),
      right: api.versionUpdateAvailable() && <Badge status="positive">Update</Badge>,
    }),
    [api]
  );

  const releaseNotes = useMemo(
    () => ({
      id: 'release-notes',
      title: 'Release notes',
      onClick: () => api.navigateToSettingsPage('/settings/release-notes'),
    }),
    [api]
  );

  const shortcuts = useMemo(
    () => ({
      id: 'shortcuts',
      title: 'Keyboard shortcuts',
      onClick: () => api.navigateToSettingsPage('/settings/shortcuts'),
      right: enableShortcuts ? <Shortcut keys={shortcutKeys.shortcutsPage} /> : null,
      style: {
        borderBottom: `4px solid ${theme.appBorderColor}`,
      },
    }),
    [api, enableShortcuts, shortcutKeys.shortcutsPage, theme.appBorderColor]
  );

  const sidebarToggle = useMemo(
    () => ({
      id: 'S',
      title: 'Show sidebar',
      onClick: () => api.toggleNav(),
      active: showNav,
      right: enableShortcuts ? <Shortcut keys={shortcutKeys.toggleNav} /> : null,
      left: showNav ? <Icons icon="check" /> : null,
    }),
    [api, enableShortcuts, shortcutKeys, showNav]
  );

  const toolbarToogle = useMemo(
    () => ({
      id: 'T',
      title: 'Show toolbar',
      onClick: () => api.toggleToolbar(),
      active: showToolbar,
      right: enableShortcuts ? <Shortcut keys={shortcutKeys.toolbar} /> : null,
      left: showToolbar ? <Icons icon="check" /> : null,
    }),
    [api, enableShortcuts, shortcutKeys, showToolbar]
  );

  const addonsToggle = useMemo(
    () => ({
      id: 'A',
      title: 'Show addons',
      onClick: () => api.togglePanel(),
      active: showPanel,
      right: enableShortcuts ? <Shortcut keys={shortcutKeys.togglePanel} /> : null,
      left: showPanel ? <Icons icon="check" /> : null,
    }),
    [api, enableShortcuts, shortcutKeys, showPanel]
  );

  const addonsOrientationToggle = useMemo(
    () => ({
      id: 'D',
      title: 'Change addons orientation',
      onClick: () => api.togglePanelPosition(),
      right: enableShortcuts ? <Shortcut keys={shortcutKeys.panelPosition} /> : null,
    }),
    [api, enableShortcuts, shortcutKeys]
  );

  const fullscreenToggle = useMemo(
    () => ({
      id: 'F',
      title: 'Go full screen',
      onClick: () => api.toggleFullscreen(),
      active: isFullscreen,
      right: enableShortcuts ? <Shortcut keys={shortcutKeys.fullScreen} /> : null,
      left: isFullscreen ? <Icons icon="check" /> : null,
    }),
    [api, enableShortcuts, shortcutKeys, isFullscreen]
  );

  const searchToggle = useMemo(
    () => ({
      id: '/',
      title: 'Search',
      onClick: () => api.focusOnUIElement(focusableUIElements.storySearchField),
      right: enableShortcuts ? <Shortcut keys={shortcutKeys.search} /> : null,
    }),
    [api, enableShortcuts, shortcutKeys]
  );

  const up = useMemo(
    () => ({
      id: 'up',
      title: 'Previous component',
      onClick: () => api.jumpToComponent(-1),
      right: enableShortcuts ? <Shortcut keys={shortcutKeys.prevComponent} /> : null,
    }),
    [api, enableShortcuts, shortcutKeys]
  );

  const down = useMemo(
    () => ({
      id: 'down',
      title: 'Next component',
      onClick: () => api.jumpToComponent(1),
      right: enableShortcuts ? <Shortcut keys={shortcutKeys.nextComponent} /> : null,
    }),
    [api, enableShortcuts, shortcutKeys]
  );

  const prev = useMemo(
    () => ({
      id: 'prev',
      title: 'Previous story',
      onClick: () => api.jumpToStory(-1),
      right: enableShortcuts ? <Shortcut keys={shortcutKeys.prevStory} /> : null,
    }),
    [api, enableShortcuts, shortcutKeys]
  );

  const next = useMemo(
    () => ({
      id: 'next',
      title: 'Next story',
      onClick: () => api.jumpToStory(1),
      right: enableShortcuts ? <Shortcut keys={shortcutKeys.nextStory} /> : null,
    }),
    [api, enableShortcuts, shortcutKeys]
  );

  const collapse = useMemo(
    () => ({
      id: 'collapse',
      title: 'Collapse all',
      onClick: () => api.collapseAll(),
      right: enableShortcuts ? <Shortcut keys={shortcutKeys.collapseAll} /> : null,
    }),
    [api, enableShortcuts, shortcutKeys]
  );

  const getAddonsShortcuts = useCallback(() => {
    const addonsShortcuts = api.getAddonsShortcuts();
    const keys = shortcutKeys as any;
    return Object.entries(addonsShortcuts)
      .filter(([_, { showInMenu }]) => showInMenu)
      .map(([actionName, { label, action }]) => ({
        id: actionName,
        title: label,
        onClick: () => action(),
        right: enableShortcuts ? <Shortcut keys={keys[actionName]} /> : null,
      }));
  }, [api, enableShortcuts, shortcutKeys]);

  return useMemo(
    () => [
      about,
      ...(api.releaseNotesVersion() ? [releaseNotes] : []),
      shortcuts,
      sidebarToggle,
      toolbarToogle,
      addonsToggle,
      addonsOrientationToggle,
      fullscreenToggle,
      searchToggle,
      up,
      down,
      prev,
      next,
      collapse,
      ...getAddonsShortcuts(),
    ],
    [
      about,
      api,
      releaseNotes,
      shortcuts,
      sidebarToggle,
      toolbarToogle,
      addonsToggle,
      addonsOrientationToggle,
      fullscreenToggle,
      searchToggle,
      up,
      down,
      prev,
      next,
      collapse,
      getAddonsShortcuts,
    ]
  );
};
