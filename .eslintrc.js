module.exports = {
    env: {
        commonjs: true,
        es2021: true,
        node: true,
        jest: true,
        es6: true,
    },
    extends: ['airbnb-base', 'plugin:prettier/recommended'],
    parserOptions: {
        ecmaVersion: 12,
    },
    plugins: ['prettier'],
    rules: {
        'no-unused-vars': 0,
        'no-console': 'off',
        'max-classes-per-file': 0,
    },
}
