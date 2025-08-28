import { LeafNode } from "./leafnode";
import { TextType, TextNode } from "./textnode";

function main(): void {
  const node = new TextNode(
    "Personal website",
    TextType.LINK,
    "https://portfolio-seven-gamma-97.vercel.app"
  );

  console.log(node.toString());
}

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

if (import.meta.main) {
  main();
}
