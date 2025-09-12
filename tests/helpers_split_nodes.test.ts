import { expect, test, describe } from "bun:test";
import { TextNode, TextType } from "../textnode";
import { splitNodesImage, splitNodesLink } from "../helpers";

const toTuples = (nodes: TextNode[]) =>
    nodes.map((n) => [n.text, n.textType, n.url]);

describe("splitNodesImage", () => {
    test("splits multiple markdown images into TEXT and IMAGE nodes", () => {
        const node = new TextNode(
            "This is text with an ![image](https://i.imgur.com/zjjcJKZ.png) and another ![second image](https://i.imgur.com/3elNhQu.png)",
            TextType.TEXT,
        );
        const out = splitNodesImage([node]);
        expect(toTuples(out)).toEqual([
            ["This is text with an ", TextType.TEXT, undefined],
            ["image", TextType.IMAGE, "https://i.imgur.com/zjjcJKZ.png"],
            [" and another ", TextType.TEXT, undefined],
            ["second image", TextType.IMAGE, "https://i.imgur.com/3elNhQu.png"],
        ]);
    });

    test("no images returns original node", () => {
        const node = new TextNode("no images here", TextType.TEXT);
        expect(toTuples(splitNodesImage([node]))).toEqual([
            ["no images here", TextType.TEXT, undefined],
        ]);
    });

    test("supports empty alt text", () => {
        const node = new TextNode(
            "start ![](http://a.com/x.png) end",
            TextType.TEXT,
        );
        const out = splitNodesImage([node]);
        expect(toTuples(out)).toEqual([
            ["start ", TextType.TEXT, undefined],
            ["", TextType.IMAGE, "http://a.com/x.png"],
            [" end", TextType.TEXT, undefined],
        ]);
    });

    test("handles URL with parentheses", () => {
        const node = new TextNode(
            "![pic](https://ex.com/image_(final).png)",
            TextType.TEXT,
        );
        const out = splitNodesImage([node]);
        expect(toTuples(out)).toEqual([
            ["pic", TextType.IMAGE, "https://ex.com/image_(final).png"],
        ]);
    });

    test("non-TEXT node is returned as-is", () => {
        const node = new TextNode("already image", TextType.IMAGE, "http://x");
        expect(toTuples(splitNodesImage([node]))).toEqual([
            ["already image", TextType.IMAGE, "http://x"],
        ]);
    });
});

describe("splitNodesLink", () => {
    test("splits multiple links into TEXT and LINK nodes", () => {
        const node = new TextNode(
            "Click [one](http://a) then [two](http://b) and [three](http://c)",
            TextType.TEXT,
        );
        const out = splitNodesLink([node]);
        expect(toTuples(out)).toEqual([
            ["Click ", TextType.TEXT, undefined],
            ["one", TextType.LINK, "http://a"],
            [" then ", TextType.TEXT, undefined],
            ["two", TextType.LINK, "http://b"],
            [" and ", TextType.TEXT, undefined],
            ["three", TextType.LINK, "http://c"],
        ]);
    });

    test("does not treat images as links", () => {
        const node = new TextNode(
            "![img](http://x/y.png) [ok](http://x)",
            TextType.TEXT,
        );
        const out = splitNodesLink([node]);
        expect(toTuples(out)).toEqual([
            ["![img](http://x/y.png) ", TextType.TEXT, undefined],
            ["ok", TextType.LINK, "http://x"],
        ]);
    });

    test("URL with parentheses in link", () => {
        const node = new TextNode(
            "Go [file](https://ex.com/file_(1).zip)",
            TextType.TEXT,
        );
        const out = splitNodesLink([node]);
        expect(toTuples(out)).toEqual([
            ["Go ", TextType.TEXT, undefined],
            ["file", TextType.LINK, "https://ex.com/file_(1).zip"],
        ]);
    });

    test("no links returns original node", () => {
        const node = new TextNode("no links here", TextType.TEXT);
        expect(toTuples(splitNodesLink([node]))).toEqual([
            ["no links here", TextType.TEXT, undefined],
        ]);
    });

    test("non-TEXT node is returned as-is", () => {
        const node = new TextNode("already link", TextType.LINK, "http://x");
        expect(toTuples(splitNodesLink([node]))).toEqual([
            ["already link", TextType.LINK, "http://x"],
        ]);
    });
});
