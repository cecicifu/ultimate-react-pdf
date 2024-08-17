import { useContext } from "react"

import UltimateReactPdfError from "@/components/UltimateReactPdfError"
import { ViewerContext } from "@/contexts/ViewerContext"

export const useViewerContext = () => {
	const context = useContext(ViewerContext)

	if (!context) {
		throw new UltimateReactPdfError(
			"useViewerContext must be used within a ViewerProvider"
		)
	}

	return context
}
