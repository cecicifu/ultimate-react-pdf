import "./global.css"

import { PdfViewerProvider } from "@/contexts/ViewerContext"
import type { DocumentProps } from "@/types"

export function Document({
	children,
	src,
	documentRef,
	className,
	externalLinkTarget,
	externalLinkRel,
	onDocumentError,
	onDocumentLoad,
	messages = {
		nextButton: "Next",
		previousButton: "Previous",
		numPagesSeparator: "of",
		loading: "Loading...",
		error: "Error loading PDF",
	},
}: DocumentProps) {
	return (
		<PdfViewerProvider
			src={src}
			externalLinkTarget={externalLinkTarget}
			externalLinkRel={externalLinkRel}
			onDocumentError={onDocumentError}
			onDocumentLoad={onDocumentLoad}
			messages={messages}
		>
			<div
				className={className ? `${className} pdf-viewer` : "pdf-viewer"}
				ref={documentRef}
			>
				{children}
			</div>
		</PdfViewerProvider>
	)
}
