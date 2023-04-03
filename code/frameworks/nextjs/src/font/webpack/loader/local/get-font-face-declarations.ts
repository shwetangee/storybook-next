// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import loaderUtils from 'next/dist/compiled/loader-utils3';
import path from 'path';

import type { LoaderOptions } from '../types';

type LocalFontSrc = string | Array<{ path: string; weight?: string; style?: string }>;

export async function getFontFaceDeclarations(options: LoaderOptions, rootContext: string) {
  const localFontSrc = options.props.src as LocalFontSrc;

  // Parent folder relative to the root context
  const parentFolder = options.filename.split('/').slice(0, -1).join('/').replace(rootContext, '');

  const { validateData } = require('../utils/local-font-utils');
  const { weight, style, variable } = validateData('', options.props);

  const id = `font-${loaderUtils.getHashDigest(
    Buffer.from(JSON.stringify(localFontSrc)),
    'md5',
    'hex',
    6
  )}`;

  const getFontFaceCSS = () => {
    if (typeof localFontSrc === 'string') {
      const localFontPath = path.join(parentFolder, localFontSrc);

      return `@font-face {
          font-family: ${id};
          src: url(${localFontPath});
      }`;
    }
    return localFontSrc
      .map((font) => {
        const localFontPath = path.join(parentFolder, font.path);

        return `@font-face {
          font-family: ${id};
          src: url(${localFontPath});
          ${font.weight ? `font-weight: ${font.weight};` : ''}
          ${font.style ? `font-style: ${font.style};` : ''}
        }`;
      })
      .join('');
  };

  return {
    id,
    fontFamily: id,
    fontFaceCSS: getFontFaceCSS(),
    weights: weight ? [weight] : [],
    styles: style ? [style] : [],
    variable,
  };
}
