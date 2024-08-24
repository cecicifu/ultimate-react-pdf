import { useViewerContext } from "@/hooks/useViewerContext"

export function LoadingStatus() {
	const { messages } = useViewerContext()

	return <p className="pdf-viewer__status">{messages?.loading}</p>
}
