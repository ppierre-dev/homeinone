import nextConfig from 'eslint-config-next'
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import prettierConfig from 'eslint-config-prettier'

const eslintConfig = [
  // Ignore generated and build directories
  {
    ignores: ['.next/**', 'node_modules/**', 'src/generated/**'],
  },

  // Base: Next.js (TypeScript + React + accessibility rules)
  ...nextConfig,

  // Core web vitals strictness on top
  ...nextCoreWebVitals,

  // TypeScript strict rules + Prettier
  {
    rules: {
      // No explicit any
      '@typescript-eslint/no-explicit-any': 'error',

      // No unused vars — allow vars/args prefixed with _
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],

      // Enforce type imports
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],

      // React: allow unescaped entities (Next.js handles this)
      'react/no-unescaped-entities': 'off',
    },
  },

  // Prettier: disable formatting rules that conflict with Prettier
  prettierConfig,
]

export default eslintConfig
