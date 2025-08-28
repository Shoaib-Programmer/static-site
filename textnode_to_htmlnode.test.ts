import { expect, test, describe } from "bun:test";
import { TextNode, TextType } from "./textnode";
import { textNodeToHTMLNode } from "./helpers";

// The HTMLNode subclasses are used under the hood; we only assert on shape/output

describe("textNodeToHTMLNode", () => {
	test("TEXT maps to LeafNode with no tag and value set", () => {
		const node = new TextNode("This is a text node", TextType.TEXT);
		const htmlNode = textNodeToHTMLNode(node);
		expect(htmlNode.tag).toBeUndefined();
		expect(htmlNode.value).toBe("This is a text node");
		expect(htmlNode.children).toBeUndefined();
	});

	test("BOLD maps to <b> with value", () => {
		const node = new TextNode("bold text", TextType.BOLD);
		const htmlNode = textNodeToHTMLNode(node);
		expect(htmlNode.tag).toBe("b");
		expect(htmlNode.value).toBe("bold text");
	});

	test("ITALIC maps to <i> with value", () => {
		const node = new TextNode("italic text", TextType.ITALIC);
		const htmlNode = textNodeToHTMLNode(node);
		expect(htmlNode.tag).toBe("i");
		expect(htmlNode.value).toBe("italic text");
	});

	test("CODE maps to <code> with value", () => {
		const node = new TextNode("const x = 1", TextType.CODE);
		const htmlNode = textNodeToHTMLNode(node);
		expect(htmlNode.tag).toBe("code");
		expect(htmlNode.value).toBe("const x = 1");
	});

	test("LINK maps to <a> with href prop and value", () => {
		const node = new TextNode("my site", TextType.LINK, "https://ex.com");
		const htmlNode = textNodeToHTMLNode(node);
		expect(htmlNode.tag).toBe("a");
		expect(htmlNode.value).toBe("my site");
		expect(htmlNode.props).toEqual({ href: "https://ex.com" });
	});

	test("IMAGE maps to <img> with src and alt and empty value", () => {
		const node = new TextNode("logo", TextType.IMAGE, "https://ex.com/logo.png");
		const htmlNode = textNodeToHTMLNode(node);
		expect(htmlNode.tag).toBe("img");
		expect(htmlNode.value).toBe("");
		expect(htmlNode.props).toEqual({ src: "https://ex.com/logo.png", alt: "logo" });
	});
});
