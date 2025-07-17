import type { PageViewport, PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist"
import type { RenderParameters } from "pdfjs-dist/types/src/display/api"
import { useEffect, useState } from "react"

import UltimateReactPdfError from "@/components/UltimateReactPdfError"
import { STATUS } from "@/constants"
import type { Status } from "@/types"

interface UseInfinityPageRendererProps {
	pdf: PDFDocumentProxy | undefined
	getResponsiveScale: (baseViewport?: PageViewport) => number
	onPageLoad?: (pages: PDFPageProxy[], pdf: PDFDocumentProxy) => void
	onPageError?: (error: unknown, pdf: PDFDocumentProxy) => void
	setStatus: (status: Status) => void
}

export const useInfinityPageRenderer = ({
	pdf,
	getResponsiveScale,
	onPageLoad,
	onPageError,
	setStatus,
}: UseInfinityPageRendererProps) => {
	const [viewports, setViewports] = useState<PageViewport[]>([])

	useEffect(() => {
		if (!pdf) return

		const loadPage = async () => {
			try {
				const pages: PDFPageProxy[] = []
				const newViewports: PageViewport[] = []

				await Promise.all(
					Array.from({ length: pdf.numPages }).map(async (_, index) => {
						const currentPage = index + 1

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

						newViewports[index] = pageViewport
						pages[index] = page
					})
				)

				setViewports(newViewports)
				onPageLoad?.(pages, pdf)
				setStatus(STATUS.ready)
			} catch (error) {
				if (error instanceof UltimateReactPdfError) console.error(error.message)

				onPageError?.(error, pdf)
				setStatus(STATUS.error)
			}
		}

		loadPage()
	}, [pdf, getResponsiveScale, onPageLoad, onPageError, setStatus])

	return { viewports }
}
