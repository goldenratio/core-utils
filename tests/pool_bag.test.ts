import { describe, it } from "node:test";
import assert from "node:assert";

import { PoolBag } from "../src/pool_bag.js";

describe("PoolBag Tests", () => {
  it("creates pool with given size using set_size", () => {
    let createCount = 0;

    const pool = new PoolBag<number>({
      create_pooled_item: () => {
        createCount++;
        return createCount;
      },
    });

    assert.strictEqual(pool.size, 0);

    pool.set_size(3);

    assert.strictEqual(pool.size, 3);
    assert.strictEqual(createCount, 3);
  });

  it("throws if set_size is called with non-number", () => {
    const pool = new PoolBag<number>({
      create_pooled_item: () => 1,
    });

    // @ts-expect-error runtime test for bad input
    assert.throws(() => pool.set_size("not a number"), /Parameter is not a number/);
  });

  it("get returns new object when pool is empty", () => {
    let createCount = 0;

    const pool = new PoolBag<number>({
      create_pooled_item: () => {
        createCount++;
        return createCount;
      },
    });

    const item1 = pool.get();
    const item2 = pool.get();

    assert.strictEqual(item1, 1);
    assert.strictEqual(item2, 2);
    assert.strictEqual(pool.size, 0);
    assert.strictEqual(createCount, 2);
  });

  it("get reuses objects from pool and triggers callbacks", () => {
    const events: string[] = [];

    const pool = new PoolBag<number>({
      create_pooled_item: () => 1,
      on_take_from_pool: (item) => events.push(`take:${item}`),
      on_returned_to_pool: (item) => events.push(`return:${item}`),
    });

    // Pre-fill pool
    pool.set_size(1);
    assert.strictEqual(pool.size, 1);

    // Take from pool
    const item = pool.get();
    assert.strictEqual(item, 1);
    assert.strictEqual(pool.size, 0);

    // Return to pool
    pool.release(item);
    assert.strictEqual(pool.size, 1);

    assert.deepStrictEqual(events, ["return:1", "take:1", "return:1"]);
    // Explanation:
    // - set_size(1) creates item then release() -> "return:1"
    // - get() -> "take:1"
    // - release() -> "return:1"
  });

  it("set_size shrinking destroys extra objects", () => {
    const destroyedItems: number[] = [];

    const pool = new PoolBag<number>({
      create_pooled_item: () => Math.floor(Math.random() * 1000),
      on_destroy_pool_object: (item) => destroyedItems.push(item),
    });

    pool.set_size(5);
    assert.strictEqual(pool.size, 5);

    // Shrink down to 2
    pool.set_size(2);
    assert.strictEqual(pool.size, 2);

    // Exactly 3 items should have been destroyed
    assert.strictEqual(destroyedItems.length, 3);

    // All destroyed items should be distinct from current items
    const remaining = Array.from((pool as any).items as Set<number>);
    destroyedItems.forEach((item) => {
      assert.ok(!remaining.includes(item));
    });
  });

  it("release adds items back to pool", () => {
    const pool = new PoolBag<number>({
      create_pooled_item: () => 42,
    });

    const item = pool.get();
    assert.strictEqual(pool.size, 0);

    pool.release(item);
    assert.strictEqual(pool.size, 1);

    const item2 = pool.get();
    assert.strictEqual(item2, 42);
    assert.strictEqual(pool.size, 0);
  });

  it("delete removes item and calls on_destroy_pool_object", () => {
    const destroyed: number[] = [];

    const pool = new PoolBag<number>({
      create_pooled_item: () => 1,
      on_destroy_pool_object: (item) => destroyed.push(item),
    });

    pool.set_size(1);
    assert.strictEqual(pool.size, 1);

    const [item] = (pool as any).items as Set<number>;
    pool.delete(item);

    assert.strictEqual(pool.size, 0);
    assert.deepStrictEqual(destroyed, [1]);
  });

  it("dispose destroys all items and clears pool", () => {
    const destroyed: number[] = [];

    const pool = new PoolBag<number>({
      create_pooled_item: () => Math.floor(Math.random() * 1000),
      on_destroy_pool_object: (item) => destroyed.push(item),
    });

    pool.set_size(3);
    const snapshot = Array.from((pool as any).items as Set<number>);

    pool.dispose();

    assert.strictEqual(pool.size, 0);
    assert.strictEqual(destroyed.length, 3);
    // All previously pooled items should be in destroyed list
    snapshot.forEach((item) => {
      assert.ok(destroyed.includes(item));
    });
  });

  it("on_take_from_pool is not called when creating a brand new item with empty pool", () => {
    let takeCount = 0;
    let createCount = 0;

    const pool = new PoolBag<number>({
      create_pooled_item: () => {
        createCount++;
        return 10;
      },
      on_take_from_pool: () => {
        takeCount++;
      },
    });

    const item = pool.get();
    assert.strictEqual(item, 10);
    assert.strictEqual(pool.size, 0);
    assert.strictEqual(createCount, 1);
    assert.strictEqual(takeCount, 0);
  });
});
