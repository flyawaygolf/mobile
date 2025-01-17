import { FlatCompat } from "@eslint/eslintrc";
import path from "path";
import { fileURLToPath } from "url";
import babelParser from "@babel/eslint-parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname
});

export default {
  ...compat.extends["@react-native"],
  files: ["**/*.ts", "**/*.tsx"],
  languageOptions: {
    parser: babelParser,
  },
  rules: {
    quotes: 'off',
    curly: 'off',
    semi: 'off',
    'no-bitwise': 'off',
    'react-hooks/exhaustive-deps': 'off',
    'react-native/no-inline-styles': 'off',
    '@typescript-eslint/no-shadow': 'off',
    // 'comma-dangle': 'off',
    // 'eol-last': 'off',
    // 'no-trailing-spaces': 'off'
  },
};
