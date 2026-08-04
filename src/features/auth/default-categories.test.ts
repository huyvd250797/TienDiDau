import { describe, expect, it } from "vitest";

import {
  DEFAULT_CATEGORIES,
  DEFAULT_CATEGORY_COUNTS
} from "@/features/auth/default-categories";

describe("default categories", () => {
  it("contains exactly 7 income and 13 expense categories", () => {
    expect(DEFAULT_CATEGORY_COUNTS).toEqual({
      total: 20,
      income: 7,
      expense: 13
    });
  });

  it("uses unique stable ids and system keys", () => {
    const ids = DEFAULT_CATEGORIES.map((category) => category.id);
    const keys = DEFAULT_CATEGORIES.map((category) => category.systemKey);

    expect(new Set(ids).size).toBe(ids.length);
    expect(new Set(keys).size).toBe(keys.length);
  });

  it("keeps all monetary category names non-empty", () => {
    expect(DEFAULT_CATEGORIES.every((category) => category.name.trim().length > 0)).toBe(true);
  });
});
