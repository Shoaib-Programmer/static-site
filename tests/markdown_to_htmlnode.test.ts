import { expect, test, describe } from "bun:test";
import { markdownToHTMLNode } from "../html";

describe("markdownToHTMLNode", () => {
    test("renders a simple paragraph", () => {
        const root = markdownToHTMLNode("Hello world");
        expect(root.toHTML()).toBe("<div ><p >Hello world</p></div>");
    });

    test("renders inline bold and italic inside paragraph", () => {
        const md = "This is **bold** and _italic_.";
        const root = markdownToHTMLNode(md);
        expect(root.toHTML()).toBe(
            "<div ><p >This is <b >bold</b> and <i >italic</i>.</p></div>",
        );
    });

    test("renders heading levels", () => {
        expect(markdownToHTMLNode("# Title").toHTML()).toBe(
            "<div ><h1 >Title</h1></div>",
        );
        expect(markdownToHTMLNode("### Sub").toHTML()).toBe(
            "<div ><h3 >Sub</h3></div>",
        );
    });

    test("renders blockquote from > lines", () => {
        const md = "> quoted\n> text";
        const root = markdownToHTMLNode(md);
        expect(root.toHTML()).toBe(
            "<div ><blockquote >quoted\ntext</blockquote></div>",
        );
    });

    test("renders unordered list", () => {
        const md = "- one\n- two";
        const root = markdownToHTMLNode(md);
        expect(root.toHTML()).toBe(
            "<div ><ul ><li >one</li><li >two</li></ul></div>",
        );
    });

    test("renders ordered list", () => {
        const md = "1. one\n2. two";
        const root = markdownToHTMLNode(md);
        expect(root.toHTML()).toBe(
            "<div ><ol ><li >one</li><li >two</li></ol></div>",
        );
    });

    test("renders code block without inline parsing", () => {
        const md = '```js\nconst msg = "**not bold**";\n```';
        const root = markdownToHTMLNode(md);
        expect(root.toHTML()).toBe(
            '<div ><pre ><code >const msg = "**not bold**";</code></pre></div>',
        );
    });

    test("renders multiple blocks under root div", () => {
        const md = [
            "# Title",
            "",
            "Paragraph with a [link](https://ex.com).",
        ].join("\n");
        const root = markdownToHTMLNode(md);
        expect(root.toHTML()).toBe(
            "<div ><h1 >Title</h1><p >Paragraph with a <a href=https://ex.com >link</a>.</p></div>",
        );
    });
});
