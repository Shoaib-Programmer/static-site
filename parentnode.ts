import { HTMLNode } from "./htmlnode";

export class ParentNode extends HTMLNode {
  constructor(
    public tag: string,
    public children: HTMLNode[],
    public props: Record<string, string> | undefined = undefined,
  ) {
    super(tag, undefined, children, props);
  }

  public toHTML() {
    if (!this.tag) {
      throw new Error("The tag must be present");
    }

    if (!this.children) {
      throw new Error("Children must be present for a Parent");
    }

    const childrenHTML = this.children.map((child) => child.toHTML()).join("");
    return `<${this.tag} ${super.propsToHTML()}>${childrenHTML}</${this.tag}>`;
  }
}
