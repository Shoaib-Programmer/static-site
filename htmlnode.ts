export class HTMLNode {
  constructor(
    public tag: string | undefined = undefined,
    public value: string | undefined = undefined,
    public children: HTMLNode[] | undefined = undefined,
    public props: Record<string, string> | undefined = undefined,
  ) {
    if (!!this.tag !== !!this.props) {
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
