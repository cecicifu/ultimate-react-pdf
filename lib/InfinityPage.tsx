import type { PageViewport, PDFPageProxy } from "pdfjs-dist"
import type { RenderParameters } from "pdfjs-dist/types/src/display/api"
import { useEffect, useState } from "react"

import { AnnotationLayer } from "@/AnnotationLayer"
import { ErrorStatus, LoadingStatus } from "@/components"
import { STATUS } from "@/constants"
import { useViewerContext } from "@/hooks/useViewerContext"
import type { InfinityPageProps } from "@/types"

import UltimateReactPdfError from "./components/UltimateReactPdfError"

export function InfinityPage({
	className,
	pageRef,
	annotations = true,
	viewPortScale = window.devicePixelRatio,
	onPageError,
	onPageLoad,
}: InfinityPageProps) {
	const [viewport, setViewport] = useState<PageViewport>()

	const { status, setStatus, pdf } = useViewerContext()

	useEffect(() => {
		if (!pdf) return

		const loadPage = async () => {
			try {
				const pages: PDFPageProxy[] = []

				Array.from({ length: pdf.numPages }).forEach(async (_, index) => {
					const currentPage = index + 1

					const page = await pdf.getPage(currentPage)

					const pageViewport = page.getViewport({ scale: viewPortScale })

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

					pages.push(page)
				})

				onPageLoad && onPageLoad(pages, pdf)

				setStatus(STATUS.READY)
			} catch (error) {
				if (error instanceof Error) console.error(error.message)

				onPageError && onPageError(error, pdf)
				setStatus(STATUS.ERROR)

				throw error
			}
		}

		loadPage()
	}, [onPageError, onPageLoad, pdf, setStatus, viewPortScale])

	return (
		<div className="pdf-viewer__container">
			{status === STATUS.LOADING && <LoadingStatus />}
			{status === STATUS.ERROR && <ErrorStatus />}

			{pdf &&
				Array.from({ length: pdf.numPages }).map((_, index) => {
					const page = index + 1

					return (
						<div
							key={page}
							ref={pageRef}
							className={
								className ? `${className} pdf-viewer__page` : "pdf-viewer__page"
							}
							style={{
								height: viewport?.height,
								width: viewport?.width,
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
