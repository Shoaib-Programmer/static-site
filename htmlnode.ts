export class HTMLNode {
  constructor(
    public tag: string | undefined,
    public value: string | undefined,
    public children: HTMLNode[] | undefined,
    public props: Record<string, string> | undefined
  ) {
    if (!!this.tag !== (!!this.props)) {
      throw new Error("tag and props must be used together");
    }
  }

  public toHTML() {
    throw new Error("This method is not implemented");
  }

  public propsToHTML() {
    let ret = "";
    if (this.props) {
      Object.entries(this.props).forEach(([key, value]) => {
        ret += `${key}=${value}` + " ";
      });
    }
    return ret;
  }
  public toString(): string {
    return `HTMLNode(${this?.tag}, ${this?.value}, ${this?.children}, ${this?.props})`;
  }
}
