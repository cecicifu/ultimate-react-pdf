import { Page } from "@/Page"
import { render } from "@testing-library/react"
import { Document } from "@/Document"
import { describe, expect, it } from "vitest"
import importedPdf from "../example.pdf"
import { examplePdf } from "../example"

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
