/// <reference types="node" />

/* eslint-disable no-console */
import npmLog from 'npmlog';
import prettyTime from 'pretty-hrtime';
import chalk from 'chalk';

// The default is stderr, which can cause some tools (like rush.js) to think
// there are issues with the build: https://github.com/storybookjs/storybook/issues/14621
npmLog.stream = process.stdout;

export const colors = {
  pink: chalk.hex('F1618C'),
  purple: chalk.hex('B57EE5'),
  orange: chalk.hex('F3AD38'),
  green: chalk.hex('A2E05E'),
  blue: chalk.hex('6DABF5'),
  red: chalk.hex('F16161'),
  gray: chalk.gray,
};

export const logger = {
  verbose: (message: string): void => npmLog.verbose('', message),
  info: (message: string): void => npmLog.info('', message),
  plain: (message: string): void => console.log(message),
  line: (count = 1): void => console.log(`${Array(count - 1).fill('\n')}`),
  warn: (message: string): void => npmLog.warn('', message),
  error: (message: string): void => npmLog.error('', message),
  trace: ({ message, time }: { message: string; time: [number, number] }): void =>
    npmLog.info('', `${message} (${colors.purple(prettyTime(time))})`),
  setLevel: (level = 'info'): void => {
    npmLog.level = level;
  },
};

export { npmLog as instance };

const logged = new Set();
export const once = (type: 'verbose' | 'info' | 'warn' | 'error') => (message: string) => {
  if (logged.has(message)) return undefined;
  logged.add(message);
  return logger[type](message);
};

once.clear = () => logged.clear();
once.verbose = once('verbose');
once.info = once('info');
once.warn = once('warn');
once.error = once('error');

export const deprecate = once('warn');
