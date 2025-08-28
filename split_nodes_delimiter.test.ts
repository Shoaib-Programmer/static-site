import { expect, test, describe } from "bun:test";
import { TextNode, TextType } from "./textnode";
import { splitNodesDelimiter } from "./helpers";

const toTuples = (nodes: TextNode[]) => nodes.map(n => [n.text, n.textType]);

describe("splitNodesDelimiter", () => {
	test("splits single occurrence with '*' into BOLD", () => {
		const input = [new TextNode("This is *bold* text", TextType.TEXT)];
		const out = splitNodesDelimiter(input, "*", TextType.BOLD);
		expect(toTuples(out)).toEqual([
			["This is ", TextType.TEXT],
			["bold", TextType.BOLD],
			[" text", TextType.TEXT],
		]);
	});

	test("multiple '*' occurrences produce alternating TEXT and BOLD nodes", () => {
		const input = [new TextNode("a *b* c *d*", TextType.TEXT)];
		const out = splitNodesDelimiter(input, "*", TextType.BOLD);
		expect(toTuples(out)).toEqual([
			["a ", TextType.TEXT],
			["b", TextType.BOLD],
			[" c ", TextType.TEXT],
			["d", TextType.BOLD],
		]);
	});

	test("no delimiter returns original TEXT node", () => {
		const input = [new TextNode("no markers here", TextType.TEXT)];
		const out = splitNodesDelimiter(input, "*", TextType.BOLD);
		expect(toTuples(out)).toEqual([["no markers here", TextType.TEXT]]);
	});

	test("unmatched delimiter yields original text", () => {
		const input = [new TextNode("This is *incomplete", TextType.TEXT)];
		const out = splitNodesDelimiter(input, "*", TextType.BOLD);
		expect(toTuples(out)).toEqual([["This is *incomplete", TextType.TEXT]]);
	});

	test("empty capture between delimiters (e.g., '**') is ignored (no split)", () => {
		const input = [new TextNode("empty ** here", TextType.TEXT)];
		const out = splitNodesDelimiter(input, "*", TextType.BOLD);
		expect(toTuples(out)).toEqual([["empty ** here", TextType.TEXT]]);
	});

	test("handles adjacent bold segments '*a**b*'", () => {
		const input = [new TextNode("x *a**b* y", TextType.TEXT)];
		const out = splitNodesDelimiter(input, "*", TextType.BOLD);
		expect(toTuples(out)).toEqual([
			["x ", TextType.TEXT],
			["a", TextType.BOLD],
			["b", TextType.BOLD],
			[" y", TextType.TEXT],
		]);
	});

	test("leaves non-TEXT nodes untouched", () => {
		const input = [
			new TextNode("plain ", TextType.TEXT),
			new TextNode("bold", TextType.BOLD),
			new TextNode(" and *not split* here", TextType.TEXT),
		];
		const out = splitNodesDelimiter(input, "*", TextType.ITALIC);
		expect(toTuples(out)).toEqual([
			["plain ", TextType.TEXT],
			["bold", TextType.BOLD],
			[" and ", TextType.TEXT],
			["not split", TextType.ITALIC],
			[" here", TextType.TEXT],
		]);
	});

	test("supports multi-character delimiter '**'", () => {
		const input = [new TextNode("a **bold** b", TextType.TEXT)];
		const out = splitNodesDelimiter(input, "**", TextType.BOLD);
		expect(toTuples(out)).toEqual([
			["a ", TextType.TEXT],
			["bold", TextType.BOLD],
			[" b", TextType.TEXT],
		]);
	});

	// Special regex characters as delimiters
	test("delimiter '.' (dot) is escaped correctly", () => {
		const input = [new TextNode("A .code. B", TextType.TEXT)];
		const out = splitNodesDelimiter(input, ".", TextType.CODE);
		expect(toTuples(out)).toEqual([
			["A ", TextType.TEXT],
			["code", TextType.CODE],
			[" B", TextType.TEXT],
		]);
	});

	test("delimiter '+' is escaped correctly", () => {
		const input = [new TextNode("A +code+ B", TextType.TEXT)];
		const out = splitNodesDelimiter(input, "+", TextType.CODE);
		expect(toTuples(out)).toEqual([
			["A ", TextType.TEXT],
			["code", TextType.CODE],
			[" B", TextType.TEXT],
		]);
	});

	test("delimiter '?' is escaped correctly", () => {
		const input = [new TextNode("A ?code? B", TextType.TEXT)];
		const out = splitNodesDelimiter(input, "?", TextType.CODE);
		expect(toTuples(out)).toEqual([
			["A ", TextType.TEXT],
			["code", TextType.CODE],
			[" B", TextType.TEXT],
		]);
	});

	test("delimiter '|' is escaped correctly", () => {
		const input = [new TextNode("A |code| B", TextType.TEXT)];
		const out = splitNodesDelimiter(input, "|", TextType.CODE);
		expect(toTuples(out)).toEqual([
			["A ", TextType.TEXT],
			["code", TextType.CODE],
			[" B", TextType.TEXT],
		]);
	});

	test("delimiter '^' is escaped correctly", () => {
		const input = [new TextNode("A ^code^ B", TextType.TEXT)];
		const out = splitNodesDelimiter(input, "^", TextType.CODE);
		expect(toTuples(out)).toEqual([
			["A ", TextType.TEXT],
			["code", TextType.CODE],
			[" B", TextType.TEXT],
		]);
	});

	test("delimiter '$' is escaped correctly", () => {
		const input = [new TextNode("A $code$ B", TextType.TEXT)];
		const out = splitNodesDelimiter(input, "$", TextType.CODE);
		expect(toTuples(out)).toEqual([
			["A ", TextType.TEXT],
			["code", TextType.CODE],
			[" B", TextType.TEXT],
		]);
	});

	test("delimiter '(' and ')' are escaped correctly", () => {
		const input = [new TextNode("A (code) B", TextType.TEXT)];
		const out = splitNodesDelimiter(input, "(", TextType.CODE);
		// Using '(' alone as delimiter, pattern looks for (code( which doesn't match; instead use ')' to complete pair
		const out2 = splitNodesDelimiter(input, ")", TextType.CODE);
		expect(toTuples(out)).toEqual([["A (code) B", TextType.TEXT]]);
		expect(toTuples(out2)).toEqual([["A (code) B", TextType.TEXT]]);
	});

	test("delimiter '[' and ']' are escaped correctly", () => {
		const input = [new TextNode("A [code] B", TextType.TEXT)];
		const out = splitNodesDelimiter(input, "[", TextType.CODE);
		const out2 = splitNodesDelimiter(input, "]", TextType.CODE);
		expect(toTuples(out)).toEqual([["A [code] B", TextType.TEXT]]);
		expect(toTuples(out2)).toEqual([["A [code] B", TextType.TEXT]]);
	});

	test("delimiter '{' and '}' are escaped correctly", () => {
		const input = [new TextNode("A {code} B", TextType.TEXT)];
		const out = splitNodesDelimiter(input, "{", TextType.CODE);
		const out2 = splitNodesDelimiter(input, "}", TextType.CODE);
		expect(toTuples(out)).toEqual([["A {code} B", TextType.TEXT]]);
		expect(toTuples(out2)).toEqual([["A {code} B", TextType.TEXT]]);
	});

	test("delimiter '/' is escaped correctly", () => {
		const input = [new TextNode("A /em/ B", TextType.TEXT)];
		const out = splitNodesDelimiter(input, "/", TextType.ITALIC);
		expect(toTuples(out)).toEqual([
			["A ", TextType.TEXT],
			["em", TextType.ITALIC],
			[" B", TextType.TEXT],
		]);
	});

	test("delimiter '-' is escaped correctly", () => {
		const input = [new TextNode("A -code- B", TextType.TEXT)];
		const out = splitNodesDelimiter(input, "-", TextType.CODE);
		expect(toTuples(out)).toEqual([
			["A ", TextType.TEXT],
			["code", TextType.CODE],
			[" B", TextType.TEXT],
		]);
	});

	test("delimiter '`' is escaped correctly (code-like)", () => {
		const input = [new TextNode("A `snip` B", TextType.TEXT)];
		const out = splitNodesDelimiter(input, "`", TextType.CODE);
		expect(toTuples(out)).toEqual([
			["A ", TextType.TEXT],
			["snip", TextType.CODE],
			[" B", TextType.TEXT],
		]);
	});
});
