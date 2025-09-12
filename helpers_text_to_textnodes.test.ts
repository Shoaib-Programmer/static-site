import { expect, test, describe } from "bun:test";
import { TextNode, TextType } from "./textnode";
import { textToTextNodes } from "./helpers";

const toTuples = (nodes: TextNode[]) =>
  nodes.map((n) => [n.text, n.textType, n.url]);

describe("textToTextNodes", () => {
  test("returns single TEXT node for plain text", () => {
    const out = textToTextNodes("hello world");
    expect(toTuples(out)).toEqual([["hello world", TextType.TEXT, undefined]]);
  });

  test("parses bold using **", () => {
    const out = textToTextNodes("Say **bold** now");
    expect(toTuples(out)).toEqual([
      ["Say ", TextType.TEXT, undefined],
      ["bold", TextType.BOLD, undefined],
      [" now", TextType.TEXT, undefined],
    ]);
  });

  test("parses italic using _", () => {
    const out = textToTextNodes("this is _fine_");
    expect(toTuples(out)).toEqual([
      ["this is ", TextType.TEXT, undefined],
      ["fine", TextType.ITALIC, undefined],
    ]);
  });

  test("parses code using backticks", () => {
    const out = textToTextNodes("run `echo hi`");
    expect(toTuples(out)).toEqual([
      ["run ", TextType.TEXT, undefined],
      ["echo hi", TextType.CODE, undefined],
    ]);
  });

  test("parses markdown link and image", () => {
    const out = textToTextNodes(
      "See [site](https://ex.com) and ![img](https://ex.com/a.png)",
    );
    expect(toTuples(out)).toEqual([
      ["See ", TextType.TEXT, undefined],
      ["site", TextType.LINK, "https://ex.com"],
      [" and ", TextType.TEXT, undefined],
      ["img", TextType.IMAGE, "https://ex.com/a.png"],
    ]);
  });

  test("mixed formatting in order: bold, italic, code, link, image", () => {
    const input = "x **b** y _i_ z `c` [l](u) ![a](v)";
    const out = textToTextNodes(input);
    expect(toTuples(out)).toEqual([
      ["x ", TextType.TEXT, undefined],
      ["b", TextType.BOLD, undefined],
      [" y ", TextType.TEXT, undefined],
      ["i", TextType.ITALIC, undefined],
      [" z ", TextType.TEXT, undefined],
      ["c", TextType.CODE, undefined],
      [" ", TextType.TEXT, undefined],
      ["l", TextType.LINK, "u"],
      [" ", TextType.TEXT, undefined],
      ["a", TextType.IMAGE, "v"],
    ]);
  });

  test("unmatched delimiters are left as plain text", () => {
    const out = textToTextNodes("broken **bold and _italic");
    expect(toTuples(out)).toEqual([
      ["broken **bold and _italic", TextType.TEXT, undefined],
    ]);
  });
});
