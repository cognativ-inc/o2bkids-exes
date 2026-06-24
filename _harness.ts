/**
 * Tiny zero-dependency test harness shared by all exercises.
 * Runnable under ts-node with no Jest config required.
 */
import * as assert from 'node:assert';

let passed = 0;
let failed = 0;
const failures: string[] = [];

export function test(name: string, fn: () => void | Promise<void>): void {
  pending.push({ name, fn });
}

type Case = { name: string; fn: () => void | Promise<void> };
const pending: Case[] = [];

export function eq<T>(actual: T, expected: T, msg?: string): void {
  assert.deepStrictEqual(actual, expected, msg);
}

/** Call once at the bottom of a file to run everything that was registered. */
export async function run(suite: string): Promise<void> {
  console.log(`\n=== ${suite} ===`);
  for (const c of pending) {
    try {
      await c.fn();
      passed++;
      console.log(`  ✓ ${c.name}`);
    } catch (err) {
      failed++;
      const message = err instanceof Error ? err.message : String(err);
      failures.push(`${c.name}: ${message}`);
      console.log(`  ✗ ${c.name}`);
      console.log(`      ${message.split('\n')[0]}`);
    }
  }
  pending.length = 0;
  console.log(`\n${passed} passed, ${failed} failed`);
  if (failed > 0) {
    console.log('\nFailures:');
    failures.forEach((f) => console.log(`  - ${f}`));
    process.exitCode = 1;
  }
}
