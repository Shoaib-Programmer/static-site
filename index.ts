import {
    copyFileSync,
    rmSync,
    existsSync,
    mkdirSync,
    readdirSync,
    statSync,
} from "fs";
import { generatePage } from "./page";
import { join } from "path";

function main(): void {
    loadStatic();
    generatePage("content/index.md", "template.html", "public/index.html");
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

function copyDir(src: string, dest: string) {
    mkdirSync(dest, { recursive: true });
    for (const entry of readdirSync(src)) {
        const srcPath = join(src, entry);
        const destPath = join(dest, entry);
        const stat = statSync(srcPath);

        if (stat.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            copyFileSync(srcPath, destPath);
        }
    }
}

if (import.meta.main) {
    main();
}
