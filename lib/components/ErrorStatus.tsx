import { useViewerContext } from "@/hooks/useViewerContext"

export function ErrorStatus() {
	const { messages } = useViewerContext()

	return <p>{messages?.error}</p>
}
