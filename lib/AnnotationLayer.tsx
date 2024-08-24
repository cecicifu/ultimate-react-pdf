import { AnnotationLayer as Annotation } from "pdfjs-dist"
import type { IDownloadManager } from "pdfjs-dist/types/web/interfaces"
import { useCallback, useEffect, useRef } from "react"

import { useViewerContext } from "@/hooks/useViewerContext"

import UltimateReactPdfError from "./components/UltimateReactPdfError"
import { DEFAULT_LINK_REL } from "./constants"
import type { Dest, Page, ResolvedDest } from "./types"

const scrollPageIntoView = (page: number) => {
	document.querySelector<HTMLCanvasElement>(`#page-${page}`)?.scrollIntoView({
		behavior: "smooth",
		block: "center",
		inline: "center",
	})
}

interface AnnotationLayerProps {
	currentPage: Page
	setPage?: (page: number) => void
	infinity?: boolean
}

export function AnnotationLayer({
	currentPage,
	setPage,
	infinity = false,
}: AnnotationLayerProps) {
	const annotationLayer = useRef<HTMLDivElement>(null)

	const { pdf, externalLinkTarget, externalLinkRel } = useViewerContext()

	const loadAnnotationLayer = useCallback(async () => {
		if (!pdf || !annotationLayer.current) return

		const layer = annotationLayer.current

		layer.innerHTML = ""

		const page = await pdf.getPage(currentPage)

		const annotations = await page.getAnnotations()

		const viewport = page.getViewport()

		const newAnnotation = new Annotation({
			div: layer,
			accessibilityManager: null, // TODO
			annotationCanvasMap: null, // TODO
			annotationEditorUIManager: null, // TODO
			page,
			viewport,
		})

		annotations.forEach(() => {
			newAnnotation.render({
				div: layer,
				annotationStorage: pdf.annotationStorage,
				annotations,
				viewport: viewport,
				downloadManager: null as unknown as IDownloadManager,
				page,
				renderForms: true,
				linkService: {
					rotation: 0,
					page: currentPage,
					pagesCount: pdf.numPages,
					externalLinkEnabled: true,
					isInPresentationMode: false,
					getDestinationHash: () => "#",
					getAnchorUrl: () => "#",
					goToPage: (pageNumber: number) => {
						const pageIndex = pageNumber - 1
						scrollPageIntoView(pageIndex)
					},
					goToDestination: (dest: Dest) =>
						new Promise<ResolvedDest | null>((resolve) => {
							if (!dest) {
								throw new UltimateReactPdfError("Destination is not defined")
							}

							if (typeof dest === "string") {
								pdf.getDestination(dest).then(resolve)
							} else if (Array.isArray(dest)) {
								resolve(dest)
							} else {
								dest.then(resolve)
							}
						}).then((dest) => {
							if (!Array.isArray(dest)) {
								throw new UltimateReactPdfError("Invalid destination array")
							}

							const [destRef] = dest

							new Promise<number>((resolve) => {
								if (destRef instanceof Object) {
									pdf
										.getPageIndex(destRef)
										.then(resolve)
										.catch(() => {
											throw new UltimateReactPdfError(
												"Invalid destination object"
											)
										})
								} else if (typeof destRef === "number") {
									resolve(destRef)
								} else {
									throw new UltimateReactPdfError(
										"Invalid destination reference"
									)
								}
							}).then((pageIndex) => {
								const page = pageIndex + 1

								if (!infinity && setPage) {
									setPage(page)
									return
								}

								scrollPageIntoView(page)
							})
						}),
					addLinkAttributes: (
						link: HTMLAnchorElement,
						url: string,
						newWindow: boolean
					) => {
						link.href = url
						link.rel = externalLinkRel || DEFAULT_LINK_REL
						link.target = newWindow ? "_blank" : externalLinkTarget || ""
					},
					setHash: () => {
						/* empty method */
					},
					executeSetOCGState: () => {
						/* empty method */
					},
					executeNamedAction: () => {
						/* empty method */
					},
				},
			})
		})
	}, [currentPage, externalLinkRel, externalLinkTarget, infinity, pdf, setPage])

	useEffect(() => {
		loadAnnotationLayer()
	}, [currentPage, loadAnnotationLayer])

	return (
		<div
			ref={annotationLayer}
			className="pdf-viewer__annotations-layer"
			id="annotations"
		/>
	)
}
