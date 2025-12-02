import { describe, it } from "node:test";
import assert from "node:assert";

import { is_not_null_or_undefined, to_boolean, to_float, to_int, to_number } from "../src/type_utils.js";

describe("type util test", () => {
  it("should convert anything to boolean", () => {
    assert.equal(to_boolean("true", false), true);
    assert.equal(to_boolean("1", false), true);
    assert.equal(to_boolean("false", false), false);
    assert.equal(to_boolean("0", false), false);

    assert.equal(to_boolean("TRUE", false), true);
    assert.equal(to_boolean("FALSE", false), false);

    assert.equal(to_boolean(undefined, true), true);
    assert.equal(to_boolean(undefined, false), false);

    assert.equal(to_boolean({}, true), true);
    assert.equal(to_boolean(true, true), true);
  });

  it("should convert string to int", () => {
    assert.equal(to_int("30"), 30);
    assert.equal(to_int("0"), 0);
    assert.equal(to_int("10.8"), 10);
    assert.equal(to_int(10.8), 10);
    assert.equal(to_int("-3"), -3);
    assert.equal(to_int("3r4"), 3);
    assert.equal(to_int(""), undefined);
    assert.equal(to_int("invalid-data"), undefined);
    assert.equal(to_int(undefined), undefined);
    assert.equal(to_int(null), undefined);
  });

  it("should convert to_float", () => {
    assert.equal(to_float("30"), 30);
    assert.equal(to_float("0"), 0);
    assert.equal(to_float("20.0"), 20);
    assert.equal(to_float("10.8"), 10.8);
    assert.equal(to_float(10.8), 10.8);
    assert.equal(to_float("-3"), -3);
    assert.equal(to_float("3r4"), 3);
    assert.equal(to_float(""), undefined);
    assert.equal(to_float("invalid-data"), undefined);
    assert.equal(to_float(undefined), undefined);
    assert.equal(to_float(null), undefined);
  });

  it("should convert to_number", () => {
    assert.equal(to_number("2"), 2);
    assert.equal(to_number(2), 2);
    assert.equal(to_number("2px"), undefined);
    assert.equal(to_number(""), undefined);
    assert.equal(to_number("abcde"), undefined);
    assert.equal(to_number(undefined), undefined);
    assert.equal(to_number(null), undefined);
  });

  it("should check for not null or undefined", () => {
    assert.equal(is_not_null_or_undefined(null), false);
    assert.equal(is_not_null_or_undefined(undefined), false);
    assert.equal(is_not_null_or_undefined({}), true);
  });
});
