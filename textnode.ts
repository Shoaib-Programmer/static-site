export enum TextType {
  TEXT = "text",
  BOLD = "bold",
  ITALIC = "italic",
  CODE = "code",
  LINK = "link",
  IMAGE = "image",
}

export class TextNode {
  constructor(
    public text: string,
    public textType: TextType,
    public url: string | undefined = undefined
  ) {}

  public equals(other: TextNode) {
    return (
      this.text === other.text &&
      this.textType === other.textType &&
      this.url === other.url
    );
  }

  public toString(): string {
    return `TextNode(${this.text}, ${this.textType}, ${this.url})`;
  }
}
