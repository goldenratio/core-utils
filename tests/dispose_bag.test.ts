import { describe, it } from "node:test";
import assert from "node:assert";
import { EventEmitter } from "node:events";

import {
  DisposeBag,
  is_disposable,
} from "../src/dispose_bag.js";

class TestDisposable {
  public disposed: boolean = false;
  dispose() {
    this.disposed = true;
  }
}

describe("DisposeBag Tests", () => {

  describe("is_disposable()", () => {
    it("returns true for valid Disposable", () => {
      const obj = { dispose() { } };
      assert.equal(is_disposable(obj), true);
    });

    it("returns false for invalid values", () => {
      assert.equal(is_disposable(null), false);
      assert.equal(is_disposable(undefined), false);
      assert.equal(is_disposable({}), false);
      assert.equal(is_disposable({ dispose: 123 }), false);
      assert.equal(is_disposable(() => { }), false);
    });
  });

  describe("DisposeBag.add()", () => {
    it("executes function callbacks on dispose", () => {
      const bag = new DisposeBag();
      let a = false;
      let b = false;

      bag.add(() => {
        a = true;
      });
      bag.add(() => {
        b = true;
      });

      assert.equal(a, false);
      assert.equal(b, false);

      bag.dispose();

      assert.equal(a, true);
      assert.equal(b, true);
    });

    it("calls Disposable.dispose() on dispose", () => {
      const bag = new DisposeBag();
      const d1 = new TestDisposable();
      const d2 = new TestDisposable();

      bag.add(d1);
      bag.add(d2);

      bag.dispose();

      assert.equal(d1.disposed, true);
      assert.equal(d2.disposed, true);
    });

    it("throws for invalid items", () => {
      const bag = new DisposeBag();
      assert.throws(
        // @ts-expect-error runtime test for bad input
        () => bag.add({ not: "valid" }),
        /doesn't contain dispose method/,
      );
    });

    it("throws when adding after dispose()", () => {
      const bag = new DisposeBag();
      bag.dispose();

      assert.throws(() => bag.add(() => { }), /already disposed/);
    });
  });

  describe("DisposeBag.from_event()", () => {
    it("works with Node EventEmitter (on/off)", () => {
      const bag = new DisposeBag();
      const emitter = new EventEmitter();

      const events: unknown[] = [];

      bag.from_event(emitter, "ping", e => {
        events.push(e);
      });

      emitter.emit("ping", "A");
      emitter.emit("ping", "B");
      assert.deepEqual(events, ["A", "B"]);

      // Disposing should unsubscribe
      bag.dispose();
      emitter.emit("ping", "C");

      assert.deepEqual(events, ["A", "B"]);
    });

    it("works with EventTarget (addEventListener/removeEventListener)", () => {
      const bag = new DisposeBag();
      const emitter = new EventTarget();

      type CustomEventType = { detail: number };

      const collected_values: number[] = [];

      bag.from_event(emitter, "ping", (e: CustomEventType) => {
        collected_values.push(e.detail);
      });

      emitter.dispatchEvent(new CustomEvent("ping", { detail: 1 }));
      emitter.dispatchEvent(new CustomEvent("ping", { detail: 2 }));
      assert.deepEqual(collected_values, [1, 2]);

      // Disposing should unsubscribe
      bag.dispose();
      emitter.dispatchEvent(new CustomEvent("ping", { detail: 3 }));

      assert.deepEqual(collected_values, [1, 2]);
    });

    it("throws when used after dispose()", () => {
      const bag = new DisposeBag();
      bag.dispose();
      const emitter = new EventEmitter();

      assert.throws(
        () => {
          bag.from_event(emitter, "ping", () => { });
        },
        /already disposed/,
      );
    });
  });

  describe("DisposeBag.dispose()", () => {
    it("clears internal list and prevents reuse", () => {
      const bag = new DisposeBag();
      let called = false;

      bag.add(() => {
        called = true;
      });
      bag.dispose();

      assert.equal(called, true);

      assert.throws(() => bag.add(() => { }), /already disposed/);
    });
  });
});
