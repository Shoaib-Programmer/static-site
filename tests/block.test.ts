import { expect, test, describe } from "bun:test";
import { markdownToBlocks, blockToBlockType, BlockType } from "../block";

describe("markdownToBlocks", () => {
    test("splits paragraphs and list blocks per assignment example", () => {
        const md = `
This is **bolded** paragraph

This is another paragraph with _italic_ text and \`code\` here
This is the same paragraph on a new line

- This is a list
- with items
`;
        const blocks = markdownToBlocks(md);
        expect(blocks).toEqual([
            "This is **bolded** paragraph",
            "This is another paragraph with _italic_ text and `code` here\nThis is the same paragraph on a new line",
            "- This is a list\n- with items",
        ]);
    });

    test("trims leading/trailing whitespace and removes empty blocks", () => {
        const md = `\n\n  First\n\n\nSecond  \n\n  \n`;
        const blocks = markdownToBlocks(md);
        expect(blocks).toEqual(["First", "Second"]);
    });

    test("single block with no double newline returns one block", () => {
        const md = "Just a single block";
        expect(markdownToBlocks(md)).toEqual(["Just a single block"]);
    });
});

describe("blockToBlockType", () => {
    test("detects headings from 1 to 6 hashes", () => {
        expect(blockToBlockType("# Title")).toBe(BlockType.HEADING);
        expect(blockToBlockType("## Sub")).toBe(BlockType.HEADING);
        expect(blockToBlockType("###### H6 heading")).toBe(BlockType.HEADING);
    });

    test("heading requires a space after hashes", () => {
        expect(blockToBlockType("#NoSpace")).toBe(BlockType.PARAGRAPH);
    });

    test("detects fenced code blocks with triple backticks", () => {
        const code = "```\nconst x = 1;\nconsole.log(x);\n```";
        expect(blockToBlockType(code)).toBe(BlockType.CODE);
    });

    test("detects quote blocks where every line starts with >", () => {
        const quote = "> line one\n> line two\n> line three";
        expect(blockToBlockType(quote)).toBe(BlockType.QUOTE);
    });

    test("detects unordered list where every line starts with '- '", () => {
        const ul = "- item one\n- item two\n- item three";
        expect(blockToBlockType(ul)).toBe(BlockType.UNORDERED_LIST);
    });

    test("unordered list fails if one line missing '- ' prefix", () => {
        const mixed = "- item one\nitem two\n- item three";
        expect(blockToBlockType(mixed)).toBe(BlockType.PARAGRAPH);
    });

    test("detects ordered list with sequential numbering starting at 1", () => {
        const ol = "1. First\n2. Second\n3. Third";
        expect(blockToBlockType(ol)).toBe(BlockType.ORDERED_LIST);
    });

    test("ordered list fails when numbering is out of sequence", () => {
        const bad = "1. First\n3. Third\n2. Second";
        expect(blockToBlockType(bad)).toBe(BlockType.PARAGRAPH);
    });

    test("falls back to paragraph for plain text", () => {
        expect(blockToBlockType("Just some text here.")).toBe(
            BlockType.PARAGRAPH,
        );
    });
});
