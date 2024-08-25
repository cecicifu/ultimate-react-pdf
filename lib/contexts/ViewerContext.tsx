import {
	getDocument,
	GlobalWorkerOptions,
	type PDFDocumentLoadingTask,
	type PDFDocumentProxy,
} from "pdfjs-dist"
import { createContext, useEffect, useRef, useState } from "react"

import UltimateReactPdfError from "@/components/UltimateReactPdfError"
import { STATUS } from "@/constants"
import type { Status, ViewerContextProps, ViewerProviderProps } from "@/types"
import { isValidUrl, isWindowDefined } from "@/utils"

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
	options = {},
}: ViewerProviderProps) => {
	const [status, setStatus] = useState<Status>(STATUS.LOADING)
	const [pdf, setPdf] = useState<PDFDocumentProxy>()

	const isTaskInProgress = useRef<PDFDocumentLoadingTask>()

	useEffect(() => {
		if (pdf || isTaskInProgress.current) return

		const loadDocument = async () => {
			try {
				if (typeof src === "string") {
					if (isValidUrl(src)) {
						isTaskInProgress.current = getDocument({
							url: src,
							verbosity: 0,
							...options,
						})
					}

					if (!isValidUrl(src)) {
						isTaskInProgress.current = getDocument({
							data: isWindowDefined ? window.atob(src) : src,
							verbosity: 0,
							...options,
						})
					}
				}

				if (src instanceof URL) {
					isTaskInProgress.current = getDocument({
						url: src,
						verbosity: 0,
						...options,
					})
				}

				if (!isTaskInProgress.current)
					throw new UltimateReactPdfError("Unsupported source")

				const pdfLoaded = await isTaskInProgress.current.promise

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
	}, [src, pdf, onDocumentError, onDocumentLoad, options])

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
