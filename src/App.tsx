import { Document } from "@/Document"
import { Page } from "@/Page"

import { examplePdf } from "./example"

export default function App() {
	return (
		<Document src={{ data: atob(examplePdf) }}>
			<Page initialPage={1} controls />
		</Document>
	)
}
