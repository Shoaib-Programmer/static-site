import { expect, test, describe } from "bun:test";
import { TextNode, TextType } from "./textnode";

describe("TextNode", () => {
  test("equals should confirm two Nodes equal when they are the same", () => {
    const node = new TextNode("This is a text node", TextType.BOLD);
    const node2 = new TextNode("This is a text node", TextType.BOLD);
    expect(node.equals(node2));
  });
  test("toString formats properly", () => {
    const node = new TextNode(
      "Personal website",
      TextType.LINK,
      "https://portfolio-seven-gamma-97.vercel.app"
    );
    expect(node.toString()).toBe(
      "TextNode(Personal website, link, https://portfolio-seven-gamma-97.vercel.app)"
    );
  });
});
