import { describe, it } from "node:test";
import assert from "node:assert";

import {
  assert_exists,
  assert_never,
  assert_true,
  unwrap,
  unsafe_cast,
} from "../src/assert_utils.js";

describe("assert util test", () => {
  describe("assert_exists", () => {
    it("does not throw when value exists", () => {
      assert.doesNotThrow(() => {
        assert_exists(0, "should not throw");
        assert_exists("", "should not throw");
        assert_exists(false, "should not throw");
        assert_exists({}, "should not throw");
        assert_exists([], "should not throw");
      });
    });

    it("throws when value is undefined", () => {
      const message = "value must exist";
      assert.throws(
        () => {
          assert_exists(undefined, message);
        },
        (err: unknown) => {
          assert.ok(err instanceof Error);
          assert.strictEqual(err.message, message);
          return true;
        }
      );
    });

    it("throws when value is null", () => {
      const message = "value must not be null";
      assert.throws(
        () => {
          assert_exists(null, message);
        },
        (err: unknown) => {
          assert.ok(err instanceof Error);
          assert.strictEqual(err.message, message);
          return true;
        }
      );
    });
  });

  describe("assert_never", () => {
    it("always throws an error", () => {
      assert.throws(
        () => {
          // ignore TS "never" typing in tests
          assert_never(42 as never);
        },
        (err: unknown) => {
          assert.ok(err instanceof Error);
          return true;
        }
      );
    });
  });

  describe("assert_true", () => {
    it("does not throw when value is true", () => {
      assert.doesNotThrow(() => {
        assert_true(true, "should not throw");
      });
    });

    it("throws when value is false", () => {
      const message = "value must be true";
      assert.throws(
        () => {
          assert_true(false, message);
        },
        (err: unknown) => {
          assert.ok(err instanceof Error);
          assert.strictEqual(err.message, message);
          return true;
        }
      );
    });
  });

  describe("unwrap", () => {
    it("returns the value when not null/undefined", () => {
      const value = 123;
      const result = unwrap(value, "should not throw");
      assert.strictEqual(result, value);

      const obj = { a: 1 };
      const objResult = unwrap(obj, "should not throw");
      assert.strictEqual(objResult, obj);
    });

    it("throws when value is null", () => {
      const message = "null not allowed";
      assert.throws(
        () => {
          unwrap(null, message);
        },
        (err: unknown) => {
          assert.ok(err instanceof Error);
          assert.strictEqual(err.message, message);
          return true;
        }
      );
    });

    it("throws when value is undefined", () => {
      const message = "undefined not allowed";
      assert.throws(
        () => {
          unwrap(undefined, message);
        },
        (err: unknown) => {
          assert.ok(err instanceof Error);
          assert.strictEqual(err.message, message);
          return true;
        }
      );
    });
  });

  describe("unsafe_cast", () => {
    it("returns the same underlying value", () => {
      const original = { x: 1, y: 2 };
      const casted = unsafe_cast<{ x: number; y: number }>(original);
      assert.strictEqual(casted, original);
      assert.strictEqual(casted.x, 1);
      assert.strictEqual(casted.y, 2);
    });

    it("allows casting between unrelated types at runtime", () => {
      const original: unknown = "hello";
      const casted = unsafe_cast<number | string>(original);
      assert.strictEqual(casted, "hello");
    });
  });
});
