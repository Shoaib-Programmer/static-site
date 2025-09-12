import { TextType, TextNode } from "./textnode";

function main(): void {
  const node = new TextNode(
    "Personal website",
    TextType.LINK,
    "https://portfolio-seven-gamma-97.vercel.app",
  );

  console.log(node.toString());
}

if (import.meta.main) {
  main();
}
