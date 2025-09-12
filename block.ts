export const markdownToBlocks = (markdown: string): string[] => {
    const rawBlocks = markdown.split("\n\n");
    const blocks: string[] = rawBlocks
        .map((raw) => raw.trim())
        .filter((trimmed) => trimmed.length > 0);
    return blocks;
};

// Backward-compatible export (original misspelling)
export const markdowntoBlocks = markdownToBlocks;
