module.exports = {
  env: {
    es6: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  extends: [
    "eslint:recommended",
  ],
  rules: {
    "indent": "off",
    "quotes": "off",
    "max-len": "off",
    "no-trailing-spaces": "off",
    "require-jsdoc": "off",
    "comma-dangle": "off",
    "object-curly-spacing": "off",
    "linebreak-style": "off",
  },
  overrides: [
    {
      files: ["**/*.spec.*"],
      env: {
        mocha: true,
      },
      rules: {},
    },
  ],
  globals: {},
};
