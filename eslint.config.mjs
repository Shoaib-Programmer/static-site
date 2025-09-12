import typescriptEslint from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";

export default [
    {
        files: ["**/*.{ts,tsx}"], // Make sure .ts files are included
        languageOptions: {
            parser: typescriptParser, // This is crucial - tells ESLint how to parse TS
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
            },
        },
        plugins: {
            "@typescript-eslint": typescriptEslint,
        },
        rules: {
            "@typescript-eslint/no-unused-vars": "error",
            "no-unused-vars": "off",
            semi: "error",
            "prefer-const": "error",
        },
    },
    {
        files: ["**/*.{js,mjs,cjs}"], // Separate config for JS files
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
        },
        rules: {
            "no-unused-vars": "error",
            semi: "error",
            "prefer-const": "error",
        },
    },
];
