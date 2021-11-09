module.exports = {
  // parser: '@typescript-eslint/parser',
  extends: [
    'plugin:react/recommended',
    'plugin:prettier/recommended',
    // 'plugin:@typescript-eslint/recommended',
    // 'prettier/@typescript-eslint'
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  rules: {
    'arrow-spacing' : ['error'],
    'no-class-assign': 0,
    'no-console': 0,
    'no-multiple-empty-lines': ['error'],
    'no-trailing-spaces': ['error'],
    'no-var': ['error'],
    'prefer-const': ['error'],
    'quotes': ['error', 'single'],
    'react/jsx-uses-react': [2],
    'react/jsx-uses-vars': [2],
    'semi': ['error', 'never'],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    'react/prop-types': 'off',
    'space-before-function-paren': 'off',
    'react/display-name': 'off',
  },
  settings: {
    react: {
      version: 'detect'
    }
  }
}