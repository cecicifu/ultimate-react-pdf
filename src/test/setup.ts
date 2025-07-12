import "@testing-library/jest-dom"
import workerContent from "../../lib/contexts/build/pdf.worker.min.mjs.json"
import { GlobalWorkerOptions } from "pdfjs-dist"
import fs from "node:fs"
import path from "node:path"

import { vi } from "vitest"

// Mock GlobalWorkerOptions
vi.mock("pdfjs-dist", async () => {
	const actual = await vi.importActual("pdfjs-dist")
	return {
		...actual,
		GlobalWorkerOptions: {
			workerSrc: "",
			workerPort: null,
		},
	}
})

// Mock fetch for PDF files
const originalFetch = global.fetch
global.fetch = vi.fn((url) => {
	if (typeof url === "string" && url.includes("example.pdf")) {
		// Read the actual PDF file and return it as a Response
		const pdfPath = path.resolve(__dirname, "../example.pdf")
		const pdfBuffer = fs.readFileSync(pdfPath)

		return Promise.resolve(
			new Response(pdfBuffer, {
				status: 200,
				headers: {
					"Content-Type": "application/pdf",
				},
			})
		)
	}
	// For other URLs, use the original fetch if it exists
	return originalFetch
		? originalFetch(url)
		: Promise.reject(new Error("Not mocked"))
})

window.URL.createObjectURL = vi.fn()

GlobalWorkerOptions.workerSrc = window.URL.createObjectURL(
	new Blob([workerContent], { type: "text/javascript" })
)

global.ResizeObserver = class ResizeObserver {
	observe() {}
	unobserve() {}
	disconnect() {}
}

Element.prototype.scrollIntoView = vi.fn()
