import {
	getDocument,
	GlobalWorkerOptions,
	type PDFDocumentProxy,
} from "pdfjs-dist"
import { createContext, useEffect, useState } from "react"

import UltimateReactPdfError from "@/components/UltimateReactPdfError"
import { STATUS } from "@/constants"
import type { Status, ViewerContextProps, ViewerProviderProps } from "@/types"

import workerContent from "./build/pdf.worker.min.mjs.json"

const workerBlob = new Blob([workerContent as BlobPart], {
	type: "text/javascript",
})
const workerBlobURL = URL.createObjectURL(workerBlob)
GlobalWorkerOptions.workerSrc = workerBlobURL

export const ViewerContext = createContext<ViewerContextProps | null>(null)

export const PdfViewerProvider = ({
	src,
	children,
	externalLinkTarget,
	externalLinkRel,
	onDocumentError,
	onDocumentLoad,
	messages,
}: ViewerProviderProps) => {
	const [status, setStatus] = useState<Status>(STATUS.LOADING)
	const [pdf, setPdf] = useState<PDFDocumentProxy>()

	useEffect(() => {
		if (pdf) return

		const loadDocument = async () => {
			try {
				const pdfLoaded = await getDocument(src).promise

				onDocumentLoad && onDocumentLoad(pdfLoaded)

				setPdf(pdfLoaded)
			} catch (error) {
				if (error instanceof UltimateReactPdfError) console.error(error.message)

				onDocumentError && onDocumentError(error)
				setStatus(STATUS.ERROR)

				throw error
			}
		}

		loadDocument()
	}, [src, pdf, onDocumentError, onDocumentLoad])

	return (
		<ViewerContext.Provider
			value={{
				pdf,
				status,
				setStatus,
				externalLinkTarget,
				externalLinkRel,
				messages,
			}}
		>
			{children}
		</ViewerContext.Provider>
	)
}
