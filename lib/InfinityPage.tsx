import { type PDFPageProxy } from "pdfjs-dist"
import { type RenderParameters } from "pdfjs-dist/types/src/display/api"
import { useEffect } from "react"

import { ErrorStatus, LoadingStatus } from "@/components"
import { STATUS } from "@/constants"
import { useViewerContext } from "@/hooks/useViewerContext"
import { type InfinityPageProps } from "@/types"

export function InfinityPage({
	canvasRef,
	className,
	pageRef,
	viewPortScale = window.devicePixelRatio,
	onPageError,
	onPageLoad,
}: InfinityPageProps) {
	const { status, setStatus, pdf } = useViewerContext()

	useEffect(() => {
		if (!pdf) return

		const loadPage = async () => {
			try {
				const pages: PDFPageProxy[] = []

				Array.from({ length: pdf.numPages }).forEach(async (_, index) => {
					const currentPage = index + 1

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
		<div className={className} ref={pageRef}>
			{status === STATUS.LOADING && <LoadingStatus />}
			{status === STATUS.ERROR && <ErrorStatus />}

			{pdf &&
				Array.from({ length: pdf.numPages }).map((_, index) => {
					return (
						<canvas
							key={index}
							ref={canvasRef}
							className="page"
							id={`page-${index + 1}`}
						/>
					)
				})}
		</div>
	)
}
