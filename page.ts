import fs from "fs";
import type { PathLike } from "fs";
import path from "path";
import { markdownToHTMLNode } from "./html";

export const generatePagesRecursive = (
    contentDirPath: PathLike,
    templatePath: PathLike,
    dstDirPath: PathLike,
) => {
    const entries = getEntries(contentDirPath);
    for (const entry of entries) {
        let destination =
            dstDirPath + entry.replace(contentDirPath as string, "");
        destination = destination.replace(".md", ".html");
        generatePage(entry, templatePath, destination);
    }
};

const generatePage = (
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

const getEntries = (dir: PathLike, entries: string[] = []): string[] => {
    if (!isDir(dir)) {
        return entries;
    }

    const items = listDir(dir);

    for (const item of items) {
        if (isFile(item)) {
            entries.push(item);
        } else if (isDir(item)) {
            getEntries(item, entries);
        }
    }

    return entries;
};

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

const isFile = (filePath: PathLike) => {
    try {
        return fs.statSync(filePath).isFile();
    } catch {
        return false;
    }
};

const isDir = (dirPath: PathLike) => {
    try {
        return fs.statSync(dirPath).isDirectory();
    } catch {
        return false;
    }
};

const listDir = (dirPath: PathLike) => {
    try {
        return fs
            .readdirSync(dirPath)
            .map((name) => path.join(dirPath as string, name));
    } catch {
        return [];
    }
};
