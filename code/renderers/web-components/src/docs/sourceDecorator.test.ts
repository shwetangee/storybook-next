import { html } from 'lit';
import { styleMap } from 'lit/directives/style-map.js';
import { addons, useEffect } from '@storybook/preview-api';
import { SNIPPET_RENDERED } from '@storybook/docs-tools';
import type { StoryContext } from '../types';
import { sourceDecorator } from './sourceDecorator';

jest.mock('@storybook/preview-api');
const mockedAddons = addons as jest.Mocked<typeof addons>;
const mockedUseEffect = useEffect as jest.Mock;

expect.addSnapshotSerializer({
  print: (val: any) => val,
  test: (val) => typeof val === 'string',
});

const tick = () => new Promise((r) => setTimeout(r, 0));

const makeContext = (name: string, parameters: any, args: any, extra?: Partial<StoryContext>) =>
  ({
    id: `lit-test--${name}`,
    kind: 'js-text',
    name,
    parameters,
    args,
    argTypes: {},
    globals: {},
    ...extra,
  } as StoryContext);

describe('sourceDecorator', () => {
  let mockChannel: { on: jest.Mock; emit?: jest.Mock };
  beforeEach(() => {
    mockedAddons.getChannel.mockReset();
    mockedUseEffect.mockImplementation((cb) => setTimeout(() => cb(), 0));

    mockChannel = { on: jest.fn(), emit: jest.fn() };
    mockedAddons.getChannel.mockReturnValue(mockChannel as any);
  });

  it('should render dynamically for args stories', async () => {
    const storyFn = (args: any) => html`<div>args story</div>`;
    const context = makeContext('args', { __isArgsStory: true }, {});
    sourceDecorator(storyFn, context);
    await tick();
    expect(mockChannel.emit).toHaveBeenCalledWith(SNIPPET_RENDERED, {
      id: 'lit-test--args',
      args: {},
      source: '<div>args story</div>',
    });
  });

  it('should skip dynamic rendering for no-args stories', async () => {
    const storyFn = () => html`<div>classic story</div>`;
    const context = makeContext('classic', {}, {});
    sourceDecorator(storyFn, context);
    await tick();
    expect(mockChannel.emit).not.toHaveBeenCalled();
  });

  it('should use the originalStoryFn if excludeDecorators is set', async () => {
    const storyFn = (args: any) => html`<div>args story</div>`;
    const decoratedStoryFn = (args: any) => html`
      <div style=${styleMap({ padding: `${25}px`, border: '3px solid red' })}>${storyFn(args)}</div>
    `;
    const context = makeContext(
      'args',
      {
        __isArgsStory: true,
        docs: {
          source: {
            excludeDecorators: true,
          },
        },
      },
      {},
      { originalStoryFn: storyFn }
    );
    sourceDecorator(decoratedStoryFn, context);
    await tick();
    expect(mockChannel.emit).toHaveBeenCalledWith(SNIPPET_RENDERED, {
      id: 'lit-test--args',
      args: {},
      source: '<div>args story</div>',
    });
  });
});
