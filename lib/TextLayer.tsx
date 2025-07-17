import { TextLayer as PdfTextLayer } from "pdfjs-dist"
import { useCallback, useEffect, useRef } from "react"

import { useViewerContext } from "@/hooks/useViewerContext"
import type { TextLayerProps } from "@/types"

import UltimateReactPdfError from "./components/UltimateReactPdfError"

export const TextLayer = ({
	currentPage,
	viewport: passedViewport,
}: TextLayerProps) => {
	const textLayerDiv = useRef<HTMLDivElement>(null)

	const { pdf } = useViewerContext()

	const loadTextLayer = useCallback(async () => {
		if (!pdf || !textLayerDiv.current) return

		const layer = textLayerDiv.current
		layer.innerHTML = ""

		try {
			const page = await pdf.getPage(currentPage)
			const textContent = await page.getTextContent()

			let viewport = passedViewport

			// if viewport is not passed, calculate it based on the canvas
			if (!viewport) {
				const canvas = document.querySelector<HTMLCanvasElement>(
					`#page-${currentPage}`
				)
				const parentDiv = canvas?.parentElement

				const baseViewport = page.getViewport({ scale: 1 })
				let scaleFactor = 1

				if (canvas && parentDiv) {
					const containerWidth = parentDiv.clientWidth
					const containerHeight = parentDiv.clientHeight

					if (canvas.width > 0 && canvas.height > 0) {
						scaleFactor = Math.min(
							containerWidth / baseViewport.width,
							containerHeight / baseViewport.height
						)
					} else {
						scaleFactor = containerWidth / baseViewport.width
					}

					viewport = page.getViewport({ scale: scaleFactor })
				} else {
					viewport = baseViewport
				}
			}

			// Set scale factor in CSS
			const scaleFactor = viewport.scale
			layer.style.setProperty("--scale-factor", scaleFactor.toString())

			const textLayer = new PdfTextLayer({
				textContentSource: textContent,
				container: layer,
				viewport,
			})

			await textLayer.render()
		} catch (error) {
			if (error instanceof UltimateReactPdfError) console.error(error.message)
		}
	}, [currentPage, pdf, passedViewport])

	useEffect(() => {
		// Little delay to ensure the canvas is rendered
		const timer = setTimeout(() => {
			loadTextLayer()
		}, 150)

		return () => {
			clearTimeout(timer)
			if (textLayerDiv.current) {
				textLayerDiv.current.innerHTML = ""
			}
		}
	}, [currentPage, loadTextLayer])

	return (
		<div
			ref={textLayerDiv}
			data-testid={`text-layer-${currentPage}`}
			className="pdf-viewer__text-layer"
		/>
	)
}
