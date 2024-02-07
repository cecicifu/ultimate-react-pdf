import {
	getDocument,
	GlobalWorkerOptions,
	type PDFDocumentProxy,
} from "pdfjs-dist"
import { createContext, useEffect, useState } from "react"

import { STATUS } from "@/constants"
import {
	type Status,
	type ViewerContextProps,
	type ViewerProviderProps,
} from "@/types"

GlobalWorkerOptions.workerSrc = new URL(
	"pdfjs-dist/build/pdf.worker.min.mjs",
	import.meta.url
).toString()

export const ViewerContext = createContext<ViewerContextProps | null>(null)

export const PdfViewerProvider = ({
	src,
	children,
	onDocumentError,
	onDocumentLoad,
}: ViewerProviderProps) => {
	const [status, setStatus] = useState<Status>(STATUS.LOADING)
	const [pdf, setPdf] = useState<PDFDocumentProxy>()

	useEffect(() => {
		const loadDocument = async () => {
			if (!pdf) {
				try {
					// TODO options
					const pdfLoaded = await getDocument(src).promise

					onDocumentLoad && onDocumentLoad(pdfLoaded)

					setPdf(pdfLoaded)
				} catch (error) {
					if (error instanceof Error) console.error(error.message)

					onDocumentError && onDocumentError(error)
					setStatus(STATUS.ERROR)

					throw error
				}
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
			}}
		>
			{children}
		</ViewerContext.Provider>
	)
}
