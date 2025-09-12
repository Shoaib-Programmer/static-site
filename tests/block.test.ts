import { expect, test, describe } from "bun:test";
import { markdownToBlocks } from "../block";

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
