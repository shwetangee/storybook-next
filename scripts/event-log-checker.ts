/* eslint-disable jest/no-export, jest/expect-expect, no-console */
import chalk from 'chalk';
import assert from 'assert';
import fetch from 'node-fetch';
import { allTemplates } from '../code/lib/cli/src/sandbox-templates';
import { oneWayHash } from '../code/lib/telemetry/src/one-way-hash';

const PORT = process.env.PORT || 6007;

const eventTypeExpectations = {
  build: {},
};

async function run() {
  const [eventType, templateName] = process.argv.slice(2);
  let testMessage = '';

  // very simple jest-like test fn for better error readability
  const test = (message: string, fn: () => void) => {
    testMessage = message;
    fn();
  };

  try {
    if (!eventType || !templateName) {
      throw new Error(
        `Need eventType and templateName; call with ./event-log-checker <eventType> <templateName>`
      );
    }

    const expectation = eventTypeExpectations[eventType as keyof typeof eventTypeExpectations];
    if (!expectation) throw new Error(`Unexpected eventType '${eventType}'`);

    const template = allTemplates[templateName as keyof typeof allTemplates];
    if (!template) throw new Error(`Unexpected template '${templateName}'`);

    const events = await (await fetch(`http://localhost:${PORT}/event-log`)).json();

    test('Should log 2 events', () => {
      assert.equal(
        events.length,
        2,
        `Expected 2 events but received ${
          events.length
        } instead. The following events were logged: ${JSON.stringify(events)}`
      );
    });

    const [bootEvent, mainEvent] = events;

    test(`Should log a boot event with a payload of type ${eventType}`, () => {
      assert.equal(bootEvent.eventType, 'boot');
      assert.equal(bootEvent.payload?.eventType, eventType);
    });

    // Test only StoryStoreV7 projects, as ssv6 does not support the storyIndex
    if (template.modifications?.mainConfig?.features?.storyStoreV7 !== false) {
      const { exampleStoryCount, exampleDocsCount } = mainEvent.payload?.storyIndex || {};
      if (['build', 'dev'].includes(eventType)) {
        test(`${eventType} event should contain 8 stories and 3 docs entries`, () => {
          assert.equal(
            exampleStoryCount,
            8,
            `Expected 8 stories but received ${exampleStoryCount} instead.`
          );
          assert.equal(
            exampleDocsCount,
            3,
            `Expected 3 docs entries but received ${exampleDocsCount} instead.`
          );
        });
      }
    }

    test(`main event should be ${eventType} and contain correct id and session id`, () => {
      assert.equal(mainEvent.eventType, eventType);
      assert.notEqual(mainEvent.eventId, bootEvent.eventId);
      assert.equal(mainEvent.sessionId, bootEvent.sessionId);
    });

    test(`main event should contain anonymousId properly hashed`, () => {
      const templateDir = `sandbox/${templateName.replace('/', '-')}`;
      const unhashedId = `github.com/storybookjs/storybook.git${templateDir}`;
      assert.equal(mainEvent.context.anonymousId, oneWayHash(unhashedId));
    });

    const {
      expected: { renderer, builder, framework },
    } = template;

    test(`main event should contain correct packages from template's "expected" field`, () => {
      assert.equal(mainEvent.metadata.renderer, renderer);
      assert.equal(mainEvent.metadata.builder, builder);
      assert.equal(mainEvent.metadata.framework.name, framework);
    });
  } catch (err) {
    if (err instanceof assert.AssertionError) {
      console.log(`Assertions failed for ${chalk.bold(templateName)}\n`);
      console.log(chalk.bold(chalk.red`✕ ${testMessage}:`));
      console.log(err);
      process.exit(1);
    }
    throw err;
  }
}

export {};

if (require.main === module) {
  run()
    .then(() => process.exit(0))
    .catch((err) => {
      console.log(err);
      process.exit(1);
    });
}
