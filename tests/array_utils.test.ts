import { describe, it } from "node:test";
import assert from "node:assert";

import { chunk_array } from "../src/array_utils.js";

describe("array util test", () => {
  it("should create array chunks properly", () => {
    assert.deepStrictEqual(
      chunk_array([3, 4, 5, 6, 7, 3, 6, 5], 3),
      [
        [3, 4, 5],
        [6, 7, 3],
        [6, 5]
      ]
    );
    assert.deepStrictEqual(chunk_array([3, 4, 5, 6, 7, 3, 6, 5], 8), [[3, 4, 5, 6, 7, 3, 6, 5]]);
    assert.deepStrictEqual(chunk_array([], 2), []);
  });
});
