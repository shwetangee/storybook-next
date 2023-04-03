import type { Task } from '../task';
import { exec } from '../utils/exec';
import { PORT } from './serve';

export const testRunnerBuild: Task & { port: number } = {
  description: 'Run the test runner against a built sandbox',
  junit: true,
  dependsOn: ['serve'],
  port: PORT,
  async ready() {
    return false;
  },
  async run({ sandboxDir, junitFilename, template }, { dryRun, debug }) {
    const execOptions = { cwd: sandboxDir };
    const flags = [`--url http://localhost:${this.port}`, '--junit', '--maxWorkers=2'];

    // index-json mode is only supported in ssv7
    if (template.modifications?.mainConfig?.features?.storyStoreV7 !== false) {
      flags.push('--index-json');
    }

    await exec(
      `yarn test-storybook ${flags.join(' ')}`,
      {
        ...execOptions,
        env: {
          JEST_JUNIT_OUTPUT_FILE: junitFilename,
        },
      },
      { dryRun, debug }
    );
  },
};
