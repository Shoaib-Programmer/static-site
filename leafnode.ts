import { HTMLNode } from "./htmlnode";

export class LeafNode extends HTMLNode {
  constructor(
    public tag: string | undefined,
    public value: string,
    public props: Record<string, string> | undefined,
  ) {
    super(tag, value, undefined, props);
  }

  public toHTML() {
    if (!this.value) {
      throw new Error("Value must be present for a LeafNode");
    }

    if (!this.tag) {
      return this.value;
    }

    return `<${this.tag} ${super.propsToHTML()}>${this.value}</${this.tag}>`;
  }
}
