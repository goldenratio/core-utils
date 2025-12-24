import { describe, it } from "node:test";
import assert from "node:assert";

import { debounce } from "../src/debounce.js";

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

describe("debounce test", () => {
  it("should test function is debounced properly", async () => {
    let calls = 0;
    let lastArg: unknown;

    const fn = (arg: unknown) => {
      calls += 1;
      lastArg = arg;
    };

    const debounced = debounce(fn, 30);

    debounced(1);
    debounced(2);
    debounced(3);

    // Nothing should have happened yet
    assert.strictEqual(calls, 0);

    // Wait long enough for debounce to fire once
    await sleep(50);

    assert.strictEqual(calls, 1);
    assert.strictEqual(lastArg, 3);

    // Calling again should schedule a new call
    debounced("again");
    await sleep(50);

    assert.strictEqual(calls, 2);
    assert.strictEqual(lastArg, "again");
  });

  it("should test debounce function is aborted using AbortSignal", async () => {
    const ac = new AbortController();

    let calls = 0;
    const fn = () => {
      calls += 1;
    };

    const debounced = debounce(fn, 30, { signal: ac.signal });

    // Schedule, then abort before it fires
    debounced();
    ac.abort();

    await sleep(60);
    assert.strictEqual(calls, 0);

    // After abort, calling debounced should be a no-op
    debounced();
    await sleep(60);
    assert.strictEqual(calls, 0);
  });
});
