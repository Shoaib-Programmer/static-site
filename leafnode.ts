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
        // For self-closing tags like img, empty value is allowed
        const selfClosingTags = ["img", "br", "hr", "input", "meta", "link"];

        if (!this.value && (!this.tag || !selfClosingTags.includes(this.tag))) {
            throw new Error("Value must be present for a LeafNode");
        }

        if (!this.tag) {
            return this.value;
        }

        // Handle self-closing tags
        if (selfClosingTags.includes(this.tag)) {
            return `<${this.tag} ${super.propsToHTML()} />`;
        }

        return `<${this.tag} ${super.propsToHTML()}>${this.value}</${this.tag}>`;
    }
}
