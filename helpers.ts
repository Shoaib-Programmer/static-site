import { LeafNode } from "./leafnode";
import { TextType, TextNode } from "./textnode";

export const textNodeToHTMLNode = (textNode: TextNode) => {
  if (!Object.values(TextType).includes(textNode.textType)) {
    throw new Error("textType is not included in the TextType enum");
  }

  switch (textNode.textType) {
    case TextType.TEXT:
      return new LeafNode(undefined, textNode.text, undefined);
    case TextType.BOLD:
      return new LeafNode("b", textNode.text, {});
    case TextType.ITALIC:
      return new LeafNode("i", textNode.text, {});
    case TextType.CODE:
      return new LeafNode("code", textNode.text, {});
    case TextType.LINK:
      return new LeafNode("a", textNode.text, { href: textNode.url as string });
    case TextType.IMAGE:
      return new LeafNode("img", "", {
        src: textNode.url as string,
        alt: textNode.text as string,
      });
  }
};

export const splitNodesDelimiter = (
  oldNodes: TextNode[],
  delimiter: string,
  textType: TextType
): TextNode[] => {
  const nodes: TextNode[] = [];

  for (const node of oldNodes) {
    // Only split nodes of type TEXT; leave others untouched
    if (node.textType !== TextType.TEXT) {
      nodes.push(node);
      continue;
    }

    // Escape delimiter for regex if needed
    const escapedDelimiter = delimiter.replace(
      /[-\/\\^$*+?.()|[\]{}]/g,
      "\\$&"
    );
    // Match: delimiter (not empty) delimiter, non-greedy
    const regex = new RegExp(
      `${escapedDelimiter}([^${escapedDelimiter}]+?)${escapedDelimiter}`,
      "g"
    );

    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(node.text)) !== null) {
      // Add text before the delimiter
      if (match.index > lastIndex) {
        const before = node.text.slice(lastIndex, match.index);
        if (before.length > 0) {
          nodes.push(new TextNode(before, TextType.TEXT));
        }
      }
      // Add the delimited text
      nodes.push(new TextNode(match[1] as string, textType));
      lastIndex = regex.lastIndex;
    }

    // Add any remaining text after the last delimiter
    if (lastIndex < node.text.length) {
      const after = node.text.slice(lastIndex);
      if (after.length > 0) {
        nodes.push(new TextNode(after, TextType.TEXT));
      }
    }
  }

  return nodes;
};

export const extractMarkdownImages = (text: string): [string, string][] => {
  const regex = /!\[([^\]]*)\]\(((?:[^()]+|\([^()]*\))+?)\)/g;
  const results: [string, string][] = [];
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    results.push([match[1] as string, match[2] as string]);
  }
  return results;
};

export const extractMarkdownLinks = (text: string): [string, string][] => {
  const regex = /(?<!!)\[([^\]]+)\]\(((?:[^()]+|\([^()]*\))+?)\)/g;
  const results: [string, string][] = [];
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    results.push([match[1] as string, match[2] as string]);
  }
  return results;
};
