import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import pluginPrettier from "eslint-plugin-prettier";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser,
    },
    plugins: {
      prettier: pluginPrettier,
    },
    rules: {
      ...js.configs.recommended.rules,
      quotes: ["error", "double"],
    },
  },
]);
