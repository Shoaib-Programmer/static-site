import { expect, test, describe } from "bun:test";
import { TextNode, TextType } from "./textnode";

describe("TextNode", () => {
  test("equals should confirm two Nodes equal when they are the same", () => {
    const node = new TextNode("This is a text node", TextType.BOLD);
    const node2 = new TextNode("This is a text node", TextType.BOLD);
    expect(node.equals(node2)).toBe(true);
  });
  test("toString formats properly", () => {
    const node = new TextNode(
      "Personal website",
      TextType.LINK,
      "https://portfolio-seven-gamma-97.vercel.app",
    );
    expect(node.toString()).toBe(
      "TextNode(Personal website, link, https://portfolio-seven-gamma-97.vercel.app)",
    );
  });
  test("Edge case: throws if LINK type without URL", () => {
    expect(() => {
      new TextNode("Personal website", TextType.LINK);
    }).toThrow("URL must be provided if and only if textType is LINK or IMAGE");
  });
  test("Edge case: throws if IMAGE type without URL", () => {
    expect(() => {
      new TextNode("An image", TextType.IMAGE);
    }).toThrow("URL must be provided if and only if textType is LINK or IMAGE");
  });
  test("Edge case: throws if URL provided but not LINK or IMAGE type", () => {
    expect(() => {
      new TextNode("Some text", TextType.BOLD, "https://example.com");
    }).toThrow("URL must be provided if and only if textType is LINK or IMAGE");
  });
  test("textType is not included in the enum", () => {
    expect(() => {
      // @ts-ignore
      new TextNode("Some text", "dance");
    }).toThrow("textType is not included in the TextType enum");
  });
});
