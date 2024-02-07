import { Document } from "@/Document"
import { Page } from "@/Page"

import { pdfData } from "./pdfData"

export default function App() {
	return (
		<Document src={{ data: atob(pdfData) }}>
			<Page initialPage={1} controls />
		</Document>
	)
}
