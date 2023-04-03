import { global } from '@storybook/global';
import { dedent } from 'ts-dedent';
import type {
  API_ComposedRef,
  API_ComposedRefUpdate,
  API_Refs,
  API_SetRefData,
  SetStoriesStoryData,
  API_IndexHash,
  API_StoryMapper,
} from '@storybook/types';
// eslint-disable-next-line import/no-cycle
import {
  transformSetStoriesStoryDataToStoriesHash,
  transformStoryIndexToStoriesHash,
} from '../lib/stories';

import type { ModuleFn } from '../index';

const { location, fetch } = global;

// eslint-disable-next-line no-useless-escape
const findFilename = /(\/((?:[^\/]+?)\.[^\/]+?)|\/)$/;

export interface SubState {
  refs: API_Refs;
}

export interface SubAPI {
  findRef: (source: string) => API_ComposedRef;
  setRef: (id: string, data: API_SetRefData, ready?: boolean) => void;
  updateRef: (id: string, ref: API_ComposedRefUpdate) => void;
  getRefs: () => API_Refs;
  checkRef: (ref: API_SetRefData) => Promise<void>;
  changeRefVersion: (id: string, url: string) => void;
  changeRefState: (id: string, previewInitialized: boolean) => void;
}

export const getSourceType = (source: string, refId?: string) => {
  const { origin: localOrigin, pathname: localPathname } = location;
  const { origin: sourceOrigin, pathname: sourcePathname } = new URL(source);

  const localFull = `${localOrigin + localPathname}`.replace(findFilename, '');
  const sourceFull = `${sourceOrigin + sourcePathname}`.replace(findFilename, '');

  if (localFull === sourceFull) {
    return ['local', sourceFull];
  }
  if (refId || source) {
    return ['external', sourceFull];
  }
  return [null, null];
};

export const defaultStoryMapper: API_StoryMapper = (b, a) => {
  return { ...a, kind: a.kind.replace('|', '/') };
};

const addRefIds = (input: API_IndexHash, ref: API_ComposedRef): API_IndexHash => {
  return Object.entries(input).reduce((acc, [id, item]) => {
    return { ...acc, [id]: { ...item, refId: ref.id } };
  }, {} as API_IndexHash);
};

async function handleRequest(
  request: Response | Promise<Response | boolean> | boolean
): Promise<API_SetRefData> {
  if (!request) return {};

  try {
    const response = await request;
    if (response === false || response === true) throw new Error('Unexpected boolean response');
    if (!response.ok) throw new Error(`Unexpected response not OK: ${response.statusText}`);

    const json = await response.json();

    if (json.entries || json.stories) {
      return { storyIndex: json };
    }

    return json as API_SetRefData;
  } catch (err) {
    return { indexError: err };
  }
}

interface UrlParseResult {
  url: string;
  authorization: string | undefined;
}

const parseUrl = (url: string): UrlParseResult => {
  const credentialsRegex = /https?:\/\/(.+:.+)@/;
  let cleanUrl = url;
  let authorization;
  const [, credentials] = url.match(credentialsRegex) || [];

  if (credentials) {
    cleanUrl = url.replace(`${credentials}@`, '');
    authorization = btoa(`${credentials}`);
  }
  return {
    url: cleanUrl,
    authorization,
  };
};

const map = (
  input: SetStoriesStoryData,
  ref: API_ComposedRef,
  options: { storyMapper?: API_StoryMapper }
): SetStoriesStoryData => {
  const { storyMapper } = options;
  if (storyMapper) {
    return Object.entries(input).reduce((acc, [id, item]) => {
      return { ...acc, [id]: storyMapper(ref, item) };
    }, {} as SetStoriesStoryData);
  }
  return input;
};

