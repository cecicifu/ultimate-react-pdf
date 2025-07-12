import type { PageViewport } from "pdfjs-dist"
import { useCallback } from "react"

interface UsePageScaleProps {
	viewPortScale?: number
	containerWidth: number
	devicePixelRatio: number
}

export const usePageScale = ({
	viewPortScale,
	containerWidth,
	devicePixelRatio,
}: UsePageScaleProps) => {
	const getResponsiveScale = useCallback(
		(baseViewport?: PageViewport) => {
			if (viewPortScale) return viewPortScale
			if (!baseViewport || !containerWidth) return devicePixelRatio

			// Scale to fit container width while maintaining aspect ratio
			const scaleToFit = containerWidth / baseViewport.width
			return Math.min(scaleToFit, 1) * devicePixelRatio
		},
		[viewPortScale, containerWidth, devicePixelRatio]
	)

	return { getResponsiveScale }
}
