import globals from "globals";
import js from "@eslint/js";
import html from "@html-eslint/eslint-plugin";

export default [
  // Lints your JavaScript files
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser,
    },
    ...js.configs.recommennded,
  },

  // Lints your HTML markup
  {
    files: ["**/*.html"],
    plugins: {
      "@html-eslint": html,
    },
    languageOptions: {
      parser: html.parsers.html,
    },
    rules: {
      ...html.configs.recommended.rules,
    },
  },

  // Lints the JavaScript inside <script> tags
  {
    files: ["**/*.html"],
    processor: "@html-eslint/recommended",
    ...js.configs.recommended,
  },
];
