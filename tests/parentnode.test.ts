import { expect, test, describe } from "bun:test";
import { ParentNode } from "../parentnode";
import { LeafNode } from "../leafnode";

describe("ParentNode", () => {
    test("toHTML with single child", () => {
        const childNode = new LeafNode("span", "child", {});
        const parentNode = new ParentNode("div", [childNode], {});
        expect(parentNode.toHTML()).toBe("<div ><span >child</span></div>");
    });

    test("toHTML with grandchildren (nested ParentNode)", () => {
        const grandchildNode = new LeafNode("b", "grandchild", {});
        const childNode = new ParentNode("span", [grandchildNode], {});
        const parentNode = new ParentNode("div", [childNode], {});
        expect(parentNode.toHTML()).toBe(
            "<div ><span ><b >grandchild</b></span></div>",
        );
    });

    test("toHTML with multiple children", () => {
        const child1 = new LeafNode("span", "one", {});
        const child2 = new LeafNode("span", "two", {});
        const parentNode = new ParentNode("div", [child1, child2], {});
        expect(parentNode.toHTML()).toBe(
            "<div ><span >one</span><span >two</span></div>",
        );
    });

    test("toHTML with no children (empty array)", () => {
        const parentNode = new ParentNode("div", [], {});
        expect(parentNode.toHTML()).toBe("<div ></div>");
    });

    test("throws when tag is missing", () => {
        // @ts-expect-error forcing missing tag
        const parentNode = new ParentNode(undefined, [], undefined);
        expect(() => parentNode.toHTML()).toThrow("The tag must be present");
    });

    test("throws when children is undefined", () => {
        // @ts-expect-error forcing missing children
        const parentNode = new ParentNode("div", undefined, {});
        expect(() => parentNode.toHTML()).toThrow(
            "Children must be present for a Parent",
        );
    });

    test("renders attributes when props provided", () => {
        const childNode = new LeafNode("span", "child", {});
        const parentNode = new ParentNode("div", [childNode], {
            class: "container",
            id: "root",
        });
        expect(parentNode.toHTML()).toBe(
            "<div class=container id=root ><span >child</span></div>",
        );
    });
});
