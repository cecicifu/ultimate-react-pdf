import type { PageViewport, PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist"
import type { RenderParameters } from "pdfjs-dist/types/src/display/api"
import { useEffect, useState } from "react"

import UltimateReactPdfError from "@/components/UltimateReactPdfError"
import { STATUS } from "@/constants"
import type { Status } from "@/types"

interface UsePageRendererProps {
	pdf: PDFDocumentProxy | undefined
	currentPage: number
	getResponsiveScale: (baseViewport?: PageViewport) => number
	onPageLoad?: (page: PDFPageProxy, pdf: PDFDocumentProxy) => void
	onPageError?: (error: unknown, pdf: PDFDocumentProxy) => void
	setStatus: (status: Status) => void
}

export const usePageRenderer = ({
	pdf,
	currentPage,
	getResponsiveScale,
	onPageLoad,
	onPageError,
	setStatus,
}: UsePageRendererProps) => {
	const [viewport, setViewport] = useState<PageViewport>()

	useEffect(() => {
		if (!pdf) return

		const loadPage = async () => {
			try {
				const page = await pdf.getPage(currentPage)

				const baseViewport = page.getViewport({ scale: 1 })
				const scale = getResponsiveScale(baseViewport)
				const pageViewport = page.getViewport({ scale })

				const canvas = document.querySelector<HTMLCanvasElement>(
					`#page-${currentPage}`
				)
				if (!canvas) throw new UltimateReactPdfError("Canvas not found")

				const context = canvas.getContext("2d")
				if (!context) throw new UltimateReactPdfError("Context not found")

				canvas.height = pageViewport.height
				canvas.width = pageViewport.width

				const renderContext: RenderParameters = {
					canvasContext: context,
					viewport: pageViewport,
				}

				await page.render(renderContext).promise

				setViewport(pageViewport)
				onPageLoad?.(page, pdf)
				setStatus(STATUS.ready)
			} catch (error) {
				if (error instanceof UltimateReactPdfError) console.error(error.message)

				onPageError?.(error, pdf)
				setStatus(STATUS.error)
			}
		}

		loadPage()
	}, [pdf, currentPage, getResponsiveScale, onPageLoad, onPageError, setStatus])

	return { viewport }
}
