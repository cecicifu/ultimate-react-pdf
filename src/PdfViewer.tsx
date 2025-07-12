import { Document } from "@/Document"
import { Page } from "@/Page"

import importedPdf from "./example.pdf"

export const PdfViewer = () => {
	return (
		<Document src={importedPdf}>
			<Page controls />
		</Document>
	)
}
