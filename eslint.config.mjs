import { defineConfig } from "eslint/config";
import html from "@html-eslint/eslint-plugin";
import js from "@eslint/js";

export default defineConfig([
  // ESLint para configurar o JS
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
      },
    },
    ...js.configs.recommended,
  },

  // ESLint para configurar o JS
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
      "@html-eslint/require-img-alt": "error",
    },
  },
]);
