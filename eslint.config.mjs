import globals from "globals";
import pluginJs from "@eslint/js";
import eslintPluginHtml from "eslint-plugin-html";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: globals.browser,
    },
    ...pluginJs.configs.recommended,
  },
  {
    files: ["**/*.html"],
    plugins: {
      html: eslintPluginHtml,
    },
    processor: "html/html",
    ...eslintPluginHtml.configs.recommended,
  },
]);
