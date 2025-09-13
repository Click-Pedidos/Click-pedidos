import html from "@html-eslint/eslint-plugin";
import htmlParser from "@html-eslint/parser";
import js from "@eslint/js";
import globals from "globals";

export default [
  // Configuração para arquivos JavaScript (já estava correta)
  {
    files: ["**/*.js"],
    ...js.configs.recommended,
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
      },
    },
  },

  // Configuração para arquivos HTML
  {
    files: ["**/*.html"],
    ...html.configs.recommended,

    languageOptions: {
      parser: htmlParser,
    },

    rules: {
      "html/require-img-alt": "error",
      "html/no-trailing-spaces": "warn",
    },
  },
];
