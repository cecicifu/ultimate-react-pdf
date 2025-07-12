import { useState } from "react"

import { AnnotationLayer } from "@/AnnotationLayer"
import { Controls, ErrorStatus, LoadingStatus } from "@/components"
import { STATUS } from "@/constants"
import {
	useContainerResize,
	useDevicePixelRatio,
	usePageRenderer,
	usePageScale,
	useRefCallback,
	useViewerContext,
} from "@/hooks"
import type { PageProps } from "@/types"

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

	const { status, setStatus, pdf } = useViewerContext()
	const { containerRef, containerWidth } = useContainerResize()
	const devicePixelRatio = useDevicePixelRatio()
	const { getResponsiveScale } = usePageScale({
		viewPortScale,
		containerWidth,
		devicePixelRatio,
	})
	const { setRefs } = useRefCallback({ pageRef })
	const { viewport } = usePageRenderer({
		pdf,
		currentPage,
		getResponsiveScale,
		onPageLoad,
		onPageError,
		setStatus,
	})

	const showControls = controls && status === STATUS.ready

	// Combine container ref with page ref
	const handleRefCallback = (node: HTMLDivElement | null) => {
		containerRef.current = node
		setRefs(node)
	}

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
				ref={handleRefCallback}
				className={
					className ? `${className} pdf-viewer__page` : "pdf-viewer__page"
				}
				style={{
					width: "100%",
					height: viewport?.height,
					maxWidth: viewport?.width,
				}}
			>
				<canvas
					className="pdf-viewer__canvas"
					id={`page-${currentPage}`}
					style={{ width: "100%", height: "auto" }}
				/>
				{annotations && (
					<AnnotationLayer currentPage={currentPage} setPage={setCurrentPage} />
				)}
			</div>
		</div>
	)
}
