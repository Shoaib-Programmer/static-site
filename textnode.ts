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
  ) {
    if (!!this.url !== (this.textType === TextType.LINK)) {
      throw new Error("URL and LINK textType must be used together");
    }
    if (!Object.values(TextType).includes(this.textType)) {
      throw new Error("textType is not included in the TextType enum");
    }
  }

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
