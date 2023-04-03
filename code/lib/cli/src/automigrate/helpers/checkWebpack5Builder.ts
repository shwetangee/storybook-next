import chalk from 'chalk';
import semver from 'semver';
import dedent from 'ts-dedent';
import type { GetStorybookData } from './mainConfigFile';
import { getStorybookData } from './mainConfigFile';

const logger = console;

export const checkWebpack5Builder = async ({
  configDir,
  packageManager,
}: Parameters<GetStorybookData>[0]) => {
  const { mainConfig, storybookVersion } = await getStorybookData({ configDir, packageManager });

  if (semver.lt(storybookVersion, '6.3.0')) {
    logger.warn(
      dedent`
        Detected SB 6.3 or below, please upgrade storybook to use webpack5.

        To upgrade to the latest stable release, run this from your project directory:

        ${chalk.cyan('npx storybook upgrade')}

        Add the ${chalk.cyan('--prerelease')} flag to get the latest prerelease.
      `.trim()
    );
    return null;
  }

  if (semver.gte(storybookVersion, '7.0.0')) {
    return null;
  }

  if (!mainConfig) {
    logger.warn('Unable to find storybook main.js config');
    return null;
  }

  const builder = mainConfig.core?.builder;
  if (builder && builder !== 'webpack4') {
    logger.info(`Found builder ${builder}, skipping`);
    return null;
  }

  return { storybookVersion };
};
