import { PageViewport } from "pdfjs-dist"
import { type RenderParameters } from "pdfjs-dist/types/src/display/api"
import { useEffect, useState } from "react"

import { Controls, ErrorStatus, LoadingStatus } from "@/components"
import { STATUS } from "@/constants"
import { useViewerContext } from "@/hooks/useViewerContext"
import { type PageProps } from "@/types"

export function Page({
	canvasRef,
	className,
	controls = false,
	initialPage = 1,
	pageRef,
	viewPortScale = window.devicePixelRatio,
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

				const viewport = page.getViewport({ scale: viewPortScale })

				const canvas = document.querySelector<HTMLCanvasElement>(
					`#page-${currentPage}`
				)
				if (!canvas) throw new Error("Canvas not found")

				const context = canvas.getContext("2d")
				if (!context) throw new Error("Context not found")

				canvas.height = viewport.height
				canvas.width = viewport.width

				const renderContext: RenderParameters = {
					canvasContext: context,
					viewport: viewport,
				}

				await page.render(renderContext).promise

				setViewport(viewport)

				onPageLoad && onPageLoad(page, pdf)

				setStatus(STATUS.READY)
			} catch (error) {
				if (error instanceof Error) console.error(error.message)

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

	return (
		<div className={className} ref={pageRef}>
			{status === STATUS.LOADING && <LoadingStatus />}
			{status === STATUS.ERROR && <ErrorStatus />}

			{showControls && (
				<Controls
					pageNumber={currentPage}
					setPage={setCurrentPage}
					onPageChange={onPageChange}
				/>
			)}

			{pdf && (
				<div
					style={{
						position: "relative",
						height: viewport?.height,
						width: viewport?.width,
					}}
				>
					<canvas ref={canvasRef} className="page" id={`page-${currentPage}`} />
				</div>
			)}
		</div>
	)
}
