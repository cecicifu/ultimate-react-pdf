import "./index.css"

import { StrictMode } from "react"
import ReactDOM from "react-dom/client"

import { PdfViewer } from "./PdfViewer"

ReactDOM.createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<PdfViewer />
	</StrictMode>
)
