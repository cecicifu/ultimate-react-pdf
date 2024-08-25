import "./index.css"

import { StrictMode } from "react"
import ReactDOM from "react-dom/client"

import { Document } from "@/Document"
import { Page } from "@/Page"

import { examplePdf } from "./example"

ReactDOM.createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<Document src={examplePdf}>
			<Page controls />
		</Document>
	</StrictMode>
)
