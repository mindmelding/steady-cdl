const expoConfig = require('eslint-config-expo/flat');
const prettier = require('eslint-config-prettier');

module.exports = [
  ...expoConfig,
  prettier,
  { ignores: ['dist/*', 'web-build/*', 'node_modules/*', 'assets/content.db', '.expo/*'] },
  {
    // Reading text must never be truncated (CLAUDE.md design principle 4).
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: "JSXAttribute[name.name='numberOfLines']",
          message: 'numberOfLines truncates reading text; do not use it (CLAUDE.md principle 4).',
        },
        {
          selector: "JSXAttribute[name.name='maxFontSizeMultiplier']",
          message: 'Do not cap font scaling on reading text (CLAUDE.md principle 4).',
        },
      ],
    },
  },
];
