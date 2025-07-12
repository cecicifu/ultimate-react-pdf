// @ts-check

import globals from "globals"
import eslint from "@eslint/js"
import tseslint from "typescript-eslint"
import reactHookseslint from "eslint-plugin-react-hooks"
import eslintParser from "@typescript-eslint/parser"
import reactRefresh from "eslint-plugin-react-refresh"
import simpleImportSort from "eslint-plugin-simple-import-sort"

export default tseslint.config(
	eslint.configs.recommended,
	tseslint.configs.recommended,
	reactHookseslint.configs["recommended-latest"],
	{
		ignores: ["dist", "eslint.config.js", "vitest.config.ts"],
	},
	{
		languageOptions: {
			ecmaVersion: 2022,
			sourceType: "module",
			globals: {
				...globals.browser,
				...globals.node,
			},
			parser: eslintParser,
		},
		plugins: {
			"react-refresh": reactRefresh,
			"simple-import-sort": simpleImportSort,
		},
		rules: {
			"simple-import-sort/imports": "warn",
			"no-unused-vars": "off",
			"@typescript-eslint/no-unused-vars": "error",
			"react-hooks/exhaustive-deps": "off",
			"react-refresh/only-export-components": [
				"warn",
				{ allowConstantExport: true },
			],
		},
	}
)
