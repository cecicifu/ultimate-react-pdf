import { useViewerContext } from "@/hooks/useViewerContext"

export const ErrorStatus = () => {
	const { messages } = useViewerContext()

	return <p className="pdf-viewer__error">{messages?.error}</p>
}
