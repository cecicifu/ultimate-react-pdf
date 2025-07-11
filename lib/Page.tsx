import type { PageViewport } from "pdfjs-dist"
import type { RenderParameters } from "pdfjs-dist/types/src/display/api"
import { useEffect, useState } from "react"

import { AnnotationLayer } from "@/AnnotationLayer"
import { Controls, ErrorStatus, LoadingStatus } from "@/components"
import { STATUS } from "@/constants"
import { useViewerContext } from "@/hooks/useViewerContext"
import type { PageProps } from "@/types"

import UltimateReactPdfError from "./components/UltimateReactPdfError"
import { isWindowDefined } from "./utils"

export const Page = ({
	className,
	controls = false,
	initialPage = 1,
	annotations = true,
	pageRef,
	viewPortScale,
	onPageChange,
	onPageError,
	onPageLoad,
}: PageProps) => {
	const [currentPage, setCurrentPage] = useState(initialPage)
	const [viewport, setViewport] = useState<PageViewport>()

	const { status, setStatus, pdf } = useViewerContext()

	const showControls = controls && status === STATUS.ready

	const dpr = isWindowDefined ? window.devicePixelRatio : 1
	const scale = viewPortScale ?? dpr

	useEffect(() => {
		if (!pdf) return

		const loadPage = async () => {
			try {
				const page = await pdf.getPage(currentPage)

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
	}, [currentPage, onPageError, onPageLoad, pdf, viewPortScale])

	if (!pdf && status === STATUS.loading) return <LoadingStatus />
	if (!pdf && status === STATUS.error) return <ErrorStatus />

	return (
		<div className="pdf-viewer__container" role="region" aria-label="PDF Page">
			{showControls && (
				<Controls
					pageNumber={currentPage}
					setPage={setCurrentPage}
					onPageChange={onPageChange}
				/>
			)}

			<div
				ref={pageRef}
				className={
					className ? `${className} pdf-viewer__page` : "pdf-viewer__page"
				}
				style={{
					height: viewport?.height,
					width: viewport?.width,
				}}
			>
				<canvas className="pdf-viewer__canvas" id={`page-${currentPage}`} />
				{annotations && (
					<AnnotationLayer currentPage={currentPage} setPage={setCurrentPage} />
				)}
			</div>
		</div>
	)
}
