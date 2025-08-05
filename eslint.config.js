import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'node_modules', 'public']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.node,
        // Analytics and external libraries
        gtag: 'readonly',
        ga: 'readonly', 
        mixpanel: 'readonly',
        // Node.js globals for config files
        process: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        Buffer: 'readonly',
        // Vite globals
        __DEV__: 'readonly',
        // Service Worker globals
        navigator: 'readonly',
        // Module system
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
      },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      // Unused variables - allow uppercase and underscore prefixed
      'no-unused-vars': [
        'error', 
        { 
          varsIgnorePattern: '^[A-Z_]|^motion$|^AnimatePresence$|^set[A-Z]|^handle[A-Z]|^fetch[A-Z]|^show[A-Z]|^is[A-Z]|^has[A-Z]|^user[A-Z]|^analytics$|^loading$|^error$|^data$|^status$|^success$|^token$|^disconnect$|^compact$|^slice$|^query$|^config$|^options$|^key$|^index$|^Icon$',
          argsIgnorePattern: '^_|^e$|^error$|^event$|^index$|^item$|^key$|^value$|^data$|^props$|^ref$|^node$|^element$',
          ignoreRestSiblings: true,
          caughtErrors: 'none'
        }
      ],
      // Allow console in development
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      // React specific rules
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/rules-of-hooks': 'error',
      // Import/export rules
      'no-undef': 'error',
      // Disable problematic rules for this project
      'no-useless-escape': 'warn',
    },
  },
  // Specific rules for config files
  {
    files: ['*.config.js', 'vite.config.js', 'tailwind.config.js', 'postcss.config.js'],
    languageOptions: {
      globals: {
        ...globals.node,
        process: 'readonly',
        __dirname: 'readonly',
        module: 'readonly',
        require: 'readonly',
      },
    },
    rules: {
      'no-undef': 'off',
    },
  },
])
