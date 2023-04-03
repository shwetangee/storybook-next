import { dirname, join } from 'path';

import downloadTarball from '@ndelangen/get-tarball';
import getNpmTarballUrl from 'get-npm-tarball-url';
import * as tempy from 'tempy';

import { externalFrameworks } from './project_types';
import type { SupportedFrameworks, SupportedRenderers } from './project_types';
import type { JsPackageManager } from './js-package-manager';
import versions from './versions';

export function getCliDir() {
  return dirname(require.resolve('@storybook/cli/package.json'));
}

const resolveUsingBranchInstall = async (packageManager: JsPackageManager, request: string) => {
  const tempDirectory = tempy.directory();
  const name = request as keyof typeof versions;

  // FIXME: this might not be the right version for community packages
  const version = versions[name] || (await packageManager.latestVersion(request));

  const url = getNpmTarballUrl(request, version, { registry: packageManager.getRegistryURL() });

  // this unzips the tarball into the temp directory
  await downloadTarball({ url, dir: tempDirectory });

  return join(tempDirectory, 'package');
};

export async function getRendererDir(
  packageManager: JsPackageManager,
  renderer: SupportedFrameworks | SupportedRenderers
) {
  const externalFramework = externalFrameworks.find((framework) => framework.name === renderer);
  const frameworkPackageName =
    externalFramework?.renderer || externalFramework?.packageName || `@storybook/${renderer}`;

  const packageJsonPath = `${frameworkPackageName}/package.json`;

  const errors: Error[] = [];

  try {
    return dirname(
      require.resolve(packageJsonPath, {
        paths: [process.cwd()],
      })
    );
  } catch (e) {
    errors.push(e);
  }

  try {
    return await resolveUsingBranchInstall(packageManager, frameworkPackageName);
  } catch (e) {
    errors.push(e);
  }

  throw new Error(`Cannot find ${packageJsonPath}, ${errors.map((e) => e.stack).join('\n\n')}`);
}
