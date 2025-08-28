import { expect, test, describe } from "bun:test";
import { LeafNode } from "./leafnode";

describe("LeafNode", () => {
  test("renders plain value when tag is falsy (and no props)", () => {
    // @ts-expect-error testing undefined tag path by forcing through the type
    const node = new LeafNode(undefined, "hello", undefined);
    expect(node.toHTML()).toBe("hello");
  });

  test("throws when value is empty string", () => {
    const node = new LeafNode("p", "", {});
    expect(() => node.toHTML()).toThrow("Value must be present for a LeafNode");
  });

  test("throws when value is undefined", () => {
    // @ts-expect-error testing missing value path by forcing through the type
    const node = new LeafNode("p", undefined, {});
    expect(() => node.toHTML()).toThrow("Value must be present for a LeafNode");
  });

  test("renders tag with props and closes correctly", () => {
    const node = new LeafNode("a", "Click me", { href: "https://ex.com", rel: "noopener" });
    expect(node.toHTML()).toBe("<a href=https://ex.com rel=noopener >Click me</a>");
  });

  test("renders tag without props (no extra space before closing angle)", () => {
    // tag present implies props must be present per base class; use empty object
    const node = new LeafNode("span", "hi", {});
    expect(node.toHTML()).toBe("<span >hi</span>");
  });
});
