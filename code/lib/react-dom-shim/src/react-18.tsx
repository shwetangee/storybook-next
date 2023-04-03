import type { FC, ReactElement } from 'react';
// @ts-expect-error react-dom doesn't have this in v16, which confuses TS
import type { Root as ReactRoot } from 'react-dom/client';
import React, { useLayoutEffect, useRef } from 'react';
// @ts-expect-error react-dom doesn't have this in v16, which confuses TS
import ReactDOM from 'react-dom/client'; // eslint-disable-line import/no-unresolved

// A map of all rendered React 18 nodes
const nodes = new Map<Element, ReactRoot>();

const WithCallback: FC<{ callback: () => void; children: ReactElement }> = ({
  callback,
  children,
}) => {
  // See https://github.com/reactwg/react-18/discussions/5#discussioncomment-2276079
  const once = useRef<() => void>();
  useLayoutEffect(() => {
    if (once.current === callback) return;
    once.current = callback;
    callback();
  }, [callback]);

  return children;
};

export const renderElement = async (node: ReactElement, el: Element) => {
  // Create Root Element conditionally for new React 18 Root Api
  const root = await getReactRoot(el);

  return new Promise((resolve) => {
    root.render(<WithCallback callback={() => resolve(null)}>{node}</WithCallback>);
  });
};

export const unmountElement = (el: Element, shouldUseNewRootApi?: boolean) => {
  const root = nodes.get(el);

  if (root) {
    root.unmount();
    nodes.delete(el);
  }
};

const getReactRoot = async (el: Element): Promise<ReactRoot | null> => {
  let root = nodes.get(el);

  if (!root) {
    root = ReactDOM.createRoot(el);
    nodes.set(el, root);
  }

  return root;
};
