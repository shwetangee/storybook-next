import path from 'path';
import findUp from 'find-up';

export const getProjectRoot = () => {
  let result;
  try {
    const found = findUp.sync('.git', { type: 'directory' });
    if (found) {
      result = path.join(found, '..');
    }
  } catch (e) {
    //
  }
  try {
    const found = findUp.sync('.svn', { type: 'directory' });
    if (found) {
      result = result || path.join(found, '..');
    }
  } catch (e) {
    //
  }
  try {
    const found = findUp.sync('.yarn', { type: 'directory' });
    if (found) {
      result = result || path.join(found, '..');
    }
  } catch (e) {
    //
  }
  try {
    result = result || __dirname.split('node_modules')[0];
  } catch (e) {
    //
  }

  return result || process.cwd();
};

export const nodePathsToArray = (nodePath: string) =>
  nodePath
    .split(process.platform === 'win32' ? ';' : ':')
    .filter(Boolean)
    .map((p) => path.resolve('./', p));

const relativePattern = /^\.{1,2}([/\\]|$)/;
/**
 * Ensures that a path starts with `./` or `../`, or is entirely `.` or `..`
 */
export function normalizeStoryPath(filename: string) {
  if (relativePattern.test(filename)) return filename;

  return `.${path.sep}${filename}`;
}
