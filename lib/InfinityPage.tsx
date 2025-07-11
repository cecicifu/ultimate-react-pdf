import type { PageViewport, PDFPageProxy } from "pdfjs-dist"
import type { RenderParameters } from "pdfjs-dist/types/src/display/api"
import { useEffect, useState } from "react"

import { AnnotationLayer } from "@/AnnotationLayer"
import { ErrorStatus, LoadingStatus } from "@/components"
import { STATUS } from "@/constants"
import { useViewerContext } from "@/hooks/useViewerContext"
import type { InfinityPageProps } from "@/types"

import UltimateReactPdfError from "./components/UltimateReactPdfError"
import { isWindowDefined } from "./utils"

export const InfinityPage = ({
	className,
	pageRef,
	annotations = true,
	viewPortScale,
	onPageError,
	onPageLoad,
}: InfinityPageProps) => {
	const [viewports, setViewports] = useState<PageViewport[]>([])

	const { status, setStatus, pdf } = useViewerContext()

	const dpr = isWindowDefined ? window.devicePixelRatio : 1
	const scale = viewPortScale ?? dpr

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

						const pageViewport = page.getViewport({ scale })

						const canvas = document.querySelector<HTMLCanvasElement>(
							`#page-${currentPage}`
						)
						if (!canvas) throw new UltimateReactPdfError("Canvas not found")

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
				if (error instanceof Error) console.error(error.message)

				onPageError?.(error, pdf)
				setStatus(STATUS.error)
			}
		}

		loadPage()
	}, [onPageError, onPageLoad, pdf, viewPortScale])

	return (
		<div className="pdf-viewer__container" role="region" aria-label="PDF Page">
			{status === STATUS.loading && <LoadingStatus />}
			{status === STATUS.error && <ErrorStatus />}

			{pdf &&
				Array.from({ length: pdf.numPages }).map((_, index) => {
					const page = index + 1
					const pageViewport = viewports[index]

					return (
						<div
							key={page}
							ref={pageRef}
							className={
								className ? `${className} pdf-viewer__page` : "pdf-viewer__page"
							}
							style={{
								height: pageViewport?.height,
								width: pageViewport?.width,
							}}
						>
							<canvas className="pdf-viewer__canvas" id={`page-${page}`} />
							{annotations && (
								<AnnotationLayer currentPage={page} infinity={true} />
							)}
						</div>
					)
				})}
		</div>
	)
}
