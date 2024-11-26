import { fixupConfigRules, fixupPluginRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import { default as eslint, default as js } from '@eslint/js';
import tanstackQuery from '@tanstack/eslint-plugin-query';
import cssModules from 'eslint-plugin-css-modules';
import importPlugin from 'eslint-plugin-import';
import react from 'eslint-plugin-react';
import requireExplicitGenerics from 'eslint-plugin-require-explicit-generics';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import tseslint from 'typescript-eslint';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
});

export default [
    {
        ignores: [
            'src/xpanse-api/**/*',
            'public/OidcServiceWorker.js',
            'public/inject.js',
            '**/dist',
            '**/node_modules',
            'public/OidcTrustedDomains.js',
            'eslint.config.mjs',
        ],
    },
    {
        files: ['**/*.js', '**/*.jsx', '**/*.tsx', '**/*.ts'],
    },
    {
        languageOptions: {
            parserOptions: {
                sourceType: 'module',
                projectService: {
                    defaultProject: './tsconfig.json',
                },
            },
        },
    },
    eslint.configs.recommended,
    ...tseslint.configs.strictTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
    ...tseslint.configs.recommendedTypeChecked,
    importPlugin.flatConfigs.recommended,
    ...fixupConfigRules(
        compat.extends(
            'eslint:recommended',
            'plugin:prettier/recommended',
            'plugin:react/recommended',
            'plugin:react-hooks/recommended',
            'plugin:import/typescript'
        )
    ),
    {
        plugins: {
            react: fixupPluginRules(react),
            '@tanstack/query': tanstackQuery,
            'require-explicit-generics': requireExplicitGenerics,
            'css-modules': fixupPluginRules(cssModules),
        },
        rules: {
            'react/jsx-uses-react': 'error',
            'react/jsx-uses-vars': 'error',
            'no-undef': 'off',
            '@typescript-eslint/no-inferrable-types': 'off',
            '@tanstack/query/exhaustive-deps': 'error',
            'no-console': 'error',
            '@typescript-eslint/no-dynamic-delete': 'off',
            'react/react-in-jsx-scope': 'off',
            '@typescript-eslint/no-deprecated': 'error',
            'no-unused-vars': 'off',
            '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
        },
        settings: {
            'import/parsers': {
                '@typescript-eslint/parser': ['.ts', '.tsx'],
            },
            'import/resolver': {
                typescript: true,
                node: false,
            },
            react: {
                version: 'detect',
                defaultVersion: '',
            },
        },
    },
];
