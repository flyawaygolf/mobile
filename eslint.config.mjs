import { FlatCompat } from "@eslint/eslintrc";
import path from "path";
import { fileURLToPath } from "url";
import babelParser from "@babel/eslint-parser";
import importPlugin from 'eslint-plugin-import';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname
});

export default {
  ...compat.extends["@react-native"],
  files: ["**/*.{js,jsx,ts,tsx}"],
  languageOptions: {
    parser: babelParser,
    parserOptions: {
      ecmaFeatures: {
        jsx: true, // Permet le JSX dans les fichiers JS
      },
    }
  },
  plugins: {
    import: importPlugin, // Ajoute cette ligne
  },
  rules: {
    quotes: 'off',
    curly: 'off',
    semi: 'off',
    'no-bitwise': 'off',
    'react-hooks/exhaustive-deps': 'off',
    'react-native/no-inline-styles': 'off',
    '@typescript-eslint/no-shadow': 'off',
    'import/order': [
      'warn',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          ['parent', 'sibling', 'index'],
        ],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
    // 'comma-dangle': 'off',
    // 'eol-last': 'off',
    // 'no-trailing-spaces': 'off'
  },
};
