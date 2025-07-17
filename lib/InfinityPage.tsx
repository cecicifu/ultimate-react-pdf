import { AnnotationLayer } from "@/AnnotationLayer"
import { ErrorStatus, LoadingStatus } from "@/components"
import { STATUS } from "@/constants"
import {
	useContainerResize,
	useDevicePixelRatio,
	useInfinityPageRenderer,
	usePageScale,
	useRefCallback,
	useViewerContext,
} from "@/hooks"
import { TextLayer } from "@/TextLayer"
import type { InfinityPageProps } from "@/types"

export const InfinityPage = ({
	className,
	pageRef,
	annotations = true,
	textSelection = true,
	viewPortScale,
	onPageError,
	onPageLoad,
}: InfinityPageProps) => {
	const { status, setStatus, pdf } = useViewerContext()
	const { containerRef, containerWidth } = useContainerResize()
	const devicePixelRatio = useDevicePixelRatio()
	const { getResponsiveScale } = usePageScale({
		viewPortScale,
		containerWidth,
		devicePixelRatio,
	})
	const { setRefs } = useRefCallback({ pageRef })
	const { viewports } = useInfinityPageRenderer({
		pdf,
		getResponsiveScale,
		onPageLoad,
		onPageError,
		setStatus,
	})

	// Combine container ref with page ref
	const handleRefCallback = (node: HTMLDivElement | null) => {
		containerRef.current = node
		setRefs(node)
	}

	if (!pdf && status === STATUS.loading) return <LoadingStatus />
	if (!pdf && status === STATUS.error) return <ErrorStatus />

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
							ref={handleRefCallback}
							className={
								className ? `${className} pdf-viewer__page` : "pdf-viewer__page"
							}
							style={{
								width: "100%",
								height: pageViewport?.height,
								maxWidth: pageViewport?.width,
							}}
						>
							<canvas
								className="pdf-viewer__canvas"
								data-testid={`page-canvas-${page}`}
								id={`page-${page}`}
								style={{ width: "100%", height: "auto" }}
							/>
							{textSelection && (
								<TextLayer currentPage={page} viewport={pageViewport} />
							)}
							{annotations && (
								<AnnotationLayer currentPage={page} infinity={true} />
							)}
						</div>
					)
				})}
		</div>
	)
}
