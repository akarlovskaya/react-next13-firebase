module.exports = {
  env: {
    es6: true,
    node: true
  },
  parserOptions: {
    ecmaVersion: 2018
  },
  extends: ["eslint:recommended", "google"],
  rules: {
    "no-restricted-globals": ["error", "name", "length"],
    "prefer-arrow-callback": "error",
    "quotes": ["error", "double", {allowTemplateLiterals: true}],
    "indent": ["error", 2], // Use 2-space indentation
    "object-curly-spacing": ["error", "never"], // No spaces in curly braces
    "comma-dangle": ["error", "never"], // No trailing commas
    "max-len": ["error", {code: 120}] // Increase line length limit
  },
  overrides: [
    {
      files: ["**/*.spec.*"],
      env: {
        mocha: true
      },
      rules: {}
    }
  ],
  globals: {}
};
