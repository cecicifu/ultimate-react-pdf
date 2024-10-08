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

export function Page({
	className,
	controls = false,
	initialPage = 1,
	annotations = true,
	pageRef,
	viewPortScale = isWindowDefined ? window.devicePixelRatio : 1,
	onPageChange,
	onPageError,
	onPageLoad,
}: PageProps) {
	const [currentPage, setCurrentPage] = useState(initialPage)
	const [viewport, setViewport] = useState<PageViewport>()

	const { status, setStatus, pdf } = useViewerContext()

	const showControls = controls && status === STATUS.READY

	useEffect(() => {
		if (!pdf) return

		const loadPage = async () => {
			try {
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

				onPageLoad && onPageLoad(page, pdf)

				setStatus(STATUS.READY)
			} catch (error) {
				if (error instanceof UltimateReactPdfError) console.error(error.message)

				onPageError && onPageError(error, pdf)
				setStatus(STATUS.ERROR)

				throw error
			}
		}

		loadPage()
	}, [
		currentPage,
		onPageError,
		onPageLoad,
		initialPage,
		pdf,
		setStatus,
		viewPortScale,
	])

	if (!pdf && status === STATUS.LOADING) return <LoadingStatus />
	if (!pdf && status === STATUS.ERROR) return <ErrorStatus />

	return (
		<div className="pdf-viewer__container">
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
