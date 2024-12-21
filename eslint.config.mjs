// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

export default tseslint.config({
    languageOptions: {
        parserOptions: {
            project: true,
            tsconfigRootDir: import.meta.dirname
        }
    },
    files: ["**/*.ts"],
    extends: [eslint.configs.recommended, ...tseslint.configs.recommendedTypeChecked, eslintConfigPrettier],
    rules: {
        quotes: ["error", "double", { allowTemplateLiterals: true }],
        "prefer-const": [
            "off",
            {
                destructuring: "any",
                ignoreReadBeforeAssign: false
            }
        ],
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/no-misused-promises": "off"
    }
});
