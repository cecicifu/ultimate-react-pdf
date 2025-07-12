import { createRequire } from "node:module"
import path, { extname, relative, resolve } from "node:path"
import { fileURLToPath } from "node:url"

import react from "@vitejs/plugin-react-swc"
import { glob } from "glob"
import { defineConfig, normalizePath } from "vite"
import dts from "vite-plugin-dts"
import { libInjectCss } from "vite-plugin-lib-inject-css"
import { viteStaticCopy } from "vite-plugin-static-copy"

const require = createRequire(import.meta.url)

const cMapsDir = normalizePath(
	path.join(path.dirname(require.resolve("pdfjs-dist/package.json")), "cmaps")
)

const workerDir = normalizePath(
	path.join(
		path.dirname(require.resolve("pdfjs-dist/package.json")),
		"build/pdf.worker.min.mjs"
	)
)
const standardFontsDir = normalizePath(
	path.join(
		path.dirname(require.resolve("pdfjs-dist/package.json")),
		"standard_fonts"
	)
)

// https://vitejs.dev/config/
export default defineConfig({
	assetsInclude: ["**/*.pdf"],
	plugins: [
		react(),
		libInjectCss(),
		dts({
			include: ["lib"],
		}),
		viteStaticCopy({
			targets: [
				{
					src: cMapsDir,
					dest: "",
				},
				{
					src: workerDir,
					dest: "./build",
					rename: "pdf.worker.min.mjs.json",
					transform: (contents) => JSON.stringify(contents),
				},
				{
					src: standardFontsDir,
					dest: "",
				},
			],
		}),
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./lib"),
		},
	},
	build: {
		copyPublicDir: false,
		lib: {
			entry: resolve(__dirname, "lib/index.ts"),
			formats: ["es"],
		},
		rollupOptions: {
			external: ["react", "react/jsx-runtime"],
			input: Object.fromEntries(
				// https://rollupjs.org/configuration-options/#input
				glob
					.sync("lib/**/*.{ts,tsx}", {
						ignore: ["lib/**/*.d.ts"],
					})
					.map((file) => [
						// 1. The name of the entry point
						// lib/nested/foo.js becomes nested/foo
						relative("lib", file.slice(0, file.length - extname(file).length)),
						// 2. The absolute path to the entry file
						// lib/nested/foo.ts becomes /project/lib/nested/foo.ts
						fileURLToPath(new URL(file, import.meta.url)),
					])
			),
			output: {
				assetFileNames: "assets/[name][extname]",
				entryFileNames: "[name].js",
			},
		},
	},
})
