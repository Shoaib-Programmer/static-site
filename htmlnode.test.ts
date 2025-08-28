import { expect, test, describe } from "bun:test";
import { HTMLNode } from "./htmlnode";

describe("HTMLNode", () => {
  test("propsToHTML formats props into HTML attribute string with trailing space", () => {
    const node = new HTMLNode(
      "a",
      undefined,
      undefined,
      { href: "https://example.com", target: "_blank" }
    );
    expect(node.propsToHTML()).toBe("href=https://example.com target=_blank ");
  });

  test("propsToHTML returns empty string when props is undefined", () => {
    const node = new HTMLNode("p", "hello", undefined, undefined);
    expect(node.propsToHTML()).toBe("");
  });

  test("propsToHTML returns empty string when props is empty object", () => {
    const node = new HTMLNode("p", "hello", undefined, {});
    expect(node.propsToHTML()).toBe("");
  });

  test("toString formats correctly with simple values", () => {
    const node = new HTMLNode("p", "hello", undefined, undefined);
    expect(node.toString()).toBe("HTMLNode(p, hello, undefined, undefined)");
  });

  test("toHTML throws not implemented error", () => {
    const node = new HTMLNode("div", undefined, undefined, undefined);
    expect(() => node.toHTML()).toThrow("This method is not implemented");
  });
});
