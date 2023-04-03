import { sync as readUpSync } from 'read-pkg-up';
import { buildStaticStandalone } from './build-static';
import { buildDevStandalone } from './build-dev';

async function build(options: any = {}, frameworkOptions: any = {}) {
  const { mode = 'dev' } = options;
  const { packageJson } = readUpSync({ cwd: __dirname });

  const commonOptions = {
    ...options,
    ...frameworkOptions,
    frameworkPresets: [
      ...(options.frameworkPresets || []),
      ...(frameworkOptions.frameworkPresets || []),
    ],
    packageJson,
  };

  if (mode === 'dev') {
    return buildDevStandalone(commonOptions);
  }

  if (mode === 'static') {
    return buildStaticStandalone(commonOptions);
  }

  throw new Error(`'mode' parameter should be either 'dev' or 'static'`);
}

export default build;
