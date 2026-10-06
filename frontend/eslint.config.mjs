import { defineConfig, globalIgnores } from 'eslint/config';
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';
import eslintConfigPrettier from 'eslint-config-prettier';
import tseslint from 'typescript-eslint';

export default defineConfig(
  globalIgnores(['.next/**', 'out/**', 'jest-coverage/**', '.nyc_output/**', 'next-env.d.ts', 'src/data-contracts/**']),
  ...nextCoreWebVitals,
  ...tseslint.configs.recommended,
  eslintConfigPrettier
);
