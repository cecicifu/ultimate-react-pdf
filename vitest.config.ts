import { defineConfig } from "vitest/config"
import path from "node:path"

export default defineConfig({
	assetsInclude: ["**/*.pdf"],
	test: {
		globals: true,
		environment: "jsdom",
		setupFiles: ["./src/test/setup.ts"],
		watch: false,
		css: true,
		alias: {
			"@": path.resolve(__dirname, "./lib"),
		},
	},
})