export const init: ModuleFn<SubAPI, SubState, void> = (
  { store, provider, singleStory, docsOptions = {} },
  { runCheck = true } = {}
) => {
  const api: SubAPI = {
    findRef: (source) => {
      const refs = api.getRefs();

      return Object.values(refs).find(({ url }) => url.match(source));
    },
    changeRefVersion: (id, url) => {
      const { versions, title } = api.getRefs()[id];
      const ref: API_SetRefData = { id, url, versions, title, index: {}, expanded: true };

      api.setRef(id, { ...ref, type: 'unknown' }, false);
      api.checkRef(ref);
    },
    changeRefState: (id, previewInitialized) => {
      const { [id]: ref, ...updated } = api.getRefs();

      updated[id] = { ...ref, previewInitialized };

      store.setState({
        refs: updated,
      });
    },
    checkRef: async (ref) => {
      const { id, url, version, type } = ref;
      const isPublic = type === 'server-checked';

      // ref's type starts as either 'unknown' or 'server-checked'
      // "server-checked" happens when we were able to verify the storybook is accessible from node (without cookies)
      // "unknown" happens if the request was declined of failed (this can happen because the storybook doesn't exists or authentication is required)
      //
      // we then make a request for stories.json
      //
      // if this request fails when storybook is server-checked we mark the ref as "auto-inject", this is a fallback mechanism for local storybook, legacy storybooks, and storybooks that lack stories.json
      // if the request fails with type "unknown" we give up and show an error
      // if the request succeeds we set the ref to 'lazy' type, and show the stories in the sidebar without injecting the iframe first
      //
      // then we fetch metadata if the above fetch succeeded

      const loadedData: API_SetRefData = {};
      const query = version ? `?version=${version}` : '';
      const credentials = isPublic ? 'omit' : 'include';
      const urlParseResult = parseUrl(url);

      const headers: HeadersInit = {
        Accept: 'application/json',
      };

      if (urlParseResult.authorization) {
        Object.assign(headers, {
          Authorization: `Basic ${urlParseResult.authorization}`,
        });
      }

      const [indexResult, storiesResult] = await Promise.all(
        ['index.json', 'stories.json'].map(async (file) =>
          handleRequest(
            fetch(`${urlParseResult.url}/${file}${query}`, {
              headers,
              credentials,
            })
          )
        )
      );

      if (!indexResult.indexError || !storiesResult.indexError) {
        const metadata = await handleRequest(
          fetch(`${urlParseResult.url}/metadata.json${query}`, {
            headers,
            credentials,
            cache: 'no-cache',
          }).catch(() => false)
        );

        Object.assign(loadedData, {
          ...(indexResult.indexError ? storiesResult : indexResult),
          ...(!metadata.indexError && metadata),
        });
      } else if (!isPublic) {
        // In theory the `/iframe.html` could be private and the `stories.json` could not exist, but in practice
        // the only private servers we know about (Chromatic) always include `stories.json`. So we can tell
        // if the ref actually exists by simply checking `stories.json` w/ credentials.
        loadedData.indexError = {
          message: dedent`
            Error: Loading of ref failed
              at fetch (lib/api/src/modules/refs.ts)

            URL: ${urlParseResult.url}

            We weren't able to load the above URL,
            it's possible a CORS error happened.

            Please check your dev-tools network tab.
          `,
        } as Error;
      }

      const versions =
        ref.versions && Object.keys(ref.versions).length ? ref.versions : loadedData.versions;

      await api.setRef(id, {
        id,
        url: urlParseResult.url,
        ...loadedData,
        ...(versions ? { versions } : {}),
        type: !loadedData.storyIndex ? 'auto-inject' : 'lazy',
      });
    },

    getRefs: () => {
      const { refs = {} } = store.getState();

      return refs;
    },

    setRef: (id, { storyIndex, setStoriesData, ...rest }, ready = false) => {
      if (singleStory) {
        return;
      }
      const { storyMapper = defaultStoryMapper } = provider.getConfig();
      const ref = api.getRefs()[id];

      let index: API_IndexHash;
      if (setStoriesData) {
        index = transformSetStoriesStoryDataToStoriesHash(
          map(setStoriesData, ref, { storyMapper }),
          { provider, docsOptions }
        );
      } else if (storyIndex) {
        index = transformStoryIndexToStoriesHash(storyIndex, { provider, docsOptions });
      }
      if (index) index = addRefIds(index, ref);

      api.updateRef(id, { index, ...rest });
    },

    updateRef: (id, data) => {
      const { [id]: ref, ...updated } = api.getRefs();

      updated[id] = { ...ref, ...data };

      /* eslint-disable no-param-reassign */
      const ordered = Object.keys(initialState).reduce((obj: any, key) => {
        obj[key] = updated[key];
        return obj;
      }, {});
      /* eslint-enable no-param-reassign */

      store.setState({
        refs: ordered,
      });
    },
  };

  const refs: API_Refs = (!singleStory && global.REFS) || {};

  const initialState: SubState['refs'] = refs;

  if (runCheck) {
    Object.entries(refs).forEach(([id, ref]) => {
      api.checkRef({ ...ref, stories: {} } as API_SetRefData);
    });
  }

  return {
    api,
    state: {
      refs: initialState,
    },
  };
};
