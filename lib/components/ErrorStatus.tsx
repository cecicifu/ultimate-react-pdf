import { useViewerContext } from "@/hooks/useViewerContext"

export function ErrorStatus() {
	const { messages } = useViewerContext()

	return <p className="pdf-viewer__status">{messages?.error}</p>
}
