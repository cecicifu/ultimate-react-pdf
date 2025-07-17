import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { Document } from "@/Document"
// import { InfinityPage } from "@/InfinityPage"
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

	it("should render with an annotation layer", async () => {
		const { findByTestId } = render(
			<Document src={importedPdf}>
				<Page controls annotations />
			</Document>
		)

		expect(await findByTestId("annotation-layer-1")).toBeInTheDocument()
	})

	it("should not render with an annotation layer when annotations prop is false", async () => {
		const { queryByTestId } = render(
			<Document src={importedPdf}>
				<Page controls annotations={false} />
			</Document>
		)

		expect(queryByTestId("annotation-layer-1")).not.toBeInTheDocument()
	})

	it("should render with a text layer", async () => {
		const { findByTestId } = render(
			<Document src={importedPdf}>
				<Page controls textSelection />
			</Document>
		)

		expect(await findByTestId("text-layer-1")).toBeInTheDocument()
	})

	it("should not render with a text layer when textSelection prop is false", async () => {
		const { queryByTestId } = render(
			<Document src={importedPdf}>
				<Page controls textSelection={false} />
			</Document>
		)

		expect(queryByTestId("text-layer-1")).not.toBeInTheDocument()
	})

	// it("should render with InfinityPage and annotation layer", async () => {
	// 	const { findByTestId } = render(
	// 		<Document src={importedPdf}>
	// 			<InfinityPage />
	// 		</Document>
	// 	)

	// 	expect(await findByTestId("annotation-layer-1")).toBeInTheDocument()
	// 	expect(await findByTestId("annotation-layer-10")).toBeInTheDocument()
	// })

	// it("should render with InfinityPage and text layer", async () => {
	// 	const { findByTestId } = render(
	// 		<Document src={importedPdf}>
	// 			<InfinityPage />
	// 		</Document>
	// 	)

	// 	expect(await findByTestId("text-layer-1")).toBeInTheDocument()
	// 	expect(await findByTestId("text-layer-10")).toBeInTheDocument()
	// })
})
