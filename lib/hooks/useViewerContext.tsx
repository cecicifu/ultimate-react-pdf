import { useContext } from "react"

import { ViewerContext } from "@/contexts/ViewerContext"

export const useViewerContext = () => {
	const context = useContext(ViewerContext)

	if (!context) {
		throw new Error("useViewerContext must be used within a ViewerProvider")
	}

	return context
}
