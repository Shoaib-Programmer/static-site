import {
    copyFileSync,
    rmSync,
    existsSync,
    mkdirSync,
    readdirSync,
    statSync,
} from "fs";
import { generatePagesRecursive } from "./page";
import { join } from "path";

function main(): void {
    loadStatic();
    generatePagesRecursive("content", "template.html", "public");
}

const loadStatic = (): void => {
    // Ensure there exists a ./static/ directory
    if (!existsSync("./static/")) {
        throw new Error("No static directory found");
    }

    // Remove previous contents
    rmSync("./public/", { recursive: true, force: true });
    mkdirSync("./public/", { recursive: false });
    // Copy files into the new directory
    copyDir("./static/", "./public/");
};

const copyDir = (src: string, dst: string) => {
    mkdirSync(dst, { recursive: true });
    for (const entry of readdirSync(src)) {
        const srcPath = join(src, entry);
        const dstPath = join(dst, entry);
        const stat = statSync(srcPath);

        if (stat.isDirectory()) {
            copyDir(srcPath, dstPath);
        } else {
            copyFileSync(srcPath, dstPath);
        }
    }
}

if (import.meta.main) {
    main();
}
