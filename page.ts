import fs from "fs";
import type { PathLike } from "fs";
import path from "path";
import { markdownToHTMLNode } from "./html";

export const generatePage = (
    fromPath: PathLike,
    templatePath: PathLike,
    dstPath: PathLike,
) => {
    console.log(
        `Generating page from ${fromPath} to ${dstPath} using ${templatePath}...`,
    );

    // Load data
    const src = fs.readFileSync(fromPath, "utf8");
    const template = fs.readFileSync(templatePath, "utf8");

    // Deduce the content
    const content = markdownToHTMLNode(src).toHTML();
    const title = extractTitle(src);

    // Inject the content
    let html = template.replace(/{{ Title }}/g, title);
    html = html.replace(/{{ Content }}/g, content);

    // Ensure directory exists before writing to it
    const dir = path.dirname(dstPath.toString());
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(dstPath, html);

    console.log("Done.");
};

// TODO: Watchout for errors from this function
const extractTitle = (text: string) => {
    const firstLine = text
        .split("\n")
        .map((raw) => raw.trim())
        .filter((trimmed) => trimmed.length > 0)[0];

    if (!firstLine?.startsWith("# ")) {
        throw new Error("No heading found");
    }

    return firstLine.slice(2);
};
