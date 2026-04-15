import tseslint from 'typescript-eslint';
import prettier from 'eslint-plugin-prettier/recommended';

export default tseslint.config(
    ...tseslint.configs.recommended,
    prettier,
    {
        rules: {
            'no-console': 'off',
            'prettier/prettier': 'error',
            '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
            '@typescript-eslint/no-explicit-any': 'warn',
        },
    },
    {
        ignores: ['dist/**', 'node_modules/**', 'prisma/**'],
    },
);
