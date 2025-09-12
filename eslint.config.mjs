import js from "@eslint/js";
import globals from "globals";
import pluginHtml from "eslint-plugin-html";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser,
    },
    rules: {
      ...js.configs.recommended.rules,
    },
  },
  {
    files: ["**/*.html"],
    plugins: {
      html: pluginHtml,
    },
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    processor: "html/html",
  },
]);
