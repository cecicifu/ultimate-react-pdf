import { useViewerContext } from "@/hooks/useViewerContext"

export const LoadingStatus = () => {
	const { messages } = useViewerContext()

	return <p className="pdf-viewer__loading">{messages?.loading}</p>
}
