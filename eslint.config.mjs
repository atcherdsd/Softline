import eslintImport from 'eslint-plugin-import';
import eslintPrettier from 'eslint-plugin-prettier';
import { defineConfig } from "eslint/config";

export default defineConfig(
	{
		ignores: ['dist'],
	},
	{
		files: ['**/*.js'],
		plugins: {
			import: eslintImport,
      		prettier: eslintPrettier
		},
		rules: {
			"no-debugger": "off",
			"no-console": 0,
			"class-methods-use-this": "off"
		}
	}
);
