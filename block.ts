export enum BlockType {
    PARAGRAPH = "paragraph",
    HEADING = "heading",
    CODE = "code",
    QUOTE = "quote",
    UNORDERED_LIST = "unordered_list",
    ORDERED_LIST = "ordered_list",
}

export const blockToBlockType = (text: string): BlockType => {
    if (/^#{1,6}\s+.+/.test(text)) {
        return BlockType.HEADING;
    }
    if (/^```[\s\S]*```$/.test(text)) {
        return BlockType.CODE;
    }

    const lines = text.split('\n');
    if (lines.every(line => line.startsWith(">"))) {
        return BlockType.QUOTE;
    }
    if (lines.every(line => line.startsWith("- "))) {
        return BlockType.UNORDERED_LIST;
    }
    if (lines.every((line, index) => {
        const match = line.match(/^(\d+)\.\s+/);
        return match && parseInt(match[1]!) === index + 1;
    })) {
        return BlockType.ORDERED_LIST;
    }

    return BlockType.PARAGRAPH;
};

export const markdownToBlocks = (markdown: string): string[] => {
    const rawBlocks = markdown.split("\n\n");
    const blocks: string[] = rawBlocks
        .map((raw) => raw.trim())
        .filter((trimmed) => trimmed.length > 0);
    return blocks;
};
