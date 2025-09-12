import { expect, test, describe } from "bun:test";
import { extractMarkdownImages, extractMarkdownLinks } from "./helpers";

describe("helpers: extractMarkdownImages", () => {
    test("finds a single markdown image with alt text", () => {
        const matches = extractMarkdownImages(
            "This is text with an ![image](https://i.imgur.com/zjjcJKZ.png)",
        );
        expect(matches).toEqual([["image", "https://i.imgur.com/zjjcJKZ.png"]]);
    });

    test("finds multiple images in a string", () => {
        const input =
            "Start ![one](http://a.com/1.png) middle ![two](http://b.com/2.jpg) end";
        expect(extractMarkdownImages(input)).toEqual([
            ["one", "http://a.com/1.png"],
            ["two", "http://b.com/2.jpg"],
        ]);
    });

    test("supports empty alt text", () => {
        const input = "Here ![](http://a.com/x.png) there";
        expect(extractMarkdownImages(input)).toEqual([
            ["", "http://a.com/x.png"],
        ]);
    });

    test("alt text with spaces and punctuation", () => {
        const input =
            "Look ![an example image! v2](https://cdn.ex/x-y_z.png) now";
        expect(extractMarkdownImages(input)).toEqual([
            ["an example image! v2", "https://cdn.ex/x-y_z.png"],
        ]);
    });

    test("URL containing parentheses is captured entirely", () => {
        const input = "![pic](https://ex.com/image_(final).png)";
        expect(extractMarkdownImages(input)).toEqual([
            ["pic", "https://ex.com/image_(final).png"],
        ]);
    });

    test("does not match non-image markdown links", () => {
        const input =
            "a [link](https://ex.com) and ![img](https://ex.com/i.png)";
        expect(extractMarkdownImages(input)).toEqual([
            ["img", "https://ex.com/i.png"],
        ]);
    });

    test("no matches returns empty list", () => {
        expect(extractMarkdownImages("nothing here")).toEqual([]);
    });
});

describe("helpers: extractMarkdownLinks", () => {
    test("finds a single markdown link", () => {
        const matches = extractMarkdownLinks(
            "Check [site](https://example.com) for more",
        );
        expect(matches).toEqual([["site", "https://example.com"]]);
    });

    test("finds multiple links in order", () => {
        const input =
            "[one](http://a) and [two](http://b) and [three](http://c)";
        expect(extractMarkdownLinks(input)).toEqual([
            ["one", "http://a"],
            ["two", "http://b"],
            ["three", "http://c"],
        ]);
    });

    test("link text can include spaces and punctuation", () => {
        const input = "Go to [My Site, Inc.](https://ex.com/home) now";
        expect(extractMarkdownLinks(input)).toEqual([
            ["My Site, Inc.", "https://ex.com/home"],
        ]);
    });

    test("does not match images (with leading '!') as links", () => {
        const input = "![img](http://x/y.png) [ok](http://x)";
        expect(extractMarkdownLinks(input)).toEqual([["ok", "http://x"]]);
    });

    test("URL containing parentheses is captured entirely", () => {
        const input = "([wrapped] text) [k](https://ex.com/file_(1).zip)";
        expect(extractMarkdownLinks(input)).toEqual([
            ["k", "https://ex.com/file_(1).zip"],
        ]);
    });

    test("no matches returns empty list", () => {
        expect(extractMarkdownLinks("nothing here")).toEqual([]);
    });
});
