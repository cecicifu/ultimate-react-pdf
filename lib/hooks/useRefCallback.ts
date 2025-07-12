import { useCallback } from "react"

interface UseRefCallbackProps {
	pageRef?: React.MutableRefObject<HTMLDivElement | null>
}

export const useRefCallback = ({ pageRef }: UseRefCallbackProps) => {
	const setRefs = useCallback(
		(node: HTMLDivElement | null) => {
			if (pageRef) {
				pageRef.current = node
			}
		},
		[pageRef]
	)

	return { setRefs }
}
