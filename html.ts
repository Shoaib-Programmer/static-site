import { blockToBlockType, BlockType, markdownToBlocks } from "./block";
import { HTMLNode } from "./htmlnode";
import { ParentNode } from "./parentnode";
import { textNodeToHTMLNode, textToTextNodes } from "./helpers";
import { TextNode, TextType } from "./textnode";

export const markdownToHTMLNode = (text: string) => {
    const blocks = markdownToBlocks(text);
    const children: HTMLNode[] = [];

    const textToChildren = (t: string): HTMLNode[] => {
        return textToTextNodes(t).map((n) => textNodeToHTMLNode(n));
    };

    for (const block of blocks) {
        const type = blockToBlockType(block);

        switch (type) {
            case BlockType.HEADING: {
                const match = block.match(/^(#{1,6})\s+(.+)$/);
                const level = match ? match[1]!.length : 1;
                const content = match
                    ? (match[2] as string)
                    : block.replace(/^#+\s*/, "");
                children.push(
                    new ParentNode(`h${level}`, textToChildren(content), {}),
                );
                break;
            }
            case BlockType.CODE: {
                const codeMatch = block.match(
                    /^```(?:\w+)?\n?([\s\S]*?)\n?```$/,
                );
                const codeContent = codeMatch
                    ? (codeMatch[1] as string)
                    : block;
                const codeLeaf = textNodeToHTMLNode(
                    new TextNode(codeContent, TextType.CODE),
                );
                children.push(new ParentNode("pre", [codeLeaf], {}));
                break;
            }
            case BlockType.QUOTE: {
                const quoteText = block
                    .split("\n")
                    .map((line) => line.replace(/^>\s?/, ""))
                    .join("\n");
                children.push(
                    new ParentNode("blockquote", textToChildren(quoteText), {}),
                );
                break;
            }
            case BlockType.UNORDERED_LIST: {
                const items = block
                    .split("\n")
                    .map((line) => line.replace(/^\-\s+/, ""));
                const liNodes = items.map(
                    (item) => new ParentNode("li", textToChildren(item), {}),
                );
                children.push(new ParentNode("ul", liNodes, {}));
                break;
            }
            case BlockType.ORDERED_LIST: {
                const items = block
                    .split("\n")
                    .map((line) => line.replace(/^\d+\.\s+/, ""));
                const liNodes = items.map(
                    (item) => new ParentNode("li", textToChildren(item), {}),
                );
                children.push(new ParentNode("ol", liNodes, {}));
                break;
            }
            case BlockType.PARAGRAPH:
            default: {
                children.push(new ParentNode("p", textToChildren(block), {}));
                break;
            }
        }
    }

    return new ParentNode("div", children, {});
};
