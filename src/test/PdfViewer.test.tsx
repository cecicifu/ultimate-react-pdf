import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Document } from "@/Document"
import { Page } from "@/Page"

import { examplePdf } from "../example"
import importedPdf from "../example.pdf"

describe("PdfViewer", () => {
	it("should render with a URL", async () => {
		const EXAMPLE_PDF = "https://pdfobject.com/pdf/sample.pdf"

		const { findByTestId } = render(
			<Document src={EXAMPLE_PDF}>
				<Page controls />
			</Document>
		)

		expect(await findByTestId("page-canvas-1")).toBeInTheDocument()
	})

	it("should render with a base64 string", async () => {
		const { findByTestId } = render(
			<Document src={examplePdf}>
				<Page controls />
			</Document>
		)

		expect(await findByTestId("page-canvas-1")).toBeInTheDocument()
	})

	it("should render with an imported file", async () => {
		const { findByTestId } = render(
			<Document src={importedPdf}>
				<Page controls />
			</Document>
		)

		expect(await findByTestId("page-canvas-1")).toBeInTheDocument()
	})
})
