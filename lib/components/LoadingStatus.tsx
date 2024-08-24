import { useViewerContext } from "@/hooks/useViewerContext"

export function LoadingStatus() {
	const { messages } = useViewerContext()

	return <p>{messages?.loading}</p>
}
