import {
	getDocument,
	GlobalWorkerOptions,
	type PDFDocumentLoadingTask,
	type PDFDocumentProxy,
} from "pdfjs-dist"
import { createContext, useEffect, useMemo, useRef, useState } from "react"

import UltimateReactPdfError from "@/components/UltimateReactPdfError"
import { STATUS } from "@/constants"
import type { Status, ViewerContextProps, ViewerProviderProps } from "@/types"
import { decodeBase64ToUint8Array, isBase64, isValidUrl } from "@/utils"

import workerContent from "./build/pdf.worker.min.mjs.json"

const workerBlob = new Blob([workerContent as BlobPart], {
	type: "text/javascript",
})
const workerBlobURL = window.URL.createObjectURL(workerBlob)

GlobalWorkerOptions.workerSrc = workerBlobURL

// eslint-disable-next-line react-refresh/only-export-components
export const ViewerContext = createContext<ViewerContextProps | null>(null)

export const PdfViewerProvider = ({
	src,
	children,
	externalLinkTarget,
	externalLinkRel,
	onDocumentError,
	onDocumentLoad,
	messages,
	options,
}: ViewerProviderProps) => {
	const [status, setStatus] = useState<Status>(STATUS.loading)
	const [pdf, setPdf] = useState<PDFDocumentProxy>()

	const isTaskInProgress = useRef<PDFDocumentLoadingTask>(null)

	const defaultOptions = useMemo(() => options, [options])

	useEffect(() => {
		if (pdf || isTaskInProgress.current) return

		const loadDocument = async () => {
			try {
				const isUrl = isValidUrl(src)

				if (isUrl || !isBase64(src)) {
					// URL or non-base64 string imported
					isTaskInProgress.current = getDocument({
						url: src,
						verbosity: 0,
						...defaultOptions,
					})
				}

				if (!isUrl && isBase64(src)) {
					// base64 string imported
					isTaskInProgress.current = getDocument({
						data: decodeBase64ToUint8Array(src),
						verbosity: 0,
						...defaultOptions,
					})
				}

				if (!isTaskInProgress.current) {
					throw new UltimateReactPdfError("Unsupported source")
				}

				const pdfLoaded = await isTaskInProgress.current.promise.catch(() => {
					throw new UltimateReactPdfError("Invalid PDF structure")
				})

				onDocumentLoad?.(pdfLoaded)
				setPdf(pdfLoaded)
			} catch (error) {
				if (error instanceof UltimateReactPdfError) console.error(error.message)

				onDocumentError?.(error)
				setStatus(STATUS.error)
			}
		}

		loadDocument()
	}, [src, onDocumentError, onDocumentLoad, defaultOptions])

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
