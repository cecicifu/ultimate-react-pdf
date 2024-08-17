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
}: DocumentProps) {
	return (
		<PdfViewerProvider
			src={src}
			externalLinkTarget={externalLinkTarget}
			externalLinkRel={externalLinkRel}
			onDocumentError={onDocumentError}
			onDocumentLoad={onDocumentLoad}
		>
			<div className={className} ref={documentRef}>
				{children}
			</div>
		</PdfViewerProvider>
	)
}
